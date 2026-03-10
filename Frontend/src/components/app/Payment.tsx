import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Edit3, User, Globe, MapPin, CreditCard, ChevronDown, Menu, Loader2 } from 'lucide-react';
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

    // Default to a 1 Month Plan if none provided (matching screenshot)
    const plan = selectedPlan || {
        id: 1, // Default ID for backend
        name: '1 Month Plan',
        price: '1799.00',
        total: '1799',
        features: [
            'Create unlimited dynamic QR codes',
            'Access a variety of QR types',
            'Unlimited modifications of QR codes',
            'Unlimited scans',
            'Multiple QR code download formats',
            'Access to advanced analytics',
            'Premium customer support',
            'Cancel at anytime'
        ]
    };

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
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

            // 1. Create Order in Backend
            const orderData = await createOrder(plan.id);

            // 2. Configure Razorpay Options
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: orderData.name,
                description: orderData.description,
                order_id: orderData.order_id,
                handler: async (response: any) => {
                    try {
                        // 3. Verify Payment in Backend
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert("Payment successful! Your plan is now active.");
                        setView('my_codes');
                    } catch (err: any) {
                        setError("Payment verification failed. Please contact support.");
                        console.error(err);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: "", // User's email if available
                    contact: "" // User's phone if available
                },
                theme: {
                    color: "#38bdf8"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setError(response.error.description);
            });
            rzp.open();

        } catch (err: any) {
            setError("Could not initiate payment. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfdff] font-inter text-slate-800 flex flex-col">
            {/* Premium Header */}
            <header className="bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-3 h-3 bg-[#38bdf8] rounded-sm" />
                            <div className="w-3 h-3 bg-[#38bdf8] rounded-sm opacity-60" />
                            <div className="w-3 h-3 bg-[#38bdf8] rounded-sm opacity-60" />
                            <div className="w-3 h-3 bg-[#38bdf8] rounded-sm" />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">QR code.io</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Plans & Pricing</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Information</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-400 text-slate-400 flex items-center justify-center text-[10px] font-black">
                                3
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Payment</span>
                        </div>
                    </nav>
                </div>

                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <Menu className="w-6 h-6 text-slate-600" />
                </button>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Left: Billing Form */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-900">Billing Information</h1>
                    </div>

                    <form className="space-y-8" onSubmit={handlePayment}>
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-bold text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block pl-1">Full name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block pl-1">Country or region</label>
                            <div className="relative group">
                                <select
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option>India</option>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                    <option>Germany</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block pl-1">Address line 1</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Street address, P.O. box, etc."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full max-w-sm py-5 bg-[#38bdf8] text-white font-black text-[14px] rounded-2xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 lg:mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Continue to payment
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right: Summary Sidebar */}
                <div className="lg:col-span-2">
                    <div className="sticky top-32 space-y-6">
                        <h2 className="text-xl font-black text-slate-900">Summary</h2>

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                            <div className="p-8 space-y-8 flex-1">
                                {/* Plan Title & Price */}
                                <div className="flex items-start justify-between pb-8 border-b border-slate-50">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                            <Edit3 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-800">{plan.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Plan</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-slate-900">₹ {plan.price}/mo</p>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-slate-900 tracking-tight">Total</span>
                                    <span className="text-2xl font-black text-slate-900 flex items-center gap-1">
                                        <span className="text-lg">₹</span> {plan.total}
                                    </span>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4 pt-4">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Monthly Plan includes:</p>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4 group">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-100/50 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-blue-500" strokeWidth={4} />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-600 leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Small Disclaimer */}
                            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                    The selected plan provides access to QR code.io and renews every 1 month at ₹ {plan.price} until canceled. Cancel anytime directly from your account. Please refer to our Terms & Conditions for more details. Charges may appear on your credit card statement as "QR CODE.IO".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
