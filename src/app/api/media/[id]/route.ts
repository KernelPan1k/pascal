import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });

  // Delete physical file
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");
  const relativePath = media.url.replace("/uploads/", "");
  const filePath = path.join(uploadDir, relativePath);

  try {
    await fs.unlink(filePath);
  } catch {
    // File might not exist, continue
  }

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
