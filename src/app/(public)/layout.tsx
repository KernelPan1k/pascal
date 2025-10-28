import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <PublicNav />
      <main style={{ flex: 1 }}>{children}</main>
      <PublicFooter />
    </div>
  );
}
