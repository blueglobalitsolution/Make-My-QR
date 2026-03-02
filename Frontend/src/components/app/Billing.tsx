import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';

interface BillingProps { }

export const Billing: React.FC<BillingProps> = () => {
  return (
    <div className="p-12 max-w-6xl mx-auto w-full space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Flexible <span className="text-[#156295]">Plans</span> & Pricing</h1>
        <p className="max-w-xl mx-auto text-slate-400 font-medium">Choose a professional plan that scales with your growth. All plans include unlimited dynamic QR codes and scans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {/* Monthly Plan */}
        <div className="skeu-card p-10 flex flex-col group hover:scale-[1.02] transition-all duration-300">
          <div className="text-center space-y-4 mb-10">
            <h3 className="text-lg font-bold text-slate-400 tracking-widest uppercase">Monthly</h3>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-[#0F172A]">₹1,799</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">per month</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold border border-slate-100 rounded-full py-1.5 uppercase tracking-widest">No long-term commitment</p>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            {['Unlimited Dynamic Codes', 'All QR Type Access', 'Unlimited Scans', 'Premium Formatting', 'Cancel Anytime'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#156295]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-4 bg-white border-2 border-slate-100 hover:border-[#156295] text-slate-800 hover:text-[#156295] text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm">
            Get Started
          </button>
        </div>

        {/* Annual Plan - Popular */}
        <div className="skeu-card p-10 flex flex-col border-2 border-[#156295] scale-105 relative z-10 bg-white group hover:scale-[1.07] transition-all duration-300 shadow-2xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#156295] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-current" /> Best Value
          </div>

          <div className="text-center space-y-4 mb-10 pt-2">
            <h3 className="text-lg font-bold text-[#156295] tracking-widest uppercase">Annually</h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-[#0F172A]">₹699</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">per month, billed yearly</span>
            </div>
            <div className="bg-amber-400/10 text-amber-600 rounded-full py-2 px-4 flex items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Save 60% with Annual Billing</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            {['Everything in Monthly', 'Full Analytics Dashboard', 'API Access Access', 'Priority Direct Support', 'Dedicated Account Manager'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <div className="w-5 h-5 rounded-full bg-[#156295] flex items-center justify-center text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-5 bg-[#156295] hover:bg-[#0E4677] text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5">
            Upgrade My Account
          </button>
        </div>

        {/* Quarterly Plan */}
        <div className="skeu-card p-10 flex flex-col group hover:scale-[1.02] transition-all duration-300">
          <div className="text-center space-y-4 mb-10">
            <h3 className="text-lg font-bold text-slate-400 tracking-widest uppercase">Quarterly</h3>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-[#0F172A]">₹999</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">per month</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold border border-slate-100 rounded-full py-1.5 uppercase tracking-widest">Save 45% vs Monthly</p>
          </div>

          <div className="flex-1 space-y-4 mb-10">
            {['Unlimited Dynamic Codes', 'Quarterly Billing Cycle', 'Analytics Access', 'Team Management', 'Email Support'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#156295]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-4 bg-white border-2 border-slate-100 hover:border-[#156295] text-slate-800 hover:text-[#156295] text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm">
            Choose Quarterly
          </button>
        </div>
      </div>
    </div>
  );
};
