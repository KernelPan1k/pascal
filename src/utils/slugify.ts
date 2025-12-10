import slugifyLib from "slugify";

export function generateSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "fr",
    trim: true,
  });
}

export function generateUniqueSlug(text: string, suffix?: string | number): string {
  const base = generateSlug(text);
  if (suffix !== undefined) {
    return `${base}-${suffix}`;
  }
  return base;
}
