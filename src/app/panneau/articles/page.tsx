import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/lib/auth";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

const PER_PAGE = 15;

export default async function AdminArticlesPage({ searchParams }: Props) {
  const { page: pageParam, search } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));
  const skip = (page - 1) * PER_PAGE;

  const session = await auth();

  const where = search
    ? { title: { contains: search, mode: "insensitive" as const } }
    : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: PER_PAGE,
      include: { author: { select: { name: true } } },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
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
            Articles
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-light)", marginTop: "0.25rem" }}>
            {total} article{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/panneau/articles/new"
          style={{
            backgroundColor: "var(--color-gold)",
            color: "var(--color-midnight)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "0.625rem 1.25rem",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}
        >
          + Nouvel article
        </Link>
      </div>

      {/* Search */}
      <form style={{ marginBottom: "1.5rem" }}>
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Rechercher un article…"
          className="form-input"
          style={{ maxWidth: "360px" }}
        />
      </form>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #e8e0cc",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#faf9f6", borderBottom: "1px solid #e8e0cc" }}>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                  fontWeight: 600,
                }}
              >
                Titre
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Statut
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Auteur
              </th>
              <th
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Mis à jour
              </th>
              <th style={{ padding: "0.75rem 1rem", width: "80px" }} />
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--color-text-light)",
                    fontStyle: "italic",
                  }}
                >
                  Aucun article trouvé.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr
                  key={article.id}
                  style={{ borderBottom: "1px solid #f0ece0" }}
                >
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.9rem",
                        color: "var(--color-midnight)",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.2rem 0.6rem",
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
                      }}
                    >
                      {article.status === "PUBLISHED"
                        ? "Publié"
                        : article.status === "DRAFT"
                        ? "Brouillon"
                        : "Archivé"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.875rem 1rem",
                      fontSize: "0.875rem",
                      color: "var(--color-text-light)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {article.author.name}
                  </td>
                  <td
                    style={{
                      padding: "0.875rem 1rem",
                      fontSize: "0.8rem",
                      color: "var(--color-text-light)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-burgundy)",
                        textDecoration: "none",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1.5rem",
            justifyContent: "center",
          }}
        >
          {page > 1 && (
            <Link
              href={`/admin/articles?page=${page - 1}${search ? `&search=${search}` : ""}`}
              style={{
                padding: "0.5rem 0.875rem",
                border: "1px solid #e8e0cc",
                textDecoration: "none",
                fontSize: "0.875rem",
                color: "var(--color-text)",
              }}
            >
              ←
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/articles?page=${p}${search ? `&search=${search}` : ""}`}
              style={{
                padding: "0.5rem 0.875rem",
                border: "1px solid #e8e0cc",
                textDecoration: "none",
                fontSize: "0.875rem",
                backgroundColor: p === page ? "var(--color-midnight)" : "transparent",
                color: p === page ? "var(--color-cream)" : "var(--color-text)",
              }}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={`/admin/articles?page=${page + 1}${search ? `&search=${search}` : ""}`}
              style={{
                padding: "0.5rem 0.875rem",
                border: "1px solid #e8e0cc",
                textDecoration: "none",
                fontSize: "0.875rem",
                color: "var(--color-text)",
              }}
            >
              →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
