// /app/english/layout.tsx
import React from "react";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="bg-white w-full md:w-64 p-4 shadow">
        <h2 className="font-bold text-lg mb-4">📚 Học Tiếng Anh</h2>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-indigo-100 transition">
           🏠 Home
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
