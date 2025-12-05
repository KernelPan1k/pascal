"use client";

import { useState } from "react";

interface Props {
  settings: Record<string, string>;
}

const SETTING_LABELS: Record<string, { label: string; description: string; multiline?: boolean }> = {
  site_title: { label: "Titre du site", description: "Affiché dans l'onglet du navigateur." },
  site_description: {
    label: "Description du site",
    description: "Utilisée pour le SEO et les réseaux sociaux.",
    multiline: true,
  },
  home_intro: {
    label: "Texte d'introduction",
    description: "Court paragraphe affiché sur la page d'accueil.",
    multiline: true,
  },
  home_quote: {
    label: "Citation / poème",
    description: "Citation ou extrait poétique affiché sur la page d'accueil.",
    multiline: true,
  },
  contact_email: { label: "Email de contact", description: "Email affiché dans le pied de page." },
};

export default function SettingsForm({ settings: initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de la sauvegarde.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
  };

  const knownKeys = Object.keys(SETTING_LABELS);
  const unknownKeys = Object.keys(settings).filter((k) => !knownKeys.includes(k));

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "640px" }}>
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {knownKeys.map((key) => {
          const meta = SETTING_LABELS[key];
          return (
            <div key={key}>
              <label
                htmlFor={key}
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  color: "var(--color-midnight)",
                  marginBottom: "0.3rem",
                }}
              >
                {meta.label}
              </label>
              <p style={{ fontSize: "0.775rem", color: "var(--color-text-light)", marginBottom: "0.4rem" }}>
                {meta.description}
              </p>
              {meta.multiline ? (
                <textarea
                  id={key}
                  value={settings[key] ?? ""}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                  className="form-input"
                  rows={4}
                  style={{ resize: "vertical" }}
                />
              ) : (
                <input
                  id={key}
                  type="text"
                  value={settings[key] ?? ""}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                  className="form-input"
                />
              )}
            </div>
          );
        })}

        {unknownKeys.length > 0 && (
          <>
            <hr style={{ border: "none", borderTop: "1px solid #e8e0cc" }} />
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)", fontStyle: "italic" }}>
              Paramètres additionnels
            </p>
            {unknownKeys.map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                    color: "var(--color-text-light)",
                    marginBottom: "0.3rem",
                  }}
                >
                  {key}
                </label>
                <input
                  id={key}
                  type="text"
                  value={settings[key] ?? ""}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                  className="form-input"
                />
              </div>
            ))}
          </>
        )}

        {error && (
          <p
            style={{
              color: "var(--color-burgundy)",
              fontSize: "0.875rem",
              padding: "0.625rem",
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
              padding: "0.625rem",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
            }}
          >
            Paramètres sauvegardés.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ alignSelf: "flex-start" }}
        >
          {saving ? "Sauvegarde…" : "Sauvegarder les paramètres"}
        </button>
      </div>
    </form>
  );
}
