import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processUpload, isUploadError } from "@/utils/upload";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const result = await processUpload(file as File);

  if (isUploadError(result)) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const media = await prisma.media.create({
    data: {
      filename: result.filename,
      url: result.url,
      type: result.type,
      size: result.size,
      mimeType: result.mimeType,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
