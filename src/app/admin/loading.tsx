export default function AdminLoading() {
  return (
    <div
      style={{
        padding: "3rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        color: "var(--color-text-light)",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          border: "2px solid #e8e0cc",
          borderTopColor: "var(--color-gold)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: "0.875rem" }}>Chargement…</span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
