import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <span className="text-2xl font-black text-white">
              KORMO<span className="text-brand-teal">LAB</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Better Tools • Smarter Work • Bigger Dreams.
              Professional business tools, Excel automation, and productivity assets.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Direct Support</h4>
            <p className="text-sm text-slate-400">Official WhatsApp Hotline:</p>
            <a href="https://wa.me/8801717488371" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-teal-400 hover:underline">
              01717488371
            </a>
            <p className="text-xs text-slate-500 mt-2">Available 24/7 for instant order assistance.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">System Identity</h4>
            <p className="text-xs text-slate-500">SuperAdmin Email: kormolab.admin@gmail.com</p>
            <p className="text-xs text-slate-500 mt-1">Platform: Edge Powered by Cloudflare & Supabase</p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 flex items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KormoLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
