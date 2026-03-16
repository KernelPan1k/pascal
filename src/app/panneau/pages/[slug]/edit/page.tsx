import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageForm from "@/components/panneau/PageForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditPagePage({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page) notFound();

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
        Modifier : {page.title}
      </h1>
      <PageForm
        page={{
          slug: page.slug,
          title: page.title,
          content: page.content,
        }}
      />
    </div>
  );
}
