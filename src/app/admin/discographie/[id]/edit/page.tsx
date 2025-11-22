import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AlbumForm from "@/components/admin/AlbumForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id } });

  if (!album) notFound();

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          color: "var(--color-midnight)",
          marginBottom: "1.5rem",
        }}
      >
        Modifier l&apos;album
      </h1>
      <AlbumForm
        album={{
          id: album.id,
          title: album.title,
          slug: album.slug,
          year: album.year,
          description: album.description,
          coverImage: album.coverImage,
          audioPreview: album.audioPreview || "",
          order: album.order,
        }}
      />
    </div>
  );
}
