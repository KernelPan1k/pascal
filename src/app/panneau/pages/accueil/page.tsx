import { prisma } from "@/lib/prisma";
import HomepageForm from "./HomepageForm";

export default async function AdminHomepagePage() {
  const keys = [
    "home_intro",
    "home_portrait_image",
    "home_portrait_quote",
    "home_portrait_text",
    "home_chanteur_text",
    "home_dessinateur_text",
    "home_poete_text",
    "home_region_quote",
    "home_region_text",
    "home_cta_title",
    "home_cta_text",
  ];

  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: keys } },
  });
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginBottom: "0.25rem" }}>
          Pages
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            color: "var(--color-midnight)",
          }}
        >
          Page d&apos;accueil
        </h1>
      </div>
      <HomepageForm settings={settingsMap} />
    </div>
  );
}
