export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-4">
        Quản lý chi tiêu cá nhân
      </h1>
      <p className="text-gray-600 mb-6">
        Theo dõi thu chi – tiết kiệm hiệu quả mỗi ngày
      </p>
      <a href="/login" className="btn-primary">
        Bắt đầu sử dụng
      </a>
    </main>
  );
}
