import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/utils/slugify";

const createSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  coverImage: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = 15;
  const search = searchParams.get("search");

  const where = search
    ? { title: { contains: search, mode: "insensitive" as const } }
    : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { author: { select: { name: true } } },
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({ articles, total, page, perPage });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, slug: rawSlug, excerpt, content, status, coverImage } = parsed.data;
  let slug = rawSlug || generateSlug(title);

  // Ensure unique slug
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      coverImage,
      authorId: session.user.id,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(article, { status: 201 });
}
