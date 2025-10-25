import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar
        userRole={session.user.role}
        userName={session.user.name || session.user.email}
      />
      <main
        style={{
          flex: 1,
          backgroundColor: "#f8f7f4",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
