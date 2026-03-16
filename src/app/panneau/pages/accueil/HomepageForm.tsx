"use client";

import { useState } from "react";

interface Props {
  settings: Record<string, string>;
}

const GROUPS = [
  {
    title: "Héro",
    fields: [
      { key: "home_intro", label: "Introduction", description: "Paragraphe sous le titre.", rows: 3 },
    ],
  },
  {
    title: "Portrait",
    fields: [
      { key: "home_portrait_quote", label: "Citation en italique", description: "Phrase mise en avant, en italique.", rows: 3 },
      { key: "home_portrait_text", label: "Texte", description: "Paragraphe de présentation.", rows: 4 },
    ],
  },
  {
    title: "Trois univers",
    fields: [
      { key: "home_chanteur_text", label: "Le Chanteur", description: "Texte du bloc Chanteur.", rows: 4 },
      { key: "home_dessinateur_text", label: "Le Dessinateur", description: "Texte du bloc Dessinateur.", rows: 4 },
      { key: "home_poete_text", label: "Le Poète", description: "Texte du bloc Poète.", rows: 4 },
    ],
  },
  {
    title: "Besançon & alentours",
    fields: [
      { key: "home_region_quote", label: "Phrase en italique", description: "Citation mise en avant.", rows: 3 },
      { key: "home_region_text", label: "Texte", description: "Paragraphe de la section région.", rows: 4 },
    ],
  },
  {
    title: "Appel à l'action",
    fields: [
      { key: "home_cta_title", label: "Titre", description: "Titre du bloc en bas de page.", rows: 1 },
      { key: "home_cta_text", label: "Texte", description: "Paragraphe sous le titre.", rows: 3 },
    ],
  },
];

export default function HomepageForm({ settings: initialSettings }: Props) {
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

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "760px" }}>
      <div style={{ display: "grid", gap: "2.5rem" }}>
        {GROUPS.map((group) => (
          <div
            key={group.title}
            style={{
              backgroundColor: "white",
              border: "1px solid #e8e0cc",
              padding: "1.5rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-text-light)",
                borderBottom: "1px solid #e8e0cc",
                paddingBottom: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              {group.title}
            </h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {group.fields.map(({ key, label, description, rows }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--color-midnight)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {label}
                  </label>
                  <p style={{ fontSize: "0.775rem", color: "var(--color-text-light)", marginBottom: "0.4rem" }}>
                    {description}
                  </p>
                  {rows === 1 ? (
                    <input
                      id={key}
                      type="text"
                      value={settings[key] ?? ""}
                      onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                      className="form-input"
                    />
                  ) : (
                    <textarea
                      id={key}
                      value={settings[key] ?? ""}
                      onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                      className="form-input"
                      rows={rows}
                      style={{ resize: "vertical" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {error && (
          <p style={{ color: "var(--color-burgundy)", fontSize: "0.875rem", padding: "0.625rem", backgroundColor: "rgba(124, 29, 63, 0.08)", border: "1px solid rgba(124, 29, 63, 0.2)" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "#166534", fontSize: "0.875rem", padding: "0.625rem", backgroundColor: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
            Modifications sauvegardées.
          </p>
        )}

        <div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        </div>
      </div>
    </form>
  );
}
