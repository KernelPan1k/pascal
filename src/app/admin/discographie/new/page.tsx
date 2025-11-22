import AlbumForm from "@/components/admin/AlbumForm";

export default function NewAlbumPage() {
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
        Nouvel album
      </h1>
      <AlbumForm />
    </div>
  );
}
