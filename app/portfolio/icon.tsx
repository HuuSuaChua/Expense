import { ImageResponse } from "next/og";

// Kích thước chuẩn cho favicon/tab icon
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #10b981 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "8px",
          fontWeight: 900,
          fontFamily: "monospace",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}