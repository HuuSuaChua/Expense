export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">

      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 p-6 shadow-md flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-indigo-600 flex items-center gap-2">
            💰 Expense
          </h2>
        </div>

        <nav className="flex flex-col gap-3">
          <a
            href="/english"
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-all"
          >
            📚 Learn English
          </a>
        </nav>
        <nav className="flex flex-col gap-3">
          <a
            href="/noel"
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-all"
          >
            🎅 Merry
          </a>
        </nav>
        <nav className="flex flex-col gap-3">
          <a
            href="/fire"
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-all"
          >
            🧧Happy New Year
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
