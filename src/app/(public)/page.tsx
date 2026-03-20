import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const HOME_KEYS = [
  "home_intro",
  "home_portrait_image",
  "home_portrait_quote",
  "home_portrait_text",
  "home_chanteur_text",
  "home_dessinateur_text",
  "home_poete_text",
  "home_region_quote",
  "home_region_text",
  "home_cta_title",
  "home_cta_text",
];

async function getSettings() {
  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: HOME_KEYS } },
  });
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--color-midnight) 0%, var(--color-deep) 50%, #2a1a0e 100%)`,
          color: "var(--color-cream)",
          padding: "8rem 1.5rem 6rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(201, 169, 110, 0.03) 80px, rgba(201, 169, 110, 0.03) 81px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: "1.5rem",
            }}
          >
            ✦ Besançon, Franche-Comté ✦
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "1rem",
              background: "linear-gradient(to bottom, #f0ece0, #c9a96e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Pascal
            <br />
            Mathieu
          </h1>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              fontStyle: "italic",
              color: "var(--color-gold)",
              letterSpacing: "0.15em",
              marginBottom: "2.5rem",
            }}
          >
            Chanteur · Dessinateur · Poète
          </p>

          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(240, 236, 224, 0.8)",
              lineHeight: 1.9,
              maxWidth: "600px",
              margin: "0 auto 3rem",
            }}
          >
            {settings.home_intro}
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/discographie"
              style={{
                display: "inline-block",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-midnight)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                textDecoration: "none",
              }}
            >
              Discographie
            </Link>
            <Link
              href="/biographie"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: "var(--color-cream)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                textDecoration: "none",
                border: "1px solid rgba(201, 169, 110, 0.4)",
              }}
            >
              Biographie
            </Link>
          </div>
        </div>
      </section>

      {/* Portrait */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "var(--color-deep)",
          color: "var(--color-cream)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: settings.home_portrait_image
              ? "repeat(auto-fit, minmax(300px, 1fr))"
              : "1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Photo */}
          {settings.home_portrait_image && (
            <div style={{ position: "relative" }}>
              {/* Décoration dorée décalée derrière la photo */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "1.5rem",
                  right: "-1.5rem",
                  bottom: "-1.5rem",
                  border: "1px solid rgba(201, 169, 110, 0.25)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  overflow: "hidden",
                  border: "1px solid rgba(201, 169, 110, 0.35)",
                  aspectRatio: "3 / 4",
                }}
              >
                <Image
                  src={settings.home_portrait_image}
                  alt="Pascal Mathieu"
                  fill
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                    filter: "sepia(18%) contrast(1.08) brightness(0.92)",
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Fondu bas vers la couleur de fond */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "35%",
                    background: "linear-gradient(to top, var(--color-deep) 0%, transparent 100%)",
                  }}
                />
              </div>
              {/* Légende dorée */}
              <p
                style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  left: "1.25rem",
                  zIndex: 2,
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                }}
              >
                Pascal Mathieu
              </p>
            </div>
          )}

          {/* Texte */}
          <div style={{ textAlign: settings.home_portrait_image ? "left" : "center" }}>
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "2rem",
              }}
            >
              ✦ Portrait ✦
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                fontStyle: "italic",
                lineHeight: 1.9,
                color: "rgba(240, 236, 224, 0.9)",
                marginBottom: "2rem",
              }}
            >
              {settings.home_portrait_quote}
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.85,
                color: "rgba(240, 236, 224, 0.65)",
                maxWidth: settings.home_portrait_image ? "none" : "640px",
                margin: settings.home_portrait_image ? "0" : "0 auto",
              }}
            >
              {settings.home_portrait_text}
            </p>
          </div>
        </div>
      </section>

      {/* Trois univers */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "var(--color-midnight)",
          color: "var(--color-cream)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                marginBottom: "1rem",
              }}
            >
              ✦ L&apos;univers ✦
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "var(--color-cream-bright)",
              }}
            >
              Trois arts, une même voix
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2px",
            }}
          >
            {[
              {
                icon: "♬",
                title: "Le Chanteur",
                href: "/discographie",
                text: settings.home_chanteur_text,
                cta: "Voir la discographie",
              },
              {
                icon: "✏",
                title: "Le Dessinateur",
                href: "/biographie",
                text: settings.home_dessinateur_text,
                cta: "Découvrir la biographie",
              },
              {
                icon: "✦",
                title: "Le Poète",
                href: "/articles",
                text: settings.home_poete_text,
                cta: "Lire les articles",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "3rem 2.5rem",
                  backgroundColor: "var(--color-surface)",
                  borderTop: "2px solid var(--color-gold)",
                }}
              >
                <p
                  style={{
                    fontSize: "1.75rem",
                    color: "var(--color-gold)",
                    marginBottom: "1.25rem",
                    opacity: 0.7,
                  }}
                >
                  {item.icon}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.35rem",
                    color: "var(--color-cream-bright)",
                    marginBottom: "1rem",
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.85,
                    color: "rgba(240, 236, 224, 0.65)",
                    marginBottom: "1.75rem",
                  }}
                >
                  {item.text}
                </p>
                <Link
                  href={item.href}
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(201, 169, 110, 0.35)",
                    paddingBottom: "2px",
                  }}
                >
                  {item.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ancrage géographique */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "var(--color-deep)",
          color: "var(--color-cream)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: "2rem",
            }}
          >
            ✦ Besançon & alentours ✦
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
              fontStyle: "italic",
              lineHeight: 1.9,
              color: "rgba(240, 236, 224, 0.85)",
              marginBottom: "2rem",
            }}
          >
            {settings.home_region_quote}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.85,
              color: "rgba(240, 236, 224, 0.55)",
            }}
          >
            {settings.home_region_text}
          </p>
        </div>
      </section>

      {/* CTA contact */}
      <section
        style={{
          padding: "5rem 1.5rem",
          backgroundColor: "var(--color-midnight)",
          textAlign: "center",
          borderTop: "1px solid rgba(201, 169, 110, 0.1)",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
              color: "var(--color-cream-bright)",
              marginBottom: "1rem",
              fontWeight: 700,
            }}
          >
            {settings.home_cta_title}
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(240, 236, 224, 0.6)",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            {settings.home_cta_text}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/biographie"
              style={{
                display: "inline-block",
                backgroundColor: "var(--color-gold)",
                color: "var(--color-midnight)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                textDecoration: "none",
              }}
            >
              La biographie
            </Link>
            <Link
              href="/articles"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: "var(--color-cream)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                textDecoration: "none",
                border: "1px solid rgba(201, 169, 110, 0.4)",
              }}
            >
              Les articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
