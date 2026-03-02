import React, { useState, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Folder as FolderIcon, ChevronDown, Globe, FileText, Link as LinkIcon, MessageCircle, Briefcase, Grid3X3, Plus, X, Check, Trash2, Upload, Palette as PaletteIcon, Info, CheckCheck, Star } from 'lucide-react';
import { ViewState, WizardState, GeneratedCode, Folder, Palette } from './types';
import { StyledQRCode } from './components/StyledQRCode';
import { QRFrameWrapper } from './components/QRFrameWrapper';
import { PdfViewer } from './components/PdfViewer';
import BusinessProfileViewer from './components/BusinessProfileViewer';
import { getCodes } from './src/api/qrcodes';
import { getFolders } from './src/api/folders';
import { getInitialBusinessProfile } from './src/services/businessProfile';

import { Sidebar } from './src/components/app/Sidebar';
import { Landing } from './src/components/app/Landing';
import { AuthViews } from './src/components/app/AuthViews';
import { MyCodes } from './src/components/app/MyCodes';
import { Wizard } from './src/components/app/Wizard';
import { Account } from './src/components/app/Account';
import { Billing } from './src/components/app/Billing';

import { useAuth } from './src/hooks/useAuth';
import { useWizard } from './src/hooks/useWizard';
import { useCodes } from './src/hooks/useCodes';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [isStandaloneView, setIsStandaloneView] = useState(false);
  const [phonePreviewMode, setPhonePreviewMode] = useState<'ui' | 'qr'>('ui');
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [currentPdfFileId, setCurrentPdfFileId] = useState<string | null>(null);
  const [currentBusinessProfileId, setCurrentBusinessProfileId] = useState<string | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);

  const auth = useAuth(setView);
  const [wizard, setWizard] = useState<WizardState>({
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
      buttons: [{ id: '1', text: 'My Website', url: '#', icon: 'globe' }],
      openingHours: { monday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] }, tuesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] }, wednesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] }, thursday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] }, friday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] }, saturday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] }, sunday: { isOpen: false, slots: [{ start: '09:00', end: '17:00' }] } },
      images: [],
      location: { searchAddress: '', streetNumberFirst: false, street: '', number: '', postalCode: '', city: '', state: '', country: '' },
      contact: { name: '', phones: [], emails: [], websites: [] },
      socialNetworks: [],
      aboutCompany: '',
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const [history, setHistory] = useState<GeneratedCode[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'f1', name: 'Marketing Campaigns', count: 0, createdAt: new Date().toISOString() },
    { id: 'f2', name: 'Social Media', count: 0, createdAt: new Date().toISOString() },
  ]);
  const [activeFolderId, setActiveFolderId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [whatsappPhone, setWhatsappPhone] = useState('84606 87490');
  const [whatsappMessage, setWhatsappMessage] = useState('Hello! I scanned your QR code.');
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFileRecord, setPdfFileRecord] = useState<any>(null);
  const [activeDesignSection, setActiveDesignSection] = useState<string | null>(null);
  const [isTransparent, setIsTransparent] = useState(false);
  const [useFgGradient, setUseFgGradient] = useState(false);
  const [useBgGradient, setUseBgGradient] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { initDatabase } = await import('./src/utils/database');
      await initDatabase();

      const { initBusinessProfilesDB, getAllBusinessProfiles } = await import('./src/services/businessProfile');
      await initBusinessProfilesDB();

      const profiles = await getAllBusinessProfiles();
      setBusinessProfiles(profiles);
    };
    init();

    const savedUserStr = localStorage.getItem('barqr_user');
    if (savedUserStr) {
      const user = JSON.parse(savedUserStr);
      auth.setCurrentUser(user);
      if (user.savedPalettes) setSavedPalettes([...user.savedPalettes]);

      const fetchData = async () => {
        try {
          const [historyData, foldersData] = await Promise.all([getCodes(), getFolders()]);
          setHistory(historyData);
          setFolders(foldersData);
        } catch (err) {
          console.error("Failed to fetch user data from backend", err);
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (wizard.step === 2) {
      if (wizard.type === 'links' || wizard.type === 'pdf') {
        setActiveDesignSection('design');
      } else if (wizard.type === 'business') {
        setActiveDesignSection('business_design');
      } else {
        setActiveDesignSection('content');
      }
    }
  }, [wizard.step, wizard.type]);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const isStandalone = searchParams.get('standalone') === 'true';
      setIsStandaloneView(isStandalone);

      const pdfMatch = path.match(/^\/view\/file\/(.+)$/);
      if (pdfMatch) {
        setCurrentPdfFileId(pdfMatch[1]);
        setView('pdf_viewer');
        return;
      }

      const businessMatch = path.match(/^\/view\/business/);
      if (businessMatch) {
        setCurrentBusinessProfileId('url-data');
        setView('business_profile');
        return;
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const getQRValue = () => {
    if (wizard.type === 'whatsapp') {
      return `https://wa.me/${whatsappPhone.replace(/\s+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    }
    return wizard.value || "https://qr-code.io";
  };

  const qrStylingOptions = {
    data: getQRValue(),
    dotsOptions: {
      color: wizard.config.fgColor,
      type: wizard.config.pattern as any,
      gradient: useFgGradient ? { type: 'linear', colorStops: [{ offset: 0, color: wizard.config.fgColor }, { offset: 1, color: '#156295' }] } : undefined
    },
    backgroundOptions: { color: isTransparent ? 'transparent' : wizard.config.bgColor },
    cornersSquareOptions: { type: (wizard.config.cornersSquareType || 'square') as any, color: wizard.config.cornersSquareColor || wizard.config.fgColor },
    cornersDotOptions: { type: (wizard.config.cornersDotType || 'square') as any, color: wizard.config.cornersDotColor || wizard.config.fgColor },
    image: wizard.config.logoUrl,
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
  };

  const filteredHistory = history.filter(item => {
    const matchesFolder = activeFolderId === 'all' || item.folderId === activeFolderId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleNextStep = async () => {
    if (wizard.step === 3) {
      const { saveCode, updateCode } = await import('./src/api/qrcodes');
      let finalValue = '';

      if (wizard.type === 'business') {
        const businessData = wizard.business;
        const businessProfileData = { company: businessData?.company || '', logo: businessData?.images?.[0] || '', headline: businessData?.title || '', aboutCompany: businessData?.aboutCompany || '', phones: businessData?.contact?.phones?.filter((p: any) => p.value) || [], emails: businessData?.contact?.emails?.filter((e: any) => e.value) || [], address: businessData?.location?.searchAddress || '', openingHours: businessData?.openingHours || {}, socialNetworks: businessData?.socialNetworks?.filter((s: any) => s.url) || [], primaryColor: businessData?.primaryColor || '#156295', secondaryColor: businessData?.secondaryColor || '#9DB3C2', fontTitle: businessData?.fontTitle || 'Inter', fontText: businessData?.fontText || 'Inter' };
        const profileId = 'b' + Date.now().toString(36);
        localStorage.setItem('business_' + profileId, JSON.stringify(businessProfileData));
        finalValue = `https://stage.makemyqrcode.com//view/business?id=${profileId}&standalone=true`;
      } else if (wizard.type === 'pdf' || wizard.type === 'links') {
        finalValue = wizard.value || `https://qr-code.io/p/${Math.random().toString(36).substring(7)}`;
      } else if (wizard.type === 'whatsapp') {
        finalValue = `https://wa.me/${whatsappPhone.replace(/\s+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
      } else {
        finalValue = wizard.value || "https://qr-code.io";
      }

      if (editingId) {
        const existingCode = history.find(h => h.id === editingId);
        if (existingCode?.folderId !== wizard.folderId) {
          let updatedFolders = [...folders];
          if (existingCode?.folderId) updatedFolders = updatedFolders.map(f => f.id === existingCode.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f);
          if (wizard.folderId) updatedFolders = updatedFolders.map(f => f.id === wizard.folderId ? { ...f, count: f.count + 1 } : f);
          setFolders(updatedFolders);
          localStorage.setItem('barqr_folders', JSON.stringify(updatedFolders));
        }
        try {
          const updatedCode = await updateCode(editingId, { folder: wizard.folderId, category: wizard.type, name: wizard.name || `My QR`, value: finalValue, settings: { ...wizard.config, business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined } });
          setHistory(history.map(h => h.id === editingId ? { ...h, ...updatedCode, id: updatedCode.id.toString() } : h));
          setEditingId(null);
        } catch (err) { alert("Failed to update QR code."); }
      } else {
        try {
          const savedData = await saveCode({ folder: wizard.folderId, type: wizard.mode, category: wizard.type, name: wizard.name || `My QR`, value: finalValue, settings: { ...wizard.config, business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined } });
          const newCode: GeneratedCode = { ...savedData, id: savedData.id.toString() };
          setHistory([newCode, ...history]);
          if (wizard.folderId) setFolders(folders.map(f => f.id === wizard.folderId ? { ...f, count: f.count + 1 } : f));
        } catch (err) { alert("Failed to save QR code."); }
      }
      setView('my_codes');
      setWizard({ ...wizard, step: 1, value: '', name: '', folderId: undefined });
    } else {
      const nextStep = (wizard.step + 1) as 1 | 2 | 3;
      let nextWizard = { ...wizard, step: nextStep };
      if (nextStep === 3 && (wizard.type === 'pdf' || wizard.type === 'business' || wizard.type === 'links')) {
        if (!wizard.value) nextWizard.value = `https://qr-code.io/${wizard.type}/${Math.random().toString(36).substring(2, 9)}`;
      }
      setWizard(nextWizard);
      if (nextStep === 3) setPhonePreviewMode('qr');
    }
  };

  const handleBackStep = () => {
    const prevStep = Math.max(1, wizard.step - 1) as 1 | 2 | 3;
    if (wizard.step === 3 && prevStep === 2) setPhonePreviewMode('ui');
    setWizard({ ...wizard, step: prevStep });
  };

  const toggleSection = (id: string) => setActiveDesignSection(activeDesignSection === id ? null : id);

  const updateBusinessField = (field: keyof any, val: any) => setWizard(prev => ({ ...prev, business: prev.business ? { ...prev.business, [field]: val } : undefined }));

  const updateBusinessButton = (val: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newButtons = [...prev.business.buttons];
      if (newButtons.length > 0) newButtons[0] = { ...newButtons[0], text: val };
      else newButtons.push({ id: '1', text: val, url: '#', icon: 'globe' });
      return { ...prev, business: { ...prev.business, buttons: newButtons } };
    });
  };

  const addLink = () => setWizard(prev => ({ ...prev, business: prev.business ? { ...prev.business, buttons: [...prev.business.buttons, { id: Date.now().toString(), text: 'New Profile', url: '', icon: 'globe' }] } : undefined }));

  const addLinkByIcon = (iconName: string) => setWizard(prev => ({ ...prev, business: prev.business ? { ...prev.business, buttons: [...prev.business.buttons, { id: Date.now().toString(), text: 'Follow us', url: '', icon: iconName }] } : undefined }));

  const updateLink = (id: string, field: keyof any, val: string) => setWizard(prev => ({ ...prev, business: prev.business ? { ...prev.business, buttons: prev.business.buttons.map(b => b.id === id ? { ...b, [field]: val } : b) } : undefined }));

  const removeLink = (id: string) => setWizard(prev => ({ ...prev, business: prev.business ? { ...prev.business, buttons: prev.business.buttons.filter(b => b.id !== id) } : undefined }));

  const reorderLink = (id: string, direction: 'up' | 'down') => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const index = prev.business.buttons.findIndex(b => b.id === id);
      if (index === -1) return prev;
      const newLinks = [...prev.business.buttons];
      if (direction === 'up' && index > 0) [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
      else if (direction === 'down' && index < newLinks.length - 1) [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const swapColors = () => setWizard(prev => ({ ...prev, business: prev.business ? { ...prev.business, primaryColor: prev.business.secondaryColor, secondaryColor: prev.business.primaryColor } : undefined }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setWizard({ ...wizard, config: { ...wizard.config, logoUrl: reader.result as string } });
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(file));
      const { saveFile } = await import('./src/services/fileStorage');
      const fileRecord = await saveFile(file);
      setPdfFileRecord(fileRecord);
      setWizard(prev => ({ ...prev, value: `https://stage.makemyqrcode.com//view/file/${fileRecord.id}?standalone=true` }));
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setWizard(prev => ({ ...prev, business: prev.business ? { ...prev.business, images: [reader.result as string] } : undefined }));
      reader.readAsDataURL(file);
    }
  };

  const deleteCode = async (id: string) => {
    const { deleteCode: apiDeleteCode } = await import('./src/api/qrcodes');
    try {
      await apiDeleteCode(id);
      const codeToDelete = history.find(h => h.id === id);
      setHistory(history.filter(h => h.id !== id));
      if (codeToDelete?.folderId) setFolders(folders.map(f => f.id === codeToDelete.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f));
    } catch (err) { alert("Failed to delete QR code."); }
  };

  const downloadCode = (code: GeneratedCode, format: 'png' | 'svg' = 'png') => {
    const qr = new QRCodeStyling({ width: 1000, height: 1000, data: code.value, dotsOptions: { color: code.settings.fgColor, type: code.settings.pattern }, backgroundOptions: { color: code.settings.bgColor }, cornersSquareOptions: { type: code.settings.cornersSquareType as any, color: code.settings.cornersSquareColor }, cornersDotOptions: { type: code.settings.cornersDotType as any, color: code.settings.cornersDotColor }, image: code.settings.logoUrl, imageOptions: { crossOrigin: "anonymous", margin: 5 } });
    qr.download({ name: code.name || 'qr-code', extension: format });
  };

  const startEditing = (code: GeneratedCode) => {
    setEditingId(code.id);
    let whatsappPhoneEdit = whatsappPhone;
    let whatsappMessageEdit = whatsappMessage;
    if (code.category === 'whatsapp') {
      try { const url = new URL(code.value); whatsappPhoneEdit = url.pathname.replace('/', ''); whatsappMessageEdit = url.searchParams.get('text') || ''; } catch (e) { } 
    }
    setWhatsappPhone(whatsappPhoneEdit);
    setWhatsappMessage(whatsappMessageEdit);
    setWizard({ step: 2, mode: code.type, type: code.category as any, value: (code.category === 'whatsapp' || code.category === 'pdf' || code.category === 'business') ? '' : code.value, name: code.name, isPasswordActive: false, folderId: code.folderId, config: code.settings, business: code.settings.business || wizard.business });
    setPhonePreviewMode('ui');
    setView('wizard');
  };

  const createNewFolder = async () => {
    if (!newFolderName.trim()) return;
    const { createFolder: apiCreateFolder } = await import('./src/api/folders');
    try {
      const folderData = await apiCreateFolder(newFolderName.trim());
      const newFolder: Folder = { ...folderData, id: folderData.id.toString(), count: 0 };
      setFolders([...folders, newFolder]);
      setWizard({ ...wizard, folderId: newFolder.id });
      setNewFolderName('');
      setIsCreatingFolder(false);
    } catch (err) { alert("Failed to create folder."); }
  };

  const viewPdf = (fileId: string) => { setCurrentPdfFileId(fileId); setView('pdf_viewer'); };

  const resetWizard = () => ({
    step: 1, mode: 'qr', type: 'website', value: '', name: '', isPasswordActive: false, password: '', folderId: undefined,
    business: { primaryColor: '#156295', secondaryColor: '#9DB3C2', pageBackgroundColor: '#156295', linkBackgroundColor: '#F7F7F7', linkTextColor: '#9DB3C2', company: 'My Company', title: 'Find me on social networks', subtitle: '', description: 'New content every week in the links below', buttons: [{ id: '1', text: 'My Website', url: '#', icon: 'globe' }], openingHours: wizard.business?.openingHours || {}, images: [], location: wizard.business?.location || { searchAddress: '', streetNumberFirst: false, street: '', number: '', postalCode: '', city: '', state: '', country: '' }, contact: wizard.business?.contact || { name: '', phones: [], emails: [], websites: [] }, socialNetworks: [], aboutCompany: '', facilities: [], fontTitle: 'Inter', fontText: 'Inter', fontTitleColor: '#ffffff', fontTextColor: '#ffffff', welcomeScreenImage: undefined },
    config: { fgColor: '#000000', bgColor: '#ffffff', level: 'H', borderRadius: 0, pattern: 'square', cornerType: 'square', cornersSquareType: 'square', cornersSquareColor: '#000000', cornersDotType: 'square', cornersDotColor: '#000000', frame: 'none' }
  });

  return (
    <div className="min-h-screen flex skeu-app-bg overflow-hidden">
      {view !== 'landing' && view !== 'auth' && view !== 'forgot_password' && view !== 'register' && !isStandaloneView && (
        <Sidebar
          view={view}
          setView={setView}
          setEditingId={setEditingId}
          setWizard={setWizard}
          setPhonePreviewMode={setPhonePreviewMode}
          handleLogout={auth.handleLogout}
        />
      )}

      <main className={`flex-1 overflow-y-auto scrollbar-hide ${view !== 'landing' && view !== 'auth' && view !== 'forgot_password' && view !== 'register' && !isStandaloneView ? 'ml-64 w-[calc(100%-16rem)]' : 'w-full'}`}>
        {view === 'landing' && <Landing setView={setView} />}

        {(view === 'auth' || view === 'register' || view === 'forgot_password') && (
          <AuthViews
            view={view}
            setView={setView}
            loginEmail={auth.loginEmail}
            setLoginEmail={auth.setLoginEmail}
            loginPassword={auth.loginPassword}
            setLoginPassword={auth.setLoginPassword}
            showLoginPassword={auth.showLoginPassword}
            setShowLoginPassword={auth.setShowLoginPassword}
            handleAuth={auth.handleAuth}
            regName={auth.regName}
            setRegName={auth.setRegName}
            regLastName={auth.regLastName}
            setRegLastName={auth.setRegLastName}
            regEmail={auth.regEmail}
            setRegEmail={auth.setRegEmail}
            regPhone={auth.regPhone}
            setRegPhone={auth.setRegPhone}
            regPassword={auth.regPassword}
            setRegPassword={auth.setRegPassword}
            regConfirmPassword={auth.regConfirmPassword}
            setRegConfirmPassword={auth.setRegConfirmPassword}
            showRegPassword={auth.showRegPassword}
            setShowRegPassword={auth.setShowRegPassword}
            showRegConfirmPassword={auth.showRegConfirmPassword}
            setShowRegConfirmPassword={auth.setShowRegConfirmPassword}
            handleRegister={auth.handleRegister}
            resetStep={auth.resetStep}
            setResetStep={auth.setResetStep}
            resetEmail={auth.resetEmail}
            setResetEmail={auth.setResetEmail}
            resetOTP={auth.resetOTP}
            setResetOTP={auth.setResetOTP}
            resetTimer={auth.resetTimer}
            newPasswordReset={auth.newPasswordReset}
            setNewPasswordReset={auth.setNewPasswordReset}
            handleResetRequest={auth.handleResetRequest}
            handleResetVerify={auth.handleResetVerify}
            handleResetConfirm={auth.handleResetConfirm}
          />
        )}

        {view === 'my_codes' && (
          <MyCodes
            history={history}
            folders={folders}
            activeFolderId={activeFolderId}
            setActiveFolderId={setActiveFolderId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredHistory={filteredHistory}
            deleteCode={deleteCode}
            downloadCode={downloadCode}
            startEditing={startEditing}
            createNewFolder={createNewFolder}
            isCreatingFolder={isCreatingFolder}
            setIsCreatingFolder={setIsCreatingFolder}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            setView={setView}
            viewPdf={viewPdf}
          />
        )}

        {view === 'wizard' && (
          <div className="p-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
              <div className="lg:col-span-4 space-y-4">
                {wizard.step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-2">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">1. Select Type</h2>
                      <p className="text-slate-500 font-medium">Choose the type of QR code you want to create</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[
                        { id: 'website', name: 'Website', icon: 'Globe' },
                        { id: 'pdf', name: 'PDF', icon: 'FileText' },
                        { id: 'links', name: 'Links', icon: 'LinkIcon' },
                        { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle' },
                        { id: 'business', name: 'Business', icon: 'Briefcase' },
                        { id: 'vcard', name: 'vCard', icon: 'Grid3X3' },
                      ].map((type) => (
                        <button key={type.id} onClick={() => setWizard({ ...wizard, type: type.id as any })} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${wizard.type === type.id ? 'border-[#156295] bg-[#156295]/5 shadow-lg' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                          <span className={`font-bold text-sm ${wizard.type === type.id ? 'text-[#156295]' : 'text-slate-600'}`}>{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizard.step === 2 && (
                  <WizardContent
                    wizard={wizard}
                    setWizard={setWizard}
                    folders={folders}
                    activeDesignSection={activeDesignSection}
                    toggleSection={toggleSection}
                    updateBusinessField={updateBusinessField}
                    updateBusinessButton={updateBusinessButton}
                    addLink={addLink}
                    addLinkByIcon={addLinkByIcon}
                    updateLink={updateLink}
                    removeLink={removeLink}
                    reorderLink={reorderLink}
                    handleLogoUpload={handleLogoUpload}
                    handlePdfUpload={handlePdfUpload}
                    handleCoverImageUpload={handleCoverImageUpload}
                    pdfFileName={pdfFileName}
                    pdfUrl={pdfUrl}
                    isCreatingFolder={isCreatingFolder}
                    setIsCreatingFolder={setIsCreatingFolder}
                    newFolderName={newFolderName}
                    setNewFolderName={setNewFolderName}
                    createNewFolder={createNewFolder}
                    whatsappPhone={whatsappPhone}
                    setWhatsappPhone={setWhatsappPhone}
                    whatsappMessage={whatsappMessage}
                    setWhatsappMessage={setWhatsappMessage}
                  />
                )}

                {wizard.step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">3. Design the QR</h2>
                    <div className="text-slate-500">QR Design options...</div>
                  </div>
                )}

                <div className="bg-white/80 backdrop-blur-md border-t border-black/5 p-4 fixed bottom-0 left-64 right-0 z-50 flex justify-between items-center">
                  <button onClick={handleBackStep} disabled={wizard.step === 1} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-black uppercase text-[10px] flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    Back
                  </button>
                  <button onClick={handleNextStep} className="px-6 py-2.5 bg-[#156295] text-white rounded-lg font-black uppercase text-[10px] flex items-center gap-2 hover:bg-[#0E4677] shadow-md transition-all">
                    {wizard.step === 3 ? 'Save & Finish' : 'Next Step'}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 relative">
                <div className="fixed top-24 z-40 flex flex-col items-center gap-3" style={{ left: 'calc(16rem + (100% - 16rem) * 8 / 12 + (100% - 16rem) * 4 / 12 / 2 - 140px)', width: '280px' }}>
                  <div className="bg-[#156295] p-[3px] rounded-full shadow-sm flex items-center self-center overflow-hidden">
                    <button onClick={() => setPhonePreviewMode('ui')} className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${phonePreviewMode === 'ui' ? 'bg-white text-[#156295] shadow-md' : 'text-white/80 hover:text-white'}`}>Preview</button>
                    <button onClick={() => setPhonePreviewMode('qr')} className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${phonePreviewMode === 'qr' ? 'bg-white text-[#156295] shadow-md' : 'text-white/80 hover:text-white'}`}>QR code</button>
                  </div>
                  <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-[60]" />
                    <div className="w-full h-full bg-white relative flex flex-col">
                      <div className="px-8 pt-6 pb-2 flex justify-between items-center text-[10px] font-black text-white bg-slate-900 z-40">
                        <span>9:41</span>
                        <div className="flex gap-1.5 items-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>
                      </div>
                      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6">
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
                          <QRFrameWrapper frame={wizard.config.frame}>
                            <StyledQRCode options={qrStylingOptions} size={180} />
                          </QRFrameWrapper>
                        </div>
                        <h4 className="mt-10 text-xl font-black text-slate-800 text-center">{wizard.name || "My Secure QR"}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'account' && (
          <Account
            accFirstName={auth.accFirstName}
            setAccFirstName={auth.setAccFirstName}
            accLastName={auth.accLastName}
            setAccLastName={auth.setAccLastName}
            accEmail={auth.accEmail}
            setAccEmail={auth.setAccEmail}
            accPhone={auth.accPhone}
            setAccPhone={auth.setAccPhone}
            accPassword={auth.accPassword}
            setAccPassword={auth.setAccPassword}
            accConfirmPassword={auth.accConfirmPassword}
            setAccConfirmPassword={auth.setAccConfirmPassword}
            handleUpdateProfile={auth.handleUpdateProfile}
            handleUpdatePassword={auth.handleUpdatePassword}
          />
        )}

        {view === 'billing' && <Billing />}

        {view === 'pdf_viewer' && currentPdfFileId && <PdfViewer fileId={currentPdfFileId} onBack={() => { setCurrentPdfFileId(null); setView('my_codes'); }} />}

        {view === 'business_profile' && currentBusinessProfileId && <BusinessProfileViewer profileId={currentBusinessProfileId} onBack={() => { setCurrentBusinessProfileId(null); setView('my_codes'); }} />}
      </main>
    </div>
  );
};

const WizardContent: React.FC<any> = ({ wizard, setWizard, folders, activeDesignSection, toggleSection, updateBusinessField, updateBusinessButton, addLink, addLinkByIcon, updateLink, removeLink, reorderLink, handleLogoUpload, handlePdfUpload, handleCoverImageUpload, pdfFileName, pdfUrl, isCreatingFolder, setIsCreatingFolder, newFolderName, setNewFolderName, createNewFolder, whatsappPhone, setWhatsappPhone, whatsappMessage, setWhatsappMessage }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">2. Add Content</h2>
      
      {wizard.type === 'links' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('content')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center"><Info className="w-6 h-6" /></div>
                <div className="text-left"><h3 className="text-xl font-black text-slate-800">Content</h3></div>
              </div>
              <ChevronDown className={`w-5 h-5 ${activeDesignSection === 'content' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'content' && (
              <div className="p-8 space-y-4">
                <input type="text" placeholder="Page Title" value={wizard.business?.title || ''} onChange={(e: any) => updateBusinessField('title', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                {wizard.business?.buttons.map((link: any) => (
                  <div key={link.id} className="flex items-center gap-3">
                    <input type="text" value={link.text} onChange={(e: any) => updateLink(link.id, 'text', e.target.value)} placeholder="Link text" className="flex-1 px-4 py-3 bg-white border rounded-xl font-bold" />
                    <input type="text" value={link.url} onChange={(e: any) => updateLink(link.id, 'url', e.target.value)} placeholder="https://..." className="flex-1 px-4 py-3 bg-white border rounded-xl" />
                    <button onClick={() => removeLink(link.id)} className="p-3 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={addLink} className="text-blue-500 font-bold text-xs flex items-center gap-1"><Plus className="w-4 h-4" /> Add Link</button>
              </div>
            )}
          </div>
        </div>
      )}

      {wizard.type === 'whatsapp' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4">
          <input type="text" placeholder="Phone number" value={whatsappPhone} onChange={(e: any) => setWhatsappPhone(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold" />
          <textarea placeholder="Pre-filled message" value={whatsappMessage} onChange={(e: any) => setWhatsappMessage(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold" rows={4} />
        </div>
      )}

      {wizard.type === 'website' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4">
          <input type="text" placeholder="https://www.yourwebsite.com" value={wizard.value} onChange={(e: any) => setWizard({ ...wizard, value: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-xl" />
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <FolderIcon className="w-5 h-5 text-blue-500" />
          <span className="font-bold">Save to Folder</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {folders.map(folder => (
            <button key={folder.id} onClick={() => setWizard({ ...wizard, folderId: folder.id })} className={`p-4 rounded-2xl border-2 text-left ${wizard.folderId === folder.id ? 'border-blue-500 bg-blue-50' : 'border-slate-50'}`}>
              <span className="text-xs font-black">{folder.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
