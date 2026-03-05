import React from 'react';
import { Plus, Grid3X3, UserCircle, CreditCard, LogOut, Barcode, FileText } from 'lucide-react';

interface SidebarProps {
  view: string;
  setView: (view: any) => void;
  setEditingId: (id: string | null) => void;
  resetWizard: () => void;
  setPhonePreviewMode: (mode: 'ui' | 'qr') => void;
  handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  setView,
  setEditingId,
  resetWizard,
  setPhonePreviewMode,
  handleLogout
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
    <aside className="fixed top-0 left-0 w-64 h-screen flex flex-col z-50 skeu-sidebar p-6 border-r border-[#fee2e2]">
      <div className="flex flex-col h-full space-y-10">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group px-2"
          onClick={() => setView('landing')}
        >
          <img src="/src/assets/logo-full.png" alt="MakeMyQR Logo" className="h-10 group-hover:scale-105 transition-transform" />
        </div>

        {/* Create QR Code Button */}
        <button
          onClick={() => handleNavClick('wizard')}
          className="w-full flex items-center justify-center gap-3 py-4 skeu-btn text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create QR Code</span>
        </button>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          <p className="text-[10px] font-black skeu-text-muted uppercase tracking-[0.2em] pl-4 mb-4 opacity-70">Main Menu</p>
          {[
            { id: 'my_codes', name: 'My QR Codes', icon: Grid3X3 },
            { id: 'account', name: 'My Account', icon: UserCircle },
            { id: 'billing', name: 'Billing', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-black transition-all ${view === item.id
                ? 'skeu-tag-active scale-[1.02]'
                : 'skeu-tag hover:skeu-text-primary'
                }`}
            >
              <item.icon className={`w-5 h-5 ${view === item.id ? 'text-white' : 'skeu-text-accent'}`} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-6 border-t border-[#fee2e2]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-[13px] font-black skeu-text-muted hover:skeu-text-secondary active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
