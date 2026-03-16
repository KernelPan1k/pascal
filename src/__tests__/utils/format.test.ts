import { formatDate, formatDateShort, formatFileSize, truncate } from "@/utils/format";

describe("formatDate", () => {
  it("formats a date in long French format", () => {
    const result = formatDate(new Date("2025-06-15T00:00:00Z"));
    // Should contain the year and month name in French
    expect(result).toContain("2025");
    expect(result).toMatch(/juin/i);
  });

  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("accepts a string date", () => {
    const result = formatDate("2013-01-01");
    expect(result).toContain("2013");
  });

  it("accepts a custom locale", () => {
    const result = formatDate("2025-01-15", "en-US");
    expect(result).toContain("2025");
    expect(result).toMatch(/January/i);
  });
});

describe("formatDateShort", () => {
  it("returns a short date string", () => {
    const result = formatDateShort(new Date("2025-06-15T00:00:00Z"));
    expect(result).toContain("2025");
  });

  it("returns empty string for null", () => {
    expect(formatDateShort(null)).toBe("");
  });

  it("accepts a string date", () => {
    const result = formatDateShort("2013-04-12");
    expect(result).toContain("2013");
  });
});

describe("formatFileSize", () => {
  it("formats bytes", () => {
    expect(formatFileSize(512)).toBe("512 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });

  it("formats 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("rounds to one decimal place", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });
});

describe("truncate", () => {
  it("returns the string unchanged if within limit", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("truncates and adds ellipsis when over limit", () => {
    const result = truncate("Hello World", 5);
    expect(result).toContain("…");
    expect(result.length).toBeLessThan("Hello World".length);
  });

  it("trims trailing spaces before ellipsis", () => {
    const result = truncate("Hello World", 6);
    expect(result).not.toMatch(/ …$/);
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  it("handles exactly maxLength", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});
