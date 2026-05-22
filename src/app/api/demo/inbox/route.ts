import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (process.env.DEMO_MODE !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const email = request.nextUrl.searchParams.get("email");
  const type = request.nextUrl.searchParams.get("type");

  if (!email || !type) {
    return NextResponse.json({ error: "email and type are required" }, { status: 400 });
  }

  try {
    const message = await prisma.demoInbox.findUnique({
      where: { email_type: { email, type } },
      select: { url: true, subject: true, type: true },
    });
    return NextResponse.json(message ?? null);
  } catch {
    return NextResponse.json(null);
  }
}
