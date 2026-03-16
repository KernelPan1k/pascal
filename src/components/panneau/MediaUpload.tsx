"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface UploadedFile {
  id: string;
  url: string;
  filename: string;
  type: string;
  mimeType: string;
}

interface Props {
  accept?: string;
  onUpload?: (file: UploadedFile) => void;
  label?: string;
}

export default function MediaUpload({
  accept = "image/*",
  onUpload,
  label = "Télécharger un fichier",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
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
        setError(data.error || "Erreur lors du téléchargement");
        setUploading(false);
        return;
      }

      setUploaded(data);
      onUpload?.(data);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--color-gold)" : "var(--color-cream-dark)"}`,
          borderRadius: "4px",
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragOver ? "rgba(201, 169, 110, 0.05)" : "#faf9f6",
          transition: "all 0.2s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {uploading ? (
          <div>
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid var(--color-cream-dark)",
                borderTopColor: "var(--color-gold)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 0.75rem",
              }}
            />
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-light)" }}>
              Téléchargement en cours…
            </p>
          </div>
        ) : uploaded ? (
          <div>
            {uploaded.type === "IMAGE" && (
              <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 0.75rem" }}>
                <Image
                  src={uploaded.url}
                  alt={uploaded.filename}
                  fill
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />
              </div>
            )}
            <p style={{ fontSize: "0.875rem", color: "#166534", marginBottom: "0.25rem" }}>
              ✓ {uploaded.filename}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
              Cliquez pour changer
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>↑</p>
            <p
              style={{
                fontSize: "0.875rem",
                fontFamily: "var(--font-display)",
                color: "var(--color-midnight)",
                marginBottom: "0.25rem",
              }}
            >
              {label}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
              Glissez-déposez ou cliquez pour parcourir
            </p>
          </div>
        )}
      </div>

      {error && (
        <p
          style={{
            color: "var(--color-burgundy)",
            fontSize: "0.8rem",
            marginTop: "0.5rem",
          }}
        >
          {error}
        </p>
      )}

      {uploaded && (
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "0.4rem" }}>
          URL: <code style={{ fontFamily: "monospace" }}>{uploaded.url}</code>
        </p>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
