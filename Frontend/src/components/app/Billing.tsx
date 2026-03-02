import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';

interface BillingProps { }

export const Billing: React.FC<BillingProps> = () => {
  return (
    <div className="p-12 max-w-6xl mx-auto w-full space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black skeu-text-primary tracking-tighter">Flexible <span className="skeu-text-accent">Plans</span> & Pricing</h1>
        <p className="max-w-2xl mx-auto skeu-text-muted font-black text-sm uppercase tracking-widest leading-relaxed">Choose a professional plan that scales with your growth. All plans include unlimited dynamic QR codes and scans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {/* Monthly Plan */}
        <div className="skeu-card p-10 flex flex-col group hover:scale-[1.02] transition-all duration-300">
          <div className="text-center space-y-4 mb-10">
            <h3 className="text-sm font-black skeu-text-muted tracking-widest uppercase">Monthly</h3>
            <div className="flex flex-col">
              <span className="text-4xl font-black skeu-text-primary tracking-tight">₹1,799</span>
              <span className="text-[10px] font-black skeu-text-muted uppercase tracking-wider py-1">per month</span>
            </div>
            <div className="skeu-inset rounded-full py-2 px-4 shadow-inner">
              <p className="text-[9px] skeu-text-secondary font-black uppercase tracking-widest">No long-term commitment</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10 px-2">
            {['Unlimited Dynamic Codes', 'All QR Type Access', 'Unlimited Scans', 'Premium Formatting', 'Cancel Anytime'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] font-black skeu-text-primary">
                <div className="w-6 h-6 skeu-inset flex items-center justify-center skeu-text-accent rounded-lg shadow-inner">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-4 skeu-btn-secondary text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
            Get Started
          </button>
        </div>

        {/* Annual Plan - Popular */}
        <div className="skeu-card p-10 flex flex-col scale-105 relative z-10 group hover:scale-[1.07] transition-all duration-300 shadow-2xl border-2 border-black/5">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 skeu-hero-icon text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2 skeu-gloss">
            <Star className="w-3.5 h-3.5 fill-current" /> Best Value
          </div>

          <div className="text-center space-y-4 mb-10 pt-2">
            <h3 className="text-sm font-black skeu-text-accent tracking-widest uppercase">Annually</h3>
            <div className="flex flex-col">
              <span className="text-5xl font-black skeu-text-primary tracking-tight">₹699</span>
              <span className="text-[10px] font-black skeu-text-muted uppercase tracking-wider py-1">per month, billed yearly</span>
            </div>
            <div className="skeu-inset rounded-full py-3 px-6 shadow-inner ring-1 ring-black/5">
              <span className="text-[10px] font-black skeu-text-accent uppercase tracking-widest">Save 60% with Annual Billing</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10 px-2">
            {['Everything in Monthly', 'Full Analytics Dashboard', 'API Access Access', 'Priority Direct Support', 'Dedicated Account Manager'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] font-black skeu-text-primary">
                <div className="w-6 h-6 skeu-hero-icon flex items-center justify-center text-white rounded-lg shadow-md relative skeu-gloss">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-5 skeu-btn text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
            Upgrade My Account
          </button>
        </div>

        {/* Quarterly Plan */}
        <div className="skeu-card p-10 flex flex-col group hover:scale-[1.02] transition-all duration-300">
          <div className="text-center space-y-4 mb-10">
            <h3 className="text-sm font-black skeu-text-muted tracking-widest uppercase">Quarterly</h3>
            <div className="flex flex-col">
              <span className="text-4xl font-black skeu-text-primary tracking-tight">₹999</span>
              <span className="text-[10px] font-black skeu-text-muted uppercase tracking-wider py-1">per month</span>
            </div>
            <div className="skeu-inset rounded-full py-2 px-4 shadow-inner">
              <p className="text-[9px] skeu-text-secondary font-black uppercase tracking-widest">Save 45% vs Monthly</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 mb-10 px-2">
            {['Unlimited Dynamic Codes', 'Quarterly Billing Cycle', 'Analytics Access', 'Team Management', 'Email Support'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] font-black skeu-text-primary">
                <div className="w-6 h-6 skeu-inset flex items-center justify-center skeu-text-accent rounded-lg shadow-inner">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-4 skeu-btn-secondary text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
            Choose Quarterly
          </button>
        </div>
      </div>
    </div>
  );
};
