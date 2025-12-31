import Fireworks from "@/components/Fireworks";
import HappyNewYear from "@/components/HappyNewYear";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <HappyNewYear />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
