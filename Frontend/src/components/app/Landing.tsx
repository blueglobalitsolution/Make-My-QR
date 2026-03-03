import React from 'react';
import { Barcode } from 'lucide-react';

interface LandingProps {
  setView: (view: any) => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-[100] flex items-center justify-between px-8 py-3 backdrop-blur-xl bg-white/70 border-b border-slate-100/50">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('landing')}>
          <img src="/src/assets/logo-full.png" alt="MakeMyQR Logo" className="h-8 group-hover:scale-105 transition-transform" />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('auth')}
            className="px-6 py-2 rounded-xl text-sm font-bold text-[#156295] border-2 border-[#156295]/10 hover:border-[#156295] transition-all"
          >
            Login
          </button>
          <button
            onClick={() => setView('register')}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-[#156295] hover:bg-[#0E4677] shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Get Started
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Subtle background decorative elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mb-8 animate-in zoom-in-50 duration-700">
          <div className="transform -rotate-6 relative z-10 transition-transform hover:rotate-0 duration-500">
            <img src="/src/assets/logo-icon.png" alt="MakeMyQR Icon" className="w-24 h-24 object-contain drop-shadow-2xl" />
          </div>
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl transform scale-150" />
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tighter mb-5 leading-[0.9] max-w-3xl">
          The Next Generation <br />
          <span className="text-[#156295]">of Dynamic QR</span> <br />
          Experience
        </h1>

        <p className="max-w-xl text-slate-400 text-base font-medium mb-8">
          Create, manage and track professional-grade QR codes with our premium studio.
          Built for teams who value high-quality design and security.
        </p>

        <button
          onClick={() => setView('auth')}
          className="px-12 py-4 bg-[#156295] text-white rounded-[2rem] text-xl font-black tracking-tight hover:bg-[#0E4677] shadow-2xl shadow-blue-500/40 transition-all transform hover:scale-105 active:scale-95"
        >
          Launch Studio
        </button>
      </div>
    </div>
  );
};
