import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="fr">
      <body
        style={{
          fontFamily: "Georgia, serif",
          backgroundColor: "#f0ece0",
          color: "#2c2c3a",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "4rem",
                color: "#c9a96e",
                marginBottom: "1rem",
              }}
            >
              404
            </h1>
            <p style={{ marginBottom: "2rem" }}>Page introuvable</p>
            <Link
              href="/"
              style={{
                backgroundColor: "#c9a96e",
                color: "#0d0d1a",
                padding: "0.75rem 1.5rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Accueil
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
