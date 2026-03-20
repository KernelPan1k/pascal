import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/utils/sanitize";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await prisma.album.findUnique({ where: { slug } });
  if (!album) return { title: "Album introuvable" };
  return {
    title: album.title,
    description: `${album.title} (${album.year}) — Album de Pascal Mathieu`,
  };
}

export async function generateStaticParams() {
  try {
    const albums = await prisma.album.findMany({ select: { slug: true } });
    return albums.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await prisma.album.findUnique({ where: { slug } });

  if (!album) notFound();

  const cleanDescription = sanitizeHtml(album.description);

  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--color-midnight)",
          color: "var(--color-cream)",
          padding: "4rem 1.5rem 3rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Link
            href="/discographie"
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "2rem",
            }}
          >
            ← Discographie
          </Link>
        </div>
      </div>

      {/* Album content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Cover */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "1",
                maxWidth: "420px",
                boxShadow: "0 20px 60px rgba(13, 13, 26, 0.25)",
              }}
            >
              <Image
                src={album.coverImage}
                alt={album.title}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Audio preview */}
            {album.audioPreview && (
              <div style={{ marginTop: "1.5rem", maxWidth: "420px" }}>
                <p
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Extrait audio
                </p>
                <audio
                  controls
                  style={{ width: "100%" }}
                  preload="metadata"
                >
                  <source src={album.audioPreview} />
                  Votre navigateur ne supporte pas la lecture audio.
                </audio>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontStyle: "italic",
                color: "var(--color-gold)",
                marginBottom: "0.5rem",
              }}
            >
              {album.year}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "var(--color-cream-bright)",
                lineHeight: 1.2,
                marginBottom: "2rem",
              }}
            >
              {album.title}
            </h1>

            <div
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: "var(--color-gold)",
                marginBottom: "2rem",
              }}
            />

            <div
              className="prose-pascal content-html"
              dangerouslySetInnerHTML={{ __html: cleanDescription }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.9,
                color: "var(--color-text)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
