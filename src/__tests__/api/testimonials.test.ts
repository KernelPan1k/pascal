import { z } from "zod";

// Mirror of the schema in /api/testimonials/route.ts
const submitSchema = z.object({
  author: z.string().min(1).max(100),
  role: z.string().max(100).optional(),
  content: z.string().min(10).max(1000),
  honeypot: z.string().max(0).optional(),
});

describe("Testimonial submission schema", () => {
  it("accepts valid data", () => {
    const result = submitSchema.safeParse({
      author: "Marie Dupont",
      content: "Un spectacle magnifique et profondément émouvant.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid data with optional role", () => {
    const result = submitSchema.safeParse({
      author: "Jean Martin",
      role: "Journaliste",
      content: "Une œuvre qui marque durablement les esprits.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty author", () => {
    const result = submitSchema.safeParse({
      author: "",
      content: "Contenu suffisamment long pour passer la validation.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects author over 100 characters", () => {
    const result = submitSchema.safeParse({
      author: "A".repeat(101),
      content: "Contenu suffisamment long.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects content under 10 characters", () => {
    const result = submitSchema.safeParse({
      author: "Jean",
      content: "Court",
    });
    expect(result.success).toBe(false);
  });

  it("rejects content over 1000 characters", () => {
    const result = submitSchema.safeParse({
      author: "Jean",
      content: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-empty honeypot (bot detection)", () => {
    const result = submitSchema.safeParse({
      author: "Bot",
      content: "Contenu suffisamment long pour passer.",
      honeypot: "I am a bot",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty honeypot", () => {
    const result = submitSchema.safeParse({
      author: "Real user",
      content: "Contenu suffisamment long pour passer.",
      honeypot: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts undefined honeypot", () => {
    const result = submitSchema.safeParse({
      author: "Real user",
      content: "Contenu suffisamment long pour passer.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects role over 100 characters", () => {
    const result = submitSchema.safeParse({
      author: "Jean",
      role: "R".repeat(101),
      content: "Contenu suffisamment long pour passer.",
    });
    expect(result.success).toBe(false);
  });

  it("accepts content of exactly 10 characters", () => {
    const result = submitSchema.safeParse({
      author: "Jean",
      content: "1234567890",
    });
    expect(result.success).toBe(true);
  });

  it("accepts content of exactly 1000 characters", () => {
    const result = submitSchema.safeParse({
      author: "Jean",
      content: "a".repeat(1000),
    });
    expect(result.success).toBe(true);
  });
});
