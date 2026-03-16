import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/panneau/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar
        userRole={session.user.role}
        userName={session.user.name || session.user.email}
      />
      <main
        className="admin-main"
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
