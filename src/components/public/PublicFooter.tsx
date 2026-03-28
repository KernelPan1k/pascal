import Link from "next/link";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#000000",
        color: "#d0d0d0",
        borderTop: "3px solid #e8262b",
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
                color: "#ffffff",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Pascal<span style={{ color: "#e8262b" }}> Mathieu</span>
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
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
                color: "#e8262b",
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
                      color: "rgba(255,255,255,0.5)",
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
            backgroundColor: "rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.3)",
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
