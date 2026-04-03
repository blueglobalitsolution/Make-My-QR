import React from 'react';
import { Barcode, ChevronLeft, Mail, Lock, Eye, EyeOff, User as UserIcon, Phone } from 'lucide-react';

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
  isProcessing: boolean;
  signupStep: 1 | 2;
  setSignupStep: (step: 1 | 2) => void;
  regOtp: string;
  setRegOtp: (otp: string) => void;
}

const inputClass = "w-full pl-12 pr-6 py-4 skeu-input transition-all";
const inputPasswordClass = "w-full pl-12 pr-12 py-4 skeu-input transition-all";
const btnPrimary = "w-full py-4 skeu-btn text-xs font-black capitalize  active:scale-95 transition-all";

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
  isProcessing,
  signupStep,
  setSignupStep,
  regOtp,
  setRegOtp,
}) => {
  /* ─── LOGIN ─── */
  if (view === 'login') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12">
        <div className="max-w-md w-full skeu-auth-card p-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <img src="/src/assets/logo-full.png" alt="Make My QR Code Logo" className="h-10" />
            </div>
            <button type="button" onClick={() => setView('login')} className="flex items-center gap-1.5 text-sm font-bold skeu-text-secondary hover:skeu-text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Home
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black skeu-text-primary  font-poppins">Welcome back</h2>
            <p className="mt-2 text-sm skeu-text-secondary font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-5 h-5" /></div>
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={inputClass} placeholder="Enter your email here" />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-5 h-5" /></div>
              <input type={showLoginPassword ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={inputPasswordClass} placeholder="Enter your password here" />
              <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#dc2626] focus:ring-[#dc2626] border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-bold skeu-text-secondary">Remember me</label>
              </div>
              <button type="button" onClick={() => setView('forgot_password')} className="text-sm font-bold skeu-text-accent hover:underline">Forgot password?</button>
            </div>

            <button type="submit" className={btnPrimary}>Sign in</button>

            <p className="text-center text-sm text-slate-500">
              Don't have an account? <button type="button" onClick={() => setView('register')} className="font-bold text-[#dc2626] hover:underline">Sign up</button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* ─── REGISTER ─── */
  if (view === 'register') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12">
        <div className="max-w-md w-full skeu-auth-card p-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <img src="/src/assets/logo-full.png" alt="Make My QR Code Logo" className="h-10" />
            </div>
            <button type="button" onClick={() => setView('login')} className="flex items-center gap-1.5 text-sm font-bold skeu-text-secondary hover:skeu-text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Home
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black skeu-text-primary ">Sign up</h2>
            <p className="mt-2 text-sm skeu-text-secondary font-medium">Create a free account</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            {signupStep === 1 ? (
              <>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><UserIcon className="w-5 h-5" /></div>
                  <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} className={inputClass} placeholder="Enter your full name" />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-5 h-5" /></div>
                  <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className={inputClass} placeholder="Enter your email here" />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone className="w-5 h-5" /></div>
                  <input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className={inputClass} placeholder="Enter your phone number" />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-5 h-5" /></div>
                  <input type={showRegPassword ? "text" : "password"} required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={inputPasswordClass} placeholder="Enter your password here" />
                  <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-5 h-5" /></div>
                  <input type={showRegConfirmPassword ? "text" : "password"} required value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} className={inputPasswordClass} placeholder="Confirm your password" />
                  <button type="button" onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showRegConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <p className="text-sm font-bold skeu-text-secondary text-center">
                  Enter the 6-digit verification code sent to <br />
                  <span className="text-[#dc2626]">{regEmail}</span>
                </p>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value)}
                    className="w-full text-center tracking-[1em] text-2xl font-black skeu-input py-5 rounded-2xl"
                    placeholder="000000"
                  />
                </div>
                <button type="button" onClick={() => setSignupStep(1)} className="w-full text-xs font-bold text-slate-400 hover:text-[#dc2626] transition-colors">
                  Wrong email? Go back
                </button>
              </div>
            )}

            <button disabled={isProcessing} type="submit" className={btnPrimary}>
              {isProcessing ? 'Please wait...' : signupStep === 1 ? 'Verify Email' : 'Complete Registration'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account? <button type="button" onClick={() => setView('login')} className="font-bold text-[#dc2626] hover:underline">Log In</button>
            </p>

            <p className="text-center text-xs text-slate-400 pt-4 leading-relaxed">
              By creating an account, you consent that you have read and agree to our<br />
              <button type="button" className="font-bold text-[#dc2626] hover:underline">Terms & Conditions</button> and the <button type="button" className="font-bold text-[#dc2626] hover:underline">Privacy Policy.</button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* ─── FORGOT PASSWORD ─── */
  if (view === 'forgot_password') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 skeu-auth-card p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="text-center">
            <div className="skeu-icon-raised p-4 rounded-3xl w-16 h-16 mx-auto flex items-center justify-center mb-6">
              <Lock className="text-amber-500 w-8 h-8" />
            </div>
            <h2 className="mt-2 text-3xl font-black skeu-text-primary ">
              {resetStep === 1 ? "Reset password" : resetStep === 2 ? "Verify OTP" : "New Password"}
            </h2>
            <p className="mt-2 text-sm skeu-text-secondary font-medium">
              {resetStep === 1
                ? "Enter your email and we'll send you an OTP."
                : resetStep === 2
                  ? "Enter the 6-digit code sent to your email."
                  : "Create a new strong password for your account."}
            </p>
          </div>

          {resetStep === 1 && (
            <form className="mt-8 space-y-6" onSubmit={handleResetRequest}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold skeu-text-secondary ml-1">Email address</label>
                  <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="appearance-none relative block w-full px-5 py-4 skeu-input rounded-xl sm:text-sm" placeholder="name@company.com" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className={`skeu-btn w-full flex justify-center py-4 px-4 text-sm rounded-xl transition-all duration-300 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </div>
                ) : "Send OTP"}
              </button>
            </form>
          )}

          {resetStep === 2 && (
            <form className="mt-8 space-y-6" onSubmit={handleResetVerify}>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-500 mb-2">
                    {Math.floor(resetTimer / 60)}:{(resetTimer % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold skeu-text-secondary ml-1">6-digit OTP</label>
                  <input type="text" maxLength={6} required value={resetOTP} onChange={(e) => setResetOTP(e.target.value)} className="appearance-none relative block w-full px-5 py-4 skeu-input rounded-xl sm:text-sm text-center  font-bold" placeholder="000000" />
                </div>
              </div>
              <div>
                <button type="submit" className="skeu-btn w-full flex justify-center py-4 px-4 text-sm rounded-xl">Verify OTP</button>
                <button type="button" onClick={() => setResetStep(1)} className="w-full mt-4 text-xs font-bold skeu-text-muted hover:skeu-text-primary">Resend OTP</button>
              </div>
            </form>
          )}

          {resetStep === 3 && (
            <form className="mt-8 space-y-6" onSubmit={handleResetConfirm}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold skeu-text-secondary ml-1">New Password</label>
                  <input type="password" required value={newPasswordReset} onChange={(e) => setNewPasswordReset(e.target.value)} className="appearance-none relative block w-full px-5 py-4 skeu-input rounded-xl sm:text-sm" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" className="skeu-btn w-full flex justify-center py-4 px-4 text-sm rounded-xl">Update Password</button>
            </form>
          )}

          <div className="text-center pt-2">
            <button type="button" onClick={() => { setView('login'); setResetStep(1); }} className="text-xs font-bold skeu-text-muted hover:skeu-text-primary transition-colors">
              <ChevronLeft className="w-3 h-3 inline-block items-center" /> Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
