import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  const [articlesCount, albumsCount, testimonialsCount, pendingCount, mediaCount] =
    await Promise.all([
      prisma.article.count(),
      prisma.album.count(),
      prisma.testimonial.count({ where: { status: "APPROVED" } }),
      prisma.testimonial.count({ where: { status: "PENDING" } }),
      prisma.media.count(),
    ]);

  const recentArticles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, updatedAt: true },
  });

  const stats = [
    { label: "Articles", value: articlesCount, href: "/panneau/articles", icon: "✍" },
    { label: "Albums", value: albumsCount, href: "/panneau/discographie", icon: "♬" },
    { label: "Témoignages", value: testimonialsCount, href: "/panneau/temoignages", icon: "✦" },
    { label: "Médias", value: mediaCount, href: "/panneau/media", icon: "◉" },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            color: "var(--color-midnight)",
            marginBottom: "0.25rem",
          }}
        >
          Bonjour, {session?.user?.name?.split(" ")[0] || "Administrateur"}
        </h1>
        <p style={{ color: "var(--color-text-light)", fontSize: "0.875rem" }}>
          Bienvenue dans l&apos;interface d&apos;administration.
        </p>
      </div>

      {/* Alert for pending testimonials */}
      {pendingCount > 0 && (
        <Link
          href="/panneau/temoignages"
          style={{
            display: "block",
            padding: "0.875rem 1.25rem",
            backgroundColor: "rgba(201, 169, 110, 0.12)",
            border: "1px solid var(--color-gold)",
            marginBottom: "1.5rem",
            textDecoration: "none",
            color: "var(--color-text)",
          }}
        >
          <span style={{ fontSize: "0.875rem" }}>
            ⚠ {pendingCount} témoignage{pendingCount > 1 ? "s" : ""} en attente de modération →
          </span>
        </Link>
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid #e8e0cc",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "var(--color-gold)",
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </span>
              <div>
                <p
                  style={{
                    fontSize: "1.75rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-midnight)",
                    lineHeight: 1,
                    marginBottom: "0.2rem",
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Recent articles */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e8e0cc",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                color: "var(--color-midnight)",
              }}
            >
              Articles récents
            </h2>
            <Link
              href="/panneau/articles/new"
              style={{
                fontSize: "0.75rem",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-midnight)",
                padding: "0.35rem 0.75rem",
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
              }}
            >
              + Nouveau
            </Link>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recentArticles.map((article) => (
              <li
                key={article.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.625rem 0",
                  borderBottom: "1px solid #f0ece0",
                  gap: "0.5rem",
                }}
              >
                <Link
                  href={`/panneau/articles/${article.id}/edit`}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text)",
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {article.title}
                </Link>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "2px",
                    backgroundColor:
                      article.status === "PUBLISHED"
                        ? "rgba(34, 197, 94, 0.12)"
                        : article.status === "DRAFT"
                        ? "rgba(107, 107, 125, 0.12)"
                        : "rgba(124, 29, 63, 0.12)",
                    color:
                      article.status === "PUBLISHED"
                        ? "#166534"
                        : article.status === "DRAFT"
                        ? "var(--color-text-light)"
                        : "var(--color-burgundy)",
                    flexShrink: 0,
                  }}
                >
                  {article.status === "PUBLISHED"
                    ? "Publié"
                    : article.status === "DRAFT"
                    ? "Brouillon"
                    : "Archivé"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick actions */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e8e0cc",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              color: "var(--color-midnight)",
              marginBottom: "1.25rem",
            }}
          >
            Actions rapides
          </h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {[
              { href: "/panneau/articles/new", label: "Rédiger un article" },
              { href: "/panneau/discographie/new", label: "Ajouter un album" },
              { href: "/panneau/pages", label: "Modifier les pages" },
              { href: "/panneau/media", label: "Gérer les médias" },
              { href: "/panneau/temoignages", label: "Modérer les témoignages" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{
                  display: "block",
                  padding: "0.625rem 0.875rem",
                  backgroundColor: "#f8f7f4",
                  border: "1px solid #e8e0cc",
                  fontSize: "0.875rem",
                  color: "var(--color-text)",
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  transition: "background-color 0.15s",
                }}
              >
                {action.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
