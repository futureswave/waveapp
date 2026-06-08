import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

const PLAN_PRICES: Record<string, string> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID ?? "",
  pro: process.env.STRIPE_PRO_PRICE_ID ?? "",
  studio: process.env.STRIPE_STUDIO_PRICE_ID ?? "",
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const priceId = PLAN_PRICES[plan];
  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId, priceId },
    success_url: `${baseUrl}/library?upgraded=true`,
    cancel_url: `${baseUrl}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
