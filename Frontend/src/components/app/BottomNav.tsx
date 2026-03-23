import React from 'react';
import { Grid3X3, BarChart3, Plus, UserCircle, CreditCard, LogOut } from 'lucide-react';

interface BottomNavProps {
  view: string;
  setView: (view: any) => void;
  resetWizard: () => void;
  setEditingId: (id: string | null) => void;
  setPhonePreviewMode: (mode: 'ui' | 'qr') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  view,
  setView,
  resetWizard,
  setEditingId,
  setPhonePreviewMode
}) => {
  const handleNavClick = (itemId: string) => {
    if (itemId === 'wizard') {
      setEditingId(null);
      resetWizard();
      setPhonePreviewMode('ui');
    }
    setView(itemId as any);
  };

  const navItems = [
    { id: 'my_codes', name: 'Home', icon: Grid3X3 },
    { id: 'analytics', name: 'Stats', icon: BarChart3 },
    { id: 'wizard', name: 'Create', icon: Plus, centerpiece: true },
    { id: 'account', name: 'Profile', icon: UserCircle },
    { id: 'billing', name: 'Plan', icon: CreditCard },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl px-6 py-3 pb-8 flex items-center justify-between pointer-events-auto shadow-[0_-15px_40px_rgba(0,0,0,0.06)] rounded-t-[2.5rem]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`flex flex-col items-center gap-1.5 transition-all relative ${
            item.centerpiece 
              ? 'bg-[#dc2626] text-white p-4 rounded-full -mt-12 shadow-2xl shadow-red-500/20 border-[5px] border-white active:scale-90 scale-110' 
              : `active:scale-95 ${view === item.id ? 'text-[#dc2626] scale-105' : 'text-slate-400'}`
          }`}
        >
          <item.icon className={`${item.centerpiece ? 'w-6 h-6' : 'w-[22px] h-[22px]'} ${view === item.id && !item.centerpiece ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          {!item.centerpiece && (
            <span className={`text-[10px] font-bold tracking-tight ${view === item.id ? 'opacity-100' : 'opacity-60'}`}>
              {item.name}
            </span>
          )}
          {view === item.id && !item.centerpiece && (
             <div className="absolute -top-1 right-0 w-1 h-1 bg-[#dc2626] rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
};
