import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';

type BillingCycle = '3' | '6' | '12';

const pricingData = {
  '3': {
    starter: { price: '1,999', features: ['10 Dynamic Codes', 'Standard Analytics', 'Email Support'] },
    pro: { price: '1,299', billing: 'Per Month, Billed Quarterly', discount: 'Standard Rate', features: ['Everything in Starter', 'Unlimited Scans', 'Premium Formatting', 'Direct Support'] },
    enterprise: { price: '2,499', features: ['Unlimited Codes', 'Custom API Access', 'Team Management', 'Priority Support'] }
  },
  '6': {
    starter: { price: '1,799', features: ['15 Dynamic Codes', 'Standard Analytics', 'Email Support', 'Cancel Anytime'] },
    pro: { price: '999', billing: 'Per Month, Billed Bi-Annually', discount: 'Save 20% vs 3 Months', features: ['Everything in Starter', 'Full Analytics Dashboard', 'Unlimited Scans', 'Premium Formatting', 'Team Management'] },
    enterprise: { price: '1,999', features: ['Unlimited Codes', 'Custom API Access', 'Dedicated Account Manager', 'White Labeling', 'Advanced Analytics'] }
  },
  '12': {
    starter: { price: '1,499', features: ['20 Dynamic Codes', 'Full Analytics', 'Priority Support', 'Cancel Anytime', 'Premium Formatting'] },
    pro: { price: '699', billing: 'Per Month, Billed Yearly', discount: 'Save 60% With Annual Billing', features: ['Everything in Monthly', 'Full Analytics Dashboard', 'API Access', 'Priority Direct Support', 'Dedicated Account Manager', 'Custom Branding'] },
    enterprise: { price: '1,499', features: ['Unlimited Everything', 'SLA Guarantee', 'Dedicated Infrastructure', 'SSO Integration', 'Custom Feature Development', '24/7 Phone Support'] }
  }
};

export const Billing: React.FC<{ setView?: (view: any, data?: any) => void }> = ({ setView }) => {
  const [cycle, setCycle] = useState<BillingCycle>('12');

  const currentData = pricingData[cycle];

  const handleSelectPlan = (planType: 'starter' | 'pro' | 'enterprise') => {
    const planInfo = currentData[planType];
    const durationMonths = parseInt(cycle);

    // Map to database IDs: 1-3 for 3mo, 4-6 for 6mo, 7-9 for 12mo
    const baseId = cycle === '3' ? 1 : cycle === '6' ? 4 : 7;
    const planOffset = planType === 'starter' ? 0 : planType === 'pro' ? 1 : 2;
    const dbId = baseId + planOffset;

    // Remove comma for calculation
    const monthlyPrice = parseInt(planInfo.price.replace(',', ''));
    const totalPrice = monthlyPrice * durationMonths;

    const selectedPlan = {
      id: dbId,
      name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan (${cycle} Months)`,
      price: planInfo.price,
      total: totalPrice.toLocaleString('en-IN'),
      duration: cycle,
      features: planInfo.features
    };

    setView?.('payment', selectedPlan);
  };

  // Helper styles extracted from the user's provided config
  const brandRed = 'text-[#ef4444]';
  const bgBrandRed = 'bg-[#ef4444]';
  const borderBrandRed = 'border-[#ef4444]';
  const brandDark = 'text-[#1e293b]';

  return (
    <div className={`py-10 px-4 font-inter text-[#1e293b] antialiased bg-[#f8fafc] w-full min-h-full flex flex-col justify-center`}>
      {/* MainHeader */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1e293b]">
          Flexible <span className={brandRed}>Plans</span> & Pricing
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-[15px] font-medium leading-snug">
          Choose A Professional Plan That Scales With Your Growth. All Plans Include Unlimited Dynamic QR Codes And Scans.
        </p>
      </header>

      {/* TabSwitcher */}
      <section className="flex justify-center mb-12 px-4 w-full">
        <div className="inline-flex items-center gap-2 bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50">
          <button
            type="button"
            onClick={() => setCycle('3')}
            className={`px-8 py-3.5 text-[15px] font-bold rounded-full transition-all duration-300 outline-none focus:outline-none border-transparent ring-0 whitespace-nowrap  ${cycle === '3' ? `bg-[#ee4342] !text-white shadow-md shadow-red-500/20` : '!text-[#476077] hover:!text-white hover:bg-[#3eb5a9]'}`}
          >
            3 Months
          </button>
          <button
            type="button"
            onClick={() => setCycle('6')}
            className={`px-8 py-3.5 text-[15px] font-bold rounded-full transition-all duration-300 outline-none focus:outline-none border-transparent ring-0 whitespace-nowrap  ${cycle === '6' ? `bg-[#ee4342] !text-white shadow-md shadow-red-500/20` : '!text-[#476077] hover:!text-white hover:bg-[#3eb5a9]'}`}
          >
            6 Months
          </button>
          <button
            type="button"
            onClick={() => setCycle('12')}
            className={`px-8 py-3.5 text-[15px] font-bold rounded-full transition-all duration-300 outline-none focus:outline-none border-transparent ring-0 whitespace-nowrap  ${cycle === '12' ? `bg-[#ee4342] !text-white shadow-md shadow-red-500/20` : '!text-[#476077] hover:!text-white hover:bg-[#3eb5a9]'}`}
          >
            12 Months
          </button>
        </div>
      </section>

      {/* PricingCardsContainer */}
      <main className="max-w-7xl mx-auto px-4 pb-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Starter Plan */}
          <section className={`bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col h-full hover:-translate-y-1.5 transition-transform duration-300`}>
            <div className="text-center mb-6">
              <h3 className="text-slate-500 font-bold uppercase  text-[11px] mb-3">Starter Plan</h3>
              <div className="flex justify-center items-baseline mb-2">
                <span className="text-xl font-bold align-top mt-1">₹</span>
                <span className="text-5xl font-extrabold">{currentData.starter.price}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Per Month</p>
            </div>
            <div className={`bg-red-50 ${brandRed} py-3 rounded-xl text-center text-[10px] font-bold mb-8 border border-red-50`}>
              No Long-Term Commitment
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {currentData.starter.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-red-50 border border-red-100 p-0.5 rounded-full shrink-0">
                    <Check className={`w-3 h-3 ${brandRed}`} strokeWidth={3} />
                  </div>
                  <span className={`text-[13px] font-semibold ${brandDark}`}>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan('starter')}
              className={`w-full py-4 bg-slate-50 border border-slate-200 ${brandDark} text-[13px] font-bold rounded-xl hover:bg-[#3eb5a9] hover:text-white transition-colors`}
            >
              Get Started
            </button>
          </section>

          {/* Pro Plan (Featured) */}
          <section className={`relative bg-white rounded-[2.5rem] p-10 border-2 ${borderBrandRed} shadow-[0_20px_60px_-15px_rgba(239,68,68,0.15)] flex flex-col h-full transform scale-[1.08] z-10 hover:scale-[1.1] transition-transform duration-300`}>
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-max">
              <div className="bg-gradient-to-br from-[#ef4444] to-[#b91c1c] text-white px-5 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-500/30">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] font-extrabold  uppercase">Best Value</span>
              </div>
            </div>
            <div className="text-center mb-6 mt-2">
              <h3 className={`${brandRed} font-bold uppercase  text-[11px] mb-3`}>Pro Plan</h3>
              <div className="flex justify-center items-baseline mb-2">
                <span className="text-xl font-bold align-top mt-1">₹</span>
                <span className="text-6xl font-extrabold">{currentData.pro.price}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{currentData.pro.billing}</p>
            </div>
            <div className={`bg-red-50 ${brandRed} py-3 rounded-xl text-center text-[10px] font-bold mb-8 border border-red-50`}>
              <span>{currentData.pro.discount}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {currentData.pro.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`${bgBrandRed} p-0.5 rounded-full shrink-0 shadow-sm shadow-red-200`}>
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />
                  </div>
                  <span className={`text-[13px] font-semibold ${brandDark}`}>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan('pro')}
              className={`w-full py-4 mt-auto ${bgBrandRed} text-white font-bold rounded-xl text-[13px] hover:bg-[#3eb5a9] transition-colors shadow-lg shadow-red-500/25`}
            >
              Upgrade My Account
            </button>
          </section>

          {/* Enterprise Plan */}
          <section className={`bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col h-full hover:-translate-y-1.5 transition-transform duration-300`}>
            <div className="text-center mb-6">
              <h3 className="text-slate-500 font-bold uppercase  text-[11px] mb-3">Enterprise Plan</h3>
              <div className="flex justify-center items-baseline mb-2">
                <span className="text-xl font-bold align-top mt-1">₹</span>
                <span className="text-5xl font-extrabold">{currentData.enterprise.price}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Per Month</p>
            </div>
            <div className={`bg-red-50 ${brandRed} py-3 rounded-xl text-center text-[10px] font-bold mb-8 border border-red-50`}>
              Custom Enterprise Suite
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {currentData.enterprise.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-red-50 border border-red-100 p-0.5 rounded-full shrink-0">
                    <Check className={`w-3 h-3 ${brandRed}`} strokeWidth={3} />
                  </div>
                  <span className={`text-[13px] font-semibold ${brandDark}`}>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan('enterprise')}
              className={`w-full py-4 bg-slate-50 border border-slate-200 ${brandDark} text-[13px] font-bold rounded-xl hover:bg-[#3eb5a9] hover:text-white transition-colors`}
            >
              Choose Enterprise
            </button>
          </section>

        </div>
      </main>
    </div>
  );
};
