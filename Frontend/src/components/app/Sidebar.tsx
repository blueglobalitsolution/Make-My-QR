import React from 'react';
import { Plus, Grid3X3, UserCircle, CreditCard, LogOut, Barcode, FileText } from 'lucide-react';
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
    <aside className="fixed top-0 left-0 w-64 h-screen flex flex-col z-50 bg-white border-r border-slate-100">
      <div className="px-6 py-6 flex flex-col h-full">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 mb-8 cursor-pointer group"
          onClick={() => setView('landing')}
        >
          <div className="bg-[#156295] p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Barcode className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-[#0F172A] tracking-tight">
            QR <span className="text-[#156295]">code.io</span>
          </h1>
        </div>

        {/* Create QR Code Button */}
        <button
          onClick={() => handleNavClick('wizard')}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all mb-6 bg-white text-[#156295] border-2 border-[#156295] hover:bg-[#156295] hover:text-white"
        >
          <Plus className="w-4 h-4" />
          <span>Create QR Code</span>
        </button>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {[
            { id: 'my_codes', name: 'My QR Codes', icon: Grid3X3 },
            { id: 'my_files', name: 'Assets Library', icon: FileText },
            { id: 'account', name: 'My Account', icon: UserCircle },
            { id: 'billing', name: 'Billing', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${view === item.id
                ? 'bg-blue-50 text-[#156295] font-bold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
            >
              <item.icon className={`w-5 h-5 ${view === item.id ? 'text-[#156295]' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 text-sm font-medium hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
