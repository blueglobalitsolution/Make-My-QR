import React, { useState, useEffect } from 'react';
import { generateQRWithFrame } from '../utils/qrCaptureUtils';
import { FileRecord, WizardState, BusinessConfig, BusinessButton, GeneratedCode, Folder, OpeningHours, LocationConfig, ContactInfo } from '../../types';
import { QR_TYPES_CONFIG } from '../../components/constants';
import { saveCode, updateCode, updateCodeImage } from '../api/qrcodes';
import { saveFile } from '../services/fileStorage';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const INITIAL_HOURS: OpeningHours = DAYS.reduce((acc, day) => ({
  ...acc,
  [day]: { isOpen: day !== 'sunday', slots: [{ start: '09:00', end: '17:00' }] }
}), {} as OpeningHours);

const INITIAL_LOCATION: LocationConfig = {
  address: '',
  streetNumberFirst: false,
  street: '',
  number: '',
  zipCode: '',
  city: '',
  state: '',
  country: '',
};

const INITIAL_CONTACT: ContactInfo = {
  name: '',
  phones: [],
  emails: [],
  websites: [],
};

export interface UseWizardReturn {
  wizard: WizardState;
  setWizard: React.Dispatch<React.SetStateAction<WizardState>>;
  activeDesignSection: string | null;
  setActiveDesignSection: React.Dispatch<React.SetStateAction<string | null>>;
  isTransparent: boolean;
  setIsTransparent: React.Dispatch<React.SetStateAction<boolean>>;
  useFgGradient: boolean;
  setUseFgGradient: React.Dispatch<React.SetStateAction<boolean>>;
  useBgGradient: boolean;
  setUseBgGradient: React.Dispatch<React.SetStateAction<boolean>>;
  whatsappPhone: string;
  setWhatsappPhone: React.Dispatch<React.SetStateAction<string>>;
  whatsappMessage: string;
  setWhatsappMessage: React.Dispatch<React.SetStateAction<string>>;
  pdfFileName: string | null;
  setPdfFileName: React.Dispatch<React.SetStateAction<string | null>>;
  pdfUrl: string | null;
  setPdfUrl: React.Dispatch<React.SetStateAction<string | null>>;
  pdfFileRecord: any;
  setPdfFileRecord: React.Dispatch<React.SetStateAction<any>>;
  handleNextStep: () => Promise<void>;
  handleBackStep: () => void;
  goToStep: (s: number) => void;
  toggleSection: (id: string) => void;
  updateBusinessField: (field: keyof BusinessConfig, val: any) => void;
  updateBusinessButton: (val: string) => void;
  addLink: () => void;
  addLinkByIcon: (iconName: string) => void;
  updateLink: (id: string, field: keyof BusinessButton, val: string) => void;
  removeLink: (id: string) => void;
  reorderLink: (id: string, direction: 'up' | 'down') => void;
  swapColors: () => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeletePdf: () => void;
  handleCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteCoverImage: () => void;
  startQrFromAsset: (file: FileRecord) => void;
  resetWizard: () => void;
  getQRValue: () => string;
  getPreviewValue: () => string;
  qrStylingOptions: any;
  selectedTypeConfig: any;
  whatsappCountryCode: string;
  setWhatsappCountryCode: React.Dispatch<React.SetStateAction<string>>;
  isProcessing: boolean;
}

const getInitialWizardState = (): WizardState => ({
  step: 1,
  mode: 'qr',
  type: 'website',
  value: '',
  name: '',
  isPasswordActive: false,
  is_protected: false,
  is_lead_capture: false,
  show_preview: true,
  password: '',
  folderId: undefined,
  business: {
    primaryColor: '#dc2626',
    secondaryColor: '#9DB3C2',
    pageBackgroundColor: '#dc2626',
    linkBackgroundColor: '#F7F7F7',
    linkTextColor: '#9DB3C2',
    company: 'My Company',
    title: 'Find me on social networks',
    subtitle: 'Discover our products & services',
    description: 'New content every week in the links below',
    buttons: [],
    openingHours: INITIAL_HOURS,
    images: [],
    location: INITIAL_LOCATION,
    contact: {
      name: 'John Smith',
      phones: [{ id: '1', label: 'Mobile', value: '+1 (555) 123-4567', type: 'phone' }],
      emails: [{ id: '1', label: 'Work', value: 'hello@mycompany.com', type: 'email' }],
      websites: [{ id: '1', label: 'Website', value: 'www.mycompany.com', type: 'website' }],
    },
    socialNetworks: [
      { network: 'facebook', url: '' },
      { network: 'instagram', url: '' },
      { network: 'twitter', url: '' },
    ] as any[],
    aboutCompany: "We are a passionate team dedicated to delivering the best service.",
    facilities: [],
    fontTitle: 'Inter',
    fontText: 'Inter',
    fontTitleColor: '#ffffff',
    fontTextColor: '#ffffff',
  },
  config: {
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'M',
    borderRadius: 5,
    pattern: 'square',
    cornerType: 'square',
    cornersSquareType: 'square',
    cornersSquareColor: '#000000',
    cornersDotType: 'square',
    cornersDotColor: '#000000',
    frame: 'none'
  }
});

export const useWizard = (
  history: GeneratedCode[],
  setHistory: React.Dispatch<React.SetStateAction<GeneratedCode[]>>,
  folders: Folder[],
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>,
  editingId: string | null,
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>,
  setView: React.Dispatch<React.SetStateAction<any>>,
  showAlert?: (title: string, message: string, type?: 'info' | 'danger') => void,
  currentUser?: import('../../types').User | null
): UseWizardReturn => {
  const [wizard, setWizard] = useState<WizardState>(getInitialWizardState());
  const [activeDesignSection, setActiveDesignSection] = useState<string | null>(null);
  const [isTransparent, setIsTransparent] = useState(false);
  const [useFgGradient, setUseFgGradient] = useState(false);
  const [useBgGradient, setUseBgGradient] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('84606 87490');
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('91');
  const [whatsappMessage, setWhatsappMessage] = useState('Hello! I scanned your QR code.');
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFileRecord, setPdfFileRecord] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Bug Fix: Reset context-specific content when type changes in Step 1 to prevent data carry-over
  useEffect(() => {
    if (wizard.step === 1) {
      setPdfFileName(null);
      setPdfUrl(null);
      setPdfFileRecord(null);
      setWizard(prev => ({
        ...prev,
        value: '',
        business: getInitialWizardState().business
      }));
    }
  }, [wizard.type]);

  const getPreviewValue = () => {
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;

    if (wizard.type === 'whatsapp') {
      const cleanPhone = whatsappPhone.replace(/\s+/g, '').replace(/\+/g, '');
      const cleanCC = whatsappCountryCode.replace(/\s+/g, '').replace(/\+/g, '');
      return `https://wa.me/${cleanCC}${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    }
    let val = wizard.value || `${window.location.origin}/preview`;
    if (wizard.type === 'website' && val && !val.startsWith('http') && !val.startsWith('/') && !val.startsWith('mailto:')) {
      val = `https://${val}`;
    }
    return val.startsWith('/') ? backendUrl + val : val;
  };

  const getQRValue = () => {
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;

    if (editingId) {
      const code = history.find(h => h.id === editingId);
      if (code) {
        const slug = code.shortSlug || (code as any).short_slug;
        if (slug) {
          return `${backendUrl}/r/${slug}`;
        }
      }
    }

    return getPreviewValue();
  };

  const qrStylingOptions = {
    data: getQRValue(),
    dotsOptions: {
      color: wizard.config.fgColor,
      type: wizard.config.pattern as any,
      gradient: useFgGradient ? {
        type: 'linear',
        colorStops: [{ offset: 0, color: wizard.config.fgColor }, { offset: 1, color: '#dc2626' }]
      } : undefined
    },
    backgroundOptions: { color: isTransparent ? 'transparent' : wizard.config.bgColor },
    cornersSquareOptions: {
      type: (wizard.config.cornersSquareType || 'square') as any,
      color: wizard.config.cornersSquareColor || wizard.config.fgColor
    },
    cornersDotOptions: {
      type: (wizard.config.cornersDotType || 'square') as any,
      color: wizard.config.cornersDotColor || wizard.config.fgColor
    },
    image: wizard.config.logoUrl,
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
  };

  const selectedTypeConfig = QR_TYPES_CONFIG.find(t => t.id === wizard.type) || QR_TYPES_CONFIG[0];

  const handleNextStep = async () => {
    if (isProcessing) return;

    // Ensure user is authenticated before proceeding
    if (!currentUser) {
      const msg = "Authentication credentials were not provided. Please log in again to save your progress.";
      if (showAlert) showAlert("Authentication Error", msg, "danger");
      else alert(msg);
      return;
    }

    // Check QR limit if creating new code
    if (!editingId && currentUser?.subscription?.plan_details) {
      if (history.length >= currentUser.subscription.plan_details.qr_limit) {
        const msg = `You have reached your limit of ${currentUser.subscription.plan_details.qr_limit} QR codes. Upgrade your plan to create more.`;
        if (showAlert) showAlert("Limit Reached", msg, "danger");
        else alert(msg);
        return;
      }
    }

    // 1. Calculate the final value (destination) based on current wizard state
    let finalValue = '';

    if (wizard.type === 'business') {
      const businessData = wizard.business;
      const businessProfileData = {
        ...businessData,
        id: 'temp',
        company: businessData?.company || 'My Company',
        logo: businessData?.images?.[0] || '',
        headline: businessData?.title || '',
        title: businessData?.title || '',
        subtitle: businessData?.subtitle || '',
        primaryColor: businessData?.primaryColor || '#dc2626',
        secondaryColor: businessData?.secondaryColor || '#9DB3C2',
        fontTitle: businessData?.fontTitle || 'Inter',
        fontText: businessData?.fontText || 'Inter',
        buttons: businessData?.buttons || [],
        phones: businessData?.contact?.phones?.filter(p => p.value) || [],
        emails: businessData?.contact?.emails?.filter(e => e.value) || [],
        websites: businessData?.contact?.websites?.filter(w => w.value) || [],
        address: businessData?.location?.searchAddress || '',
        openingHours: businessData?.openingHours || INITIAL_HOURS,
      };

      // Reuse existing profile ID if we're editing a code that already points to one
      let profileId = '';
      if (editingId) {
        const code = history.find(h => h.id === editingId);
        if (code?.value && code.value.includes('id=')) {
          profileId = code.value.split('id=')[1].split('&')[0];
        }
      }

      if (!profileId) {
        profileId = 'b' + Date.now().toString(36);
      }

      try {
        localStorage.setItem('business_' + profileId, JSON.stringify(businessProfileData));
      } catch (storageErr) {
        console.warn("Storage warning: Could not save to localStorage", storageErr);
      }
      finalValue = `/view/business?id=${profileId}`;
    } else if (wizard.type === 'pdf' || wizard.type === 'links') {
      finalValue = wizard.value || `${window.location.origin}/p/${Math.random().toString(36).substring(7)}`;
    } else if (wizard.type === 'whatsapp') {
      const cleanPhone = whatsappPhone.replace(/\s+/g, '');
      const cleanCC = whatsappCountryCode.replace(/\+/g, '');
      finalValue = `https://wa.me/${cleanCC}${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    } else {
      finalValue = wizard.value || `${window.location.origin}/preview`;
    }

    // 2. Step-specific logic
    if (wizard.step === 1) {
      setWizard(prev => ({ ...prev, step: 2 }));
    } else if (wizard.step === 2) {
      // Validate Step 2 content before proceeding
      const isWebsiteInvalid = wizard.type === 'website' && !wizard.value;
      const isPdfInvalid = wizard.type === 'pdf' && !pdfUrl;
      const isWhatsappInvalid = wizard.type === 'whatsapp' && !whatsappPhone;
      const isBusinessInvalid = wizard.type === 'business' && !wizard.business?.company;

      if (isWebsiteInvalid || isPdfInvalid || isWhatsappInvalid || isBusinessInvalid) {
        const msg = "Please provide the required content before moving to the next step.";
        if (showAlert) showAlert("Validation Error", msg, "danger");
        else alert(msg);
        return;
      }

      setWizard(prev => ({ ...prev, step: 3 }));
    } else if (wizard.step === 3) {
      setIsProcessing(true);

      const { mapQRCodeData } = await import('../api/mappers');
      const sanitizedFolderId = (wizard.folderId && !String(wizard.folderId).startsWith('f')) ? wizard.folderId : undefined;
      const codePayload = {
        folder: sanitizedFolderId,
        type: wizard.mode,
        category: wizard.type,
        is_dynamic: true,
        name: wizard.name || `My ${selectedTypeConfig.name}`,
        value: finalValue,
        is_protected: wizard.is_protected,
        password: wizard.password,
        is_lead_capture: wizard.is_lead_capture,
        show_preview: wizard.show_preview,
        settings: {
          ...wizard.config,
          business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined
        }
      };

      // --- Optimistic UI Update ---
      const optimisticId = editingId || `temp_${Date.now()}`;
      const optimisticCode: GeneratedCode = {
        id: optimisticId,
        userId: currentUser?.id || '0',
        name: codePayload.name,
        value: codePayload.value,
        category: wizard.type,
        type: wizard.mode,
        status: 'active',
        scans: editingId ? (history.find(h => h.id === editingId)?.scans || 0) : 0,
        createdAt: new Date().toISOString(),
        isDynamic: true,
        show_preview: wizard.show_preview,
        settings: codePayload.settings,
        imageUrl: editingId ? (history.find(h => h.id === editingId)?.imageUrl) : undefined,
        isOptimistic: true
      };

      const backupHistory = [...history];
      const backupFolders = [...folders];

      // Update UI and switch view immediately
      if (editingId) {
        setHistory(prev => prev.map(h => h.id === editingId ? optimisticCode : h));
      } else {
        setHistory(prev => [optimisticCode, ...prev]);
        if (wizard.folderId) {
          setFolders(prev => prev.map(f => f.id === wizard.folderId ? { ...f, count: (f.count || 0) + 1 } : f));
        }
      }

      setView('my_codes');
      setWizard(prev => ({ ...prev, step: 1, value: '', name: '', folderId: undefined }));
      setEditingId(null);

      try {
        let savedData;
        if (editingId) {
          savedData = await updateCode(editingId, codePayload);
        } else {
          savedData = await saveCode(codePayload);
        }

        const realCode = mapQRCodeData(savedData);

        // Success: Replace optimistic item with server data
        setHistory(prev => {
          const targetId = editingId || optimisticId;
          return prev.map(h => h.id === targetId ? realCode : h);
        });

        // Background: Generate higher-fidelity QR image
        const currentCodeId = realCode.id;
        const slug = realCode.shortSlug;
        const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
        const qrValue = slug ? `${backendUrl}/r/${slug}` : finalValue;

        try {
          const qrImage = await generateQRWithFrame(qrValue, wizard.config);
          if (qrImage) {
            const imageUrl = await updateCodeImage(currentCodeId, qrImage);
            setHistory(prev => prev.map(h => h.id === currentCodeId ? { ...h, imageUrl: imageUrl } : h));
          }
        } catch (imgErr) {
          console.error('Failed to generate QR image:', imgErr);
        }
      } catch (err) {
        // Error: Rollback state
        setHistory(backupHistory);
        setFolders(backupFolders);
        const errorMsg = (err as any)?.response?.data?.detail || (err as any)?.response?.data?.error || (err as any).message || "Unknown error";
        console.error("Save failed", err);
        if (showAlert) showAlert("Error", `Failed to save QR code: ${errorMsg}`, "danger");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleBackStep = () => {
    if (wizard.step === 1) {
      setView('my_codes');
      return;
    }
    const prevStep = Math.max(1, wizard.step - 1) as 1 | 2 | 3;
    setWizard({ ...wizard, step: prevStep });
  };

  const goToStep = (s: number) => {
    if (s < wizard.step) {
      setWizard({ ...wizard, step: s as any });
    }
  };

  const toggleSection = (id: string) => {
    setActiveDesignSection(activeDesignSection === id ? null : id);
  };

  const updateBusinessField = (field: keyof BusinessConfig, val: any) => {
    setWizard(prev => ({
      ...prev,
      business: prev.business ? { ...prev.business, [field]: val } : undefined
    }));
  };

  const updateBusinessButton = (val: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newButtons = [...prev.business.buttons];
      if (newButtons.length > 0) {
        newButtons[0] = { ...newButtons[0], text: val };
      } else {
        newButtons.push({ id: '1', text: val, url: '', icon: 'globe' });
      }
      return { ...prev, business: { ...prev.business, buttons: newButtons } };
    });
  };

  const addLink = () => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newLinks = [...prev.business.buttons, { id: Date.now().toString(), text: 'New Profile', url: '', icon: 'globe' }];
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const addLinkByIcon = (iconName: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newLinks = [...prev.business.buttons, { id: Date.now().toString(), text: 'Follow us', url: '', icon: iconName }];
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const updateLink = (id: string, field: keyof BusinessButton, val: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newLinks = prev.business.buttons.map(b => b.id === id ? { ...b, [field]: val } : b);
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const removeLink = (id: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      return { ...prev, business: { ...prev.business, buttons: prev.business.buttons.filter(b => b.id !== id) } };
    });
  };

  const reorderLink = (id: string, direction: 'up' | 'down') => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const index = prev.business.buttons.findIndex(b => b.id === id);
      if (index === -1) return prev;
      const newLinks = [...prev.business.buttons];
      if (direction === 'up' && index > 0) {
        [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
      } else if (direction === 'down' && index < newLinks.length - 1) {
        [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
      }
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const swapColors = () => {
    if (!wizard.business) return;
    setWizard(prev => ({
      ...prev,
      business: prev.business ? {
        ...prev.business,
        primaryColor: prev.business.secondaryColor,
        secondaryColor: prev.business.primaryColor
      } : undefined
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const limitMb = currentUser?.subscription?.plan_details?.upload_limit_mb || 5;
      if (file.size > limitMb * 1024 * 1024) {
        const msg = `Image is too large. Your plan allows up to ${limitMb}MB.`;
        if (showAlert) showAlert("Upload Limit", msg, "danger");
        else alert(msg);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setWizard({ ...wizard, config: { ...wizard.config, logoUrl: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const limitMb = currentUser?.subscription?.plan_details?.upload_limit_mb || 5;
      if (file.size > limitMb * 1024 * 1024) {
        const msg = `File is too large. Your plan allows up to ${limitMb}MB uploads. Upgrade your plan for higher limits.`;
        if (showAlert) showAlert("Upload Limit Reached", msg, "danger");
        else alert(msg);
        return;
      }
      setPdfFileName(file.name);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(file));

      try {
        const folderIdStr = wizard.folderId;
        const folderId = folderIdStr ? parseInt(folderIdStr) : undefined;
        const fileRecord = await saveFile(file, folderId);
        setPdfFileRecord(fileRecord);
        // Direct users to our internal PDF viewer
        setWizard(prev => ({
          ...prev,
          value: fileRecord.filePath
        }));
      } catch (err) {
        console.error("PDF upload failed", err);
        alert("Failed to upload PDF. Please try again.");
      }
    }
  };

  const handleDeletePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setPdfFileName(null);
    setPdfFileRecord(null);
    setWizard(prev => ({ ...prev, value: '' }));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const limitMb = currentUser?.subscription?.plan_details?.upload_limit_mb || 5;
      if (file.size > limitMb * 1024 * 1024) {
        const msg = `Image is too large. Your plan allows up to ${limitMb}MB.`;
        if (showAlert) showAlert("Upload Limit", msg, "danger");
        else alert(msg);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setWizard(prev => ({
          ...prev,
          business: prev.business ? { ...prev.business, images: [reader.result as string] } : undefined
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCoverImage = () => {
    setWizard(prev => ({
      ...prev,
      business: prev.business ? { ...prev.business, images: [] } : undefined
    }));
  };

  const startQrFromAsset = (file: FileRecord) => {
    setWizard(prev => ({
      ...prev,
      type: file.type === 'pdf' ? 'pdf' : 'website',
      value: file.type === 'pdf' ? file.filePath : `${window.location.origin}/view/business?id=${file.id}`,
      name: file.name,
      step: 2,
      folderId: file.folderId // Assuming FileRecord might have this or use active folder
    }));
    if (file.type === 'pdf') {
      setPdfFileName(file.name);
      setPdfFileRecord(file);
      setPdfUrl(file.filePath);
    }
    setView('wizard');
  };

  const resetWizard = () => {
    setWizard(getInitialWizardState());
    setWhatsappPhone('84606 87490');
    setWhatsappCountryCode('91');
    setWhatsappMessage('Hello! I scanned your QR code.');
    setPdfFileName(null);
    setPdfUrl(null);
    setPdfFileRecord(null);
    setActiveDesignSection(null);
  };

  return {
    wizard,
    setWizard,
    activeDesignSection,
    setActiveDesignSection,
    isTransparent,
    setIsTransparent,
    useFgGradient,
    setUseFgGradient,
    useBgGradient,
    setUseBgGradient,
    whatsappPhone,
    setWhatsappPhone,
    whatsappMessage,
    setWhatsappMessage,
    pdfFileName,
    setPdfFileName,
    pdfUrl,
    setPdfUrl,
    pdfFileRecord,
    setPdfFileRecord,
    handleNextStep,
    handleBackStep,
    goToStep,
    toggleSection,
    updateBusinessField,
    updateBusinessButton,
    addLink,
    addLinkByIcon,
    updateLink,
    removeLink,
    reorderLink,
    swapColors,
    handleLogoUpload,
    handlePdfUpload,
    handleCoverImageUpload,
    handleDeleteCoverImage,
    handleDeletePdf,
    startQrFromAsset,
    resetWizard,
    getQRValue,
    getPreviewValue,
    qrStylingOptions,
    selectedTypeConfig,
    whatsappCountryCode,
    setWhatsappCountryCode,
    isProcessing,
  };
};
