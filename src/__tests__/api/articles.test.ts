import { z } from "zod";
import { generateSlug } from "@/utils/slugify";

// Test the validation schemas used in the articles API
const createSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  coverImage: z.string().optional(),
});

describe("Article API validation", () => {
  describe("createSchema", () => {
    it("accepts valid article data", () => {
      const result = createSchema.safeParse({
        title: "My Article",
        content: "<p>Content here</p>",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = createSchema.safeParse({
        title: "",
        content: "<p>Content</p>",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing content", () => {
      const result = createSchema.safeParse({
        title: "Title",
        content: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const result = createSchema.safeParse({
        title: "Title",
        content: "Content",
        status: "INVALID",
      });
      expect(result.success).toBe(false);
    });

    it("defaults status to DRAFT", () => {
      const result = createSchema.safeParse({
        title: "Title",
        content: "Content",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("DRAFT");
      }
    });

    it("accepts PUBLISHED status", () => {
      const result = createSchema.safeParse({
        title: "Title",
        content: "Content",
        status: "PUBLISHED",
      });
      expect(result.success).toBe(true);
    });

    it("rejects title over 300 characters", () => {
      const result = createSchema.safeParse({
        title: "a".repeat(301),
        content: "Content",
      });
      expect(result.success).toBe(false);
    });

    it("accepts optional excerpt", () => {
      const result = createSchema.safeParse({
        title: "Title",
        content: "Content",
        excerpt: "A short excerpt",
      });
      expect(result.success).toBe(true);
    });

    it("rejects excerpt over 500 characters", () => {
      const result = createSchema.safeParse({
        title: "Title",
        content: "Content",
        excerpt: "a".repeat(501),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("slug generation for articles", () => {
    it("generates slug from title", () => {
      const title = "Mon Premier Article";
      const slug = generateSlug(title);
      expect(slug).toBe("mon-premier-article");
    });

    it("generates unique slug with timestamp pattern", () => {
      const base = generateSlug("Duplicate Title");
      const unique = `${base}-${1234567890}`;
      expect(unique).toMatch(/^duplicate-title-\d+$/);
    });
  });
});
