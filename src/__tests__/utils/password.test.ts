import { validatePassword, PASSWORD_RULES } from "@/utils/password";

describe("PASSWORD_RULES", () => {
  it("has 5 rules", () => {
    expect(PASSWORD_RULES).toHaveLength(5);
  });

  it("requires at least 10 characters", () => {
    const rule = PASSWORD_RULES.find((r) => r.label.includes("10"));
    expect(rule).toBeDefined();
    expect(rule!.test("123456789")).toBe(false);
    expect(rule!.test("1234567890")).toBe(true);
  });

  it("requires an uppercase letter", () => {
    const rule = PASSWORD_RULES.find((r) => r.label.includes("majuscule"));
    expect(rule).toBeDefined();
    expect(rule!.test("alllowercase")).toBe(false);
    expect(rule!.test("Uppercase")).toBe(true);
  });

  it("requires a lowercase letter", () => {
    const rule = PASSWORD_RULES.find((r) => r.label.includes("minuscule"));
    expect(rule).toBeDefined();
    expect(rule!.test("ALLUPPERCASE")).toBe(false);
    expect(rule!.test("Lowercase")).toBe(true);
  });

  it("requires a digit", () => {
    const rule = PASSWORD_RULES.find((r) => r.label.includes("chiffre"));
    expect(rule).toBeDefined();
    expect(rule!.test("NoDigitsHere")).toBe(false);
    expect(rule!.test("Has1Digit")).toBe(true);
  });

  it("requires a special character", () => {
    const rule = PASSWORD_RULES.find((r) => r.label.includes("spécial"));
    expect(rule).toBeDefined();
    expect(rule!.test("NoSpecial1A")).toBe(false);
    expect(rule!.test("Special1A!")).toBe(true);
  });
});

describe("validatePassword", () => {
  it("returns valid for a strong password", () => {
    const result = validatePassword("Admin@Pascal2025!");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns invalid for a short password", () => {
    const result = validatePassword("Ab1!");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("10"))).toBe(true);
  });

  it("returns invalid for a password without uppercase", () => {
    const result = validatePassword("nouppercase1!");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("majuscule"))).toBe(true);
  });

  it("returns invalid for a password without lowercase", () => {
    const result = validatePassword("NOLOWER1!");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("minuscule"))).toBe(true);
  });

  it("returns invalid for a password without digit", () => {
    const result = validatePassword("NoDigitHere!");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("chiffre"))).toBe(true);
  });

  it("returns invalid for a password without special character", () => {
    const result = validatePassword("NoSpecial1Ab");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("spécial"))).toBe(true);
  });

  it("reports all failing rules for an empty password", () => {
    const result = validatePassword("");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(PASSWORD_RULES.length);
  });

  it("returns only the failing rules", () => {
    // Missing special char only
    const result = validatePassword("AdminPascal2025");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("spécial");
  });
});
