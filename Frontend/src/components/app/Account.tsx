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
    <div className="p-10 max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-black skeu-text-primary tracking-tight">My Account</h1>

      <div className="flex gap border-slate--1 border-b200">
        <button className="px-5 py-3 text-sm font-bold text-[#156295] border-b-2 border-[#156295] transition-all">General Information</button>
        <button className="px-5 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 border-b-2 border-transparent transition-all">Billing Information</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
        <h3 className="text-lg font-black skeu-text-primary">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-red-500 mb-2">First Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><UserIcon className="w-5 h-5" /></div>
              <input type="text" value={accFirstName} onChange={(e) => setAccFirstName(e.target.value)} className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:border-[#156295] focus:ring-2 focus:ring-[#156295]/10 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-red-500 mb-2">Last Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><UserIcon className="w-5 h-5" /></div>
              <input type="text" value={accLastName} onChange={(e) => setAccLastName(e.target.value)} className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:border-[#156295] focus:ring-2 focus:ring-[#156295]/10 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-red-500 mb-2">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white"><Mail className="w-5 h-5" /></div>
              <input type="email" value={accEmail} onChange={(e) => setAccEmail(e.target.value)} className="w-full pl-12 pr-5 py-3 bg-[#156295] text-white border border-[#156295] rounded-xl text-sm font-medium placeholder-white/60 focus:ring-2 focus:ring-[#156295]/30 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Telephone</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone className="w-5 h-5" /></div>
              <input type="tel" value={accPhone} onChange={(e) => setAccPhone(e.target.value)} placeholder="E.g. 6565123" className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-[#156295] focus:ring-2 focus:ring-[#156295]/10 outline-none transition-all" />
            </div>
          </div>
        </div>

        <button onClick={handleUpdateProfile} className="px-8 py-2.5 bg-[#156295] text-white text-sm font-bold rounded-xl hover:bg-[#0E4677] transition-all shadow-md">
          Update
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
        <h3 className="text-lg font-black skeu-text-primary">Change password</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-red-500 mb-2">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-5 h-5" /></div>
              <input type="password" value={accPassword} onChange={(e) => setAccPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-[#156295] focus:ring-2 focus:ring-[#156295]/10 outline-none transition-all" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"><Eye className="w-5 h-5" /></button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-red-500 mb-2">Confirm password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-5 h-5" /></div>
              <input type="password" value={accConfirmPassword} onChange={(e) => setAccConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-[#156295] focus:ring-2 focus:ring-[#156295]/10 outline-none transition-all" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"><Eye className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <button onClick={handleUpdatePassword} className="px-8 py-2.5 bg-[#156295] text-white text-sm font-bold rounded-xl hover:bg-[#0E4677] transition-all shadow-md">
          Update
        </button>
      </div>
    </div>
  );
};
