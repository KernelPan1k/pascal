"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/biographie", label: "Biographie" },
  { href: "/discographie", label: "Discographie" },
  { href: "/articles", label: "Articles" },
  { href: "/temoignages", label: "Témoignages" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor: "var(--color-midnight)",
        borderBottom: "1px solid rgba(201, 169, 110, 0.2)",
      }}
    >
      <nav
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "70px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--color-gold)",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            Pascal Mathieu
          </Link>

          {/* Desktop nav */}
          <ul
            style={{
              display: "flex",
              gap: "2rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.875rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:
                      pathname === link.href
                        ? "var(--color-gold)"
                        : "var(--color-cream)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    borderBottom:
                      pathname === link.href
                        ? "1px solid var(--color-gold)"
                        : "1px solid transparent",
                    paddingBottom: "2px",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-cream)",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
            className="mobile-menu-btn"
            aria-label="Menu"
          >
            <span
              style={{
                display: "block",
                width: "24px",
                height: "2px",
                backgroundColor: "var(--color-gold)",
                transition: "transform 0.2s",
                transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "24px",
                height: "2px",
                backgroundColor: "var(--color-gold)",
                opacity: mobileOpen ? 0 : 1,
                transition: "opacity 0.2s",
              }}
            />
            <span
              style={{
                display: "block",
                width: "24px",
                height: "2px",
                backgroundColor: "var(--color-gold)",
                transition: "transform 0.2s",
                transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <ul
            style={{
              listStyle: "none",
              padding: "1rem 0",
              margin: 0,
              borderTop: "1px solid rgba(201, 169, 110, 0.2)",
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.75rem 0",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.875rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color:
                      pathname === link.href
                        ? "var(--color-gold)"
                        : "var(--color-cream)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
