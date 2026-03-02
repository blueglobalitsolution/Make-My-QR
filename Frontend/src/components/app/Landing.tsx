import React from 'react';
import { Barcode } from 'lucide-react';

interface LandingProps {
  setView: (view: any) => void;
}

export const Landing: React.FC<LandingProps> = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-[100] flex items-center justify-between px-10 py-5 backdrop-blur-xl bg-white/70 border-b border-slate-100/50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="bg-[#156295] p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Barcode className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">
            QR <span className="text-[#156295]">code.io</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('auth')}
            className="px-8 py-2.5 rounded-xl text-sm font-bold text-[#156295] border-2 border-[#156295]/10 hover:border-[#156295] transition-all"
          >
            Login
          </button>
          <button
            onClick={() => setView('register')}
            className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-[#156295] hover:bg-[#0E4677] shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Get Started
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        {/* Subtle background decorative elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mb-12 animate-in zoom-in-50 duration-700">
          <div className="bg-[#156295] p-8 rounded-[3rem] shadow-2xl shadow-blue-500/30 transform -rotate-6 relative z-10">
            <Barcode className="text-white w-20 h-20" />
          </div>
          <div className="absolute inset-0 bg-blue-500/20 rounded-[3rem] blur-2xl transform rotate-3" />
        </div>

        <h1 className="text-7xl md:text-8xl font-black text-[#0F172A] tracking-tighter mb-10 leading-[0.9] max-w-4xl">
          The Next Generation <br />
          <span className="text-[#156295]">of Dynamic QR</span> <br />
          Experience
        </h1>

        <p className="max-w-2xl text-slate-400 text-lg font-medium mb-12">
          Create, manage and track professional-grade QR codes with our premium studio.
          Built for teams who value high-quality design and security.
        </p>

        <button
          onClick={() => setView('auth')}
          className="px-16 py-6 bg-[#156295] text-white rounded-[2.5rem] text-2xl font-black tracking-tight hover:bg-[#0E4677] shadow-2xl shadow-blue-500/40 transition-all transform hover:scale-105 active:scale-95"
        >
          Launch Studio
        </button>

        <div className="mt-20 flex items-center gap-12 grayscale opacity-40">
          {/* Mock logos for "Trusted by" section */}
          <div className="font-black text-2xl">LOGOTYPE</div>
          <div className="font-black text-2xl">CREATIVE</div>
          <div className="font-black text-2xl">STUDIO.CO</div>
          <div className="font-black text-2xl">AGENCY</div>
        </div>
      </div>
    </div>
  );
};
