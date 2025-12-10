import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "code", "pre", "a", "img", "figure",
  "figcaption", "div", "span", "hr", "sup", "sub", "table", "thead", "tbody",
  "tr", "th", "td", "iframe",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "class", "id", "target", "rel",
  "width", "height", "style", "allowfullscreen", "frameborder",
  "allow", "loading", "data-youtube-video",
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });
}

export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, "")
    .trim();
}
