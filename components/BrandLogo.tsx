function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />
          <span className="font-black text-xs tracking-wider bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent font-mono">
            THH
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-base tracking-tight text-white leading-none group-hover:text-indigo-300 transition-colors">
          HỌC HỮU
        </span>
        <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase mt-0.5">
          Dev.Portfolio
        </span>
      </div>
    </div>
  );
}