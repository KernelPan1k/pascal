import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/utils/slugify";

const albumSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
  description: z.string(),
  coverImage: z.string().min(1),
  audioPreview: z.string().optional(),
  order: z.number().int().default(0),
});

export async function GET() {
  const albums = await prisma.album.findMany({
    orderBy: [{ order: "asc" }, { year: "desc" }],
  });
  return NextResponse.json(albums);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = albumSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, slug: rawSlug, ...rest } = parsed.data;
  let slug = rawSlug || generateSlug(title);

  const existing = await prisma.album.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const album = await prisma.album.create({
    data: { title, slug, ...rest },
  });

  return NextResponse.json(album, { status: 201 });
}
