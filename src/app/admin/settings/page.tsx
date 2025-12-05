import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin");

  const settings = await prisma.siteSettings.findMany({
    orderBy: { key: "asc" },
  });

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          color: "var(--color-midnight)",
          marginBottom: "1.5rem",
        }}
      >
        Paramètres du site
      </h1>
      <SettingsForm settings={settingsMap} />
    </div>
  );
}
