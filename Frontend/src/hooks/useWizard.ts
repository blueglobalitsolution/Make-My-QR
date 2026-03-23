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
  searchAddress: '',
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
  startQrFromAsset: (file: FileRecord) => void;
  resetWizard: () => void;
  getQRValue: () => string;
  qrStylingOptions: any;
  selectedTypeConfig: any;
  whatsappCountryCode: string;
  setWhatsappCountryCode: React.Dispatch<React.SetStateAction<string>>;
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
    buttons: [
      { id: '1', text: 'View PDF', url: '', icon: 'globe' }
    ],
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
    welcomeScreenImage: undefined,
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

    if (wizard.type === 'whatsapp') {
      const cleanPhone = whatsappPhone.replace(/\s+/g, '');
      const cleanCC = whatsappCountryCode.replace(/\+/g, '');
      return `https://wa.me/${cleanCC}${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    }
    const val = wizard.value || `${window.location.origin}/preview`;
    return val.startsWith('/') ? backendUrl + val : val;
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
        company: businessData?.company || '',
        logo: businessData?.images?.[0] || '',
        headline: businessData?.title || '',
        title: businessData?.title || '',
        subtitle: businessData?.subtitle || '',
        aboutCompany: businessData?.aboutCompany || '',
        phones: businessData?.contact?.phones?.filter(p => p.value) || [],
        emails: businessData?.contact?.emails?.filter(e => e.value) || [],
        websites: businessData?.contact?.websites?.filter(w => w.value) || [],
        address: businessData?.location?.searchAddress || '',
        openingHours: businessData?.openingHours || INITIAL_HOURS,
        socialNetworks: businessData?.socialNetworks?.filter(s => s.url) || [],
        facilities: businessData?.facilities || [],
        welcomeScreenImage: businessData?.welcomeScreenImage || '',
        primaryColor: businessData?.primaryColor || '#dc2626',
        secondaryColor: businessData?.secondaryColor || '#9DB3C2',
        fontTitle: businessData?.fontTitle || 'Inter',
        fontText: businessData?.fontText || 'Inter',
        buttons: businessData?.buttons || [],
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

      localStorage.setItem('business_' + profileId, JSON.stringify(businessProfileData));
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
    if (wizard.step === 2) {
      console.log("Wizard: Saving progress at Step 2 to move to Step 3...");
      try {
        let savedData;
        if (editingId) {
          const sanitizedFolderId = (wizard.folderId && !String(wizard.folderId).startsWith('f')) ? wizard.folderId : undefined;
          savedData = await updateCode(editingId, {
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
            settings: { ...wizard.config, business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined }
          });

          const mappedNewData = { ...savedData, id: savedData.id.toString(), folderId: savedData.folder?.toString() };
          setHistory(prev => prev.map(h => h.id === editingId ? { ...h, ...mappedNewData } : h));
        } else {
          const sanitizedFolderId = (wizard.folderId && !String(wizard.folderId).startsWith('f')) ? wizard.folderId : undefined;
          savedData = await saveCode({
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
            settings: { ...wizard.config, business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined }
          });

          const newCode: GeneratedCode = { ...savedData, id: savedData.id.toString(), folderId: savedData.folder?.toString() };
          setHistory(prev => [newCode, ...prev]);
          setEditingId(newCode.id);

          if (wizard.folderId) {
            setFolders(prev => prev.map(f => f.id === wizard.folderId ? { ...f, count: f.count + 1 } : f));
          }

          try {
            const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
            const slug = savedData.shortSlug || savedData.short_slug;
            const qrValue = slug ? `${backendUrl}/r/${slug}` : finalValue;
            const qrImage = await generateQRWithFrame(qrValue, wizard.config);
            if (qrImage) {
              const imageUrl = await updateCodeImage(savedData.id.toString(), qrImage);
              setHistory(prev => prev.map(h => h.id === savedData.id.toString() ? { ...h, imageUrl: imageUrl } : h));
            }
          } catch (imgErr) {
            console.error('Failed to generate QR image:', imgErr);
          }
        }
        setWizard(prev => ({ ...prev, step: 3 }));
      } catch (err) {
        const errorMsg = (err as any)?.response?.data?.detail || (err as any)?.response?.data?.error || (err as any).message || "Unknown error";
        console.error("Failed to save progress", err);
        if (showAlert) showAlert("Error", `Failed to save progress: ${errorMsg}`, "danger");
        else alert(`Failed to save progress: ${errorMsg}`);
      }
    } else if (wizard.step === 3) {
      console.log("Wizard: Finalizing QR code styling...");
      try {
        if (editingId) {
          const sanitizedFolderId = (wizard.folderId && !String(wizard.folderId).startsWith('f')) ? wizard.folderId : undefined;
          const updatedCode = await updateCode(editingId, {
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
            settings: { ...wizard.config, business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined }
          });

          const mappedUpdatedData = { ...updatedCode, id: updatedCode.id.toString(), folderId: updatedCode.folder?.toString() };
          setHistory(prev => prev.map(h => h.id === editingId ? { ...h, ...mappedUpdatedData } : h));

          try {
            const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
            const existingCode = history.find(h => h.id === editingId);
            const slug = existingCode?.shortSlug || existingCode?.short_slug || updatedCode.shortSlug || updatedCode.short_slug;
            const qrValue = slug ? `${backendUrl}/r/${slug}` : finalValue;
            const qrImage = await generateQRWithFrame(qrValue, wizard.config);
            if (qrImage) {
              const imageUrl = await updateCodeImage(editingId, qrImage);
              setHistory(prev => prev.map(h => h.id === editingId ? { ...h, imageUrl: imageUrl } : h));
            }
          } catch (imgErr) {
            console.error('Failed to generate QR image:', imgErr);
          }
        }

        setView('my_codes');
        setWizard(prev => ({ ...prev, step: 1, value: '', name: '', folderId: undefined }));
        setEditingId(null);
      } catch (err) {
        const errorMsg = (err as any)?.response?.data?.detail || (err as any)?.response?.data?.error || (err as any).message || "Unknown error";
        console.error("Finalization failed", err);
        if (showAlert) showAlert("Error", `Failed to finalize QR code: ${errorMsg}`, "danger");
        else alert(`Failed to finalize QR code: ${errorMsg}`);
      }
    } else {
      const nextStep = (wizard.step + 1) as 1 | 2 | 3;
      setWizard(prev => ({ ...prev, step: nextStep }));
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
    handleDeletePdf,
    startQrFromAsset,
    resetWizard,
    getQRValue,
    qrStylingOptions,
    selectedTypeConfig,
    whatsappCountryCode,
    setWhatsappCountryCode,
  };
};
