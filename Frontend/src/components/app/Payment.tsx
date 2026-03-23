import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Edit3, ChevronDown, Loader2 } from 'lucide-react';
import { createOrder, verifyPayment } from '../../api/payments';

interface PaymentProps {
    setView: (view: any) => void;
    selectedPlan?: any;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const Payment: React.FC<PaymentProps> = ({ setView, selectedPlan }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        country: 'India',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Default to a 1 Month Plan if none provided
    const plan = selectedPlan || {
        id: 1,
        name: 'Pro Annual',
        price: '9999.00',
        duration_months: 12,
        total: '9,999',
        features: [
            'Unlimited QRs',
            'Analytics',
            'Bulk Upload',
            'Custom Domains'
        ],
        is_lifetime: false
    };

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName) {
            setError("Full name is required");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const orderData = await createOrder(plan.id);

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: orderData.name,
                description: orderData.description,
                order_id: orderData.order_id,
                handler: async (response: any) => {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert("Payment successful! Your plan is now active.");
                        setView('my_codes');
                    } catch (err: any) {
                        setError("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#dc2626"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setError(response.error.description);
            });
            rzp.open();

        } catch (err: any) {
            setError("Could not initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col font-inter bg-[#efefef] min-h-screen overflow-y-auto w-full">
            {/* Top Navigation / Breadcrumbs - Seamless Header */}
            <div className="sticky top-0 z-40 bg-[#efefef]/95 backdrop-blur-sm border-b border-slate-200/50 flex items-center px-12 py-5 justify-center w-full">
                <nav className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setView('billing')}>
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/20">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-red-600">Plans & Pricing</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200" />
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/20">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-red-600">Information</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-200" />
                    <div className="flex items-center gap-2 opacity-40">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-[11px] font-black text-slate-400">
                           3
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Payment</span>
                    </div>
                </nav>
            </div>

            <main className="max-w-7xl mx-auto w-full px-8 lg:px-16 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                {/* Left Side: Form */}
                <div className="lg:col-span-7 space-y-12">
                    <header className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing Information</h1>
                        <p className="text-slate-500 font-medium font-inter">Enter your billing details to proceed with the secure payment.</p>
                    </header>

                    <form className="space-y-10" onSubmit={handlePayment}>
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-bold text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-10">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-7 py-5 text-[15px] font-bold shadow-sm focus:border-red-600/60 focus:ring-4 focus:ring-red-600/5 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Country or Region</label>
                                <div className="relative">
                                    <select 
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-7 py-5 text-[15px] font-bold shadow-sm focus:border-red-600/60 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option>India</option>
                                        <option>United States</option>
                                        <option>United Kingdom</option>
                                        <option>Germany</option>
                                        <option>France</option>
                                    </select>
                                    <ChevronDown className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Address Line 1</label>
                                <input 
                                    type="text" 
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Street address, P.O. box, etc."
                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-7 py-5 text-[15px] font-bold shadow-sm focus:border-red-600/60 focus:ring-4 focus:ring-red-600/5 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="pt-10 flex justify-start">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-[420px] py-5.5 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-2xl font-black text-[15px] uppercase tracking-wider shadow-[0_15px_40px_-10px_rgba(220,38,38,0.4)] hover:shadow-[0_20px_50px_-8px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Continue to payment</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Summary Card */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 space-y-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Summary</h2>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
                            <div className="p-10 lg:p-12 flex-1 space-y-12">
                                {/* Plan Header */}
                                <div className="flex items-center justify-between pb-10 border-b border-slate-50">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                                            <Edit3 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 leading-none mb-2.5">{plan.name}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.is_lifetime ? 'LIFETIME' : (plan.duration_months === 12 ? 'ANNUAL' : 'MONTHLY')} ACCESS</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-slate-900 tracking-tight">₹ {parseFloat(plan.price).toFixed(2)}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{plan.is_lifetime ? 'Once' : (plan.duration_months === 12 ? 'Yearly' : 'Monthly')}</p>
                                    </div>
                                </div>

                                {/* Main Pricing Block */}
                                <div className="flex items-center justify-between">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">Total</span>
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter flex items-baseline gap-1.5">
                                        <span className="text-2xl">₹</span>
                                        {plan.total}
                                    </span>
                                </div>

                                {/* Features Checklist */}
                                <div className="space-y-6">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">{plan.name} INCLUDES:</p>
                                    <div className="space-y-5">
                                        {plan.features.map((feature: string, i: number) => (
                                            <div key={i} className="flex items-center gap-5 group">
                                                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                                                    <Check className="w-3.5 h-3.5 text-red-600" strokeWidth={4} />
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-700 leading-snug">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Terms Summary Section */}
                            <div className="p-10 lg:p-12 bg-slate-50/10 border-t border-slate-50">
                                <p className="text-[10px] text-slate-400/80 font-semibold leading-loose uppercase tracking-wide">
                                    {plan.is_lifetime 
                                        ? "One-time payment. Permanent premium access. No recurring charges."
                                        : `Renews every ${plan.duration_months} ${plan.duration_months === 1 ? 'month' : 'months'} at ₹ ${plan.price}. Cancel anytime.`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="h-20 lg:h-0" />
        </div>
    );
};
