export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="bg-white w-full md:w-64 p-4 shadow">
        <h2 className="font-bold text-lg">💰 Expense</h2>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
