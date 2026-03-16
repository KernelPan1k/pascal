import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        <span
          style={{
            color: "#d4af7a",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          PM
        </span>
      </div>
    ),
    { ...size }
  );
}
