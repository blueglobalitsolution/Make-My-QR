import React from 'react';
import { Plus, Grid3X3, UserCircle, CreditCard, LogOut, Barcode, FileText, BarChart3, X } from 'lucide-react';
import { User } from '../../../types';

interface SidebarProps {
  view: string;
  setView: (view: any) => void;
  setEditingId: (id: string | null) => void;
  resetWizard: () => void;
  setPhonePreviewMode: (mode: 'ui' | 'qr') => void;
  handleLogout: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  currentUser: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  setView,
  setEditingId,
  resetWizard,
  setPhonePreviewMode,
  handleLogout,
  isOpen,
  setIsOpen,
  currentUser
}) => {
  // Force a re-render at midnight to update the "days remaining" counter
  const [, setMidnightRefresh] = React.useState(0);
  React.useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msToMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setMidnightRefresh(prev => prev + 1);
    }, msToMidnight);

    return () => clearTimeout(timer);
  }, [setMidnightRefresh]);

  const handleNavClick = (itemId: string) => {
    if (isExpired && itemId !== 'billing' && itemId !== 'account') {
      setView('billing');
      setIsOpen?.(false);
      return;
    }
    if (itemId === 'wizard') {
      setEditingId(null);
      resetWizard();
      setPhonePreviewMode('ui');
    }
    setView(itemId as any);
  };

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

    // Calculate difference based on calendar days
    const expiryDate = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Add 1 to include the current day as "remaining"
    return Math.max(0, diffDays + 1);
  };

  const daysLeft = getDaysRemaining();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 w-64 h-screen flex flex-col z-[70] skeu-sidebar p-6 border-r border-[#fee2e2] transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full space-y-10 relative">
          {/* Close Button for Mobile */}
          <button
            onClick={() => setIsOpen?.(false)}
            className="lg:hidden absolute top-0 -right-2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group px-2"
            onClick={() => { setView('my_codes'); setIsOpen?.(false); }}
          >
            <img src="/src/assets/logo-full.png" alt="MakeMyQR Logo" className="h-10 group-hover:scale-105 transition-transform" />
          </div>



          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {/* Trial expired banner */}
            {isExpired && (
              <div className="mx-2 mb-6 p-5 rounded-2xl bg-red-50/50 border border-red-100/50 shadow-sm animate-in zoom-in duration-500 text-center">
                <h4 className="text-[14px] font-black text-red-600 mb-4">Free Trial Expired</h4>
                <button
                  onClick={() => setView('billing')}
                  className="w-full py-3 bg-[#dc2626] text-white rounded-xl text-[13px] font-black shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95 transform"
                >
                  Upgrade
                </button>
              </div>
            )}

            {[
              { id: 'my_codes', name: 'My QR Codes', icon: Grid3X3 },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              { id: 'account', name: 'My Account', icon: UserCircle },
              { id: 'billing', name: 'Billing', icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                disabled={isExpired && item.id !== 'billing' && item.id !== 'account'}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[15px] text-[13px] font-semibold transition-all font-poppins group ${isExpired && item.id !== 'billing' && item.id !== 'account' ? 'opacity-40 grayscale cursor-not-allowed' : ''
                  } ${view === item.id
                    ? 'skeu-tag-active scale-[1.02]'
                    : 'skeu-tag hover:bg-[#dc2626] hover:text-white'
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${view === item.id ? 'text-white' : 'skeu-text-accent group-hover:text-white'}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Trial Badge bottom */}
          {isTrial && !isExpired && (
            <div className="mx-2 mb-2 p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600">7-Day Free Trial</span>
              </div>
              <p className="text-[11px] font-bold text-red-800 leading-tight mb-1">
                {daysLeft} days remaining in your premium trial.
              </p>
              {currentUser?.subscription?.expiry_date && (
                <p className="text-[9px] font-medium text-red-600/60">
                  Ends on {new Date(currentUser.subscription.expiry_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          )}

          {/* Logout */}
          <div className="pt-6 border-t border-[#fee2e2]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 text-[13px] font-semibold skeu-text-muted hover:skeu-text-secondary active:scale-95 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
