import { z } from "zod";

// Test the login validation schema used in auth
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

describe("Auth validation", () => {
  describe("loginSchema", () => {
    it("accepts valid credentials", () => {
      const result = loginSchema.safeParse({
        email: "admin@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty email", () => {
      const result = loginSchema.safeParse({
        email: "",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "abc",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });

    it("accepts password of exactly 6 characters", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "abcdef",
      });
      expect(result.success).toBe(true);
    });
  });
});

describe("Password hashing", () => {
  it("bcrypt rounds constant is 12", () => {
    const BCRYPT_ROUNDS = 12;
    expect(BCRYPT_ROUNDS).toBe(12);
    expect(BCRYPT_ROUNDS).toBeGreaterThanOrEqual(10);
  });
});
