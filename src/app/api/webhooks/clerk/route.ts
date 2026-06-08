import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    deleted?: boolean;
  };
};

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  let event: ClerkUserEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  try {
    if (type === "user.created") {
      const email = data.email_addresses?.[0]?.email_address ?? "";
      await prisma.user.upsert({
        where: { id: data.id },
        create: { id: data.id, email, credits: 100 },
        update: { email },
      });
    }

    if (type === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address;
      if (email) {
        await prisma.user.updateMany({
          where: { id: data.id },
          data: { email },
        });
      }
    }

    if (type === "user.deleted" && data.id) {
      await prisma.user.deleteMany({ where: { id: data.id } });
    }
  } catch (err) {
    console.error("[clerk-webhook] db error:", err);
    return NextResponse.json({ error: "Database error", detail: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
