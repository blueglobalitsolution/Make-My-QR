import React, { useState, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Folder as FolderIcon, ChevronDown, Globe, FileText, Link as LinkIcon, MessageCircle, Briefcase, Grid3X3, Plus, X, Check, Trash2, Upload, Palette as PaletteIcon, Info, CheckCheck, Star } from 'lucide-react';
import { ViewState, WizardState, GeneratedCode, Folder, Palette } from './types';
import { StyledQRCode } from './components/StyledQRCode';
import { QRFrameWrapper } from './components/QRFrameWrapper';
import BusinessProfileViewer from './components/BusinessProfileViewer';
import { getCodes } from './src/api/qrcodes';
import { getFolders } from './src/api/folders';
import { getInitialBusinessProfile } from './src/services/businessProfile';

import { Sidebar } from './src/components/app/Sidebar';
import { BottomNav } from './src/components/app/BottomNav';
import { Landing } from './src/components/app/Landing';
import { AuthViews } from './src/components/app/AuthViews';
import { MyCodes } from './src/components/app/MyCodes';
import { Wizard } from './src/components/app/Wizard';
import { Billing } from './src/components/app/Billing';
import { Account } from './src/components/app/Account';
import { Analytics } from './src/components/app/Analytics';
import { Payment } from './src/components/app/Payment';
import { ConfirmModal } from './src/components/app/ConfirmModal';

import { useAuth } from './src/hooks/useAuth';
import { useWizard } from './src/hooks/useWizard';
import { PublicScan } from './src/components/app/PublicScan';
import QRViewer from './src/components/app/QRViewer';
import { AdminLogin } from './src/components/app/AdminLogin';
import { AdminDashboard } from './src/components/app/AdminDashboard';

const App: React.FC = () => {
  // Initialize view and IDs directly from URL to avoid mount race conditions and sync loops
  const getInitialRouteState = () => {
    const rawPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    const id = searchParams.get('id');
    // Handles /view/business or //view/business
    if (/^\/*view\/business/.test(rawPath.slice(1)) || id) {
      return { view: 'business_profile' as ViewState, businessId: id || 'url-data' };
    }

    const path = rawPath.slice(1).split('?')[0] || 'landing';
    if (path === 'public/scan') return { view: 'public_scan' as ViewState, businessId: null };

    // Handle /view/:slug and /view/file/:slug for QR code landing pages
    if (path.startsWith('view/')) {
      const parts = path.split('/');
      // Handle /view/file/:slug (file viewer)
      if (parts[1] === 'file' && parts[2]) {
        return { view: 'qr_viewer' as ViewState, businessId: parts[2], fileMode: true };
      }
      // Handle /view/:slug (regular QR viewer)
      const slug = parts[1];
      if (slug && slug !== 'business' && slug !== 'file') {
        return { view: 'qr_viewer' as ViewState, businessId: slug, fileMode: false };
      }
    }

    const validViews: ViewState[] = [
      'landing', 'auth', 'wizard', 'my_codes', 'account', 'billing', 'payment',
      'register', 'forgot_password', 'dashboard', 'analytics', 'public_scan',
      'qr_viewer', 'admin_login', 'admin_dashboard'
    ];

    return {
      view: (validViews.includes(path as any) ? path : 'landing') as ViewState,
      businessId: null as string | null,
      fileMode: false,
    };
  };

  const initialState = getInitialRouteState();
  const [view, setView] = useState<ViewState>(initialState.view);
  const [phonePreviewMode, setPhonePreviewMode] = useState<'ui' | 'qr'>('qr');
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [currentBusinessProfileId, setCurrentBusinessProfileId] = useState<string | null>(initialState.businessId);
  const [isFileMode, setIsFileMode] = useState<boolean>((initialState as any).fileMode || false);
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);

  const [viewData, setViewData] = useState<any>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'danger' | 'info';
    confirmText?: string;
    showCancel?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showAlert = (title: string, message: string, type: 'danger' | 'info' = 'info') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => {},
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'info' = 'danger', confirmText = 'Confirm') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      showCancel: true,
      onConfirm,
    });
  };

  const auth = useAuth((v: ViewState) => setView(v), showAlert);


  const handleSetView = (v: ViewState, data?: any) => {
    setView(v);
    if (data) setViewData(data);
  };

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


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const wizardProps = useWizard(history, setHistory, folders, setFolders, editingId, setEditingId, setView, showAlert);
  const { wizard, setWizard, whatsappPhone, setWhatsappPhone, whatsappMessage, setWhatsappMessage, pdfFileName, pdfUrl, setPdfUrl, setPdfFileName, activeDesignSection, setActiveDesignSection, isTransparent, setIsTransparent, useFgGradient, setUseFgGradient, qrStylingOptions, selectedTypeConfig, handleNextStep, handleBackStep, toggleSection, updateBusinessField, updateBusinessButton, addLink, addLinkByIcon, updateLink, removeLink, reorderLink, swapColors, handleLogoUpload, handlePdfUpload, handleCoverImageUpload, getQRValue, startQrFromAsset, resetWizard } = wizardProps;

  const filteredHistory = history.filter(item => {
    const matchesFolder = activeFolderId === 'all' || 
                         (activeFolderId === 'general' 
                           ? !folders.some(f => f.id === item.folderId) 
                           : item.folderId === activeFolderId);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });
  const foldersWithQRCounts = folders.map(f => ({
    ...f,
    count: history.filter(c => c.folderId === f.id).length
  }));

  // Sync view changes to URL history
  useEffect(() => {
    const rawPath = window.location.pathname;
    const isSpecialPath = rawPath.startsWith('/view/business') || rawPath.startsWith('/public/scan') || rawPath.startsWith('/view/');
    const isSpecialView = view === 'business_profile' || view === 'public_scan' || view === 'qr_viewer';

    // Skip if we are on a special view path (deep linking) to avoid overriding with base view
    if (isSpecialPath && isSpecialView) return;

    const currentPath = rawPath.slice(1).split('?')[0] || 'landing';
    if (view !== currentPath && !isSpecialView) {
      const newPath = view === 'landing' ? '/' : `/${view}`;
      window.history.pushState({ view }, '', newPath);
    }
  }, [view]);

  const refreshData = async () => {
    try {
      const [historyData, foldersData] = await Promise.all([getCodes(), getFolders()]);

      // Map backend data (snake_case) to frontend types (camelCase)
      const mappedHistory = (Array.isArray(historyData) ? historyData : []).map((code: any) => ({
        ...code,
        id: code.id.toString(),
        folderId: code.folder?.toString(),
        shortSlug: code.short_slug,
        isDynamic: code.is_dynamic,
        isLeadCapture: code.is_lead_capture,
        password: code.password,
        createdAt: code.created_at,
        userId: code.user?.toString()
      }));

      setHistory(mappedHistory);
      if (Array.isArray(foldersData)) {
        setFolders(foldersData.map((f: any) => ({ ...f, id: f.id.toString() })));
      }
    } catch (err: any) {
      console.error("Failed to fetch library data", err);
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        showAlert("Connection Error", "Backend Connection Refused: Please ensure the Django server is running on port 8010 and accessible.", "danger");
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const { initBusinessProfilesDB, getAllBusinessProfiles } = await import('./src/services/businessProfile');
      await initBusinessProfilesDB();

      const profiles = await getAllBusinessProfiles();
      setBusinessProfiles(profiles);

      // Restore user state from local storage
      const savedUserStr = localStorage.getItem('makemyqr_user') || localStorage.getItem('barqr_user');
      const savedToken = localStorage.getItem('makemyqr_token');

      if (savedUserStr && savedToken) {
        try {
          const user = JSON.parse(savedUserStr);
          auth.setCurrentUser(user);
          if (user.savedPalettes) setSavedPalettes([...user.savedPalettes]);

          // Auto-redirect to dashboard if logged in and at root or landing/auth
          const currentPath = window.location.pathname;
          const isViewPath = currentPath.startsWith('/view/');

          if (!isViewPath && (currentPath === '/' || currentPath === '/landing' || currentPath === '/auth')) {
            setView('my_codes');
          }

          await refreshData();
        } catch (err) {
          console.error("Session restoration error", err);
          localStorage.removeItem('makemyqr_user');
          localStorage.removeItem('makemyqr_token');
        }
      }
    };
    init();
  }, []);

  // Trigger refresh when user changes (e.g., after login)
  useEffect(() => {
    if (auth.currentUser && history.length === 0) {
      refreshData();
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const handleRouteChange = async () => {
      const rawPath = window.location.pathname;
      // Only handle numeric file IDs (old file viewer), not QR code slugs
      if (rawPath.startsWith('/view/file/')) {
        const id = rawPath.replace('/view/file/', '').split('?')[0];
        // Check if id is numeric (file ID) vs alphanumeric (QR slug)
        if (/^\d+$/.test(id)) {
          const { getFile } = await import('./src/services/fileStorage');
          const fileData = await getFile(id);
          if (fileData?.record.filePath) {
            window.location.href = fileData.record.filePath;
            return;
          }
        }
        // If not numeric, let it render as QR viewer (file mode)
      }

      const state = getInitialRouteState();
      setView(state.view);
      setCurrentBusinessProfileId(state.businessId);
      setIsFileMode((state as any).fileMode || false);
    };

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange(); // Handle initial load redirection if needed
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const deleteCode = (id: string) => {
    const code = history.find(h => h.id === id);
    if (!code) return;

    showConfirm(
      'Delete QR Code',
      `Are you sure you want to delete "${code.name}"? This action cannot be undone.`,
      async () => {
        const { deleteCode: apiDeleteCode } = await import('./src/api/qrcodes');
        try {
          await apiDeleteCode(id);
          setHistory(prev => prev.filter(h => h.id !== id));
          if (code.folderId) {
            setFolders(prev => prev.map(f => f.id === code.folderId ? { ...f, count: Math.max(0, (f.count || 0) - 1) } : f));
          }
        } catch (err) { showAlert("Error", "Failed to delete QR code.", "danger"); }
      }
    );
  };

  const downloadCode = async (code: GeneratedCode, format: 'png' | 'svg' = 'png', captureElement?: HTMLElement) => {
    // Handle high-fidelity download with frame from capture element
    if (captureElement) {
      try {
        const targetElement = captureElement.firstElementChild as HTMLElement || captureElement;
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(targetElement, {
          backgroundColor: code.settings?.bgColor || '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${code.name || 'qr-code'}.png`;
        link.click();
        return;
      } catch (err) {
        console.error('Capture download failed, falling back to other methods:', err);
      }
    }

    // If we have a frame and it's not 'none', use our unified generator for high-fidelity
    const frame = code.settings?.frame || 'none';
    if (frame !== 'none' && format === 'png') {
      try {
        const { generateQRWithFrame } = await import('./src/utils/qrCaptureUtils');
        const slug = code.shortSlug || (code as any).short_slug;
        const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
        let qrValue = slug ? `${backendUrl}/r/${slug}` : code.value;
        if (qrValue.startsWith('/')) qrValue = backendUrl + qrValue;

        const dataUrl = await generateQRWithFrame(qrValue, code.settings);
        if (dataUrl) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${code.name || 'qr-code'}.png`;
          link.click();
          return;
        }
      } catch (err) {
        console.error('Unified frame generation failed:', err);
      }
    }

    if (code.imageUrl && format === 'png') {
      try {
        const response = await fetch(code.imageUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${code.name || 'qr-code'}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
        return;
      } catch (err) {
        console.error('Failed to download from imageUrl:', err);
      }
    }

    const slug = code.shortSlug || (code as any).short_slug;
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
    let qrValue = slug ? `${backendUrl}/r/${slug}` : code.value;
    if (qrValue.startsWith('/')) qrValue = backendUrl + qrValue;
    const qr = new QRCodeStyling({
      width: 1000,
      height: 1000,
      data: qrValue,
      dotsOptions: { color: code.settings.fgColor, type: code.settings.pattern },
      backgroundOptions: { color: code.settings.bgColor },
      cornersSquareOptions: { type: code.settings.cornersSquareType as any, color: code.settings.cornersSquareColor },
      cornersDotOptions: { type: code.settings.cornersDotType as any, color: code.settings.cornersDotColor },
      image: code.settings.logoUrl,
      imageOptions: { crossOrigin: "anonymous", margin: 10 }
    });
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

    // Handle PDF type - get the PDF URL from code.value or settings
    let pdfUrlValue: string | null = null;
    let pdfFileNameValue: string | null = null;
    if (code.category === 'pdf') {
      // code.value contains the PDF path/URL
      const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
      const pdfPath = code.value;
      // Construct full URL if it's a relative path
      pdfUrlValue = pdfPath?.startsWith('http') ? pdfPath :
        pdfPath?.startsWith('/') ? `${backendUrl}${pdfPath}` :
          pdfPath || null;
      // Extract filename from path
      if (pdfUrlValue) {
        const pathParts = pdfUrlValue.split('/');
        pdfFileNameValue = pathParts[pathParts.length - 1] || 'document.pdf';
      }
    }

    setWizard({
      ...wizard,
      step: 2,
      mode: code.type,
      type: code.category as any,
      value: (code.category === 'whatsapp' || code.category === 'business') ? '' : code.value,
      name: code.name,
      isPasswordActive: false,
      is_protected: (code as any).is_protected || false,
      password: (code as any).password || '',
      is_lead_capture: (code as any).is_lead_capture || false,
      folderId: code.folderId,
      config: code.settings,
      business: code.settings.business || wizard.business
    });

    // Set PDF URL and filename for PDF type
    if (code.category === 'pdf') {
      setPdfUrl(pdfUrlValue);
      setPdfFileName(pdfFileNameValue);
    }

    setPhonePreviewMode('ui');
    setView('wizard');
  };

  const deleteFolder = (id: string) => {
    const folder = folders.find(f => f.id === id);
    if (!folder) return;

    const codeCount = history.filter(c => (c as any).folder === id || c.folderId === id).length;
    const message = codeCount > 0
      ? `This folder contains ${codeCount} QR codes. Deleting it will move all codes to the General folder. Are you sure?`
      : `Are you sure you want to delete "${folder.name}"?`;

    showConfirm(
      'Delete Folder',
      message,
      async () => {
        const { deleteFolder: apiDeleteFolder } = await import('./src/api/folders');
        try {
          await apiDeleteFolder(id);
          setFolders(prev => prev.filter(f => f.id !== id));
          setHistory(prev => prev.map(c => (c.folderId === id || (c as any).folder === id) ? { ...c, folderId: undefined } : c));
          if (activeFolderId === id) setActiveFolderId('all');
        } catch (err) { showAlert("Error", "Failed to delete folder.", "danger"); }
      }
    );
  };

  const viewPdf = (fileId: string) => {
    // Redesigned shareable flow: try to find the direct path from history
    const code = history.find(h => h.value.includes(fileId));
    const slug = code?.shortSlug || (code as any)?.short_slug;
    if (code && slug) {
      // Use the new branded landing page (/view/:slug)
      const newPath = `/view/${slug}`;
      window.history.pushState({ view: 'qr_viewer' }, '', newPath);
      setView('qr_viewer');
      setCurrentBusinessProfileId(slug);
    } else if (code && !code.value.includes('/view/file/')) {
      window.open(code.value, '_blank');
    } else {
      // Fallback or old link
      window.open(`/view/file/${fileId}`, '_blank');
    }
  };

  const onNewQR = () => {
    setEditingId(null);
    resetWizard();
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
    } catch (err) { showAlert("Error", "Failed to create folder.", "danger"); }
  };

  return (
    <div className="h-screen flex skeu-app-bg overflow-hidden font-inter">
      {view !== 'landing' && view !== 'auth' && view !== 'forgot_password' && view !== 'register' && view !== 'business_profile' && view !== 'public_scan' && view !== 'qr_viewer' && view !== 'admin_login' && view !== 'admin_dashboard' && (
        <Sidebar
          view={view}
          setView={(v) => { setView(v); setIsSidebarOpen(false); }}
          setEditingId={setEditingId}
          resetWizard={resetWizard}
          setPhonePreviewMode={setPhonePreviewMode}
          handleLogout={auth.handleLogout}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}

      {/* Bottom Navigation for Mobile */}
      {view !== 'landing' && view !== 'auth' && view !== 'forgot_password' && view !== 'register' && view !== 'business_profile' && view !== 'public_scan' && view !== 'qr_viewer' && view !== 'admin_login' && view !== 'admin_dashboard' && (
        <BottomNav
          view={view}
          setView={handleSetView}
          resetWizard={resetWizard}
          setEditingId={setEditingId}
          setPhonePreviewMode={setPhonePreviewMode}
        />
      )}

      <main className={`flex-1 flex flex-col h-full relative overflow-y-auto pb-32 lg:pb-0 ${view !== 'landing' && view !== 'auth' && view !== 'forgot_password' && view !== 'register' && view !== 'business_profile' && view !== 'public_scan' && view !== 'qr_viewer' && view !== 'admin_login' && view !== 'admin_dashboard' ? `skeu-main-content ${view === 'wizard' ? '' : 'px-responsive'}` : 'w-full'}`}>
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
            folders={foldersWithQRCounts}
            activeFolderId={activeFolderId}
            setActiveFolderId={setActiveFolderId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredHistory={filteredHistory}
            deleteCode={deleteCode}
            deleteFolder={deleteFolder}
            downloadCode={downloadCode}
            startEditing={startEditing}
            createNewFolder={createNewFolder}
            isCreatingFolder={isCreatingFolder}
            setIsCreatingFolder={setIsCreatingFolder}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            setView={handleSetView}
            viewPdf={viewPdf}
            onNewQR={onNewQR}
          />
        )}

        {view === 'wizard' && (
          <Wizard
            {...wizardProps}
            folders={foldersWithQRCounts}
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

        {view === 'billing' && <Billing setView={handleSetView} />}

        {view === 'business_profile' && currentBusinessProfileId && <BusinessProfileViewer profileId={currentBusinessProfileId} />}

        {view === 'public_scan' && <PublicScan setView={handleSetView} />}

        {view === 'qr_viewer' && currentBusinessProfileId && (
          <QRViewer slug={currentBusinessProfileId} setView={handleSetView} isFileMode={isFileMode} />
        )}

        {view === 'analytics' && <Analytics />}
        {view === 'payment' && <Payment setView={handleSetView} selectedPlan={viewData} />}
        {view === 'admin_login' && <AdminLogin setView={handleSetView} />}
        {view === 'admin_dashboard' && <AdminDashboard setView={handleSetView} />}
      </main>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        showCancel={confirmModal.showCancel}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default App;
