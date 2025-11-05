import { prisma } from "@/lib/prisma";
import TestimonialForm from "./TestimonialForm";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Témoignages",
  description: "Témoignages sur l'œuvre de Pascal Mathieu. Partagez votre expérience.",
};

export default async function TemoignagesPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--color-midnight)",
          color: "var(--color-cream)",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            marginBottom: "1rem",
          }}
        >
          Ce qu&apos;on dit
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
          }}
        >
          Témoignages
        </h1>
        <div
          style={{
            width: "60px",
            height: "2px",
            backgroundColor: "var(--color-gold)",
            margin: "1.5rem auto 0",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
        }}
      >
        {/* Testimonials list */}
        {testimonials.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-light)",
              fontStyle: "italic",
              fontFamily: "var(--font-display)",
              marginBottom: "3rem",
            }}
          >
            Soyez le premier à partager votre témoignage.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "2rem",
              marginBottom: "4rem",
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "2rem 2.5rem",
                  backgroundColor: "white",
                  border: "1px solid var(--color-cream-dark)",
                  borderLeft: "3px solid var(--color-gold)",
                  position: "relative",
                }}
              >
                <p
                  style={{
                    fontSize: "3.5rem",
                    color: "var(--color-gold)",
                    opacity: 0.2,
                    position: "absolute",
                    top: "0.5rem",
                    left: "1.5rem",
                    lineHeight: 1,
                    fontFamily: "Georgia",
                  }}
                >
                  "
                </p>
                <p
                  style={{
                    fontStyle: "italic",
                    fontSize: "1rem",
                    lineHeight: 1.85,
                    color: "var(--color-text)",
                    marginBottom: "1.25rem",
                    paddingTop: "1rem",
                  }}
                >
                  {t.content}
                </p>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--color-midnight)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {t.author}
                  </p>
                  {t.role && (
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--color-text-light)",
                        fontStyle: "italic",
                        marginTop: "0.2rem",
                      }}
                    >
                      {t.role}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, var(--color-gold), transparent)",
            marginBottom: "3rem",
          }}
        />

        {/* Submission form */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              color: "var(--color-midnight)",
              marginBottom: "0.75rem",
            }}
          >
            Partagez votre témoignage
          </h2>
          <p
            style={{
              color: "var(--color-text-light)",
              marginBottom: "2rem",
              lineHeight: 1.7,
            }}
          >
            Votre message sera examiné avant publication. Nous vous remercions de partager
            votre expérience.
          </p>
          <TestimonialForm />
        </div>
      </div>
    </>
  );
}
