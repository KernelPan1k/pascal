import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDiscographiePage() {
  const albums = await prisma.album.findMany({
    orderBy: [{ order: "asc" }, { year: "desc" }],
  });

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              color: "var(--color-midnight)",
            }}
          >
            Discographie
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-light)", marginTop: "0.25rem" }}>
            {albums.length} album{albums.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/panneau/discographie/new"
          style={{
            backgroundColor: "var(--color-gold)",
            color: "var(--color-midnight)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "0.625rem 1.25rem",
            textDecoration: "none",
          }}
        >
          + Nouvel album
        </Link>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {albums.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e8e0cc",
              padding: "2rem",
              textAlign: "center",
              color: "var(--color-text-light)",
              fontStyle: "italic",
            }}
          >
            Aucun album pour le moment.
          </div>
        ) : (
          albums.map((album) => (
            <div
              key={album.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #e8e0cc",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "64px",
                  height: "64px",
                  flexShrink: 0,
                  backgroundColor: "var(--color-deep)",
                }}
              >
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    color: "var(--color-midnight)",
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {album.title}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                  {album.year} · Ordre: {album.order}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                <Link
                  href={`/discographie/${album.slug}`}
                  target="_blank"
                  style={{ fontSize: "0.75rem", color: "var(--color-text-light)", textDecoration: "none" }}
                >
                  Voir ↗
                </Link>
                <Link
                  href={`/admin/discographie/${album.id}/edit`}
                  style={{ fontSize: "0.75rem", color: "var(--color-burgundy)", textDecoration: "none" }}
                >
                  Éditer
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
