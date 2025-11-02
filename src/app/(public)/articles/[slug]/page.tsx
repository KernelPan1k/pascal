import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/utils/sanitize";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt || undefined,
  };
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { name: true } } },
  });

  if (!article) notFound();

  const cleanContent = sanitizeHtml(article.content);

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
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link
            href="/articles"
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
            ← Articles
          </Link>

          {article.publishedAt && (
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "1rem",
              }}
            >
              {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            {article.title}
          </h1>

          {article.excerpt && (
            <p
              style={{
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "rgba(240, 236, 224, 0.7)",
                lineHeight: 1.7,
              }}
            >
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Cover image */}
      {article.coverImage && (
        <div
          style={{
            position: "relative",
            maxHeight: "500px",
            overflow: "hidden",
          }}
        >
          <Image
            src={article.coverImage}
            alt={article.title}
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        <div
          className="prose-pascal content-html"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem",
            lineHeight: 1.9,
            color: "var(--color-text)",
          }}
        />

        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--color-cream-dark)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-light)",
              fontStyle: "italic",
            }}
          >
            par {article.author.name}
          </p>
          <Link
            href="/articles"
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
            ← Retour aux articles
          </Link>
        </div>
      </div>
    </>
  );
}
