"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface Props {
  userRole: string;
  userName: string;
}

const baseNavItems = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/articles", label: "Articles", icon: "✍" },
  { href: "/admin/discographie", label: "Discographie", icon: "♬" },
  { href: "/admin/pages", label: "Pages", icon: "☰" },
  { href: "/admin/media", label: "Médias", icon: "◉" },
  { href: "/admin/temoignages", label: "Témoignages", icon: "✦" },
];

const adminOnlyItems = [
  { href: "/admin/users", label: "Utilisateurs", icon: "◎" },
  { href: "/admin/settings", label: "Paramètres", icon: "⚙" },
];

export default function AdminSidebar({ userRole, userName }: Props) {
  const pathname = usePathname();

  const navItems =
    userRole === "ADMIN" ? [...baseNavItems, ...adminOnlyItems] : baseNavItems;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        backgroundColor: "var(--color-midnight)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        borderRight: "1px solid rgba(201, 169, 110, 0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid rgba(201, 169, 110, 0.1)",
        }}
      >
        <Link
          href="/admin"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--color-gold)",
            textDecoration: "none",
            display: "block",
          }}
        >
          Pascal Mathieu
        </Link>
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(240, 236, 224, 0.4)",
            marginTop: "0.25rem",
          }}
        >
          Administration
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 1.5rem",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.02em",
                  color: isActive(item.href)
                    ? "var(--color-gold)"
                    : "rgba(240, 236, 224, 0.7)",
                  backgroundColor: isActive(item.href)
                    ? "rgba(201, 169, 110, 0.08)"
                    : "transparent",
                  borderLeft: isActive(item.href)
                    ? "2px solid var(--color-gold)"
                    : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "0.8rem", width: "16px", textAlign: "center" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(201, 169, 110, 0.1)",
        }}
      >
        <p
          style={{
            fontSize: "0.8rem",
            color: "rgba(240, 236, 224, 0.6)",
            marginBottom: "0.25rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {userName}
        </p>
        <p
          style={{
            fontSize: "0.7rem",
            color: "rgba(240, 236, 224, 0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.75rem",
          }}
        >
          {userRole === "ADMIN" ? "Administrateur" : "Éditeur"}
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              fontSize: "0.7rem",
              color: "var(--color-gold)",
              textDecoration: "none",
              letterSpacing: "0.05em",
              opacity: 0.8,
            }}
          >
            ↗ Voir le site
          </Link>
          <span style={{ color: "rgba(240, 236, 224, 0.2)" }}>|</span>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{
              background: "none",
              border: "none",
              fontSize: "0.7rem",
              color: "rgba(240, 236, 224, 0.5)",
              cursor: "pointer",
              padding: 0,
              letterSpacing: "0.05em",
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
}
