import React from 'react';
import { Plus, Grid3X3, UserCircle, CreditCard, LogOut, Barcode, FileText, BarChart3, X } from 'lucide-react';

interface SidebarProps {
  view: string;
  setView: (view: any) => void;
  setEditingId: (id: string | null) => void;
  resetWizard: () => void;
  setPhonePreviewMode: (mode: 'ui' | 'qr') => void;
  handleLogout: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  setView,
  setEditingId,
  resetWizard,
  setPhonePreviewMode,
  handleLogout,
  isOpen,
  setIsOpen
}) => {
  const handleNavClick = (itemId: string) => {
    if (itemId === 'wizard') {
      setEditingId(null);
      resetWizard();
      setPhonePreviewMode('ui');
    }
    setView(itemId as any);
  };

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
            onClick={() => { setView('landing'); setIsOpen?.(false); }}
          >
            <img src="/src/assets/logo-full.png" alt="MakeMyQR Logo" className="h-10 group-hover:scale-105 transition-transform" />
          </div>



          {/* Navigation */}
          <nav className="space-y-3 flex-1">

            {[
              { id: 'my_codes', name: 'My QR Codes', icon: Grid3X3 },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              { id: 'account', name: 'My Account', icon: UserCircle },
              { id: 'billing', name: 'Billing', icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-semibold transition-all font-poppins group ${view === item.id
                  ? 'skeu-tag-active scale-[1.02]'
                  : 'skeu-tag hover:bg-[#3eb5a9] hover:text-white'
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${view === item.id ? 'text-white' : 'skeu-text-accent group-hover:text-white'}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

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
