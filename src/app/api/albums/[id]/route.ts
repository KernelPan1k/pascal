import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/utils/slugify";

const updateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  audioPreview: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) return NextResponse.json({ error: "Album introuvable" }, { status: 404 });
  return NextResponse.json(album);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.album.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Album introuvable" }, { status: 404 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.title && !data.slug) data.slug = generateSlug(data.title);
  if (data.slug && data.slug !== existing.slug) {
    const conflict = await prisma.album.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (conflict) data.slug = `${data.slug}-${Date.now()}`;
  }

  const album = await prisma.album.update({ where: { id }, data });
  return NextResponse.json(album);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.album.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Album introuvable" }, { status: 404 });

  await prisma.album.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
