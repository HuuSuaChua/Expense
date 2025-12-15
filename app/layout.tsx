import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Quản lý chi tiêu cá nhân",
    template: "%s | Expense Tracker",
  },
  description:
    "Ứng dụng quản lý chi tiêu cá nhân giúp theo dõi thu chi hiệu quả.",
  openGraph: {
    title: "Expense Tracker",
    description: "Theo dõi chi tiêu – tiết kiệm thông minh",
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
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
