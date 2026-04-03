import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Lock, ChevronLeft, Mail } from 'lucide-react';
import { login } from '../../api/auth';
import { UseAuthReturn } from '../../hooks/useAuth';

interface AdminLoginProps {
    setView: React.Dispatch<React.SetStateAction<any>>;
    auth: UseAuthReturn;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ setView, auth }) => {
    const [mode, setMode] = useState<'login' | 'forgot_password'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await login(email, password);

            if (data.user && (data.user.is_staff || data.user.is_superuser)) {
                localStorage.setItem('makemyqr_token', data.token);
                localStorage.setItem('makemyqr_user', JSON.stringify(data.user));
                setView('admin_dashboard');
            } else {
                alert("Unauthorized: Admin access required.");
            }
        } catch (err: any) {
            alert(err.response?.data?.error || "Login Failed: check your credentials.");
        }
    };

    const handleBackToLogin = () => {
        setMode('login');
        auth.setResetStep(1);
    };

    if (mode === 'forgot_password') {
        const { resetStep, resetEmail, setResetEmail, resetOTP, setResetOTP, resetTimer, newPasswordReset, setNewPasswordReset, handleAdminResetRequest, handleResetVerify, handleResetConfirm, isProcessing, setResetStep } = auth;

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-amber-500/10 border border-slate-100">
                        <div className="w-16 h-16 bg-amber-50 rounded-[15px] flex items-center justify-center mb-6 mx-auto">
                            <Lock className="w-8 h-8 text-amber-600" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-800 text-center mb-2 ">
                            {resetStep === 1 ? "Admin Reset" : resetStep === 2 ? "Verify OTP" : "New Password"}
                        </h2>
                        <p className="text-sm text-slate-500 text-center font-medium mb-8">
                            {resetStep === 1
                                ? "Enter your email for security check."
                                : resetStep === 2
                                    ? "Enter the 6-digit code sent to your email."
                                    : "Set a new secure password."}
                        </p>

                        {resetStep === 1 && (
                            <form className="space-y-4" onSubmit={handleAdminResetRequest}>
                                <div>
                                    <label className="text-[10px] font-black capitalize text-slate-400 pl-1 mb-1 block">Super Admin Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium transition-all"
                                        placeholder="superadmin@scannerstudio.co"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] capitalize py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    {isProcessing ? "Processing..." : "Send Reset Code"} <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        )}

                        {resetStep === 2 && (
                            <form className="space-y-4" onSubmit={handleResetVerify}>
                                <div className="text-center mb-4">
                                    <p className="text-lg font-bold text-amber-600 bg-amber-50 rounded-lg py-2">
                                        {Math.floor(resetTimer / 60)}:{(resetTimer % 60).toString().padStart(2, '0')}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Valid for 3:00 Minutes</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black capitalize text-slate-400 pl-1 mb-1 block">Security OTP</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        required
                                        value={resetOTP}
                                        onChange={(e) => setResetOTP(e.target.value)}
                                        className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xl text-center font-black tracking-widest transition-all"
                                        placeholder="000000"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] capitalize py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    Verify Identity <ArrowRight className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => setResetStep(1)} className="w-full text-[10px] font-bold text-slate-400 capitalize hover:text-slate-600">
                                    Resend Code
                                </button>
                            </form>
                        )}

                        {resetStep === 3 && (
                            <form className="space-y-4" onSubmit={async (e) => {
                                await handleResetConfirm(e);
                                setMode('login');
                            }}>
                                <div>
                                    <label className="text-[10px] font-black capitalize text-slate-400 pl-1 mb-1 block">New Security Key</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPasswordReset}
                                        onChange={(e) => setNewPasswordReset(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-[11px] capitalize py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    Update Security Key <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        )}

                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <button
                                onClick={handleBackToLogin}
                                className="w-full text-[10px] font-bold text-slate-400 capitalize hover:text-slate-600 transition-colors flex items-center justify-center gap-1"
                            >
                                <ChevronLeft className="w-3 h-3" /> Back to Admin Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-red-500/10 border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 rounded-[15px] flex items-center justify-center mb-6 mx-auto">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>

                    <h1 className="text-2xl font-black text-slate-800 text-center mb-2 ">System Admin</h1>
                    <p className="text-sm text-slate-500 text-center font-medium mb-8">Authorized personnel only</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black capitalize text-slate-400  pl-1 mb-1 block">Admin Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all"
                                placeholder="admin@scannerstudio.co"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black capitalize text-slate-400  pl-1 mb-1 block">Security Key</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium transition-all"
                                placeholder="••••••••"
                            />
                            <div className="flex justify-end mt-1">
                                <button
                                    type="button"
                                    onClick={() => setMode('forgot_password')}
                                    className="text-[10px] font-bold text-red-600 hover:text-red-700"
                                >
                                    Forgot security key?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-[11px] capitalize  py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            Authenticate <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <button
                            onClick={() => setView('login')}
                            className="w-full text-[10px] font-bold text-slate-400 capitalize  hover:text-slate-600 transition-colors"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
