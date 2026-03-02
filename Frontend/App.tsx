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

  const wizardProps = useWizard(history, setHistory, folders, setFolders, editingId, setEditingId, setView);
  const { wizard, setWizard, whatsappPhone, setWhatsappPhone, whatsappMessage, setWhatsappMessage, pdfFileName, pdfUrl, activeDesignSection, setActiveDesignSection, isTransparent, setIsTransparent, useFgGradient, setUseFgGradient, qrStylingOptions, selectedTypeConfig, handleNextStep, handleBackStep, toggleSection, updateBusinessField, updateBusinessButton, addLink, addLinkByIcon, updateLink, removeLink, reorderLink, swapColors, handleLogoUpload, handlePdfUpload, handleCoverImageUpload, getQRValue } = wizardProps;

  const filteredHistory = history.filter(item => {
    const matchesFolder = activeFolderId === 'all' || item.folderId === activeFolderId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  // Sync view changes to URL history
  useEffect(() => {
    const currentPath = window.location.pathname.slice(1) || 'landing';
    const isSpecialView = ['pdf_viewer', 'business_profile'].includes(view);

    if (view !== currentPath && !isSpecialView) {
      const newPath = view === 'landing' ? '/' : `/${view}`;
      window.history.pushState({ view }, '', newPath);
    }
  }, [view]);

  useEffect(() => {
    const init = async () => {
      const { initDatabase } = await import('./src/utils/database');
      await initDatabase();

      const { initBusinessProfilesDB, getAllBusinessProfiles } = await import('./src/services/businessProfile');
      await initBusinessProfilesDB();

      const profiles = await getAllBusinessProfiles();
      setBusinessProfiles(profiles);

      // Restore user state from local storage and fetch associated data
      const savedUserStr = localStorage.getItem('barqr_user');
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          auth.setCurrentUser(user);
          if (user.savedPalettes) setSavedPalettes([...user.savedPalettes]);

          // Auto-redirect to dashboard if logged in and at root or landing/auth
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/landing' || currentPath === '/auth') {
            setView('my_codes');
          }

          const [historyData, foldersData] = await Promise.all([getCodes(), getFolders()]);
          setHistory(historyData);
          setFolders(foldersData);
        } catch (err) {
          console.error("Session restoration error", err);
          localStorage.removeItem('barqr_user'); // Clean up corrupted session
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const rawPath = window.location.pathname;
      const path = rawPath.slice(1) || 'landing';
      const searchParams = new URLSearchParams(window.location.search);
      setIsStandaloneView(searchParams.get('standalone') === 'true');

      if (rawPath.startsWith('/view/file/')) {
        setCurrentPdfFileId(rawPath.replace('/view/file/', ''));
        setView('pdf_viewer');
        return;
      }

      if (rawPath.startsWith('/view/business')) {
        setCurrentBusinessProfileId('url-data');
        setView('business_profile');
        return;
      }

      const validViews: ViewState[] = [
        'landing', 'auth', 'wizard', 'my_codes', 'account', 'billing',
        'register', 'forgot_password', 'dashboard', 'analytics'
      ];

      if (validViews.includes(path as any)) {
        setView(path as any);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

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
    <div className="h-screen flex skeu-app-bg overflow-hidden font-inter">
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

      <main className={`flex-1 flex flex-col h-full relative ${view !== 'landing' && view !== 'auth' && view !== 'forgot_password' && view !== 'register' && !isStandaloneView ? 'ml-64' : 'w-full'}`}>
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
          <Wizard
            {...wizardProps}
            folders={folders}
            isCreatingFolder={isCreatingFolder}
            setIsCreatingFolder={setIsCreatingFolder}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            createNewFolder={createNewFolder}
            phonePreviewMode={phonePreviewMode}
            setPhonePreviewMode={setPhonePreviewMode}
          />
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

export default App;
