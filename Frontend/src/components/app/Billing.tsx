import React, { useState, useEffect, useMemo } from 'react';
import { Check, Star, Loader2, Globe, ChevronDown } from 'lucide-react';
import { getPlans, getPricingMeta, getSavedCurrency, setSavedCurrency } from '../../api/payments';

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  is_base: boolean;
}

interface PricingMeta {
  country: string;
  currency: { code: string; name: string; symbol: string };
  charge_currency: string;
  currencies: CurrencyOption[];
}

const FEATURE_NOISE = [
  /^\s*\d[\d,\s]*\s+dynamic\s+qr\s+codes?\s*$/i,
  /^\s*up\s+to\s+\d[\d,\s]*\s+qr\s+codes?\s*$/i,
];

const cleanFeatures = (features: unknown): string[] => {
  if (!Array.isArray(features)) return [];
  const seen = new Set<string>();
  return features
    .map((f) => String(f).trim())
    .filter((f) => {
      if (!f) return false;
      if (FEATURE_NOISE.some((re) => re.test(f))) return false;
      const key = f.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const Billing: React.FC<{ setView?: (view: any, data?: any) => void }> = ({ setView }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [meta, setMeta] = useState<PricingMeta | null>(null);
  const [cycle, setCycle] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<string>(() => getSavedCurrency());

  useEffect(() => {
    let alive = true;
    setLoading(true);

    Promise.all([getPlans(currency), getPricingMeta(currency)])
      .then(([plansData, metaData]) => {
        if (!alive) return;
        setPlans(plansData);
        setMeta(metaData);
        if (plansData.length > 0) {
          const durations = [
            ...new Set(plansData.map((p: any) => (p.is_lifetime ? 0 : p.duration_months))),
          ].sort((a: any, b: any) => Number(a) - Number(b));
          if (durations.includes(1)) setCycle(1);
          else if (durations.length > 0) setCycle(durations[0] as number);
        }
      })
      .catch((err) => console.error('Failed to fetch plans', err))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [currency]);

  const handleCurrencyChange = (value: string) => {
    setSavedCurrency(value === 'auto' ? '' : value);
    setCurrency(value === 'auto' ? '' : value);
  };

  const handleSelectPlan = (plan: any) => {
    setView?.('payment', { ...plan });
  };

  const isLifetimeVisible = cycle === 0;
  const visiblePlans = plans.filter((p) => !p.is_trial && p.name !== 'Godmode');
  const currentPlans = visiblePlans.filter((p) =>
    isLifetimeVisible ? p.is_lifetime : p.duration_months === cycle && !p.is_lifetime,
  );
  const availableCycles = [
    ...new Set(visiblePlans.map((p) => (p.is_lifetime ? 0 : p.duration_months))),
  ].sort((a: any, b: any) => Number(a) - Number(b));

  /** Pro is the upsell target; fall back to the middle card. */
  const featuredIndex = useMemo(() => {
    const pro = currentPlans.findIndex((p) => String(p.name).toLowerCase() === 'pro');
    if (pro >= 0) return pro;
    return currentPlans.length > 1 ? Math.floor((currentPlans.length - 1) / 2) : 0;
  }, [currentPlans]);

  const displayCurrency = meta?.currency?.code || 'INR';
  const symbolFor = (plan: any) => plan.display_symbol || meta?.currency?.symbol || '₹';

  const formatAmount = (plan: any) => {
    const raw = plan.display_price ?? (Number(plan.price) || 0);
    const digits = Number.isInteger(Number(raw)) ? 0 : 2;
    return Number(raw).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    });
  };

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

  const gridClass =
    currentPlans.length >= 4
      ? 'grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4'
      : currentPlans.length === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : currentPlans.length === 2
          ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
          : 'grid-cols-1 max-w-md mx-auto';

  const compact = currentPlans.length >= 4;

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 font-inter text-[#1e293b] antialiased bg-[#f0f0f0] w-full min-h-full flex flex-col justify-center pb-32 lg:pb-16">
      <header className="text-center mb-6 sm:mb-10 space-y-1">
        <h1 className="skeu-page-title text-2xl sm:text-3xl">
          Flexible <span className={brandRed}>Plans</span> & Pricing
        </h1>
        <p className="skeu-page-subtitle text-xs sm:text-sm max-w-2xl mx-auto px-2">
          Choose A Professional Plan That Scales With Your Growth.
        </p>
      </header>

      {availableCycles.length > 1 && (
        <section className="flex justify-center mb-6 sm:mb-8 px-2 w-full">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 sm:p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 max-w-full overflow-x-auto scrollbar-hide">
            {availableCycles.map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setCycle(dur as number)}
                className={`px-4 sm:px-8 py-2 sm:py-3.5 text-xs sm:text-[15px] font-bold rounded-full transition-all duration-300 outline-none focus:outline-none border-transparent ring-0 whitespace-nowrap ${
                  cycle === dur
                    ? 'bg-[#ee4342] !text-white shadow-md shadow-red-500/20'
                    : '!text-[#476077] hover:!text-white hover:bg-[#3eb5a9]'
                }`}
              >
                {dur === 0
                  ? 'LIFETIME'
                  : dur === 12
                    ? 'ANNUAL'
                    : dur === 1
                      ? 'MONTHLY'
                      : `${dur} MONTHS`}
              </button>
            ))}
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-2 sm:px-4 w-full">
        {meta && meta.currencies.length > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-5 sm:mb-7">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span>
                Prices in <strong className="text-slate-700">{displayCurrency}</strong>
                {!currency && meta.country !== 'IN' && (
                  <span className="text-slate-400"> · {meta.country}</span>
                )}
              </span>
            </div>
            <div className="relative">
              <select
                aria-label="Display currency"
                value={currency || 'auto'}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="appearance-none w-full sm:w-auto bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
              >
                <option value="auto">Auto · {displayCurrency}</option>
                {meta.currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} · {c.symbol}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        )}

        <div className={`grid ${gridClass} gap-5 sm:gap-6 lg:gap-7 items-stretch justify-center`}>
          {currentPlans.map((plan, index) => {
            const isFeatured = index === featuredIndex && currentPlans.length > 1;
            const features = cleanFeatures(plan.features);
            const localised = plan.display_currency && plan.display_currency !== 'INR';

            return (
              <section
                key={plan.id}
                className={`relative flex flex-col h-full bg-white rounded-3xl sm:rounded-[2rem] ${
                  compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
                } border transition-all duration-300 ${
                  isFeatured
                    ? `${borderBrandRed} border-2 shadow-[0_20px_60px_-15px_rgba(239,68,68,0.18)] ${
                        compact ? 'xl:-translate-y-2' : 'md:scale-[1.04] z-10'
                      }`
                    : 'border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]'
                } hover:-translate-y-1`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-max z-10">
                    <div className="bg-gradient-to-br from-[#ef4444] to-[#b91c1c] text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-500/30">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wide">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-5 pt-2">
                  <h3
                    className={`${
                      isFeatured ? brandRed : 'text-slate-500'
                    } font-bold uppercase text-[11px] tracking-wider mb-3`}
                  >
                    {plan.name}
                  </h3>

                  <div className="flex justify-center items-baseline gap-0.5 min-h-[3.5rem]">
                    <span className="text-lg sm:text-xl font-bold self-start mt-1.5">
                      {symbolFor(plan)}
                    </span>
                    <span
                      className={`${
                        compact ? 'text-[2.5rem] sm:text-5xl' : 'text-5xl sm:text-6xl'
                      } font-extrabold leading-none tracking-tight`}
                    >
                      {formatAmount(plan)}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                    {plan.is_lifetime
                      ? 'One-Time Payment'
                      : plan.duration_months === 1
                        ? 'Per Month'
                        : plan.duration_months === 12
                          ? 'Per Year'
                          : `For ${plan.duration_months} Months`}
                  </p>

                  {localised && (
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      Billed ₹{Number(plan.charge_amount ?? plan.price).toLocaleString('en-IN')} in INR
                    </p>
                  )}
                </div>

                <div
                  className={`bg-red-50 ${brandRed} py-2.5 rounded-xl text-center text-[12px] sm:text-[13px] font-bold mb-6 border border-red-50`}
                >
                  {plan.is_lifetime
                    ? 'Unlimited Access Forever'
                    : plan.duration_months === 12
                      ? 'Save with Annual Billing'
                      : 'Flexible Subscription'}
                </div>

                <ul className="space-y-3.5 mb-7 flex-grow">
                  {[
                    `Up to ${Number(plan.qr_limit).toLocaleString()} QR Codes`,
                    ...(plan.can_create_dynamic ? ['Dynamic QR Codes'] : []),
                    ...(plan.can_create_pdf ? ['PDF QR Codes'] : []),
                    ...(plan.can_create_business ? ['Business Profiles'] : []),
                    ...features,
                  ].map((label, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="bg-[#3eb5a9] p-0.5 rounded-full shrink-0 shadow-sm shadow-teal-500/10 mt-1">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                      <span className={`text-[12.5px] font-semibold leading-snug ${brandDark}`}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 ${
                    isFeatured
                      ? `${bgBrandRed} text-white shadow-lg shadow-red-500/25`
                      : `bg-slate-50 border border-slate-200 ${brandDark}`
                  } text-[13px] font-bold rounded-xl hover:bg-[#3eb5a9] hover:text-white transition-all`}
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

        {displayCurrency !== 'INR' && currentPlans.length > 0 && (
          <p className="text-center text-[11px] text-slate-400 font-medium mt-6 max-w-2xl mx-auto leading-relaxed">
            {displayCurrency} amounts are approximate conversions, shown for convenience. Every
            payment is processed in Indian Rupees (INR) by Razorpay — your bank may apply its own
            exchange rate and fees.
          </p>
        )}
      </main>
    </div>
  );
};
