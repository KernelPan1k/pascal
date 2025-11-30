import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersAdmin from "./UsersAdmin";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

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
        Utilisateurs
      </h1>
      <UsersAdmin users={users} currentUserId={session!.user.id} />
    </div>
  );
}
