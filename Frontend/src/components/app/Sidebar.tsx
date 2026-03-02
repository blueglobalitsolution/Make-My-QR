import React from 'react';
import { Plus, Grid3X3, UserCircle, CreditCard, LogOut, Barcode } from 'lucide-react';
import { INITIAL_HOURS, INITIAL_LOCATION } from '../../../components/constants';

interface SidebarProps {
  view: string;
  setView: (view: any) => void;
  setEditingId: (id: string | null) => void;
  setWizard: (wizard: any) => void;
  setPhonePreviewMode: (mode: 'ui' | 'qr') => void;
  handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  setView,
  setEditingId,
  setWizard,
  setPhonePreviewMode,
  handleLogout
}) => {
  const getInitialWizardState = () => ({
    step: 1,
    mode: 'qr',
    type: 'website',
    value: '',
    name: '',
    isPasswordActive: false,
    password: '',
    folderId: undefined,
    business: {
      primaryColor: '#156295',
      secondaryColor: '#9DB3C2',
      pageBackgroundColor: '#156295',
      linkBackgroundColor: '#F7F7F7',
      linkTextColor: '#9DB3C2',
      company: 'My Company',
      title: 'Find me on social networks',
      subtitle: '',
      description: 'New content every week in the links below',
      buttons: [
        { id: '1', text: 'My Website', url: '#', icon: 'globe' }
      ],
      openingHours: INITIAL_HOURS,
      images: [],
      location: INITIAL_LOCATION,
      contact: { phones: [], emails: [] },
      socialNetworks: [],
      aboutCompany: "",
      facilities: [],
      fontTitle: 'Inter',
      fontText: 'Inter',
      fontTitleColor: '#ffffff',
      fontTextColor: '#ffffff',
      welcomeScreenImage: undefined,
    },
    config: {
      fgColor: '#000000',
      bgColor: '#ffffff',
      level: 'H',
      borderRadius: 0,
      pattern: 'square',
      cornerType: 'square',
      cornersSquareType: 'square',
      cornersSquareColor: '#000000',
      cornersDotType: 'square',
      cornersDotColor: '#000000',
      frame: 'none'
    }
  });

  const handleNavClick = (itemId: string) => {
    if (itemId === 'wizard') {
      setEditingId(null);
      setWizard(getInitialWizardState());
      setPhonePreviewMode('ui');
    }
    setView(itemId as any);
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen flex flex-col z-50 bg-white border-r border-slate-100/80 shadow-[1px_0_40px_rgba(15,23,42,0.02)]">
      <div className="p-10 flex flex-col h-full">
        {/* logo */}
        <div
          className="flex items-center gap-3.5 mb-14 cursor-pointer group active:scale-95 transition-all"
          onClick={() => setView('landing')}
        >
          <div className="bg-[#156295] p-2.5 rounded-2xl shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-all duration-500">
            <Barcode className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">
              QR <span className="text-[#156295]">Studio</span>
            </h1>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1 ml-0.5">Professional</span>
          </div>
        </div>

        {/* nav */}
        <nav className="space-y-3 flex-1">
          <button
            onClick={() => handleNavClick('wizard')}
            className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all mb-8 overflow-hidden group relative active:scale-95 ${view === 'wizard'
                ? 'bg-[#156295] text-white shadow-2xl shadow-blue-500/30'
                : 'bg-blue-50/40 text-[#156295] hover:bg-blue-50 border border-blue-100/30'
              }`}
          >
            {view === 'wizard' && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
            <Plus className={`w-5 h-5 ${view === 'wizard' ? 'text-white' : 'text-[#156295]'}`} />
            <span>Create New QR</span>
          </button>

          <div className="space-y-1.5 pb-6">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4 pl-4">Dashboard</h3>
            {[
              { id: 'my_codes', name: 'My QR Library', icon: Grid3X3 },
              { id: 'account', name: 'Profile Settings', icon: UserCircle },
              { id: 'billing', name: 'Plan & Billing', icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all group active:scale-95 ${view === item.id
                    ? 'bg-slate-50 text-[#156295] shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 hover:translate-x-1'
                  }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${view === item.id ? 'bg-white shadow-sm text-[#156295]' : 'bg-transparent text-slate-300 group-hover:text-slate-400'
                  }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.name}</span>
                {view === item.id && <div className="ml-auto w-1.5 h-1.5 bg-[#156295] rounded-full animate-pulse" />}
              </button>
            ))}
          </div>
        </nav>

        {/* footer */}
        <div className="pt-8 border-t border-slate-50 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-red-500 hover:bg-red-50/50 rounded-2xl transition-all group"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 group-hover:bg-red-100/50">
              <LogOut className="w-4 h-4 transition-colors" />
            </div>
            <span>Logout Studio</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
