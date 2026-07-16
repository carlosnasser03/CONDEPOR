'use client';

export const BrandingFooter = () => {
  return (
    <div className="fixed bottom-4 right-4 z-[999] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-amber-500/50 transition-colors group">
      <span className="text-slate-400 text-xs font-semibold group-hover:text-slate-300">Powered by</span>
      <a
        href="https://bitnova-labs.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-black text-amber-400 hover:text-amber-300 text-xs transition-colors tracking-widest"
      >
        BITNOVA-LABS
      </a>
    </div>
  );
};
