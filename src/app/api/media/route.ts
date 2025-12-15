import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type");

  const where = type ? { type: type as "IMAGE" | "AUDIO" | "DOCUMENT" } : {};

  const media = await prisma.media.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(media);
}
