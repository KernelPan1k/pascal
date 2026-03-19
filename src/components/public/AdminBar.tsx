"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminBar() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--color-midnight)",
        borderBottom: "1px solid rgba(201, 169, 110, 0.2)",
        padding: "0.4rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "0.75rem",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.06em",
      }}
    >
      <span style={{ color: "rgba(240, 236, 224, 0.4)", textTransform: "uppercase" }}>
        Mode prévisualisation — {session.user.name || session.user.email}
      </span>
      <Link
        href="/panneau"
        style={{
          color: "var(--color-gold)",
          textDecoration: "none",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        ← Administration
      </Link>
    </div>
  );
}
