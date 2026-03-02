import React from 'react';
import { UserIcon, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

interface AccountProps {
  accFirstName: string;
  setAccFirstName: (name: string) => void;
  accLastName: string;
  setAccLastName: (lastName: string) => void;
  accEmail: string;
  setAccEmail: (email: string) => void;
  accPhone: string;
  setAccPhone: (phone: string) => void;
  accPassword: string;
  setAccPassword: (password: string) => void;
  accConfirmPassword: string;
  setAccConfirmPassword: (confirmPassword: string) => void;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
  handleUpdatePassword: (e: React.FormEvent) => Promise<void>;
}

export const Account: React.FC<AccountProps> = ({
  accFirstName,
  setAccFirstName,
  accLastName,
  setAccLastName,
  accEmail,
  setAccEmail,
  accPhone,
  setAccPhone,
  accPassword,
  setAccPassword,
  accConfirmPassword,
  setAccConfirmPassword,
  handleUpdateProfile,
  handleUpdatePassword,
}) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-12 max-w-5xl mx-auto w-full space-y-10 animate-in fade-in duration-700 pb-24 text-slate-800">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Account Settings</h1>
        <p className="text-slate-400 font-medium">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex gap-8 border-b border-slate-100">
        <button className="px-2 py-4 text-sm font-bold text-[#156295] border-b-2 border-[#156295] transition-all">Profile Details</button>
        <button className="px-2 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 border-b-2 border-transparent transition-all">Billing & Plans</button>
      </div>

      <div className="skeu-card overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-[#156295] rounded-xl flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">First Name</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><UserIcon className="w-5 h-5" /></div>
                <input type="text" value={accFirstName} onChange={(e) => setAccFirstName(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><UserIcon className="w-5 h-5" /></div>
                <input type="text" value={accLastName} onChange={(e) => setAccLastName(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Mail className="w-5 h-5" /></div>
                <input type="email" value={accEmail} onChange={(e) => setAccEmail(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Phone className="w-5 h-5" /></div>
                <input type="tel" value={accPhone} onChange={(e) => setAccPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
              </div>
            </div>
          </div>

          <button onClick={handleUpdateProfile} className="px-10 py-4 bg-[#156295] text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-[#0E4677] transition-all shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5 mt-4">
            Save Changes
          </button>
        </div>
      </div>

      <div className="skeu-card overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Security & Password</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Password</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Lock className="w-5 h-5" /></div>
                <input type="password" value={accPassword} onChange={(e) => setAccPassword(e.target.value)} placeholder="••••••••" className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"><Eye className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#156295] transition-colors"><Lock className="w-5 h-5" /></div>
                <input type="password" value={accConfirmPassword} onChange={(e) => setAccConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-14 pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-[#156295] focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"><Eye className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          <button onClick={handleUpdatePassword} className="px-10 py-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all transform hover:-translate-y-0.5 mt-4">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};
