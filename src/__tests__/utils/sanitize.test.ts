import { sanitizeHtml, stripHtml, sanitizeText } from "@/utils/sanitize";

describe("sanitizeHtml", () => {
  it("allows safe HTML tags", () => {
    const input = "<p>Hello <strong>world</strong></p>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>");
    expect(result).toContain("Hello");
    expect(result).toContain("world");
  });

  it("removes script tags", () => {
    const input = '<p>Safe</p><script>alert("XSS")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
    expect(result).toContain("Safe");
  });

  it("removes onclick attributes", () => {
    const input = '<p onclick="alert(1)">Click me</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onclick");
    expect(result).toContain("Click me");
  });

  it("removes javascript: hrefs", () => {
    const input = '<a href="javascript:alert(1)">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("javascript:");
  });

  it("allows headings", () => {
    const input = "<h2>Title</h2><h3>Subtitle</h3>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<h2>");
    expect(result).toContain("<h3>");
  });

  it("allows blockquotes", () => {
    const input = "<blockquote>A wise quote</blockquote>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<blockquote>");
  });

  it("preserves empty string", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  it("preserves line breaks", () => {
    const input = "<p>Line 1</p><br><p>Line 2</p>";
    const result = sanitizeHtml(input);
    expect(result).toContain("<br");
  });
});

describe("stripHtml", () => {
  it("removes all HTML tags", () => {
    const result = stripHtml("<p>Hello <strong>world</strong></p>");
    expect(result).toBe("Hello world");
    expect(result).not.toContain("<");
  });

  it("handles empty string", () => {
    expect(stripHtml("")).toBe("");
  });

  it("handles nested tags", () => {
    const result = stripHtml("<div><p><em>text</em></p></div>");
    expect(result).toBe("text");
  });
});

describe("sanitizeText", () => {
  it("removes angle brackets", () => {
    expect(sanitizeText("<script>alert</script>")).toBe("scriptalert/script");
  });

  it("trims whitespace", () => {
    expect(sanitizeText("  hello world  ")).toBe("hello world");
  });

  it("handles normal text", () => {
    expect(sanitizeText("Pascal Mathieu")).toBe("Pascal Mathieu");
  });
});
