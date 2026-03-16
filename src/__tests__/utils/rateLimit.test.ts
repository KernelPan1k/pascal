import { checkRateLimit } from "@/utils/rateLimit";

describe("checkRateLimit", () => {
  it("allows first request", () => {
    const result = checkRateLimit("test:first", 3, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("allows up to maxAttempts", () => {
    const key = "test:max";
    checkRateLimit(key, 3, 60000); // 1st
    checkRateLimit(key, 3, 60000); // 2nd
    const result = checkRateLimit(key, 3, 60000); // 3rd
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("blocks after maxAttempts exceeded", () => {
    const key = "test:block";
    checkRateLimit(key, 2, 60000);
    checkRateLimit(key, 2, 60000);
    const result = checkRateLimit(key, 2, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const key = "test:reset";
    checkRateLimit(key, 1, 1); // 1ms window
    checkRateLimit(key, 1, 1); // now blocked

    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result = checkRateLimit(key, 1, 1);
        expect(result.allowed).toBe(true);
        resolve();
      }, 10);
    });
  });

  it("uses separate buckets per key", () => {
    const r1 = checkRateLimit("test:sep-a", 1, 60000);
    const r2 = checkRateLimit("test:sep-b", 1, 60000);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });

  it("reports correct remaining count", () => {
    const key = "test:remaining";
    const r1 = checkRateLimit(key, 5, 60000);
    expect(r1.remaining).toBe(4);
    const r2 = checkRateLimit(key, 5, 60000);
    expect(r2.remaining).toBe(3);
    const r3 = checkRateLimit(key, 5, 60000);
    expect(r3.remaining).toBe(2);
  });
});
