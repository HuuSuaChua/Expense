"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code2,
  Server,
  Database,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
  Send,
  Terminal,
  Menu,
  X,
  Award,
  Flame,
  CheckCircle,
  Globe,
} from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TypewriterEffect({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1600);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 font-mono font-bold">
      {words[index]?.substring(0, subIndex)}
      <span className="w-0.5 h-5 bg-indigo-400 ml-1 animate-pulse" />
    </span>
  );
}

// Từ điển đa ngôn ngữ (VI - EN)
const translations = {
  vi: {
    nav: {
      about: "Giới thiệu",
      skills: "Kỹ năng",
      experience: "Kinh nghiệm",
      projects: "Dự án",
      contact: "Liên hệ",
    },
    hero: {
      badge: "SẴN SÀNG CHO VỊ TRÍ MỚI",
      greeting: "Xin chào, tôi là",
      expertise: "Chuyên môn:",
      titles: ["Full-Stack Developer", "Next.js & React Specialist", "Laravel & Spring Boot Engineer"],
      bio: "Tôi định hướng phát triển sự nghiệp trong lĩnh vực Web Development, tập trung xây dựng các ứng dụng web có giao diện thân thiện, hiệu năng cao và khả năng mở rộng. Tôi mong muốn vận dụng thế mạnh về Frontend, Backend và Database vào các dự án thực tế, đồng thời không ngừng cập nhật công nghệ mới.",
      contactBtn: "Liên hệ hợp tác",
      projectsBtn: "Khám phá dự án",
      degree: "Công nghệ Thông tin (2022 - 2026)",
    },
    stats: [
      { label: "Dự án thực chiến", value: "7+" },
      { label: "GPA Tích lũy", value: "3.0 / 4.0" },
      { label: "Kinh nghiệm thực tế", value: "Freelance & Corp" },
    ],
    skills: {
      title: "Kỹ Năng Công Nghệ",
      desc: "Nền tảng kỹ thuật và các công cụ hiện đại tôi áp dụng vào xây dựng sản phẩm chất lượng cao",
    },
    experience: {
      title: "Kinh Nghiệm & Học Vấn",
      desc: "Quá trình rèn luyện, trau dồi kiến thức và cống hiến cho các dự án",
      workTitle: "Kinh Nghiệm Làm Việc",
      eduTitle: "Học Vấn & Hoạt Động",
      schoolName: "Trường Cao Đẳng Công Thương TP. Hồ Chí Minh",
      major: "Chuyên ngành: Công nghệ Thông tin",
      gpa: "Điểm trung bình tích lũy (GPA): 3.0 / 4.0",
      activityRole: "Thành viên Ban Kỹ Thuật (Dev Member)",
      activityDesc: "Đội ngũ sáng tạo giải pháp số, chuyên xây dựng và tối ưu giao diện, hệ thống web & mobile cho doanh nghiệp.",
    },
    projects: {
      title: "Dự Án Tiêu Biểu",
      desc: "Các sản phẩm thực tế đã triển khai và mã nguồn mở",
      all: "Tất cả",
      demo: "Xem Demo",
      source: "Mã nguồn",
    },
    contact: {
      heading: "Bạn Đang Tìm Kiếm Full-Stack Developer?",
      desc: "Tôi luôn sẵn sàng trao đổi về các dự án công nghệ, giải pháp web hoặc cơ hội nghề nghiệp mới.",
    },
    footer: "Xây dựng bằng Next.js, Tailwind CSS & Framer Motion.",
  },
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      badge: "OPEN TO NEW OPPORTUNITIES",
      greeting: "Hello, I am",
      expertise: "Expertise:",
      titles: ["Full-Stack Developer", "Next.js & React Specialist", "Laravel & Spring Boot Engineer"],
      bio: "I am oriented towards pursuing a career in Web Development, focusing on building user-friendly, high-performance, and scalable web applications. I look forward to applying my strengths in Frontend, Backend, and Databases to real-world projects while continuously adopting modern technologies.",
      contactBtn: "Get In Touch",
      projectsBtn: "Explore Projects",
      degree: "Information Technology (2022 - 2026)",
    },
    stats: [
      { label: "Hands-on Projects", value: "7+" },
      { label: "Cumulative GPA", value: "3.0 / 4.0" },
      { label: "Practical Experience", value: "Freelance & Corp" },
    ],
    skills: {
      title: "Technical Skills",
      desc: "Modern tech stack and toolkits I use to deliver robust and high-quality digital products",
    },
    experience: {
      title: "Experience & Education",
      desc: "My learning path, practical development journey, and project milestones",
      workTitle: "Work Experience",
      eduTitle: "Education & Activities",
      schoolName: "Ho Chi Minh City Industry and Trade College (HITC)",
      major: "Major: Information Technology",
      gpa: "Grade Point Average (GPA): 3.0 / 4.0",
      activityRole: "Core Technical Member (Dev Member)",
      activityDesc: "A creative digital solutions team focused on crafting and optimizing performant web and mobile applications.",
    },
    projects: {
      title: "Featured Projects",
      desc: "Production-ready platforms and open-source software I have built",
      all: "All",
      demo: "Live Demo",
      source: "Source Code",
    },
    contact: {
      heading: "Looking for a Full-Stack Developer?",
      desc: "I am always open to discussing tech projects, software solutions, or exciting full-time opportunities.",
    },
    footer: "Built with Next.js, Tailwind CSS & Framer Motion.",
  },
};

export default function PortfolioPage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [filter, setFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[lang];

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const personalInfo = {
    name: "Trương Học Hữu",
    phone: "0937492470",
    email: "huu17082004@gmail.com",
    address: lang === "vi" ? "TP. Thủ Đức, TP. Hồ Chí Minh" : "Thu Duc City, Ho Chi Minh City",
    github: "https://github.com/TruongHocHuu78",
  };

  const skillGroups = [
    {
      category: "Frontend Development",
      icon: <Code2 className="w-5 h-5 text-indigo-400" />,
      skills: ["Next.js", "ReactJS", "TypeScript", "Tailwind CSS", "JavaScript (ES6+)", "Ant Design", "Bootstrap", "Responsive UI/UX"],
    },
    {
      category: "Backend Development",
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      skills: ["Laravel (PHP)", "Spring Boot (Java)", "RESTful APIs", "WebSocket", "Sanctum Auth", "Role-based Access Control"],
    },
    {
      category: "Database & Cloud / Tools",
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      skills: ["MySQL", "PostgreSQL", "SQL Server", "Supabase", "Git/GitHub/GitLab", "Postman", "Vercel / Cloud Deploy"],
    },
  ];

  const experiences = [
    {
      period: "03/2026 - 07/2026",
      role: "Developer",
      company: "Thiên Hà Group",
      description:
        lang === "vi"
          ? [
              "Phát triển trang web cộng tác viên để kết nối môi giới tới hệ thống bất động sản.",
              "Xây dựng giao diện responsive hiện đại bằng Next.js và Tailwind CSS.",
              "Triển khai RESTful APIs, hệ thống xác thực và phân quyền tài khoản đa vai trò.",
            ]
          : [
              "Developed collaborator portal connecting real estate brokers to property systems.",
              "Built a sleek, responsive user interface using Next.js and Tailwind CSS.",
              "Implemented RESTful APIs, authentication, and role-based access control.",
            ],
    },
    {
      period: "11/2020 - 2025",
      role: "Freelance Full-stack Developer",
      company: "VHC Dev Stack Team Member",
      description:
        lang === "vi"
          ? [
              "Phát triển và bàn giao nhiều dự án thực tế cho khách hàng sử dụng Laravel và Spring Boot cho backend.",
              "Xây dựng UI responsive mượt mà với ReactJS và Tailwind CSS.",
              "Tích hợp cơ sở dữ liệu MySQL, PostgreSQL, tối ưu hóa truy vấn và đảm bảo toàn vẹn dữ liệu.",
              "Trực tiếp trao đổi yêu cầu với khách hàng và kiểm thử API toàn diện bằng Postman.",
            ]
          : [
              "Developed and deployed production apps for clients with Laravel & Spring Boot backends.",
              "Built fluid, responsive frontend components using ReactJS and Tailwind CSS.",
              "Integrated MySQL/PostgreSQL databases, optimized SQL queries, and ensured data integrity.",
              "Communicated directly with clients for requirements gathering and API testing with Postman.",
            ],
    },
  ];

  const projects = [
    {
      title: "TRIRUTO Hair Care Platform",
      category: "fullstack",
      timeline: "04/2025 - 08/2025",
      tech: ["Laravel", "ReactJS", "Vite", "MySQL", "Ant Design", "Tailwind CSS", "VNPAY", "Zalo OA", "GHN API", "Preny AI Chatbot"],
      description:
        lang === "vi"
          ? "Nền tảng số toàn diện cho chuỗi Triruto Hair Care: Đặt lịch online, quản lý nhân viên/khách hàng, theo dõi đơn hàng, tích hợp thanh toán VNPAY, chatbot AI và cloud deployment."
          : "Comprehensive digital platform for Triruto Hair Care: Online appointments, customer/staff management, VNPAY payment gateway, AI chatbot, and cloud hosting.",
      link: "https://triruto.com",
      github: "",
    },
    {
      title: "Order-In-Table (QR Ordering)",
      category: "nextjs",
      timeline: "10/08/2026 - 17/08/2026",
      tech: ["Next.js", "Tailwind CSS", "Supabase"],
      description:
        lang === "vi"
          ? "Ứng dụng quét mã QR tại bàn để chọn món và gọi món trực tiếp. Phía Admin quản lý bàn, danh mục, thực đơn và nhận thông báo đặt món realtime."
          : "QR code dining order system allowing customers to scan and place orders directly. Admin dashboard for table management, menus, and realtime order alerts.",
      link: "https://order-in-table.vercel.app",
      github: "",
    },
    {
      title: "RealTime Chat Platform",
      category: "fullstack",
      timeline: "02/11/2025 - 14/11/2025",
      tech: ["Laravel", "Tailwind CSS", "WebSocket", "MySQL"],
      description:
        lang === "vi"
          ? "Ứng dụng chat trực tuyến realtime: Đăng nhập/đăng ký, kết bạn, nhắn tin tức thời theo thời gian thực và quản lý hồ sơ cá nhân."
          : "Real-time communication app featuring authentication, friend requests, instantaneous messaging via WebSocket, and user profile customizations.",
      link: "",
      github: "https://github.com/TruongHocHuu78/Chat_Laravel.git",
    },
    {
      title: "AI-Camera Fall & Safety Detection",
      category: "ai",
      timeline: "18/08/2026 - 20/08/2026",
      tech: ["Next.js", "React", "Tailwind CSS", "AI Vision"],
      description:
        lang === "vi"
          ? "Dashboard thông minh kết nối camera giám sát và camera máy tính, tự động nhận diện và cảnh báo người ngã, bổ sung thông tin định danh."
          : "Smart dashboard linking surveillance & PC cameras to automatically detect human falls, alert emergencies, and log identification info.",
      link: "",
      github: "https://github.com/HuuSuaChua/ai-camera.git",
    },
    {
      title: "Collaboration_CTV (Real Estate)",
      category: "fullstack",
      timeline: "04/03/2026 - 14/04/2026",
      tech: ["Next.js", "Tailwind CSS", "RESTful API", "Payment Gateway"],
      description:
        lang === "vi"
          ? "Hệ thống phân phối BĐS dành cho CTV: Xác thực email, Admin quản lý giỏ hàng BĐS, khách hàng mua gói hội viên để mở khóa thông tin sản phẩm."
          : "Real estate collaborator portal with email verification, property inventory CRUD, and subscription tiers to unlock premium listings.",
      link: "",
      github: "https://github.com/TruongHocHuu78/BDS_Project.git",
    },
    {
      title: "Hand Gesture Galaxy Controller",
      category: "ai",
      timeline: "2026",
      tech: ["Next.js", "Three.js / Canvas", "Camera AI Motion"],
      description:
        lang === "vi"
          ? "Giao diện tương tác 3D vũ trụ (Galaxy) điều khiển trực tiếp bằng nhận diện chuyển động cơ tay thông qua webcam."
          : "Interactive 3D galaxy visualization dynamically controlled by real-time hand gesture tracking using camera motion recognition.",
      link: "https://expense-one-ruddy.vercel.app/noel",
      github: "",
    },
    {
      title: "Food Ordering Web Application",
      category: "fullstack",
      timeline: "04/2025 - 07/2025",
      tech: ["Spring Boot", "Tailwind CSS", "Google OAuth", "MySQL"],
      description:
        lang === "vi"
          ? "Website đặt món ăn trực tuyến: Đăng nhập Google, tìm kiếm, thanh toán online và trang quản trị doanh thu, sản phẩm chi tiết."
          : "Online food ordering website with Google OAuth, live food search, digital payments, and comprehensive admin revenue management.",
      link: "",
      github: "https://github.com/TruongHocHuu78/orderfood",
    },
  ];

  const navItems = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => (filter === "nextjs" ? p.tech.includes("Next.js") : p.category === filter));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Futuristic Background Animation Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -50, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-emerald-600/20 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.18, 0.08],
            y: [0, 50, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-sky-600/20 rounded-full blur-[150px]"
        />
      </div>

      {/* Header Fixed Nav */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-xl shadow-black/30"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="#" className="font-extrabold text-xl tracking-tight flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400"
            >
              <Terminal className="w-4 h-4" />
            </motion.div>
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              THH.Dev
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-300">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative py-1 hover:text-indigo-300 transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setLang("vi")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === "vi"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>VIE</span>
              </button>
              <button
                onClick={() => setLang("en")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === "en"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>ENG</span>
              </button>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-full border border-slate-700 text-xs font-semibold tracking-wide transition shadow-sm"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GITHUB</span>
            </motion.a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pt-4 pb-3 border-t border-slate-800 mt-3 space-y-2 overflow-hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-white text-sm font-medium transition"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-400 font-medium"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 sm:pt-28">
        {/* Hero Section */}
        <section id="about" className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:w-3/5 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "5s" }} />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {t.hero.greeting} <br />
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h1>

              <div className="text-lg sm:text-2xl font-medium text-slate-300 flex flex-wrap items-center justify-center lg:justify-start gap-2 min-h-[36px]">
                <span>{t.hero.expertise}</span>
                <TypewriterEffect words={t.hero.titles} />
              </div>

              <p className="text-slate-400 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto lg:mx-0">
                {t.hero.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:opacity-90 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 text-sm transition"
                >
                  <span>{t.hero.contactBtn}</span>
                  <Send className="w-4 h-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#projects"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>{t.hero.projectsBtn}</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{personalInfo.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              </div>
            </motion.div>

            {/* Avatar Profile Card with 3D Ring Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative lg:w-2/5 flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2.5 rounded-[32px] bg-gradient-to-r from-indigo-500 via-emerald-500 to-sky-500 opacity-30 blur-lg"
                />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-1 bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 shadow-2xl relative group overflow-hidden"
                >
                  <div className="w-full h-full bg-slate-900 rounded-[22px] overflow-hidden relative">
                    <Image
                      src="/avatar.jpg"
                      alt={personalInfo.name}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex flex-col justify-end p-5">
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded">
                          GPA: 3.0 / 4.0
                        </span>
                        <h3 className="font-bold text-white text-base sm:text-lg">{personalInfo.name}</h3>
                        <p className="text-xs text-slate-300">{t.hero.degree}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-16">
            {t.stats.map((stat, idx) => {
              const icons = [
                <Flame key="0" className="w-5 h-5 text-amber-400" />,
                <Award key="1" className="w-5 h-5 text-emerald-400" />,
                <CheckCircle key="2" className="w-5 h-5 text-indigo-400" />,
              ];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4 shadow-lg shadow-black/20"
                >
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70">{icons[idx]}</div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{t.skills.title}</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">{t.skills.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillGroups.map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60">{group.icon}</div>
                  <h3 className="font-bold text-slate-200 text-base">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, sIdx) => (
                    <motion.span
                      key={sIdx}
                      whileHover={{ scale: 1.08 }}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:border-indigo-400 hover:bg-slate-800 transition cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience & Education Section */}
        <section id="experience" className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3 mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{t.experience.title}</h2>
            <p className="text-slate-400 text-sm">{t.experience.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Work Experience */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 text-lg">
                <Briefcase className="w-5 h-5" />
                <span>{t.experience.workTitle}</span>
              </div>
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="relative pl-6 border-l-2 border-slate-800 space-y-2 group"
                >
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-mono text-indigo-400 font-semibold">{exp.period}</span>
                  <h4 className="text-base font-bold text-white">
                    {exp.role} <span className="text-slate-400 font-normal">@ {exp.company}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed list-disc list-inside">
                    {exp.description.map((desc, dIdx) => (
                      <li key={dIdx}>{desc}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Education & Activities */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 text-lg">
                <GraduationCap className="w-5 h-5" />
                <span>{t.experience.eduTitle}</span>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-6 border-l-2 border-slate-800 space-y-2 group"
              >
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-emerald-500 group-hover:scale-125 transition-transform" />
                <span className="text-xs font-mono text-emerald-400 font-semibold">2022 - 2026</span>
                <h4 className="text-base font-bold text-white">{t.experience.schoolName}</h4>
                <p className="text-xs text-slate-300 font-medium">{t.experience.major}</p>
                <p className="text-xs text-slate-400">{t.experience.gpa}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative pl-6 border-l-2 border-slate-800 space-y-2 group"
              >
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-500 group-hover:scale-125 transition-transform" />
                <span className="text-xs font-mono text-cyan-400 font-semibold">09/2025 - Present</span>
                <h4 className="text-base font-bold text-white">{t.experience.activityRole}</h4>
                <p className="text-xs text-slate-300 font-medium">VHC DevStack</p>
                <p className="text-xs text-slate-400 leading-relaxed">{t.experience.activityDesc}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{t.projects.title}</h2>
              <p className="text-slate-400 text-sm mt-1">{t.projects.desc}</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              {["all", "nextjs", "fullstack", "ai"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`relative px-3.5 py-1.5 rounded-lg font-medium transition ${
                    filter === item ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {filter === item && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {item === "all" ? t.projects.all : item === "nextjs" ? "Next.js" : item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((proj) => (
                <motion.div
                  layout
                  key={proj.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/40 transition duration-300 group shadow-lg shadow-black/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono">{proj.timeline}</span>
                      <Layers className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tech.map((tItem, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {tItem}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6 mt-4 border-t border-slate-800/60">
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t.projects.demo}</span>
                      </a>
                    )}
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>{t.projects.source}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Contact CTA Section */}
        <section id="contact" className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{t.contact.heading}</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">{t.contact.desc}</p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${personalInfo.email}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-600/30 transition"
              >
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${personalInfo.phone}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center justify-center gap-2 text-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500 px-4">
        <p>© {new Date().getFullYear()} {personalInfo.name}. {t.footer}</p>
      </footer>
    </div>
  );
}