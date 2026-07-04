import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Proxies an approved fal/CDN asset with Content-Disposition: attachment so the
// browser downloads it (the native <a download> is ignored cross-origin).
const ALLOWED_HOSTS = [/\.fal\.media$/, /\.r2\.dev$/, /\.cloudflare\.com$/];

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const target = req.nextUrl.searchParams.get("url");
  if (!target) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.some((re) => re.test(parsed.hostname))) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  const upstream = await fetch(parsed.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  const ext = contentType.includes("video") ? "mp4" : contentType.split("/")[1] ?? "bin";
  const filename = `wave-${parsed.pathname.split("/").pop() || "download"}`.replace(/\.[^.]+$/, "") + `.${ext}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
