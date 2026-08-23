import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Trương Học Hữu | Full-Stack Developer",
    template: "%s | Trương Học Hữu",
  },
  description:
    "Portfolio cá nhân của Trương Học Hữu - Full-Stack Developer chuyên về Next.js, React, Laravel, Spring Boot và Tailwind CSS.",
  authors: [{ name: "Trương Học Hữu" }],
  openGraph: {
    title: "Trương Học Hữu | Full-Stack Developer",
    description: "Khám phá các dự án web, AI, và giải pháp full-stack của Trương Học Hữu.",
    url: "https://github.com/TruongHocHuu78",
    siteName: "Trương Học Hữu Portfolio",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}