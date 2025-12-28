import { generateSlug, generateUniqueSlug } from "@/utils/slugify";

describe("generateSlug", () => {
  it("converts basic string to slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("handles French accents", () => {
    expect(generateSlug("Témoignages et récits")).toBe("temoignages-et-recits");
  });

  it("removes special characters", () => {
    // French locale: '&' becomes 'et'
    expect(generateSlug("L'art & la poésie!")).toBe("lart-et-la-poesie");
  });

  it("trims whitespace", () => {
    expect(generateSlug("  title with spaces  ")).toBe("title-with-spaces");
  });

  it("handles multiple dashes", () => {
    expect(generateSlug("Pascal---Mathieu")).toBe("pascal-mathieu");
  });

  it("converts to lowercase", () => {
    expect(generateSlug("UPPERCASE TITLE")).toBe("uppercase-title");
  });

  it("handles numbers", () => {
    expect(generateSlug("Album 2023")).toBe("album-2023");
  });
});

describe("generateUniqueSlug", () => {
  it("appends suffix when provided", () => {
    expect(generateUniqueSlug("Hello World", 1)).toBe("hello-world-1");
  });

  it("returns base slug without suffix", () => {
    expect(generateUniqueSlug("Hello World")).toBe("hello-world");
  });

  it("works with string suffix", () => {
    expect(generateUniqueSlug("Test", "copy")).toBe("test-copy");
  });
});
