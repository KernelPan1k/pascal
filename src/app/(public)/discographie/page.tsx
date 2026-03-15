import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Discographie",
  description: "Découvrez la discographie de Pascal Mathieu, ses albums et créations musicales.",
};

export default async function DiscographiePage() {
  const albums = await prisma.album.findMany({
    orderBy: [{ order: "asc" }, { year: "desc" }],
  });

  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--color-midnight)",
          color: "var(--color-cream)",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            marginBottom: "1rem",
          }}
        >
          Musique
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
          }}
        >
          Discographie
        </h1>
        <div
          style={{
            width: "60px",
            height: "2px",
            backgroundColor: "var(--color-gold)",
            margin: "1.5rem auto 0",
          }}
        />
      </div>

      {/* Albums grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >
        {albums.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-light)",
              fontStyle: "italic",
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
            }}
          >
            La discographie est en cours de mise à jour.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/discographie/${album.slug}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      overflow: "hidden",
                      backgroundColor: "var(--color-deep)",
                    }}
                  >
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      style={{ objectFit: "cover", transition: "transform 0.5s" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(13,13,26,0.8) 0%, transparent 50%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.5rem",
                          fontStyle: "italic",
                          color: "var(--color-gold)",
                          fontWeight: 400,
                        }}
                      >
                        {album.year}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.15rem",
                        color: "var(--color-cream-bright)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {album.title}
                    </h2>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-gold)",
                      }}
                    >
                      Découvrir →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
