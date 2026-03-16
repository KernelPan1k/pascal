import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          color: "var(--color-midnight)",
          marginBottom: "1.5rem",
        }}
      >
        Pages statiques
      </h1>

      <div style={{ backgroundColor: "white", border: "1px solid #e8e0cc", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#faf9f6", borderBottom: "1px solid #e8e0cc" }}>
              <th style={thStyle}>Titre</th>
              <th style={thStyle}>Slug</th>
              <th style={thStyle}>Mis à jour</th>
              <th style={{ padding: "0.75rem 1rem", width: "80px" }} />
            </tr>
          </thead>
          <tbody>
            {/* Page d'accueil — settings dédiés */}
            <tr style={{ borderBottom: "1px solid #f0ece0" }}>
              <td style={{ padding: "0.875rem 1rem", fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--color-midnight)" }}>
                Page d&apos;accueil
              </td>
              <td style={{ padding: "0.875rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                /
              </td>
              <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                —
              </td>
              <td style={{ padding: "0.875rem 1rem" }}>
                <Link href="/admin/pages/accueil" style={{ fontSize: "0.75rem", color: "var(--color-burgundy)", textDecoration: "none" }}>
                  Éditer
                </Link>
              </td>
            </tr>
            {pages.map((page) => (
              <tr key={page.id} style={{ borderBottom: "1px solid #f0ece0" }}>
                <td
                  style={{
                    padding: "0.875rem 1rem",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9rem",
                    color: "var(--color-midnight)",
                  }}
                >
                  {page.title}
                </td>
                <td
                  style={{
                    padding: "0.875rem 1rem",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    color: "var(--color-text-light)",
                  }}
                >
                  /{page.slug}
                </td>
                <td
                  style={{
                    padding: "0.875rem 1rem",
                    fontSize: "0.8rem",
                    color: "var(--color-text-light)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(page.updatedAt).toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <Link
                    href={`/admin/pages/${page.slug}/edit`}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-burgundy)",
                      textDecoration: "none",
                    }}
                  >
                    Éditer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-text-light)",
  fontWeight: 600,
};
