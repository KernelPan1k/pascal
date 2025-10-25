"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-midnight)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-gold)",
              marginBottom: "0.25rem",
            }}
          >
            Pascal Mathieu
          </h1>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(240, 236, 224, 0.4)",
            }}
          >
            Administration
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            backgroundColor: "var(--color-deep)",
            border: "1px solid rgba(201, 169, 110, 0.15)",
            padding: "2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              color: "var(--color-cream)",
              marginBottom: "1.75rem",
            }}
          >
            Connexion
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(240, 236, 224, 0.6)",
                  marginBottom: "0.4rem",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(240, 236, 224, 0.06)",
                  border: "1px solid rgba(201, 169, 110, 0.2)",
                  color: "var(--color-cream)",
                  padding: "0.65rem 0.875rem",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "var(--font-body)",
                }}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(240, 236, 224, 0.6)",
                  marginBottom: "0.4rem",
                }}
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(240, 236, 224, 0.06)",
                  border: "1px solid rgba(201, 169, 110, 0.2)",
                  color: "var(--color-cream)",
                  padding: "0.65rem 0.875rem",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "var(--font-body)",
                }}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: "0.875rem",
                  marginBottom: "1.25rem",
                  padding: "0.65rem 0.875rem",
                  backgroundColor: "rgba(248, 113, 113, 0.08)",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-midnight)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
