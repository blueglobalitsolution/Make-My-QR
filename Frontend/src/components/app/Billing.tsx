import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';

interface BillingProps {}

export const Billing: React.FC<BillingProps> = () => {
  return (
    <div className="p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-black skeu-text-primary tracking-tight">Plans <span className="skeu-text-accent">&</span> Pricing</h1>
        <p className="mt-2 text-sm skeu-text-secondary font-medium">Select the most convenient plan for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 hover:shadow-lg transition-shadow">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-[#4A9FF5]">Monthly</h3>
            <div className="text-3xl font-black skeu-text-primary">₹ 1,799 <span className="text-base font-medium text-slate-400">/mo</span></div>
            <p className="text-xs text-slate-400 italic">Invoiced every month</p>
          </div>
          <button className="w-full py-3 bg-[#4A9FF5] hover:bg-[#3B8FE5] text-white text-sm font-bold rounded-full shadow-md transition-all">Buy Now</button>
          <div className="space-y-3 pt-2">
            {['Create unlimited dynamic QR codes', 'Access a variety of QR types', 'Unlimited modifications of QR codes', 'Unlimited scans', 'Multiple QR code download formats', 'Unlimited users', 'Premium customer support', 'Cancel at anytime'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-[#4A9FF5] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-white rounded-2xl border-2 border-[#4A9FF5] p-8 space-y-6 shadow-xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4A9FF5] text-white text-xs font-bold px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Star className="w-3.5 h-3.5" /> Most Popular
          </div>
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-white transform rotate-12">60%</div>
          <div className="text-center space-y-3 pt-2">
            <h3 className="text-xl font-bold text-[#4A9FF5]">Annually</h3>
            <div className="text-3xl font-black skeu-text-primary">₹ 699 <span className="text-base font-medium text-slate-400">/mo</span></div>
            <p className="text-xs text-slate-400 italic">Invoiced every year</p>
          </div>
          <button className="w-full py-3 bg-[#4A9FF5] hover:bg-[#3B8FE5] text-white text-sm font-bold rounded-full shadow-md transition-all">Buy Now</button>
          <div className="space-y-3 pt-2">
            {['Create unlimited dynamic QR codes', 'Access a variety of QR types', 'Unlimited modifications of QR codes', 'Unlimited scans', 'Multiple QR code download formats', 'Unlimited users', 'Premium customer support', 'Cancel at anytime'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-[#4A9FF5] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 hover:shadow-lg transition-shadow">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-[#4A9FF5]">Quarterly</h3>
            <div className="text-3xl font-black skeu-text-primary">₹ 999 <span className="text-base font-medium text-slate-400">/mo</span></div>
            <p className="text-xs text-slate-400 italic">Invoiced each quarter</p>
          </div>
          <button className="w-full py-3 bg-[#4A9FF5] hover:bg-[#3B8FE5] text-white text-sm font-bold rounded-full shadow-md transition-all">Buy Now</button>
          <div className="space-y-3 pt-2">
            {['Create unlimited dynamic QR codes', 'Access a variety of QR types', 'Unlimited modifications of QR codes', 'Unlimited scans', 'Multiple QR code download formats', 'Unlimited users', 'Premium customer support', 'Cancel at anytime'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-[#4A9FF5] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
