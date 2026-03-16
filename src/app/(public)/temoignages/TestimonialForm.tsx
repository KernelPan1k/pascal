"use client";

import { useState, useRef, useEffect } from "react";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function TestimonialForm() {
  const [form, setForm] = useState({
    author: "",
    role: "",
    content: "",
    honeypot: "",
    captchaAnswer: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [captcha, setCaptcha] = useState<{ a: number; b: number } | null>(null);
  const loadTime = useRef(0);

  useEffect(() => {
    setCaptcha({ a: randomInt(1, 9), b: randomInt(1, 9) });
    loadTime.current = Date.now();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check (client side)
    if (form.honeypot) return;

    // Timing check — reject if submitted in under 3 seconds
    if (Date.now() - loadTime.current < 3000) return;

    // Math captcha check
    if (!captcha) return;
    const expected = captcha.a + captcha.b;
    if (parseInt(form.captchaAnswer, 10) !== expected) {
      setErrorMsg("Réponse incorrecte à la question de vérification.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: form.author,
          role: form.role || undefined,
          content: form.content,
          honeypot: form.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Une erreur est survenue.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ author: "", role: "", content: "", honeypot: "", captchaAnswer: "" });
      setCaptcha({ a: randomInt(1, 9), b: randomInt(1, 9) });
      loadTime.current = Date.now();
    } catch {
      setErrorMsg("Impossible de soumettre votre témoignage. Veuillez réessayer.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        style={{
          padding: "2rem",
          backgroundColor: "rgba(201, 169, 110, 0.1)",
          border: "1px solid var(--color-gold)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            color: "var(--color-midnight)",
            marginBottom: "0.5rem",
          }}
        >
          Merci pour votre témoignage !
        </p>
        <p style={{ color: "var(--color-text-light)" }}>
          Il sera examiné et publié prochainement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot field — hidden from real users */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input
          type="text"
          name="website"
          value={form.honeypot}
          onChange={(e) => setForm((f) => ({ ...f, honeypot: e.target.value }))}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div style={{ display: "grid", gap: "1.25rem" }}>
        <div>
          <label
            htmlFor="author"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontFamily: "var(--font-display)",
              color: "var(--color-midnight)",
              marginBottom: "0.4rem",
            }}
          >
            Votre nom <span style={{ color: "var(--color-burgundy)" }}>*</span>
          </label>
          <input
            id="author"
            type="text"
            required
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            className="form-input"
            placeholder="Marie Dupont"
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor="role"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontFamily: "var(--font-display)",
              color: "var(--color-midnight)",
              marginBottom: "0.4rem",
            }}
          >
            Votre titre ou profession (optionnel)
          </label>
          <input
            id="role"
            type="text"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="form-input"
            placeholder="Journaliste, Enseignant, etc."
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontFamily: "var(--font-display)",
              color: "var(--color-midnight)",
              marginBottom: "0.4rem",
            }}
          >
            Votre témoignage <span style={{ color: "var(--color-burgundy)" }}>*</span>
          </label>
          <textarea
            id="content"
            required
            minLength={10}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="form-input"
            rows={5}
            placeholder="Partagez votre expérience avec l'œuvre de Pascal…"
            maxLength={1000}
            style={{ resize: "vertical" }}
          />
          <p style={{ fontSize: "0.75rem", color: form.content.length > 0 && form.content.length < 10 ? "var(--color-burgundy)" : "var(--color-text-light)", marginTop: "0.3rem" }}>
            {form.content.length < 10 && form.content.length > 0
              ? `${form.content.length}/10 caractères minimum`
              : `${form.content.length}/1000 caractères`}
          </p>
        </div>

        {captcha && (
          <div>
            <label
              htmlFor="captcha"
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
                marginBottom: "0.4rem",
              }}
            >
              Vérification : combien font {captcha.a} + {captcha.b} ?{" "}
              <span style={{ color: "var(--color-burgundy)" }}>*</span>
            </label>
            <input
              id="captcha"
              type="number"
              required
              value={form.captchaAnswer}
              onChange={(e) => setForm((f) => ({ ...f, captchaAnswer: e.target.value }))}
              className="form-input"
              style={{ maxWidth: "120px" }}
              autoComplete="off"
            />
          </div>
        )}

        {status === "error" && (
          <p
            style={{
              color: "var(--color-burgundy)",
              fontSize: "0.875rem",
              padding: "0.75rem 1rem",
              backgroundColor: "rgba(124, 29, 63, 0.08)",
              border: "1px solid rgba(124, 29, 63, 0.2)",
            }}
          >
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary"
          style={{ alignSelf: "flex-start" }}
        >
          {status === "loading" ? "Envoi en cours…" : "Envoyer mon témoignage"}
        </button>
      </div>
    </form>
  );
}
