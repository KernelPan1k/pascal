export default function Loading() {
  return (
    <div
      style={{
        minHeight: "40vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--color-cream-dark)",
            borderTopColor: "var(--color-gold)",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "var(--color-text-light)",
            fontSize: "0.875rem",
          }}
        >
          Chargement…
        </p>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
