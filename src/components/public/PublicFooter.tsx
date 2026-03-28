import Link from "next/link";

const TEAL = "#6aacbe";
const CREAM = "#ede8d8";
const BG = "#0b1316";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: BG,
        color: "#ccc9be",
        borderTop: `3px solid ${TEAL}`,
        padding: "3rem 1.5rem 2rem",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                color: CREAM,
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Pascal<span style={{ color: TEAL }}> Mathieu</span>
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(237,232,216,0.35)",
                lineHeight: 1.7,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "var(--font-body)",
              }}
            >
              Chanteur · Dessinateur · Poète
              <br />
              Besançon, Franche-Comté
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: TEAL,
                marginBottom: "1rem",
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { href: "/biographie", label: "Biographie" },
                { href: "/discographie", label: "Discographie" },
                { href: "/articles", label: "Articles" },
                { href: "/temoignages", label: "Témoignages" },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.5rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(237,232,216,0.45)",
                      textDecoration: "none",
                      transition: "color 0.15s",
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(106,172,190,0.12)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "rgba(237,232,216,0.25)",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-body)",
          }}
        >
          © {currentYear} Pascal Mathieu. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
