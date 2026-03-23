import React, { useState, useEffect } from 'react';
import { Check, Star, Loader2 } from 'lucide-react';
import { getPlans } from '../../api/payments';

export const Billing: React.FC<{ setView?: (view: any, data?: any) => void }> = ({ setView }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [cycle, setCycle] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
      if (data.length > 0) {
        // Set initial cycle to the first available duration
        const durations = [...new Set(data.map((p: any) => p.duration_months))].sort((a: any, b: any) => Number(a) - Number(b));
        if (durations.length > 0) setCycle(durations[0]);
      }
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: any) => {
    // The price in the database is the total price for the duration
    const totalPrice = Number(plan.price);
    const selectedPlan = {
      ...plan,
      total: totalPrice.toLocaleString('en-IN'),
    };
    setView?.('payment', selectedPlan);
  };

  // Filter plans for the current cycle
  const currentPlans = plans.filter(p => p.duration_months === cycle);
  const availableCycles = [...new Set(plans.map(p => p.duration_months))].sort((a: any, b: any) => Number(a) - Number(b));

  const brandRed = 'text-[#ef4444]';
  const bgBrandRed = 'bg-[#ef4444]';
  const borderBrandRed = 'border-[#ef4444]';
  const brandDark = 'text-[#1e293b]';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`py-10 px-4 font-inter text-[#1e293b] antialiased bg-[#f0f0f0] w-full min-h-full flex flex-col justify-center`}>
      <header className="text-center mb-10 space-y-1">
        <h1 className="skeu-page-title">
          Flexible <span className={brandRed}>Plans</span> & Pricing
        </h1>
        <p className="skeu-page-subtitle max-w-2xl mx-auto">
          Choose A Professional Plan That Scales With Your Growth.
        </p>
      </header>

      {availableCycles.length > 1 && (
        <section className="flex justify-center mb-12 px-4 w-full">
          <div className="inline-flex items-center gap-2 bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50">
            {availableCycles.map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setCycle(dur)}
                className={`px-8 py-3.5 text-[15px] font-bold rounded-full transition-all duration-300 outline-none focus:outline-none border-transparent ring-0 whitespace-nowrap  ${cycle === dur ? `bg-[#ee4342] !text-white shadow-md shadow-red-500/20` : '!text-[#476077] hover:!text-white hover:bg-[#3eb5a9]'}`}
              >
                {dur} {dur === 1 ? 'Month' : 'Months'}
              </button>
            ))}
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 pb-10 w-full">
        <div className={`grid grid-cols-1 ${currentPlans.length === 2 ? 'md:grid-cols-2' : currentPlans.length >= 3 ? 'md:grid-cols-3' : ''} gap-8 items-center justify-center`}>
          {currentPlans.map((plan, index) => {
            const isFeatured = index === 1 || currentPlans.length === 1;
            return (
              <section 
                key={plan.id}
                className={`relative bg-white rounded-[2.5rem] p-8 border ${isFeatured ? `${borderBrandRed} border-2 shadow-[0_20px_60px_-15px_rgba(239,68,68,0.15)] scale-[1.05] z-10` : 'border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]'} flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-max">
                    <div className="bg-gradient-to-br from-[#ef4444] to-[#b91c1c] text-white px-5 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-500/30">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] font-extrabold uppercase">Most Popular</span>
                    </div>
                  </div>
                )}
                <div className="text-center mb-6 mt-2">
                  <h3 className={`${isFeatured ? brandRed : 'text-slate-500'} font-bold uppercase text-[11px] mb-3`}>{plan.name}</h3>
                  <div className="flex justify-center items-baseline mb-2">
                    <span className="text-xl font-bold align-top mt-1">₹</span>
                    <span className={`${isFeatured ? 'text-6xl' : 'text-5xl'} font-extrabold`}>{parseFloat(plan.price).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {plan.duration_months === 1 ? 'Per Month' : plan.duration_months === 12 ? 'Per Year' : `For ${plan.duration_months} Months`}
                  </p>
                </div>

                <div className={`bg-red-50 ${brandRed} py-3 rounded-xl text-center text-[14px] font-bold mb-8 border border-red-50`}>
                  {plan.duration_months === 12 ? 'Save with Annual Billing' : 'Flexible Subscription'}
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3">
                    <div className="bg-[#3eb5a9] p-0.5 rounded-full shrink-0 shadow-sm shadow-teal-500/10">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className={`text-[13px] font-semibold ${brandDark}`}>Up to {plan.qr_limit} QR Codes</span>
                  </li>
                  {plan.can_create_dynamic && (
                    <li className="flex items-center gap-3">
                      <div className="bg-[#3eb5a9] p-0.5 rounded-full shrink-0 shadow-sm shadow-teal-500/10">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] font-semibold ${brandDark}`}>Dynamic QR Codes</span>
                    </li>
                  )}
                  {plan.can_create_pdf && (
                    <li className="flex items-center gap-3">
                      <div className="bg-[#3eb5a9] p-0.5 rounded-full shrink-0 shadow-sm shadow-teal-500/10">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] font-semibold ${brandDark}`}>PDF QR Codes</span>
                    </li>
                  )}
                  {plan.can_create_business && (
                    <li className="flex items-center gap-3">
                      <div className="bg-[#3eb5a9] p-0.5 rounded-full shrink-0 shadow-sm shadow-teal-500/10">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] font-semibold ${brandDark}`}>Business Profiles</span>
                    </li>
                  )}
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="bg-[#3eb5a9] p-0.5 rounded-full shrink-0 shadow-sm shadow-teal-500/10">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] font-semibold ${brandDark}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-4 ${isFeatured ? `${bgBrandRed} text-white shadow-lg shadow-red-500/25` : `bg-slate-50 border border-slate-200 ${brandDark}`} text-[13px] font-bold rounded-xl hover:bg-[#3eb5a9] hover:text-white transition-all`}
                >
                  {isFeatured ? 'Upgrade Now' : 'Choose Plan'}
                </button>
              </section>
            );
          })}
        </div>

        {currentPlans.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-slate-100 border-dashed">
            <h3 className="text-slate-400 font-bold">No plans available for this cycle</h3>
          </div>
        )}
      </main>
    </div>
  );
};
