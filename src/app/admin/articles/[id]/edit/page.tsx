import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) notFound();

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
        Modifier l&apos;article
      </h1>
      <ArticleForm
        article={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          content: article.content,
          status: article.status,
          coverImage: article.coverImage || "",
        }}
      />
    </div>
  );
}
