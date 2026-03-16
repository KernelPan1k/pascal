"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

interface Props {
  media: MediaItem[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary({ media: initialMedia }: Props) {
  const router = useRouter();
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Erreur lors du téléchargement.");
        return;
      }

      setMedia((prev) => [data, ...prev]);
      router.refresh();
    } catch {
      setUploadError("Erreur réseau.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = filter === "ALL" ? media : media.filter((m) => m.type === filter);

  return (
    <div>
      {/* Upload zone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleUpload(file);
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--color-gold)" : "#e8e0cc"}`,
          borderRadius: "4px",
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "1.5rem",
          backgroundColor: dragOver ? "rgba(201, 169, 110, 0.05)" : "white",
          transition: "all 0.2s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,audio/*,application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          style={{ display: "none" }}
        />
        {uploading ? (
          <p style={{ color: "var(--color-text-light)", fontSize: "0.875rem" }}>
            Téléchargement en cours…
          </p>
        ) : (
          <div>
            <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>↑</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--color-midnight)" }}>
              Cliquez ou glissez un fichier ici
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "0.25rem" }}>
              Images (10MB max), Audio (50MB max), PDF (20MB max)
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <p style={{ color: "var(--color-burgundy)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {uploadError}
        </p>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {["ALL", "IMAGE", "AUDIO", "DOCUMENT"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.35rem 0.75rem",
              border: "1px solid #e8e0cc",
              fontSize: "0.775rem",
              fontFamily: "var(--font-display)",
              cursor: "pointer",
              backgroundColor: filter === f ? "var(--color-midnight)" : "white",
              color: filter === f ? "var(--color-cream)" : "var(--color-text)",
            }}
          >
            {f === "ALL" ? `Tous (${media.length})` : `${f === "IMAGE" ? "Images" : f === "AUDIO" ? "Audio" : "Documents"} (${media.filter((m) => m.type === f).length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
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
          Aucun fichier.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #e8e0cc",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Preview */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  backgroundColor: "#f0ece0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.type === "IMAGE" ? (
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "2rem" }}>
                    {item.type === "AUDIO" ? "♬" : "📄"}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "0.5rem 0.625rem" }}>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: "0.25rem",
                  }}
                  title={item.filename}
                >
                  {item.filename}
                </p>
                <p style={{ fontSize: "0.65rem", color: "var(--color-text-light)" }}>
                  {formatFileSize(item.size)}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.375rem" }}>
                  <button
                    onClick={() => copyUrl(item.url)}
                    style={{
                      fontSize: "0.65rem",
                      color: copied === item.url ? "#166534" : "var(--color-burgundy)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {copied === item.url ? "✓ Copié" : "Copier"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--color-text-light)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Suppr.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
