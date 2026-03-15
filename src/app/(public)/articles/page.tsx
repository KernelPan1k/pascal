import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Articles",
  description: "Articles, actualités et réflexions de Pascal Mathieu.",
};

const PER_PAGE = 9;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const skip = (page - 1) * PER_PAGE;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip,
      take: PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

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
          Actualités & Réflexions
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
          }}
        >
          Articles
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

      {/* Articles */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >
        {articles.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-light)",
              fontStyle: "italic",
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
            }}
          >
            Aucun article pour le moment.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "2rem",
            }}
          >
            {articles.map((article) => (
              <article
                key={article.id}
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                }}
              >
                {article.coverImage ? (
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      aspectRatio: "16/9",
                      backgroundColor: "var(--color-deep)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2rem",
                        color: "rgba(201, 169, 110, 0.3)",
                        fontStyle: "italic",
                      }}
                    >
                      ✦
                    </span>
                  </div>
                )}
                <div style={{ padding: "1.5rem" }}>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--color-gold)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.2rem",
                      color: "var(--color-cream-bright)",
                      marginBottom: "0.75rem",
                      lineHeight: 1.35,
                    }}
                  >
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-text-light)",
                        lineHeight: 1.7,
                        marginBottom: "1rem",
                      }}
                    >
                      {article.excerpt.length > 120
                        ? article.excerpt.slice(0, 120) + "…"
                        : article.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/articles/${article.slug}`}
                    style={{
                      fontSize: "0.8rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-burgundy)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--color-gold)",
                      paddingBottom: "2px",
                    }}
                  >
                    Lire la suite
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "3rem",
            }}
          >
            {page > 1 && (
              <Link
                href={`/articles?page=${page - 1}`}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid var(--color-border)",
                  textDecoration: "none",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                }}
              >
                ←
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/articles?page=${p}`}
                style={{
                  padding: "0.5rem 0.875rem",
                  border: "1px solid var(--color-border)",
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                  backgroundColor: p === page ? "var(--color-gold)" : "transparent",
                  color: p === page ? "var(--color-midnight)" : "var(--color-text)",
                }}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/articles?page=${page + 1}`}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid var(--color-border)",
                  textDecoration: "none",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                }}
              >
                →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
