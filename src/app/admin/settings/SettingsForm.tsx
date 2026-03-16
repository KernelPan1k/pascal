"use client";

import { useState } from "react";

interface Props {
  settings: Record<string, string>;
}

type SettingMeta = { label: string; description: string; multiline?: boolean };
type SettingGroup = { title: string; keys: string[] };

const SETTING_LABELS: Record<string, SettingMeta> = {
  // Général
  site_title: { label: "Titre du site", description: "Affiché dans l'onglet du navigateur." },
  site_description: {
    label: "Description du site",
    description: "Utilisée pour le SEO et les réseaux sociaux.",
    multiline: true,
  },
  contact_email: { label: "Email de contact", description: "Email affiché dans le pied de page." },

  // Page d'accueil — Hero
  home_intro: {
    label: "Héro — Introduction",
    description: "Paragraphe sous le titre dans la section héro.",
    multiline: true,
  },

  // Page d'accueil — Portrait
  home_portrait_quote: {
    label: "Portrait — Citation en italique",
    description: "Phrase mise en avant, en italique, dans la section Portrait.",
    multiline: true,
  },
  home_portrait_text: {
    label: "Portrait — Texte",
    description: "Paragraphe de présentation dans la section Portrait.",
    multiline: true,
  },

  // Page d'accueil — Trois univers
  home_chanteur_text: {
    label: "Univers — Le Chanteur",
    description: "Texte du bloc Chanteur.",
    multiline: true,
  },
  home_dessinateur_text: {
    label: "Univers — Le Dessinateur",
    description: "Texte du bloc Dessinateur.",
    multiline: true,
  },
  home_poete_text: {
    label: "Univers — Le Poète",
    description: "Texte du bloc Poète.",
    multiline: true,
  },

  // Page d'accueil — Ancrage
  home_region_quote: {
    label: "Région — Phrase en italique",
    description: "Citation mise en avant dans la section Besançon & alentours.",
    multiline: true,
  },
  home_region_text: {
    label: "Région — Texte",
    description: "Paragraphe de la section Besançon & alentours.",
    multiline: true,
  },

  // Page d'accueil — CTA
  home_cta_title: {
    label: "CTA — Titre",
    description: "Titre de la section d'appel à l'action en bas de page.",
  },
  home_cta_text: {
    label: "CTA — Texte",
    description: "Paragraphe sous le titre du CTA.",
    multiline: true,
  },
};

const SETTING_GROUPS: SettingGroup[] = [
  { title: "Général", keys: ["site_title", "site_description", "contact_email"] },
];

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

  const renderField = (key: string) => {
    const meta = SETTING_LABELS[key];
    if (!meta) return null;
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
            onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
            className="form-input"
            rows={4}
            style={{ resize: "vertical" }}
          />
        ) : (
          <input
            id={key}
            type="text"
            value={settings[key] ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
            className="form-input"
          />
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "700px" }}>
      <div style={{ display: "grid", gap: "2.5rem" }}>
        {SETTING_GROUPS.map((group) => (
          <div key={group.title}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-text-light)",
                borderBottom: "1px solid #e8e0cc",
                paddingBottom: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              {group.title}
            </h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {group.keys.map(renderField)}
            </div>
          </div>
        ))}

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
