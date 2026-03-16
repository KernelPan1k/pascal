"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Testimonial {
  id: string;
  author: string;
  role: string | null;
  content: string;
  status: string;
  createdAt: Date;
}

interface Props {
  testimonials: Testimonial[];
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
};

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "rgba(201, 169, 110, 0.12)", color: "#92400e" },
  APPROVED: { bg: "rgba(34, 197, 94, 0.12)", color: "#166534" },
  REJECTED: { bg: "rgba(124, 29, 63, 0.12)", color: "var(--color-burgundy)" },
};

export default function TestimonialsAdmin({ testimonials: initialTestimonials }: Props) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const updateStatus = async (id: string, status: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } finally {
      setLoading(null);
    }
  };

  const filtered = filter === "ALL" ? testimonials : testimonials.filter((t) => t.status === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "0.4rem 0.875rem",
              border: "1px solid #e8e0cc",
              fontSize: "0.8rem",
              fontFamily: "var(--font-display)",
              cursor: "pointer",
              backgroundColor: filter === s ? "var(--color-midnight)" : "white",
              color: filter === s ? "var(--color-cream)" : "var(--color-text)",
              letterSpacing: "0.05em",
            }}
          >
            {s === "ALL"
              ? `Tous (${testimonials.length})`
              : `${statusLabels[s]} (${testimonials.filter((t) => t.status === s).length})`}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e8e0cc",
              padding: "2rem",
              textAlign: "center",
              color: "var(--color-text-light)",
              fontStyle: "italic",
            }}
          >
            Aucun témoignage.
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #e8e0cc",
                padding: "1.25rem",
                borderLeft: t.status === "PENDING" ? "3px solid var(--color-gold)" : "3px solid transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.75rem",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--color-midnight)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {t.author}
                    {t.role && (
                      <span
                        style={{
                          fontWeight: 400,
                          fontStyle: "italic",
                          color: "var(--color-text-light)",
                          fontSize: "0.85rem",
                          marginLeft: "0.5rem",
                        }}
                      >
                        — {t.role}
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                    {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "2px",
                    backgroundColor: statusColors[t.status]?.bg,
                    color: statusColors[t.status]?.color,
                    flexShrink: 0,
                  }}
                >
                  {statusLabels[t.status]}
                </span>
              </div>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text)",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  marginBottom: "1rem",
                  borderLeft: "2px solid var(--color-cream-dark)",
                  paddingLeft: "0.875rem",
                }}
              >
                {t.content}
              </p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {t.status !== "APPROVED" && (
                  <button
                    onClick={() => updateStatus(t.id, "APPROVED")}
                    disabled={loading === t.id}
                    style={{
                      padding: "0.35rem 0.75rem",
                      backgroundColor: "rgba(34, 197, 94, 0.12)",
                      color: "#166534",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      fontSize: "0.775rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    ✓ Approuver
                  </button>
                )}
                {t.status !== "REJECTED" && (
                  <button
                    onClick={() => updateStatus(t.id, "REJECTED")}
                    disabled={loading === t.id}
                    style={{
                      padding: "0.35rem 0.75rem",
                      backgroundColor: "rgba(124, 29, 63, 0.08)",
                      color: "var(--color-burgundy)",
                      border: "1px solid rgba(124, 29, 63, 0.2)",
                      fontSize: "0.775rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    ✕ Rejeter
                  </button>
                )}
                {t.status !== "PENDING" && (
                  <button
                    onClick={() => updateStatus(t.id, "PENDING")}
                    disabled={loading === t.id}
                    style={{
                      padding: "0.35rem 0.75rem",
                      backgroundColor: "rgba(201, 169, 110, 0.1)",
                      color: "#92400e",
                      border: "1px solid rgba(201, 169, 110, 0.3)",
                      fontSize: "0.775rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    En attente
                  </button>
                )}
                <button
                  onClick={() => deleteTestimonial(t.id)}
                  disabled={loading === t.id}
                  style={{
                    padding: "0.35rem 0.75rem",
                    backgroundColor: "transparent",
                    color: "var(--color-text-light)",
                    border: "1px solid #e8e0cc",
                    fontSize: "0.775rem",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
