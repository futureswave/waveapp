import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
  }
  return _stripe;
}

export const PLAN_CREDITS: Record<string, number> = {
  starter: 150,
  pro: 400,
  studio: 1000,
};

export const PRICE_TO_PLAN: Record<string, keyof typeof PLAN_CREDITS> = {
  [process.env.STRIPE_STARTER_PRICE_ID ?? ""]: "starter",
  [process.env.STRIPE_PRO_PRICE_ID ?? ""]: "pro",
  [process.env.STRIPE_STUDIO_PRICE_ID ?? ""]: "studio",
};
