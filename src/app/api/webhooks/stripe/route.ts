import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_TO_PLAN, PLAN_CREDITS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

type PlanEnum = "STARTER" | "PRO" | "STUDIO";

/** Period end from a Stripe subscription (item-level in newer API, sub-level fallback). */
function periodEnd(sub: Stripe.Subscription): Date {
  const item = sub.items?.data?.[0] as { current_period_end?: number } | undefined;
  const subLevel = (sub as unknown as { current_period_end?: number }).current_period_end;
  const secs = item?.current_period_end ?? subLevel;
  return secs ? new Date(secs * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

/** Records the event as processed; returns false if it was already processed. */
async function claimEvent(eventId: string): Promise<boolean> {
  try {
    await prisma.processedWebhookEvent.create({
      data: { id: eventId, provider: "stripe" },
    });
    return true;
  } catch {
    // Unique violation → duplicate delivery, already handled.
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: process each event exactly once.
  if (!(await claimEvent(event.id))) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const priceId = session.metadata?.priceId;
      if (!userId || !priceId) return NextResponse.json({ ok: true });

      const planKey = PRICE_TO_PLAN[priceId];
      if (!planKey) return NextResponse.json({ ok: true });

      const planEnum = planKey.toUpperCase() as PlanEnum;
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const end = periodEnd(sub);

      // Initial purchase grants credits here. Renewal credits come from
      // invoice.payment_succeeded (subscription_cycle only) to avoid double grants.
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: PLAN_CREDITS[planKey] }, plan: planEnum },
        }),
        prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripePriceId: priceId,
            stripeSubId: sub.id,
            plan: planEnum,
            currentPeriodEnd: end,
          },
          update: {
            stripePriceId: priceId,
            stripeSubId: sub.id,
            plan: planEnum,
            currentPeriodEnd: end,
          },
        }),
      ]);
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | null;
        billing_reason?: string | null;
      };
      // The first invoice (subscription_create) is already credited by
      // checkout.session.completed. Only grant on actual renewals.
      if (invoice.billing_reason !== "subscription_cycle") {
        return NextResponse.json({ ok: true });
      }
      if (!invoice.subscription) return NextResponse.json({ ok: true });

      const sub = await stripe.subscriptions.retrieve(invoice.subscription);
      const priceId = sub.items.data[0]?.price.id;
      const planKey = priceId ? PRICE_TO_PLAN[priceId] : undefined;
      if (!planKey) return NextResponse.json({ ok: true });

      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubId: sub.id },
      });
      if (!subscription) return NextResponse.json({ ok: true });

      await prisma.$transaction([
        prisma.user.update({
          where: { id: subscription.userId },
          data: { credits: { increment: PLAN_CREDITS[planKey] } },
        }),
        prisma.subscription.update({
          where: { userId: subscription.userId },
          data: { currentPeriodEnd: periodEnd(sub) },
        }),
      ]);
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id;
      const planKey = priceId ? PRICE_TO_PLAN[priceId] : undefined;
      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubId: sub.id },
      });
      if (subscription && planKey) {
        const planEnum = planKey.toUpperCase() as PlanEnum;
        await prisma.$transaction([
          prisma.subscription.update({
            where: { userId: subscription.userId },
            data: { stripePriceId: priceId!, plan: planEnum, currentPeriodEnd: periodEnd(sub) },
          }),
          prisma.user.update({
            where: { id: subscription.userId },
            data: { plan: planEnum },
          }),
        ]);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const subscription = await prisma.subscription.findFirst({
        where: { stripeSubId: sub.id },
      });
      if (subscription) {
        // Downgrade to FREE and drop the subscription record.
        await prisma.$transaction([
          prisma.user.update({
            where: { id: subscription.userId },
            data: { plan: "FREE" },
          }),
          prisma.subscription.delete({ where: { userId: subscription.userId } }),
        ]);
      }
    }
  } catch (err) {
    // Roll back the idempotency claim so Stripe's retry can reprocess.
    await prisma.processedWebhookEvent.delete({ where: { id: event.id } }).catch(() => {});
    console.error("[stripe-webhook] error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
