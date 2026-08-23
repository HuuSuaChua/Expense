'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ArrowRight, 
  Menu, 
  X, 
  ShoppingBag, 
  Utensils, 
  Briefcase, 
  Coffee, 
  Store 
} from 'lucide-react';

export default function QTableLandingPage() {
  // State quản lý Dropdown & Mobile Menu
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State cho Feature Section (Tab top & Sub-category sidebar)
  const [activeMainTab, setActiveMainTab] = useState<'an-uong' | 'ban-le' | 'dich-vu'>('an-uong');
  const [activeSubTab, setActiveSubTab] = useState<string>('Quán cà phê');

  // Dữ liệu danh mục phụ cho tab "Ăn uống"
  const foodSubTabs = [
    'Quán cà phê',
    'Quán ăn / nhà hàng',
    'Quán bar / lounge / pub',
    'Quán ăn di động',
    'Tiệm trà sữa',
    'Tiệm bánh',
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased selection:bg-[#ccff00] selection:text-black">
      
      {/* ==================== HEADER / NAVBAR ==================== */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a3e635] text-lg font-black text-black">
              Q
            </div>
            <span className="text-xl font-bold tracking-tight text-black">table</span>
          </div>

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
            
            {/* MEGA MENU DROPDOWN TRIGGER */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 transition-colors hover:text-[#84cc16]">
                Giải pháp <ChevronDown className={`h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* MEGA MENU POPUP */}
              {isMegaMenuOpen && (
                <div className="absolute left-0 top-full w-64 rounded-xl border border-gray-100 bg-white p-3 shadow-xl transition-all">
                  <a href="#" className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black">
                    Lorem ipsum dolor
                  </a>
                  <a href="#" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-black hover:bg-gray-50">
                    <span>Sed do eiusmod tempor</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#" className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black">
                    Lorem ipsum dolor
                  </a>
                  <a href="#" className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black">
                    Sed do eiusmod tempor
                  </a>
                </div>
              )}
            </div>

            <a href="#" className="transition-colors hover:text-[#84cc16]">Thiết bị</a>
            <a href="#" className="transition-colors hover:text-[#84cc16]">Bảng giá</a>
            <a href="#" className="transition-colors hover:text-[#84cc16]">Hỗ trợ</a>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden items-center space-x-3 md:flex">
            <button className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-black">
              Đăng nhập
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-[#a3e635] px-5 py-2 text-sm font-semibold text-black shadow-sm transition-all hover:bg-[#84cc16]">
              Sử dụng miễn phí <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* ==================== MOBILE MENU OVERLAY ==================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white px-6 py-4 md:hidden">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a3e635] font-bold text-black">Q</div>
              <span className="text-xl font-bold">table</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-md border p-1">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flex flex-col space-y-4 font-medium">
            <a href="#" className="text-lg">Giải pháp</a>
            <a href="#" className="text-lg">Thiết bị</a>
            <a href="#" className="text-lg">Bảng giá</a>
            <a href="#" className="text-lg">Hỗ trợ</a>
            <div className="mt-8 flex flex-col gap-3">
              <button className="w-full rounded-full border border-gray-300 py-3 text-center font-semibold">Đăng nhập</button>
              <button className="w-full rounded-full bg-[#a3e635] py-3 text-center font-semibold text-black">Sử dụng miễn phí →</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HERO SECTION (CAROUSEL BANNER) ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f2fcd2] via-[#e9f8bd] to-[#d8f59d] p-6 sm:p-10 lg:p-12">
          
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* HERO LEFT TEXT */}
            <div className="lg:col-span-6">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-white/80 px-3 py-1 text-xs font-bold text-black backdrop-blur-sm">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#a3e635] text-[10px]">Q</span> table
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Quản lý dễ dàng,<br />bán hàng hiệu quả
              </h1>

              <p className="mt-4 max-w-md text-sm text-gray-600 sm:text-base">
                Chào mừng bạn đến với Xứ sở thần tiên. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <div className="mt-6">
                <button className="flex items-center gap-2 rounded-full bg-[#27272a] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-black">
                  Đặt lịch tư vấn <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* HERO RIGHT IMAGE COMPOSITION */}
            <div className="relative lg:col-span-6">
              <div className="relative mx-auto max-w-md">
                {/* Main Image Frame */}
                <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" 
                    alt="Quản lý bán hàng" 
                    className="h-64 w-full rounded-xl object-cover sm:h-72"
                  />
                </div>

                {/* Sub Image Cards Below */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="group rounded-xl bg-white p-1.5 text-center shadow-sm">
                    <img src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=300&q=80" alt="Bán lẻ" className="h-14 w-full rounded-lg object-cover" />
                    <span className="mt-1 block text-[11px] font-medium text-gray-700">🛒 Bán lẻ</span>
                  </div>
                  <div className="group rounded-xl bg-white p-1.5 text-center shadow-sm">
                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80" alt="Nhà hàng" className="h-14 w-full rounded-lg object-cover" />
                    <span className="mt-1 block text-[11px] font-medium text-gray-700">🍽️ Nhà hàng</span>
                  </div>
                  <div className="group rounded-xl bg-white p-1.5 text-center shadow-sm">
                    <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80" alt="Dịch vụ" className="h-14 w-full rounded-lg object-cover" />
                    <span className="mt-1 block text-[11px] font-medium text-gray-700">💈 Dịch vụ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CAROUSEL INDICATOR DOTS */}
          <div className="mt-8 flex justify-center space-x-2">
            <span className="h-1.5 w-8 rounded-full bg-gray-800"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES / "EVERYTHING YOU NEED" SECTION ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* SECTION SUBTITLE & TITLE */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#a3e635] px-3 py-1 text-[10px] font-bold tracking-wider text-black uppercase">
            LONG SUBTITLE
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything You Need
          </h2>
          <div className="mx-auto mt-2 max-w-2xl rounded-lg border border-pink-400 p-1 text-center">
            <p className="text-xs text-gray-500 sm:text-sm">
              Improve speed of service, boost kitchen efficiency, and drive repeat business with a restaurant management solution that offers everything you need to maximize profits and offer an unparalleled guest experience - all in one place.
            </p>
          </div>
        </div>

        {/* MAIN FEATURE CONTAINER */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-purple-300 bg-gradient-to-br from-[#f8fde8] via-[#edf7d4] to-[#e4f4c0] p-4 sm:p-8">
          
          {/* CATEGORY SWITCHER TABS (TOP NAV) */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-full border border-amber-300 bg-white/90 p-1 shadow-sm backdrop-blur-sm">
              <button 
                onClick={() => setActiveMainTab('an-uong')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeMainTab === 'an-uong' 
                    ? 'bg-[#27272a] text-white shadow' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <Utensils className="h-4 w-4" /> Ăn uống
              </button>

              <button 
                onClick={() => setActiveMainTab('ban-le')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeMainTab === 'ban-le' 
                    ? 'bg-[#27272a] text-white shadow' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <ShoppingBag className="h-4 w-4" /> Bán lẻ 
                <span className="rounded bg-[#a3e635] px-1 py-0.5 text-[9px] font-bold text-black">NEW</span>
              </button>

              <button 
                onClick={() => setActiveMainTab('dich-vu')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeMainTab === 'dich-vu' 
                    ? 'bg-[#27272a] text-white shadow' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <Briefcase className="h-4 w-4" /> Dịch vụ 
                <span className="rounded bg-[#a3e635] px-1 py-0.5 text-[9px] font-bold text-black">NEW</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENT GRID */}
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
            
            {/* LEFT SIDEBAR: SUB CATEGORIES */}
            <div className="space-y-3 lg:col-span-5">
              <div className="border-l-2 border-black pl-3">
                <h3 className="text-2xl font-bold text-gray-900">{activeSubTab}</h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Qtable POS giúp order nhanh, chọn size/topping, in phiếu bếp và quản lý mang đi/ngồi lại hiệu quả.
                </p>
              </div>

              {/* Sub Tab Selection Buttons */}
              <div className="mt-6 space-y-1">
                {foodSubTabs.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveSubTab(item)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                      activeSubTab === item 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-600 hover:bg-white/50 hover:text-black'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR: DEMO DASHBOARD PREVIEW */}
            <div className="relative lg:col-span-7">
              <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-white p-4 shadow-xl sm:h-96">
                
                {/* Mockup UI Interface inside card */}
                <div className="h-full w-full rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">Qtable POS System</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="text-xs text-gray-400">Bàn 01 - Tầng 1</div>
                      <div className="mt-1 text-sm font-bold text-gray-800">2x Cà phê sữa đá</div>
                      <div className="mt-2 text-xs font-semibold text-[#84cc16]">Đang chế biến</div>
                    </div>
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="text-xs text-gray-400">Bàn 04 - Sân thượng</div>
                      <div className="mt-1 text-sm font-bold text-gray-800">1x Trà đào cam sả</div>
                      <div className="mt-2 text-xs font-semibold text-blue-500">Đã phục vụ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}