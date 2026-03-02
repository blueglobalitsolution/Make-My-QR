import React from 'react';
import { Barcode, ChevronLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthViewsProps {
  view: string;
  setView: (view: any) => void;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  showLoginPassword: boolean;
  setShowLoginPassword: (show: boolean) => void;
  handleAuth: () => Promise<void>;
  regName: string;
  setRegName: (name: string) => void;
  regLastName: string;
  setRegLastName: (lastName: string) => void;
  regEmail: string;
  setRegEmail: (email: string) => void;
  regPhone: string;
  setRegPhone: (phone: string) => void;
  regPassword: string;
  setRegPassword: (password: string) => void;
  regConfirmPassword: string;
  setRegConfirmPassword: (confirmPassword: string) => void;
  showRegPassword: boolean;
  setShowRegPassword: (show: boolean) => void;
  showRegConfirmPassword: boolean;
  setShowRegConfirmPassword: (show: boolean) => void;
  handleRegister: (e: React.FormEvent) => Promise<void>;
  resetStep: 1 | 2 | 3;
  setResetStep: (step: 1 | 2 | 3) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetOTP: string;
  setResetOTP: (otp: string) => void;
  resetTimer: number;
  newPasswordReset: string;
  setNewPasswordReset: (password: string) => void;
  handleResetRequest: (e: React.FormEvent) => Promise<void>;
  handleResetVerify: (e: React.FormEvent) => Promise<void>;
  handleResetConfirm: (e: React.FormEvent) => Promise<void>;
}

export const AuthViews: React.FC<AuthViewsProps> = ({
  view,
  setView,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showLoginPassword,
  setShowLoginPassword,
  handleAuth,
  regName,
  setRegName,
  regLastName,
  setRegLastName,
  regEmail,
  setRegEmail,
  regPhone,
  setRegPhone,
  regPassword,
  setRegPassword,
  regConfirmPassword,
  setRegConfirmPassword,
  showRegPassword,
  setShowRegPassword,
  showRegConfirmPassword,
  setShowRegConfirmPassword,
  handleRegister,
  resetStep,
  setResetStep,
  resetEmail,
  setResetEmail,
  resetOTP,
  setResetOTP,
  resetTimer,
  newPasswordReset,
  setNewPasswordReset,
  handleResetRequest,
  handleResetVerify,
  handleResetConfirm,
}) => {
  if (view === 'auth') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-6 bg-slate-50">
        <div className="max-w-md w-full skeu-card p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#156295] p-2 rounded-xl shadow-lg shadow-blue-500/20"><Barcode className="text-white w-5 h-5" /></div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">QR <span className="text-[#156295]">code.io</span></h1>
            </div>
            <button type="button" onClick={() => setView('landing')} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
              <ChevronLeft className="w-3 h-3" /> Home
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-400 font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Mail className="w-5 h-5" /></div>
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="Email Address" />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Lock className="w-5 h-5" /></div>
                <input type={showLoginPassword ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="Password" />
                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#156295] focus:ring-[#156295] border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-slate-400 uppercase tracking-widest">Remember me</label>
              </div>
              <button type="button" onClick={() => setView('forgot_password')} className="text-xs font-bold text-[#156295] hover:text-[#0E4677] uppercase tracking-widest">Forgot password?</button>
            </div>

            <button type="submit" className="w-full py-5 bg-[#156295] hover:bg-[#0E4677] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95">
              Sign into Studio
            </button>

            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              Don't have an account? <button type="button" onClick={() => setView('register')} className="text-[#156295] hover:underline">Get Access</button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-6 bg-slate-50">
        <div className="max-w-md w-full skeu-card p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#156295] p-2 rounded-xl shadow-lg shadow-blue-500/20"><Barcode className="text-white w-5 h-5" /></div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">QR <span className="text-[#156295]">code.io</span></h1>
            </div>
            <button type="button" onClick={() => setView('landing')} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
              <ChevronLeft className="w-3 h-3" /> Home
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Join Studio</h2>
            <p className="text-sm text-slate-400 font-medium">Create your professional profile to get started.</p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="First Name" />
                </div>
                <div className="group">
                  <input type="text" required value={regLastName} onChange={(e) => setRegLastName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="Last Name" />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Mail className="w-5 h-5" /></div>
                <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="Email Address" />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Lock className="w-5 h-5" /></div>
                <input type={showRegPassword ? "text" : "password"} required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="Password" />
                <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                  {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Lock className="w-5 h-5" /></div>
                <input type={showRegConfirmPassword ? "text" : "password"} required value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="Confirm Password" />
                <button type="button" onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                  {showRegConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-[#156295] hover:bg-[#0E4677] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95">
              Create My Account
            </button>

            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              Have an account? <button type="button" onClick={() => setView('auth')} className="text-[#156295] hover:underline">Sign In Instead</button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'forgot_password') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-6 bg-slate-50">
        <div className="max-w-md w-full skeu-card p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-inner border border-white">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {resetStep === 1 ? "Reset Access" : resetStep === 2 ? "Verify Identity" : "New Password"}
              </h2>
              <p className="text-sm text-slate-400 font-medium px-4 mx-auto">
                {resetStep === 1
                  ? "Don't worry, enter your email and we'll send you an OTP."
                  : resetStep === 2
                    ? "We've sent a 6-digit code to your email for security."
                    : "Choose a new strong password for your studio account."}
              </p>
            </div>
          </div>

          {resetStep === 1 && (
            <form className="space-y-6" onSubmit={handleResetRequest}>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Mail className="w-5 h-5" /></div>
                <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300" placeholder="Email Address" />
              </div>
              <button type="submit" className="w-full py-5 bg-[#156295] hover:bg-[#0E4677] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5">
                Send OTP Code
              </button>
            </form>
          )}

          {resetStep === 2 && (
            <form className="space-y-8" onSubmit={handleResetVerify}>
              <div className="text-center">
                <span className="text-2xl font-black text-amber-500 tabular-nums">
                  {Math.floor(resetTimer / 60)}:{(resetTimer % 60).toString().padStart(2, '0')}
                </span>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Time Remaining</p>
              </div>
              <div className="group">
                <input type="text" maxLength={6} required value={resetOTP} onChange={(e) => setResetOTP(e.target.value)} className="w-full px-5 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-center text-4xl font-black tracking-[0.5em] text-[#156295] focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="000000" />
              </div>
              <div className="space-y-4">
                <button type="submit" className="w-full py-5 bg-[#156295] hover:bg-[#0E4677] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5">
                  Verify OTP
                </button>
                <button type="button" onClick={() => setResetStep(1)} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {resetStep === 3 && (
            <form className="space-y-6" onSubmit={handleResetConfirm}>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Lock className="w-5 h-5" /></div>
                <input type="password" required value={newPasswordReset} onChange={(e) => setNewPasswordReset(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300" placeholder="New Password" />
              </div>
              <button type="submit" className="w-full py-5 bg-[#156295] hover:bg-[#0E4677] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5">
                Update Security Credentials
              </button>
            </form>
          )}

          <div className="text-center pt-4 border-t border-slate-50">
            <button onClick={() => { setView('auth'); setResetStep(1); }} className="text-xs font-bold text-[#156295] hover:text-[#0E4677] uppercase tracking-widest">
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
