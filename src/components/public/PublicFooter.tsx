import Link from "next/link";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--color-midnight)",
        color: "var(--color-cream)",
        borderTop: "1px solid rgba(201, 169, 110, 0.2)",
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
            marginBottom: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                color: "var(--color-gold)",
                marginBottom: "0.75rem",
              }}
            >
              Pascal Mathieu
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(240, 236, 224, 0.7)",
                lineHeight: 1.7,
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
                fontFamily: "var(--font-display)",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
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
                      fontSize: "0.875rem",
                      color: "rgba(240, 236, 224, 0.7)",
                      textDecoration: "none",
                      transition: "color 0.2s",
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
            background:
              "linear-gradient(to right, transparent, rgba(201, 169, 110, 0.3), transparent)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Copyright */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(240, 236, 224, 0.5)",
            }}
          >
            © {currentYear} Pascal Mathieu. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
