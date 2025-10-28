import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/utils/sanitize";

export const revalidate = 60;

async function getHomeData() {
  const [articles, albums, testimonials, settings] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    }),
    prisma.album.findMany({
      orderBy: { order: "asc" },
      take: 1,
    }),
    prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.siteSettings.findMany({
      where: {
        key: { in: ["home_intro", "home_quote", "site_title"] },
      },
    }),
  ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return { articles, albums, testimonials, settings: settingsMap };
}

export default async function HomePage() {
  const { articles, albums, testimonials, settings } = await getHomeData();
  const featuredAlbum = albums[0] || null;

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-midnight) 0%, var(--color-deep) 50%, #2a1a0e 100%)`,
          color: "var(--color-cream)",
          padding: "8rem 1.5rem 6rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background lines */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(201, 169, 110, 0.03) 80px, rgba(201, 169, 110, 0.03) 81px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: "1.5rem",
            }}
          >
            ✦ Besançon, Franche-Comté ✦
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "1rem",
              background: "linear-gradient(to bottom, #f0ece0, #c9a96e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Pascal
            <br />
            Mathieu
          </h1>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              fontStyle: "italic",
              color: "var(--color-gold)",
              letterSpacing: "0.15em",
              marginBottom: "2rem",
            }}
          >
            Chanteur · Dessinateur · Poète
          </p>

          {settings.home_intro && (
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(240, 236, 224, 0.8)",
                lineHeight: 1.8,
                maxWidth: "600px",
                margin: "0 auto 2.5rem",
              }}
            >
              {settings.home_intro}
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/discographie"
              style={{
                display: "inline-block",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-midnight)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                textDecoration: "none",
                transition: "background-color 0.2s, transform 0.2s",
              }}
            >
              Discographie
            </Link>
            <Link
              href="/biographie"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: "var(--color-cream)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                textDecoration: "none",
                border: "1px solid rgba(201, 169, 110, 0.4)",
                transition: "border-color 0.2s, color 0.2s",
              }}
            >
              Biographie
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {articles.length > 0 && (
        <section
          style={{
            padding: "5rem 1.5rem",
            backgroundColor: "var(--color-cream)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                  marginBottom: "0.75rem",
                }}
              >
                Actualités
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  color: "var(--color-midnight)",
                }}
              >
                Derniers Articles
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {articles.map((article) => (
                <article
                  key={article.id}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid var(--color-cream-dark)",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  {article.coverImage && (
                    <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
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
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        color: "var(--color-midnight)",
                        marginBottom: "0.75rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--color-text-light)",
                          lineHeight: 1.7,
                          marginBottom: "1rem",
                        }}
                      >
                        {article.excerpt}
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

            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link href="/articles" className="btn-secondary">
                Tous les articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Album */}
      {featuredAlbum && (
        <section
          style={{
            padding: "5rem 1.5rem",
            backgroundColor: "var(--color-deep)",
            color: "var(--color-cream)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ position: "relative", aspectRatio: "1", maxWidth: "380px" }}>
                <Image
                  src={featuredAlbum.coverImage}
                  alt={featuredAlbum.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                  marginBottom: "0.75rem",
                }}
              >
                Discographie
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  marginBottom: "0.5rem",
                  lineHeight: 1.2,
                }}
              >
                {featuredAlbum.title}
              </h2>
              <p
                style={{
                  color: "var(--color-gold)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {featuredAlbum.year}
              </p>
              <div
                className="prose-pascal"
                style={{ color: "rgba(240, 236, 224, 0.8)", marginBottom: "2rem" }}
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(featuredAlbum.description),
                }}
              />
              <Link
                href={`/discographie/${featuredAlbum.slug}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--color-gold)",
                  color: "var(--color-midnight)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.875rem 2rem",
                  textDecoration: "none",
                }}
              >
                Découvrir l&apos;album
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quote */}
      {settings.home_quote && (
        <section
          style={{
            padding: "5rem 1.5rem",
            backgroundColor: "var(--color-cream)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div
              style={{
                fontSize: "4rem",
                color: "var(--color-gold)",
                opacity: 0.4,
                lineHeight: 1,
                marginBottom: "1rem",
                fontFamily: "Georgia, serif",
              }}
            >
              ❝
            </div>
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                fontStyle: "italic",
                color: "var(--color-midnight)",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {settings.home_quote}
            </blockquote>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section
          style={{
            padding: "5rem 1.5rem",
            backgroundColor: "var(--color-midnight)",
            color: "var(--color-cream)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                  marginBottom: "0.75rem",
                }}
              >
                Ce qu&apos;on dit
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                }}
              >
                Témoignages
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: "2rem",
                    border: "1px solid rgba(201, 169, 110, 0.2)",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      fontSize: "3rem",
                      color: "var(--color-gold)",
                      opacity: 0.3,
                      position: "absolute",
                      top: "1rem",
                      left: "1.5rem",
                      lineHeight: 1,
                      fontFamily: "Georgia",
                    }}
                  >
                    "
                  </p>
                  <p
                    style={{
                      fontStyle: "italic",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                      paddingTop: "1.5rem",
                      color: "rgba(240, 236, 224, 0.85)",
                    }}
                  >
                    {t.content}
                  </p>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: "var(--color-gold)",
                        fontSize: "0.95rem",
                      }}
                    >
                      {t.author}
                    </p>
                    {t.role && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(240, 236, 224, 0.5)",
                          marginTop: "0.25rem",
                        }}
                      >
                        {t.role}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link
                href="/temoignages"
                style={{
                  display: "inline-block",
                  backgroundColor: "transparent",
                  color: "var(--color-cream)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.875rem 2rem",
                  textDecoration: "none",
                  border: "1px solid rgba(201, 169, 110, 0.4)",
                }}
              >
                Voir tous les témoignages
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
