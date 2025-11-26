import { prisma } from "@/lib/prisma";
import TestimonialsAdmin from "./TestimonialsAdmin";

export default async function AdminTemoignagesPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const pending = testimonials.filter((t) => t.status === "PENDING");
  const approved = testimonials.filter((t) => t.status === "APPROVED");
  const rejected = testimonials.filter((t) => t.status === "REJECTED");

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          color: "var(--color-midnight)",
          marginBottom: "0.5rem",
        }}
      >
        Témoignages
      </h1>
      <p style={{ fontSize: "0.875rem", color: "var(--color-text-light)", marginBottom: "1.5rem" }}>
        {pending.length} en attente · {approved.length} approuvés · {rejected.length} rejetés
      </p>

      <TestimonialsAdmin testimonials={testimonials} />
    </div>
  );
}
