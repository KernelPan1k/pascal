import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | null;
}

export default function ArticleCard({
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
}: ArticleCardProps) {
  return (
    <article
      style={{
        backgroundColor: "white",
        border: "1px solid var(--color-cream-dark)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          overflow: "hidden",
          backgroundColor: "var(--color-deep)",
        }}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
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
      </div>
      <div style={{ padding: "1.5rem" }}>
        {publishedAt && (
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: "0.5rem",
            }}
          >
            {new Date(publishedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
            color: "var(--color-midnight)",
            marginBottom: "0.75rem",
            lineHeight: 1.35,
          }}
        >
          {title}
        </h3>
        {excerpt && (
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-light)",
              lineHeight: 1.7,
              marginBottom: "1rem",
            }}
          >
            {excerpt.length > 120 ? excerpt.slice(0, 120) + "…" : excerpt}
          </p>
        )}
        <Link
          href={`/articles/${slug}`}
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
  );
}
