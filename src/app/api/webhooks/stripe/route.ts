import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_TO_PLAN, PLAN_CREDITS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const priceId = session.metadata?.priceId;

    if (!userId || !priceId) return NextResponse.json({ ok: true });

    const planKey = PRICE_TO_PLAN[priceId];
    if (!planKey) return NextResponse.json({ ok: true });

    const credits = PLAN_CREDITS[planKey];
    const planEnum = planKey.toUpperCase() as "STARTER" | "PRO" | "STUDIO";

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits }, plan: planEnum },
      }),
      prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          stripePriceId: priceId,
          stripeSubId: session.subscription as string,
          plan: planEnum,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          stripePriceId: priceId,
          stripeSubId: session.subscription as string,
          plan: planEnum,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null };
    const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const priceId = sub.items.data[0]?.price.id;
    if (!priceId) return NextResponse.json({ ok: true });

    const planKey = PRICE_TO_PLAN[priceId];
    if (!planKey) return NextResponse.json({ ok: true });

    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubId: sub.id },
    });
    if (!subscription) return NextResponse.json({ ok: true });

    await prisma.user.update({
      where: { id: subscription.userId },
      data: { credits: { increment: PLAN_CREDITS[planKey] } },
    });
  }

  return NextResponse.json({ ok: true });
}
