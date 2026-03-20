import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string(),
});

interface Params {
  params: Promise<{ slug: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { slug } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const page = await prisma.page.upsert({
    where: { slug },
    update: { title: parsed.data.title, content: parsed.data.content },
    create: { slug, title: parsed.data.title, content: parsed.data.content },
  });

  return NextResponse.json(page);
}
