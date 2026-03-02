import React from 'react';
import { UserIcon, Mail, Phone, Lock, Eye } from 'lucide-react';

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
  const [activeTab, setActiveTab] = React.useState<'profile' | 'billing'>('profile');

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-12 max-w-5xl mx-auto w-full space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-black skeu-text-primary tracking-tight">Account Settings</h1>
        <p className="skeu-text-muted font-medium">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex bg-[#f8fafc] border border-slate-200 p-1.5 rounded-2xl shadow-inner relative max-w-[360px] w-full">
        {/* Sliding active background */}
        <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-8px)] bg-[#156295] rounded-[10px] shadow-md transition-all duration-300 ${activeTab === 'profile' ? 'left-1.5' : 'left-[calc(50%+2px)]'}`} />

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 text-[14px] font-black tracking-wide transition-all duration-300 relative z-10 ${activeTab === 'profile' ? 'text-white drop-shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex-1 py-2.5 text-[14px] font-black tracking-wide transition-all duration-300 relative z-10 ${activeTab === 'billing' ? 'text-white drop-shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Billing & Plans
        </button>
      </div>

      {activeTab === 'profile' ? (
        <>

          <div className="skeu-card p-10 space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 skeu-hero-icon text-white rounded-2xl flex items-center justify-center relative skeu-gloss">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black skeu-text-primary tracking-tight">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">First Name</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 skeu-text-accent transition-colors"><UserIcon className="w-5 h-5" /></div>
                  <input type="text" value={accFirstName} onChange={(e) => setAccFirstName(e.target.value)} className="w-full pl-16 pr-6 py-5 skeu-input" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Last Name</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 skeu-text-accent transition-colors"><UserIcon className="w-5 h-5" /></div>
                  <input type="text" value={accLastName} onChange={(e) => setAccLastName(e.target.value)} className="w-full pl-16 pr-6 py-5 skeu-input" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 skeu-text-accent transition-colors"><Mail className="w-5 h-5" /></div>
                  <input type="email" value={accEmail} onChange={(e) => setAccEmail(e.target.value)} className="w-full pl-16 pr-6 py-5 skeu-input" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 skeu-text-accent transition-colors"><Phone className="w-5 h-5" /></div>
                  <input type="tel" value={accPhone} onChange={(e) => setAccPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full pl-16 pr-6 py-5 skeu-input" />
                </div>
              </div>
            </div>

            <button onClick={handleUpdateProfile} className="px-12 py-4 skeu-btn text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
              Save Changes
            </button>
          </div>

          <div className="skeu-card p-10 space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 skeu-hero-icon text-white rounded-2xl flex items-center justify-center relative skeu-gloss">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black skeu-text-primary tracking-tight">Security & Password</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">New Password</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 skeu-text-accent transition-colors"><Lock className="w-5 h-5" /></div>
                  <input type="password" value={accPassword} onChange={(e) => setAccPassword(e.target.value)} placeholder="••••••••" className="w-full pl-16 pr-12 py-5 skeu-input" />
                  <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 skeu-text-muted hover:skeu-text-primary transition-colors"><Eye className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 skeu-text-accent transition-colors"><Lock className="w-5 h-5" /></div>
                  <input type="password" value={accConfirmPassword} onChange={(e) => setAccConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-16 pr-12 py-5 skeu-input" />
                  <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 skeu-text-muted hover:skeu-text-primary transition-colors"><Eye className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            <button onClick={handleUpdatePassword} className="px-12 py-4 skeu-btn-secondary text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
              Update Password
            </button>
          </div>
        </>
      ) : (
        <div className="skeu-card p-12 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500 min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 text-[#156295] rounded-full flex items-center justify-center skeu-inset shadow-inner">
            <Lock className="w-8 h-8 opacity-50" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-2xl font-black skeu-text-primary tracking-tight">Billing & Plans</h3>
            <p className="skeu-text-muted font-medium text-sm">
              Manage your subscription and billing details here. This feature will be available shortly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
