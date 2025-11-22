"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { generateSlug } from "@/utils/slugify";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

interface AlbumData {
  id?: string;
  title: string;
  slug: string;
  year: number;
  description: string;
  coverImage: string;
  audioPreview: string;
  order: number;
}

interface Props {
  album?: AlbumData;
}

export default function AlbumForm({ album }: Props) {
  const router = useRouter();
  const isEditing = !!album?.id;

  const [form, setForm] = useState<AlbumData>({
    id: album?.id,
    title: album?.title || "",
    slug: album?.slug || "",
    year: album?.year || new Date().getFullYear(),
    description: album?.description || "",
    coverImage: album?.coverImage || "",
    audioPreview: album?.audioPreview || "",
    order: album?.order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(!!album?.slug);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: slugManual ? f.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEditing ? `/api/albums/${album.id}` : "/api/albums";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la sauvegarde.");
        setSaving(false);
        return;
      }

      router.push("/admin/discographie");
      router.refresh();
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!album?.id) return;
    if (!confirm("Supprimer cet album définitivement ?")) return;

    setSaving(true);
    const res = await fetch(`/api/albums/${album.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/discographie");
      router.refresh();
    } else {
      setError("Erreur lors de la suppression.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
        <div style={{ display: "grid", gap: "1.25rem" }}>
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
              placeholder="Titre de l'album"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="slug" style={labelStyle}>
                Slug
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
                style={{ fontFamily: "monospace", fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label htmlFor="year" style={labelStyle}>
                Année <span style={{ color: "var(--color-burgundy)" }}>*</span>
              </label>
              <input
                id="year"
                type="number"
                required
                min={1900}
                max={2100}
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) }))}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <TiptapEditor
              content={form.description}
              onChange={(html) => setForm((f) => ({ ...f, description: html }))}
              placeholder="Description de l'album…"
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e8e0cc",
              padding: "1.25rem",
            }}
          >
            <h3 style={sectionTitleStyle}>Actions</h3>

            {error && (
              <p style={errorStyle}>{error}</p>
            )}

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ fontSize: "0.875rem" }}
              >
                {saving ? "…" : isEditing ? "Mettre à jour" : "Créer l'album"}
              </button>
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

          <div style={{ backgroundColor: "white", border: "1px solid #e8e0cc", padding: "1.25rem" }}>
            <h3 style={sectionTitleStyle}>Médias</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label htmlFor="coverImage" style={labelStyle}>
                  Image de couverture *
                </label>
                <input
                  id="coverImage"
                  type="url"
                  required
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  className="form-input"
                  placeholder="/uploads/images/…"
                  style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                />
              </div>
              <div>
                <label htmlFor="audioPreview" style={labelStyle}>
                  Extrait audio (optionnel)
                </label>
                <input
                  id="audioPreview"
                  type="url"
                  value={form.audioPreview}
                  onChange={(e) => setForm((f) => ({ ...f, audioPreview: e.target.value }))}
                  className="form-input"
                  placeholder="/uploads/audios/…"
                  style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                />
              </div>
              <div>
                <label htmlFor="order" style={labelStyle}>
                  Ordre d&apos;affichage
                </label>
                <input
                  id="order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="form-input"
                />
              </div>
            </div>
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

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "0.9rem",
  color: "var(--color-midnight)",
  marginBottom: "1rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const errorStyle: React.CSSProperties = {
  color: "var(--color-burgundy)",
  fontSize: "0.8rem",
  marginBottom: "0.75rem",
  padding: "0.5rem",
  backgroundColor: "rgba(124, 29, 63, 0.08)",
  border: "1px solid rgba(124, 29, 63, 0.2)",
};
