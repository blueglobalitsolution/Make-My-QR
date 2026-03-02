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
    <aside className="fixed top-0 left-0 w-64 skeu-sidebar h-screen flex flex-col z-50 shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => setView('landing')}>
          <div className="skeu-hero-icon p-1.5 rounded-lg relative"><Barcode className="text-white w-5 h-5" /></div>
          <h1 className="text-xl font-black skeu-text-primary tracking-tight">QR <span className="skeu-text-accent">code.io</span></h1>
        </div>
        <nav className="space-y-1">
          {[
            { id: 'wizard', name: 'Create QR Code', icon: Plus },
            { id: 'my_codes', name: 'My QR Codes', icon: Grid3X3 },
            { id: 'account', name: 'My Account', icon: UserCircle },
            { id: 'billing', name: 'Billing', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium text-sm transition-all ${view === item.id ? 'skeu-sidebar-item-active skeu-text-accent' : 'skeu-sidebar-item skeu-text-secondary'}`}
            >
              <item.icon className="w-4 h-4" /> {item.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-black/5 flex-shrink-0">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 skeu-text-secondary font-medium text-sm hover:text-red-700 skeu-sidebar-item transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};
