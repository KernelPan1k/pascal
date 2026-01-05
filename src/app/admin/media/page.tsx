import { prisma } from "@/lib/prisma";
import MediaLibrary from "./MediaLibrary";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          color: "var(--color-midnight)",
          marginBottom: "0.5rem",
        }}
      >
        Médiathèque
      </h1>
      <p style={{ fontSize: "0.875rem", color: "var(--color-text-light)", marginBottom: "1.5rem" }}>
        {media.length} fichier{media.length !== 1 ? "s" : ""}
      </p>

      <MediaLibrary media={media} />
    </div>
  );
}
