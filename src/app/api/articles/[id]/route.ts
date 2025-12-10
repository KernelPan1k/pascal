import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/utils/slugify";

const updateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  coverImage: z.string().optional().nullable(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: { select: { name: true, email: true } } },
  });

  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  // Only the author or an admin can edit
  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Resolve slug uniqueness
  if (data.title && !data.slug) {
    data.slug = generateSlug(data.title);
  }
  if (data.slug && data.slug !== existing.slug) {
    const conflict = await prisma.article.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (conflict) {
      data.slug = `${data.slug}-${Date.now()}`;
    }
  }

  const wasPublished = existing.status !== "PUBLISHED" && data.status === "PUBLISHED";

  const article = await prisma.article.update({
    where: { id },
    data: {
      ...data,
      publishedAt: wasPublished ? new Date() : existing.publishedAt,
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
