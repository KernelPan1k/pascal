"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

interface PageData {
  slug: string;
  title: string;
  content: string;
}

interface Props {
  page: PageData;
}

export default function PageForm({ page }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PageData>(page);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/pages/${page.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, content: form.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la sauvegarde.");
        setSaving(false);
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: "1.25rem", maxWidth: "900px" }}>
        <div>
          <label
            htmlFor="title"
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-text-light)",
              marginBottom: "0.4rem",
            }}
          >
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="form-input"
            required
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-text-light)",
              marginBottom: "0.4rem",
            }}
          >
            Contenu
          </label>
          <TiptapEditor
            content={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
          />
        </div>

        {error && (
          <p
            style={{
              color: "var(--color-burgundy)",
              fontSize: "0.875rem",
              padding: "0.625rem 0.875rem",
              backgroundColor: "rgba(124, 29, 63, 0.08)",
              border: "1px solid rgba(124, 29, 63, 0.2)",
            }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            style={{
              color: "#166534",
              fontSize: "0.875rem",
              padding: "0.625rem 0.875rem",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
            }}
          >
            Page sauvegardée avec succès.
          </p>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/pages")}
            className="btn-secondary"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  );
}
