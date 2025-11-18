"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { generateSlug } from "@/utils/slugify";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

interface ArticleData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  coverImage: string;
}

interface Props {
  article?: ArticleData;
}

export default function ArticleForm({ article }: Props) {
  const router = useRouter();
  const isEditing = !!article?.id;

  const [form, setForm] = useState<ArticleData>({
    id: article?.id,
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    status: article?.status || "DRAFT",
    coverImage: article?.coverImage || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(!!article?.slug);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: slugManual ? f.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, action: "save" | "publish") => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const status = action === "publish" ? "PUBLISHED" : form.status;

    try {
      const url = isEditing ? `/api/articles/${article.id}` : "/api/articles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la sauvegarde.");
        setSaving(false);
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!article?.id) return;
    if (!confirm("Supprimer cet article définitivement ?")) return;

    setSaving(true);
    const res = await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    } else {
      setError("Erreur lors de la suppression.");
      setSaving(false);
    }
  };

  return (
    <form>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
        {/* Main content */}
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {/* Title */}
          <div>
            <label htmlFor="title" style={labelStyle}>
              Titre <span style={{ color: "var(--color-burgundy)" }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={handleTitleChange}
              className="form-input"
              placeholder="Titre de l'article"
              style={{ fontSize: "1.1rem" }}
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" style={labelStyle}>
              Slug (URL)
            </label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              className="form-input"
              placeholder="slug-de-l-article"
              style={{ fontFamily: "monospace", fontSize: "0.875rem" }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" style={labelStyle}>
              Résumé
            </label>
            <textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              className="form-input"
              rows={3}
              placeholder="Résumé court pour les aperçus…"
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Content editor */}
          <div>
            <label style={labelStyle}>
              Contenu <span style={{ color: "var(--color-burgundy)" }}>*</span>
            </label>
            <TiptapEditor
              content={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              placeholder="Rédigez votre article…"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          {/* Publish box */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e8e0cc",
              padding: "1.25rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9rem",
                color: "var(--color-midnight)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Publication
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="status" style={labelStyle}>
                Statut
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="form-input"
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>

            {error && (
              <p
                style={{
                  color: "var(--color-burgundy)",
                  fontSize: "0.8rem",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  backgroundColor: "rgba(124, 29, 63, 0.08)",
                  border: "1px solid rgba(124, 29, 63, 0.2)",
                }}
              >
                {error}
              </p>
            )}

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "save")}
                disabled={saving}
                className="btn-secondary"
                style={{ fontSize: "0.875rem" }}
              >
                {saving ? "…" : "Sauvegarder"}
              </button>
              {form.status !== "PUBLISHED" && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "publish")}
                  disabled={saving}
                  className="btn-primary"
                  style={{ fontSize: "0.875rem" }}
                >
                  {saving ? "…" : "Publier"}
                </button>
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="btn-danger"
                  style={{ fontSize: "0.875rem" }}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>

          {/* Cover image */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e8e0cc",
              padding: "1.25rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9rem",
                color: "var(--color-midnight)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Image de couverture
            </h3>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
              className="form-input"
              placeholder="/uploads/images/…"
              style={{ fontSize: "0.875rem", fontFamily: "monospace" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "0.4rem" }}>
              Téléchargez d&apos;abord via la médiathèque
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-text-light)",
  marginBottom: "0.4rem",
};
