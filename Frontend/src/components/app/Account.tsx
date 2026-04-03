import React from 'react';
import { UserIcon, Mail, Phone, Lock, Eye, CreditCard, Calendar, Clock, ArrowRight, ShieldCheck, Grid3X3, Download, History, Receipt, Check, Briefcase, ChevronDown, Globe } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { User } from '../../../types';

interface AccountProps {
  currentUser: User | null;
  setView: (view: any) => void;
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
  billingCompany: string;
  setBillingCompany: (val: string) => void;
  billingTaxId: string;
  setBillingTaxId: (val: string) => void;
  billingName: string;
  setBillingName: (val: string) => void;
  billingSurname: string;
  setBillingSurname: (val: string) => void;
  billingEmail: string;
  setBillingEmail: (val: string) => void;
  billingAddress: string;
  setBillingAddress: (val: string) => void;
  billingPostalCode: string;
  setBillingPostalCode: (val: string) => void;
  billingCity: string;
  setBillingCity: (val: string) => void;
  billingCountry: string;
  setBillingCountry: (val: string) => void;
}

export const Account: React.FC<AccountProps> = ({
  currentUser,
  setView,
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
  billingCompany,
  setBillingCompany,
  billingTaxId,
  setBillingTaxId,
  billingName,
  setBillingName,
  billingSurname,
  setBillingSurname,
  billingEmail,
  setBillingEmail,
  billingAddress,
  setBillingAddress,
  billingPostalCode,
  setBillingPostalCode,
  billingCity,
  setBillingCity,
  billingCountry,
  setBillingCountry,
}) => {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'billing'>('profile');

  const isTrial = currentUser?.subscription?.plan?.toLowerCase() === 'trial' ||
    currentUser?.subscription?.plan?.toLowerCase() === 'free' ||
    currentUser?.plan?.toLowerCase() === 'free';

  const isExpired = currentUser?.subscription?.plan?.toLowerCase() === 'expired' ||
    (currentUser?.subscription?.expiry_date && (() => {
      const expiry = new Date(currentUser.subscription.expiry_date);
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate()) >
        new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    })());

  const getDaysRemaining = () => {
    if (!currentUser?.subscription?.expiry_date) return 0;
    const expiry = new Date(currentUser.subscription.expiry_date);
    const now = new Date();
    const expiryDate = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays + 1);
  };

  const daysLeft = getDaysRemaining();

  const [showInvoiceToast, setShowInvoiceToast] = React.useState(false);
  const [invoiceToastType, setInvoiceToastType] = React.useState<'success' | 'trial'>('success');

  const handleDownloadInvoice = () => {
    if (isTrial) {
      setInvoiceToastType('trial');
      setShowInvoiceToast(true);
      setTimeout(() => setShowInvoiceToast(false), 3000);
      return;
    }

    setInvoiceToastType('success');
    setShowInvoiceToast(true);
    setTimeout(() => setShowInvoiceToast(false), 3000);

    const doc = new jsPDF();
    const planName = isTrial ? '7-Day Trial' : (currentUser?.subscription?.plan_details?.name || currentUser?.plan || 'Free Plan');
    const price = isTrial ? '$0.00' : (currentUser?.plan === 'pro' ? '$29.00' : '$0.00');
    const dateStr = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

    // Header
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text('Make My QR Code', 105, 40, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Professional QR Solutions', 105, 48, { align: 'center' });

    // Invoice Info
    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33);
    doc.text('OFFICIAL RECEIPT', 20, 70);

    doc.setFontSize(10);
    doc.text(`Invoice Date: ${dateStr}`, 20, 78);
    doc.text(`Customer: ${currentUser?.name || currentUser?.email}`, 20, 84);

    // Table Header
    doc.setDrawColor(240);
    doc.line(20, 95, 190, 95);
    doc.setFont(undefined, 'bold');
    doc.text('DESCRIPTION', 25, 105);
    doc.text('AMOUNT', 160, 105);
    doc.setFont(undefined, 'normal');
    doc.line(20, 110, 190, 110);

    // Table Content
    doc.text(`${planName} - Monthly Subscription`, 25, 122);
    doc.text(price, 160, 122);

    doc.line(20, 130, 190, 130);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Thank you for choosing Make My QR Code. Your subscription is now active.', 105, 160, { align: 'center' });
    doc.text('www.makemyqrcode.com | support@makemyqrcode.com', 105, 166, { align: 'center' });

    doc.save(`Invoice_${planName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="h-full py-10 w-full space-y-4 animate-in fade-in duration-700 px-10">
      <div className="space-y-1">
        <h1 className="skeu-page-title">Account Settings</h1>
        <p className="skeu-page-subtitle">Manage your personal information and security preferences.</p>
      </div>

      <div className="flex bg-[#f8fafc] border border-slate-200 p-0.5 rounded-lg shadow-inner relative max-w-[280px] w-full">
        {/* Sliding active background */}
        <div className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-[#dc2626] rounded-md shadow-md transition-all duration-300 ${activeTab === 'profile' ? 'left-0.5' : 'left-[calc(50%+1px)]'}`} />

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-1.5 text-[12px] font-black  transition-all duration-300 relative z-10 ${activeTab === 'profile' ? 'text-white drop-shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex-1 py-1.5 text-[12px] font-black  transition-all duration-300 relative z-10 ${activeTab === 'billing' ? 'text-white drop-shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Billing & Plans
        </button>
      </div>

      {activeTab === 'profile' ? (
        <>

          <div className="bg-[#f0f0f0] rounded-[8px] p-5 space-y-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-[5px] flex items-center justify-center relative skeu-gloss">
                <UserIcon className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-normal skeu-text-primary ">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black skeu-text-muted capitalize  pl-1">First Name</label>
                <div className="relative group">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-[5px] shadow-sm flex items-center justify-center text-[#dc2626] transition-colors">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input type="text" value={accFirstName} onChange={(e) => setAccFirstName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white rounded-[6px] text-[13px] font-bold text-slate-800 outline-none border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-red-500/10 transition-shadow" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black skeu-text-muted capitalize  pl-1">Last Name</label>
                <div className="relative group">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-[5px] shadow-sm flex items-center justify-center text-[#dc2626] transition-colors">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input type="text" value={accLastName} onChange={(e) => setAccLastName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white rounded-[6px] text-[13px] font-bold text-slate-800 outline-none border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-red-500/10 transition-shadow" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black skeu-text-muted capitalize  pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-[5px] shadow-sm flex items-center justify-center text-[#dc2626] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input type="email" value={accEmail} onChange={(e) => setAccEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white rounded-[6px] text-[13px] font-bold text-slate-800 outline-none border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-red-500/10 transition-shadow" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black skeu-text-muted capitalize  pl-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-[5px] shadow-sm flex items-center justify-center text-[#dc2626] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input type="tel" value={accPhone} onChange={(e) => setAccPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full pl-12 pr-4 py-4 bg-white rounded-[6px] text-[13px] font-bold text-slate-800 outline-none border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-red-500/10 transition-shadow" />
                </div>
                <div className="flex justify-start">
                  <button type="submit" onClick={handleUpdateProfile} className="px-10 py-3.5 skeu-btn text-[14px] font-black uppercase tracking-wider active:scale-95 transition-all">Save Changes</button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information Section */}
          <div className="bg-[#f0f0f0] rounded-[8px] p-8 space-y-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 skeu-hero-icon text-white rounded-[5px] flex items-center justify-center relative skeu-gloss shadow-inner">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-normal skeu-text-primary ">Billing Information</h3>
                <p className="text-[10px] font-black skeu-text-muted capitalize ">Manage your company details and tax information for invoices.</p>
              </div>
            </div>

            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Name */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Company Name</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={billingCompany}
                        onChange={(e) => setBillingCompany(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax ID */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Tax ID / VAT Details</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={billingTaxId}
                        onChange={(e) => setBillingTaxId(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="e.g. GSTIN123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Billing First Name</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>
                </div>

                {/* Surname */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Billing Last Name</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={billingSurname}
                        onChange={(e) => setBillingSurname(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Email */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Billing Email Address</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="Enter billing email"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Company Address</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <History className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                </div>

                {/* Postal Code */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Postal Code</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={billingPostalCode}
                        onChange={(e) => setBillingPostalCode(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                </div>

                {/* City */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">City</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <Grid3X3 className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-4">
                  <div className="relative group">
                    <span className="text-[10px] font-black text-slate-400 capitalize pl-1 mb-1 block">Country / Region</span>
                    <div className="skeu-input-container w-full h-14 bg-white rounded-xl border border-white flex items-center gap-3 relative transition-all group-focus-within:border-red-100 px-1">
                      <div className="w-10 h-10 rounded-[5px] bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm ml-2">
                        <Globe className="w-5 h-5" />
                      </div>
                      <select
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 font-bold text-sm h-full appearance-none pr-10"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Germany">Germany</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <button type="submit" className="px-10 py-3.5 skeu-btn text-[14px] font-black uppercase tracking-wider active:scale-95 transition-all">Save Billing Info</button>
              </div>
            </form>
          </div>

          <div className="bg-[#f0f0f0] rounded-[8px] p-5 space-y-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-[5px] flex items-center justify-center relative skeu-gloss">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-normal skeu-text-primary ">Security & Password</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black skeu-text-muted capitalize  pl-1">New Password</label>
                <div className="relative group">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-[5px] shadow-sm flex items-center justify-center text-[#dc2626] transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input type="password" value={accPassword} onChange={(e) => setAccPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-10 py-4 bg-white rounded-[6px] text-[13px] font-bold text-slate-800 outline-none border border-slate-100 shadow-[0_2px_8_px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-red-500/10 transition-shadow" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 skeu-text-muted hover:skeu-text-primary transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black skeu-text-muted capitalize  pl-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-[5px] shadow-sm flex items-center justify-center text-[#dc2626] transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input type="password" value={accConfirmPassword} onChange={(e) => setAccConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-10 py-4 bg-white rounded-[6px] text-[13px] font-bold text-slate-800 outline-none border border-slate-100 shadow-[0_2px_8_px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-red-500/10 transition-shadow" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 skeu-text-muted hover:skeu-text-primary transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            <button onClick={handleUpdatePassword} className="px-5 py-2.5 skeu-btn text-[13px] font-medium capitalize active:scale-95 transition-all">
              Update Password
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-[#f0f0f0] rounded-[8px] p-6 space-y-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 skeu-hero-icon text-white rounded-[5px] flex items-center justify-center relative skeu-gloss shadow-inner">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-normal skeu-text-primary ">Active Subscription</h3>
                  {isTrial && (
                    <span className="px-2 py-0.5 bg-red-100 text-[#dc2626] rounded text-[9px] font-black uppercase tracking-wider animate-pulse shadow-sm">7-Day Trial</span>
                  )}
                </div>
                <p className="text-[10px] font-black skeu-text-muted capitalize ">Manage your current billing cycles and plan status.</p>
              </div>
              <div className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isExpired ? 'Expired' : (currentUser?.subscription?.is_active ? 'Active' : 'Pending')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-white rounded-[8px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-red-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[5px] bg-red-50 flex items-center justify-center text-[#dc2626] border border-red-100 shadow-sm">
                    <Grid3X3 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 capitalize ">Plan Name</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                  {isTrial ? '7-Day Trial' : (currentUser?.subscription?.plan_details?.name || currentUser?.plan || 'Free Plan')}
                </h3>
              </div>

              <div className="p-5 bg-white rounded-[8px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-red-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[5px] bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 shadow-sm">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 capitalize ">Renewal / Expiry</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800">{currentUser?.subscription?.expiry_date ? new Date(currentUser.subscription.expiry_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}</h3>
              </div>

              <div className="p-5 bg-white rounded-[8px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3 relative overflow-hidden group hover:border-red-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[5px] bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 capitalize ">Current Price</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                  {isTrial ? '$0.00 (Trial)' : (currentUser?.plan === 'pro' ? '$29 / mo' : currentUser?.plan === 'enterprise' ? '$99 / mo' : '$0.00')}
                </h3>
              </div>
            </div>

            <div className="p-6 bg-white rounded-[8px] border border-slate-100 shadow-inner space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[5px] bg-red-50 flex items-center justify-center text-[#dc2626] border border-red-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-700 ">Time Remaining</h4>
                    <p className="text-[10px] font-bold text-slate-400 capitalize ">Days left until your next renewal or expiry.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-800 ">{daysLeft}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Days Left</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{100 - Math.min(100, Math.round((daysLeft / 30) * 100))}% Used</span>
                </div>
                <div className="h-4 w-full bg-slate-50 border border-slate-200/50 rounded-full overflow-hidden shadow-inner p-1">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 shadow-sm transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round((daysLeft / 30) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setView('billing')}
                className="px-6 py-3 skeu-btn text-[14px] font-medium capitalize flex items-center gap-2 group active:scale-95 transition-all"
              >
                Upgrade Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Purchase History Section */}
          <div className="bg-[#f0f0f0] rounded-[8px] p-6 space-y-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 skeu-hero-icon text-white rounded-[5px] flex items-center justify-center relative skeu-gloss shadow-inner">
                <History className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-normal skeu-text-primary ">Purchase History</h3>
                <p className="text-[10px] font-black skeu-text-muted capitalize ">A detailed record of your past transactions and invoices.</p>
              </div>
            </div>

            <div className="bg-white rounded-[8px] border border-slate-100 shadow-inner overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[5px] bg-slate-100 flex items-center justify-center text-slate-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 px-2 bg-red-50 text-[#dc2626] rounded-[5px] text-[9px] font-black uppercase border border-red-100">
                          {isTrial ? '7-Day Trial' : (currentUser?.subscription?.plan_details?.name || currentUser?.plan || 'Free Plan')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-slate-800">{isTrial ? '$0.00' : (currentUser?.plan === 'pro' ? '$29.00' : '$0.00')}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">
                        <div className="w-1 h-1 rounded-full bg-green-500" />
                        Success
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={handleDownloadInvoice}
                        className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-[#dc2626] rounded-[5px] border border-slate-100 transition-all active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Toast Notification */}
              {showInvoiceToast && (
                <div className="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 fade-in duration-500 font-lato">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${invoiceToastType === 'trial'
                    ? 'bg-red-500/20 text-red-500 border-red-500/30'
                    : 'bg-green-500/20 text-green-500 border-green-500/30'
                    }`}>
                    {invoiceToastType === 'trial' ? <History className="w-6 h-6" /> : <Check className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black">
                      {invoiceToastType === 'trial' ? 'Trial Subscription' : 'Invoice Ready'}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400">
                      {invoiceToastType === 'trial'
                        ? 'Official invoices are only issued for paid plans.'
                        : 'PDF successfully generated and downloaded.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty state fallback if no real data */}
              {!currentUser?.subscription && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-[5px] flex items-center justify-center mx-auto text-slate-300">
                    <Receipt className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 capitalize">No recent transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
