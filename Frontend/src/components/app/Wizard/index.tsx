import React from 'react';
import { ChevronRight, ChevronLeft, Check, Plus, X, Folder as FolderIcon, ChevronDown, Globe, FileText, Link as LinkIcon, MessageCircle, Briefcase, Layout, Maximize, Image as ImageIcon, Upload, Trash2, CheckCheck, Star, Palette as PaletteIcon, Info, Barcode, Type, Video, Phone, MoreVertical, Smile, Paperclip, Mic, UserCircle, Camera, Clock, MapPin, Share2, Coffee, Wifi, Dumbbell, Car, Bed, Facebook, Instagram, Twitter, Linkedin, Youtube, Armchair, Accessibility, Bath, Baby, PawPrint, ParkingSquare, Bus, CarFront, Martini, Utensils, Umbrella, Lock, ShieldCheck, ScanEye } from 'lucide-react';
import { WizardState, Folder, BusinessConfig, BusinessButton, OpeningHours } from '../../../../types';
import { QR_TYPES_CONFIG, FRAME_STYLES, PATTERN_OPTIONS, CORNER_SQUARE_OPTIONS, CORNER_DOT_OPTIONS, DEFAULT_BUSINESS_PRESETS, FONT_OPTIONS, LINKS_DESIGN_PRESETS } from '../../../../components/constants';
import { StyledQRCode } from '../../../../components/StyledQRCode';
import { QRFrameWrapper } from '../../../../components/QRFrameWrapper';
import { GatekeeperPreview } from '../../previews/gatekeeper';
import { FontLoader } from '../../FontLoader';
// @ts-ignore
import phoneFrame from './Phone.png';

interface WizardProps {
  wizard: WizardState;
  setWizard: React.Dispatch<React.SetStateAction<WizardState>>;
  folders: Folder[];
  activeDesignSection: string | null;
  setActiveDesignSection: (section: string | null) => void;
  isTransparent: boolean;
  setIsTransparent: (transparent: boolean) => void;
  useFgGradient: boolean;
  setUseFgGradient: (use: boolean) => void;
  whatsappPhone: string;
  setWhatsappPhone: (phone: string) => void;
  whatsappCountryCode: string;
  setWhatsappCountryCode: (cc: string) => void;
  whatsappMessage: string;
  setWhatsappMessage: (message: string) => void;
  pdfFileName: string | null;
  pdfUrl: string | null;
  isCreatingFolder: boolean;
  setIsCreatingFolder: (show: boolean) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleNextStep: () => Promise<void>;
  handleBackStep: () => void;
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
  handlePdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePdf: () => void;
  handleCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  qrStylingOptions: any;
  selectedTypeConfig: any;
  phonePreviewMode: 'ui' | 'qr';
  setPhonePreviewMode: (mode: 'ui' | 'qr') => void;
  createNewFolder: () => Promise<void>;
  getQRValue: () => string;
}

export const Wizard: React.FC<WizardProps> = ({
  wizard,
  setWizard,
  folders,
  activeDesignSection,
  setActiveDesignSection,
  isTransparent,
  setIsTransparent,
  useFgGradient,
  setUseFgGradient,
  whatsappPhone,
  setWhatsappPhone,
  whatsappCountryCode,
  setWhatsappCountryCode,
  whatsappMessage,
  setWhatsappMessage,
  pdfFileName,
  pdfUrl,
  isCreatingFolder,
  setIsCreatingFolder,
  newFolderName,
  setNewFolderName,
  handleNextStep,
  handleBackStep,
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
  handleDeletePdf,
  handleCoverImageUpload,
  qrStylingOptions,
  selectedTypeConfig,
  phonePreviewMode,
  setPhonePreviewMode,
  createNewFolder,
  getQRValue,
}) => {
  const [hoveredType, setHoveredType] = React.useState<WizardState['type'] | null>(null);
  const [leadForm, setLeadForm] = React.useState({ name: '', email: '' });
  const [previewIsAuthorized, setPreviewIsAuthorized] = React.useState(false);
  const [previewViewMode, setPreviewViewMode] = React.useState<'landing' | 'preview'>('landing');

  const handlePreviewLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewIsAuthorized(true);
  };

  React.useEffect(() => {
    if (wizard.step === 3) {
      setPhonePreviewMode('qr');
    } else if (wizard.step === 2) {
      setPhonePreviewMode('ui');
    }
  }, [wizard.step, setPhonePreviewMode]);


  const renderStepper = ({ step }: { step: number }) => {
    const steps = [
      { n: 1, label: 'TYPE' },
      { n: 2, label: 'CONTENT' },
      { n: 3, label: 'STYLE' },
    ];
    return (
      <div className="hidden lg:flex items-center justify-center w-full max-w-2xl mx-auto gap-3">
        {steps.map((s, idx) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-3 shrink-0">
              <div className={`w-9 h-9 flex items-center justify-center text-[14px] font-black rounded-full transition-all ${step >= s.n ? 'skeu-tag-active shadow-lg shadow-red-500/10 scale-110' : 'skeu-inset skeu-text-muted'}`}>
                {s.n}
              </div>
              <span className={`text-[11px] font-black  transition-colors ${step >= s.n ? 'skeu-text-primary' : 'skeu-text-muted'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-20 h-[2px] skeu-inset flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStep1TypeSelection = () => (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 w-full lg:space-y-16 py-2 lg:py-0">
      <div className="hidden lg:block text-left px-2">
        <h2 className="skeu-step-header">1. Select a type of QR code</h2>
      </div>

      <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible pb-10 lg:pb-0 gap-3 px-4 lg:px-2 scrollbar-hide snap-x items-stretch">
        {QR_TYPES_CONFIG.map((type) => (
          <button
            key={type.id}
            onClick={() => { 
                setWizard(prev => ({ ...prev, type: type.id as any, step: 2 })); 
                setPhonePreviewMode('ui');
            }}
            onMouseEnter={() => setHoveredType(type.id as any)}
            onMouseLeave={() => setHoveredType(null)}
            type="button"
            className={`group relative p-4 lg:p-8 flex-none w-[140px] lg:w-full lg:aspect-square rounded-[1.8rem] transition-all duration-500 flex flex-col items-center justify-center text-center gap-2 lg:gap-6 snap-center ${wizard.type === type.id ? 'bg-white border-2 border-[#dc2626] shadow-xl shadow-red-500/10' : 'bg-white border-2 border-slate-50 hover:border-slate-200 shadow-sm'}`}
          >
            <div className={`w-11 h-11 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative shrink-0 ${wizard.type === type.id ? 'bg-[#dc2626] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-red-50 group-hover:text-[#dc2626]'}`}>
              <div className="flex items-center justify-center transition-transform duration-500">
                {type.id === 'website' && <Globe className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={1.5} />}
                {type.id === 'pdf' && <FileText className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={1.5} />}
                {type.id === 'whatsapp' && <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={1.5} />}
                {type.id === 'business' && <Briefcase className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={1.5} />}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className={`font-bold text-[13px] lg:text-lg tracking-tight transition-colors duration-300 ${wizard.type === type.id ? 'text-[#0F172A]' : 'text-slate-600'}`}>{type.name}</h3>
              <p className="text-[8px] font-medium text-slate-400 leading-relaxed px-1 line-clamp-1 capitalize tracking-tight">
                {type.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2Content = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left mb-10">
        <h2 className="skeu-step-header ml-1">2. Add content to your QR code</h2>
      </div>

      <div className="space-y-6">
        {/* Website Content Section */}
        {wizard.type === 'website' && (
          <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group"
              type="button"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-medium skeu-text-primary  capitalize">Website URL</h3>
                  <p className="text-[10px] font-medium skeu-text-muted">Link your QR code to any website.</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'content' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
            </button>

            {activeDesignSection === 'content' && (
              <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black skeu-text-muted capitalize ">Destination URL *</label>
                  <span className="text-[9px] font-black skeu-text-muted capitalize  italic opacity-60">Supports http:// and https://</span>
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-5 z-10 pointer-events-none">
                    <Globe className="w-6 h-6 skeu-text-accent transition-colors" />
                    <div className="h-8 w-[1.5px] skeu-dark opacity-30" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://www.yourwebsite.com"
                    value={wizard.value}
                    onChange={(e) => setWizard({ ...wizard, value: e.target.value })}
                    className="w-full pl-20 pr-6 py-3 skeu-input text-sm font-bold placeholder:opacity-20 translate-y-0"
                  />
                </div>

                <div className="bg-[#f0f0f0] p-6 rounded-2xl border border-black/5 flex gap-4 animate-in fade-in duration-700">
                  <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-medium text-red-600/80 leading-relaxed">
                    Make sure to include <span className="font-black">https://</span> for a secure connection. Your QR code will redirect users instantly when scanned.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WhatsApp Type */}
        {wizard.type === 'whatsapp' && (
          <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">WhatsApp Information</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Direct link to start a WhatsApp chat</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 skeu-text-muted" />
              </div>

              <div className="space-y-6">
                <div className="space-y-3 text-left">
                  <label className="text-[11px] font-bold skeu-text-muted capitalize  pl-1">Phone number *</label>
                  <div className="flex items-center skeu-input overflow-hidden">
                    <div className="px-4 py-3 flex items-center gap-2 border-r border-black/5 skeu-mid">
                      <img src="https://flagcdn.com/in.svg" className="w-5 h-3 rounded-[2px] object-cover" alt="IN" />
                      <ChevronDown className="w-3.5 h-3.5 skeu-text-muted" />
                    </div>
                    <div className="flex-1 px-4 py-3 flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <span className="font-bold skeu-text-secondary text-sm">+</span>
                        <input
                          type="text"
                          value={whatsappCountryCode}
                          onChange={(e) => setWhatsappCountryCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-7 bg-transparent outline-none font-bold skeu-text-secondary text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="84606 87490"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value.replace(/[^0-9 ]/g, ''))}
                        className="flex-1 bg-transparent outline-none font-bold skeu-text-primary text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <label className="text-[11px] font-bold skeu-text-muted capitalize  pl-1">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Write your message"
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    className="w-full px-5 py-3 skeu-input resize-none text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Type */}
        {wizard.type === 'pdf' && (
          <div className="space-y-6">
            {/* PDF Upload */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={() => toggleSection('upload')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">PDF Upload</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Select and upload your PDF document.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'upload' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'upload' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="relative group">
                    <div className={`border-2 border-solid skeu-dark rounded-[1rem] p-8 flex flex-col items-center justify-center gap-8 hover:border-[#dc2626] skeu-mid hover:shadow-2xl transition-all duration-500 group/upload ${!pdfUrl ? 'cursor-pointer' : ''}`}>
                      {!pdfUrl && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="application/pdf" onChange={handlePdfUpload} />}
                      {pdfUrl ? (
                        <div className="flex items-center gap-5 animate-in zoom-in duration-500 w-full justify-start">
                          <div className="w-14 h-14 skeu-hero-icon text-white rounded-2xl flex items-center justify-center relative skeu-gloss shrink-0">
                            <FileText className="w-7 h-7" />
                          </div>
                          <div className="text-left min-w-0 flex-1">
                            <h4 className="font-medium skeu-text-primary text-sm truncate">{pdfFileName}</h4>
                            <p className="text-xs font-medium text-green-500 mt-0.5 flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> Uploaded successfully
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-auto relative z-20">
                            <button
                              type="button"
                              className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-[#3eb5a9] hover:bg-[#3eb5a9]/10 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-90"
                              title="Delete PDF"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeletePdf();
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <label
                              className="p-2.5 bg-[#dc2626] text-white hover:bg-[#3eb5a9] rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-90 flex items-center gap-1.5"
                              title="Change PDF"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Upload className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase">Edit</span>
                              <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfUpload} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-5 w-full justify-start">
                          <div className="w-14 h-14 skeu-inset skeu-text-muted rounded-2xl flex items-center justify-center group-hover/upload:bg-gradient-to-br group-hover/upload:from-[#3eb5a9] group-hover/upload:to-[#2d8a81] group-hover/upload:text-white group-hover/upload:scale-110 transition-all duration-500 shadow-inner group-hover/upload:shadow-xl shrink-0 group-hover/upload:border-2 group-hover/upload:border-white/20">
                            <Upload className="w-7 h-7" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium skeu-text-primary text-sm">Drop your PDF or browse</p>
                            <p className="text-xs font-medium skeu-text-muted mt-0.5">Maximum file size: 20MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Design */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              <button onClick={() => toggleSection('design')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <PaletteIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Design</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Choose a color theme for your page.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'design' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'design' && (
                <div className="p-6 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-6">
                    <p className="text-[11px] font-black text-slate-400 capitalize  pl-1">Color Palette</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {DEFAULT_BUSINESS_PRESETS.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            updateBusinessField('primaryColor', preset.primary);
                            updateBusinessField('secondaryColor', preset.secondary);
                          }}
                          className={`w-16 h-10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${wizard.business?.primaryColor === preset.primary && wizard.business?.secondaryColor === preset.secondary ? 'border-slate-400 scale-105' : 'border-transparent'}`}
                        >
                          <div className="w-1/2 h-full float-left" style={{ backgroundColor: preset.primary }} />
                          <div className="w-1/2 h-full float-left" style={{ backgroundColor: preset.secondary }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex-1 space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Primary Color</label>
                      <div className="flex items-center gap-4 p-2.5 bg-[#f0f0f0] rounded-2xl border-2 border-black/5">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.primaryColor }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.primaryColor} onChange={(e) => updateBusinessField('primaryColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700  text-sm">{wizard.business?.primaryColor}</span>
                      </div>
                    </div>
                    <button type="button" onClick={swapColors} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#dc2626] hover:bg-red-50 transition-colors mt-8">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                    <div className="flex-1 space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Secondary Color</label>
                      <div className="flex items-center gap-4 p-2.5 bg-[#f0f0f0] rounded-2xl border-2 border-black/5">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.secondaryColor }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.secondaryColor} onChange={(e) => updateBusinessField('secondaryColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700  text-sm">{wizard.business?.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PDF Information */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <button onClick={() => toggleSection('pdf_info')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">PDF Information</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Details about the PDF content.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'pdf_info' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'pdf_info' && (
                <div className="p-6 border-t border-slate-50/50 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Company Name</label>
                      <input type="text" placeholder="My Company" value={wizard.business?.company || ''} onChange={(e) => updateBusinessField('company', e.target.value)} className="w-full px-8 py-3 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">PDF Title</label>
                      <input type="text" placeholder="Find me on social networks" value={wizard.business?.title || ''} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-8 py-3 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Description</label>
                    <textarea rows={3} placeholder="New content every week in the links below" value={wizard.business?.description || ''} onChange={(e) => updateBusinessField('description', e.target.value)} className="w-full px-8 py-3 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Website</label>
                      <input type="text" placeholder="https://..." value={wizard.business?.buttons?.[0]?.url || ''} onChange={(e) => updateLink(wizard.business?.buttons?.[0]?.id || '1', 'url', e.target.value)} className="w-full px-8 py-3 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Button Name</label>
                      <input type="text" placeholder="My Website" value={wizard.business?.buttons?.[0]?.text || ''} onChange={(e) => updateLink(wizard.business?.buttons?.[0]?.id || '1', 'text', e.target.value)} className="w-full px-8 py-3 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fonts */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <button onClick={() => toggleSection('fonts')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <i className="font-serif text-lg font-black">T</i>
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Fonts</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Customize fonts and colors.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'fonts' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'fonts' && (
                <div className="p-6 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black skeu-text-muted capitalize  pl-1">Title Font</label>
                      <select value={wizard.business?.fontTitle} onChange={(e) => updateBusinessField('fontTitle', e.target.value)} className="w-full pl-8 pr-12 py-5 skeu-input appearance-none">
                        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black skeu-text-muted capitalize  pl-1">Text Font</label>
                      <select value={wizard.business?.fontText} onChange={(e) => updateBusinessField('fontText', e.target.value)} className="w-full pl-8 pr-12 py-5 skeu-input appearance-none">
                        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Title Color</label>
                      <div className="flex items-center gap-4 p-2.5 bg-[#f0f0f0] rounded-2xl border-2 border-black/5">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.fontTitleColor || '#ffffff' }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.fontTitleColor || '#ffffff'} onChange={(e) => updateBusinessField('fontTitleColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700  text-sm">{wizard.business?.fontTitleColor || '#ffffff'}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Text Color</label>
                      <div className="flex items-center gap-4 p-2.5 bg-[#f0f0f0] rounded-2xl border-2 border-black/5">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.fontTextColor || '#ffffff' }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.fontTextColor || '#ffffff'} onChange={(e) => updateBusinessField('fontTextColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700  text-sm">{wizard.business?.fontTextColor || '#ffffff'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business, Links Types */}
        {/* Business Type */}
        {wizard.type === 'business' && (
          <div className="space-y-6">
            {/* Design Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={() => toggleSection('design')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <PaletteIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Design</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Choose a color theme for your page.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'design' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'design' && (
                <div className="p-6 border-t border-black/5 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 capitalize  pl-1">Color Palette</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {DEFAULT_BUSINESS_PRESETS.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            updateBusinessField('primaryColor', preset.primary);
                            updateBusinessField('secondaryColor', preset.secondary);
                          }}
                          className={`w-14 h-8 rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${wizard.business?.primaryColor === preset.primary && wizard.business?.secondaryColor === preset.secondary ? 'border-slate-400 scale-105' : 'border-transparent'}`}
                        >
                          <div className="w-1/2 h-full float-left" style={{ backgroundColor: preset.primary }} />
                          <div className="w-1/2 h-full float-left" style={{ backgroundColor: preset.secondary }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Primary Color</label>
                      <div className="flex items-center gap-3 p-2.5 bg-[#f0f0f0] rounded-xl border-2 border-black/5">
                        <div className="w-8 h-8 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.primaryColor }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.primaryColor} onChange={(e) => updateBusinessField('primaryColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700  text-[11px] capitalize">{wizard.business?.primaryColor}</span>
                      </div>
                    </div>
                    <button type="button" onClick={swapColors} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#3eb5a9] transition-colors mt-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                    <div className="flex-1 space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Secondary Color</label>
                      <div className="flex items-center gap-3 p-2.5 bg-[#f0f0f0] rounded-xl border-2 border-black/5">
                        <div className="w-8 h-8 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.secondaryColor }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.secondaryColor} onChange={(e) => updateBusinessField('secondaryColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700  text-[11px] capitalize">{wizard.business?.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Business Information Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              <button onClick={() => toggleSection('businessInfo')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Business Information</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Introduce your business or organization.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'businessInfo' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'businessInfo' && (
                <div className="p-6 border-t border-black/5 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 capitalize  pl-1 flex items-center gap-1">Image <span className="opacity-50 inline-flex items-center justify-center w-3 h-3 rounded-full border border-slate-400">?</span></label>
                    <div className="w-20 h-20 border-2 border-dashed border-[#dc2626]/30 rounded-xl flex items-center justify-center hover:bg-red-50/50 transition-colors cursor-pointer relative group/img">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" onChange={handleCoverImageUpload} />
                      <ImageIcon className="w-8 h-8 text-[#dc2626] opacity-50 group-hover/img:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Company *</label>
                      <input type="text" placeholder="E.g. My Company" value={wizard.business?.company || ''} onChange={(e) => updateBusinessField('company', e.target.value)} className="w-full px-5 py-4 skeu-input text-sm font-bold placeholder:opacity-40" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Title</label>
                      <input type="text" placeholder="E.g. Clothing store" value={wizard.business?.title || ''} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-5 py-4 skeu-input text-sm font-bold placeholder:opacity-40" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Subtitle</label>
                      <input type="text" placeholder="E.g. Selling clothes for over 15 years" value={wizard.business?.subtitle || ''} onChange={(e) => updateBusinessField('subtitle', e.target.value)} className="w-full px-5 py-4 skeu-input text-sm font-bold placeholder:opacity-40" />
                    </div>

                    <div className="pt-2">
                      {wizard.business?.buttons?.map((btn) => (
                        <div key={btn.id} className="flex flex-col gap-3 mb-4 p-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 relative group/btnitem">
                          <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover/btnitem:opacity-100 transition-opacity">
                            <button type="button" onClick={() => removeLink(btn.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <input type="text" placeholder="Button Label" value={btn.text} onChange={(e) => updateLink(btn.id, 'text', e.target.value)} className="w-full bg-transparent border-b border-slate-200 focus:border-[#dc2626] outline-none font-bold text-sm text-slate-800 pb-2" />
                          <div className="flex items-center gap-3">
                            <LinkIcon className="w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="https://" value={btn.url} onChange={(e) => updateLink(btn.id, 'url', e.target.value)} className="w-full bg-transparent border-none outline-none font-medium text-sm text-slate-600" />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addLink} className="w-full py-4 border-2 border-[#dc2626] text-[#dc2626] font-black text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-[#3eb5a9] hover:text-white hover:border-[#3eb5a9] transition-colors">
                        <Plus className="w-4 h-4" /> Add Button
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Opening Hours Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <button onClick={() => toggleSection('openingHours')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Opening Hours</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Set your business hours.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'openingHours' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'openingHours' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                    const dayData = wizard.business?.openingHours?.[day as keyof OpeningHours] || { isOpen: false, slots: [] };
                    return (
                      <div key={day} className="flex flex-col gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dayData.isOpen}
                              onChange={(e) => {
                                const newHours = { ...wizard.business?.openingHours } as any;
                                newHours[day] = { ...dayData, isOpen: e.target.checked };
                                updateBusinessField('openingHours', newHours);
                              }}
                              className="w-5 h-5 rounded border-slate-300 text-[#dc2626] focus:ring-[#dc2626]"
                            />
                            <span className="text-sm font-bold text-slate-700 capitalize">{day}</span>
                          </label>
                          {dayData.isOpen && (
                            <button
                              type="button"
                              onClick={() => {
                                const newHours = { ...wizard.business?.openingHours } as any;
                                newHours[day] = { ...dayData, slots: [...dayData.slots, { open: '09:00', close: '17:00' }] };
                                updateBusinessField('openingHours', newHours);
                              }}
                              className="text-xs font-bold text-[#dc2626] flex items-center gap-1 hover:underline"
                            >
                              <Plus className="w-3 h-3" /> Add Schedule
                            </button>
                          )}
                        </div>
                        {dayData.isOpen && dayData.slots.map((slot: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 pl-8">
                            <input
                              type="time"
                              value={slot.open}
                              onChange={(e) => {
                                const newHours = { ...wizard.business?.openingHours } as any;
                                const newSlots = [...dayData.slots];
                                newSlots[idx] = { ...slot, open: e.target.value };
                                newHours[day] = { ...dayData, slots: newSlots };
                                updateBusinessField('openingHours', newHours);
                              }}
                              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-[#dc2626] outline-none"
                            />
                            <span className="text-slate-400 font-bold">-</span>
                            <input
                              type="time"
                              value={slot.close}
                              onChange={(e) => {
                                const newHours = { ...wizard.business?.openingHours } as any;
                                const newSlots = [...dayData.slots];
                                newSlots[idx] = { ...slot, close: e.target.value };
                                newHours[day] = { ...dayData, slots: newSlots };
                                updateBusinessField('openingHours', newHours);
                              }}
                              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:border-[#dc2626] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newHours = { ...wizard.business?.openingHours } as any;
                                const newSlots = dayData.slots.filter((_: any, i: number) => i !== idx);
                                newHours[day] = { ...dayData, slots: newSlots };
                                updateBusinessField('openingHours', newHours);
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Location Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <button onClick={() => toggleSection('location')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Location</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Where is your business located?</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'location' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'location' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Address</label>
                      <input type="text" value={wizard.business?.location?.address || ''} onChange={(e) => updateBusinessField('location', { ...wizard.business?.location, address: e.target.value })} className="w-full px-5 py-3 skeu-input text-sm font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">City</label>
                      <input type="text" value={wizard.business?.location?.city || ''} onChange={(e) => updateBusinessField('location', { ...wizard.business?.location, city: e.target.value })} className="w-full px-5 py-3 skeu-input text-sm font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Postcode / Zip</label>
                      <input type="text" value={wizard.business?.location?.zipCode || ''} onChange={(e) => updateBusinessField('location', { ...wizard.business?.location, zipCode: e.target.value })} className="w-full px-5 py-3 skeu-input text-sm font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">State / Province</label>
                      <input type="text" value={wizard.business?.location?.state || ''} onChange={(e) => updateBusinessField('location', { ...wizard.business?.location, state: e.target.value })} className="w-full px-5 py-3 skeu-input text-sm font-bold" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Country</label>
                      <input type="text" value={wizard.business?.location?.country || ''} onChange={(e) => updateBusinessField('location', { ...wizard.business?.location, country: e.target.value })} className="w-full px-5 py-3 skeu-input text-sm font-bold" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <button onClick={() => toggleSection('contactInfo')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Contact Information</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">How people can reach you.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'contactInfo' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'contactInfo' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Contact Name</label>
                    <input type="text" placeholder="E.g. John Doe" value={wizard.business?.contact?.name || ''} onChange={(e) => updateBusinessField('contact', { ...wizard.business?.contact, name: e.target.value })} className="w-full px-5 py-4 skeu-input text-sm font-bold placeholder:opacity-40" />
                  </div>

                  {/* Repeated blocks for Phone, Email, Website */}
                  {(['phones', 'emails', 'websites'] as const).map((field) => (
                    <div key={field} className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 capitalize  pl-1 capitalize">{field}</label>
                      {(wizard.business?.contact?.[field] || []).map((val, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={typeof val === 'object' ? (val as any).value : val}
                            onChange={(e) => {
                              const newArr = [...(wizard.business?.contact?.[field] || [])];
                              if (typeof newArr[idx] === 'object' && newArr[idx] !== null) {
                                newArr[idx] = { ...(newArr[idx] as any), value: e.target.value };
                              } else {
                                newArr[idx] = e.target.value;
                              }
                              updateBusinessField('contact', { ...wizard.business?.contact, [field]: newArr });
                            }}
                            className="flex-1 px-5 py-3 skeu-input text-sm font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newArr = wizard.business?.contact?.[field]?.filter((_, i) => i !== idx);
                              updateBusinessField('contact', { ...wizard.business?.contact, [field]: newArr });
                            }}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newArr = [...(wizard.business?.contact?.[field] || []), ''];
                          updateBusinessField('contact', { ...wizard.business?.contact, [field]: newArr });
                        }}
                        className="text-xs font-bold text-[#dc2626] flex items-center gap-1 hover:underline pt-1"
                      >
                        <Plus className="w-3 h-3" /> Add {field.slice(0, -1)}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Networks Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <button onClick={() => toggleSection('social')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Social Networks</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Links to your social profiles.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'social' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'social' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Your Social Links</label>
                    <div className="space-y-4">
                      {wizard.business?.socialNetworks?.map((social, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-[#f0f0f0] p-2 rounded-xl border border-black/5">
                          <span className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#dc2626] font-black text-xs capitalize shrink-0">
                            {social.network.slice(0, 2)}
                          </span>
                          <input
                            type="text"
                            value={social.url}
                            onChange={(e) => {
                              const newArr = [...(wizard.business?.socialNetworks || [])];
                              newArr[idx] = { ...social, url: e.target.value };
                              updateBusinessField('socialNetworks', newArr);
                            }}
                            placeholder="https://"
                            className="flex-1 px-3 py-2 bg-transparent outline-none text-sm font-bold text-slate-700"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newArr = wizard.business?.socialNetworks?.filter((_, i) => i !== idx);
                              updateBusinessField('socialNetworks', newArr);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-4">
                      {[
                        { id: 'facebook', icon: <Facebook className="w-5 h-5" /> },
                        { id: 'instagram', icon: <Instagram className="w-5 h-5" /> },
                        { id: 'twitter', icon: <Twitter className="w-5 h-5" /> },
                        { id: 'linkedin', icon: <Linkedin className="w-5 h-5" /> },
                        { id: 'youtube', icon: <Youtube className="w-5 h-5" /> },
                        { id: 'whatsapp', icon: <MessageCircle className="w-5 h-5" /> },
                        {
                          id: 'pinterest',
                          icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                              <path d="M12 2C6.5 2 2 6.5 2 12c0 4.3 2.7 7.9 6.5 9.3-.1-.8-.2-2 .04-2.9.2-.8 1.2-5 1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.8 0-4.5 2.1-4.5 4.3 0 .9.3 1.8.7 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.6-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.4-2.2 6.2-5.2 6.2-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-.8 1.9-1.2 2.6 1 .3 2.1.5 3.2.5 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                            </svg>
                          )
                        }
                      ].map((net) => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => {
                            const exists = wizard.business?.socialNetworks?.find(s => s.network === net.id);
                            if (!exists) {
                              const newArr = [...(wizard.business?.socialNetworks || []), { network: net.id, url: '' }];
                              updateBusinessField('socialNetworks', newArr);
                            }
                          }}
                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${wizard.business?.socialNetworks?.find(s => s.network === net.id) ? 'border-[#dc2626] bg-red-50 text-[#dc2626] scale-95 opacity-50' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:shadow-md'}`}
                        >
                          {net.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Company Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <button onClick={() => toggleSection('about')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">About Company</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">A short description of your business.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'about' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'about' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">About Text</label>
                    <textarea
                      rows={5}
                      placeholder="Write something about your company..."
                      value={wizard.business?.aboutCompany || ''}
                      onChange={(e) => updateBusinessField('aboutCompany', e.target.value)}
                      className="w-full px-5 py-4 skeu-input text-sm font-bold resize-none placeholder:opacity-40"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Services Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <button onClick={() => toggleSection('facilities')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Services</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Services and amenities available.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'facilities' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'facilities' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {[
                      { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-5 h-5" /> },
                      { id: 'seating', label: 'Seating', icon: <Armchair className="w-5 h-5" /> },
                      { id: 'accessible', label: 'Accessible', icon: <Accessibility className="w-5 h-5" /> },
                      { id: 'restroom', label: 'Restroom', icon: <Bath className="w-5 h-5" /> },
                      { id: 'child-friendly', label: 'Child-friendly', icon: <Baby className="w-5 h-5" /> },
                      { id: 'pet-friendly', label: 'Pet-friendly', icon: <PawPrint className="w-5 h-5" /> },
                      { id: 'parking', label: 'Parking', icon: <ParkingSquare className="w-5 h-5" /> },
                      { id: 'public-transport', label: 'Public transport', icon: <Bus className="w-5 h-5" /> },
                      { id: 'taxi', label: 'Taxi', icon: <CarFront className="w-5 h-5" /> },
                      { id: 'lodging', label: 'Lodging', icon: <Bed className="w-5 h-5" /> },
                      { id: 'coffee', label: 'Coffee', icon: <Coffee className="w-5 h-5" /> },
                      { id: 'bar', label: 'Bar', icon: <Martini className="w-5 h-5" /> },
                      { id: 'restaurant', label: 'Restaurant', icon: <Utensils className="w-5 h-5" /> },
                      { id: 'gym', label: 'Gym', icon: <Dumbbell className="w-5 h-5" /> },
                      { id: 'terrace', label: 'Outdoor terrace', icon: <Umbrella className="w-5 h-5" /> }
                    ].map((fac) => {
                      const isActive = wizard.business?.facilities?.includes(fac.id);
                      return (
                        <button
                          key={fac.id}
                          type="button"
                          onClick={() => {
                            let newArr = wizard.business?.facilities || [];
                            if (isActive) {
                              newArr = newArr.filter(f => f !== fac.id);
                            } else {
                              newArr = [...newArr, fac.id];
                            }
                            updateBusinessField('facilities', newArr);
                          }}
                          className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all group/item cursor-pointer ${isActive ? 'border-[#dc2626] bg-red-50 text-[#dc2626] shadow-inner' : 'skeu-input !border-transparent hover:!bg-white hover:!border-slate-300 hover:shadow-md'}`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#dc2626] text-white shadow-sm' : 'bg-white text-slate-400 border border-black/5 group-hover/item:text-[#dc2626]'}`}>
                            {fac.icon}
                          </div>
                          <span className="text-xs font-black text-center">{fac.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Welcome Screen Accordion */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <button onClick={() => toggleSection('welcomeScreen')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                    <ScanEye className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium skeu-text-primary ">Welcome Screen</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Splash screen image shown while loading.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'welcomeScreen' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'welcomeScreen' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">Splash Image</label>
                    <div className="relative group">
                      <div className={`border-2 border-solid skeu-dark rounded-[1rem] p-8 flex flex-col items-center justify-center gap-8 hover:border-[#dc2626] skeu-mid hover:shadow-2xl transition-all duration-500 group/upload ${!wizard.business?.welcomeScreenImage ? 'cursor-pointer' : ''}`}>
                        {!wizard.business?.welcomeScreenImage && (
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              updateBusinessField('welcomeScreenImage', url);
                            }
                          }} />
                        )}
                        {wizard.business?.welcomeScreenImage ? (
                          <div className="flex items-center gap-5 animate-in zoom-in duration-500 w-full justify-start">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative shrink-0 p-2 overflow-hidden">
                              <img src={wizard.business.welcomeScreenImage} className="w-full h-full object-cover" alt="Splash Screen" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <h4 className="font-medium skeu-text-primary text-sm truncate">Splash Image</h4>
                              <p className="text-xs font-medium text-green-500 mt-0.5 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5" /> Uploaded successfully
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-auto relative z-20">
                              <button
                                type="button"
                                className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-90"
                                title="Delete Image"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  updateBusinessField('welcomeScreenImage', undefined);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <label
                                className="p-2.5 bg-[#dc2626] text-white hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-90 flex items-center gap-1.5"
                                title="Change Image"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Upload className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase">Edit</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const url = URL.createObjectURL(e.target.files[0]);
                                    updateBusinessField('welcomeScreenImage', url);
                                  }
                                }} />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-5 w-full justify-start">
                            <div className="w-14 h-14 skeu-inset skeu-text-muted rounded-2xl flex items-center justify-center group-hover/upload:bg-gradient-to-br group-hover/upload:from-[#dc2626] group-hover/upload:to-[#b91c1c] group-hover/upload:text-white group-hover/upload:scale-110 transition-all duration-500 shadow-inner group-hover/upload:shadow-xl shrink-0 group-hover/upload:border-2 group-hover/upload:border-white/20">
                              <ImageIcon className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium skeu-text-primary text-sm">Drop splash image or browse</p>
                              <p className="text-xs font-medium skeu-text-muted mt-0.5">Maximum file size: 5MB</p>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold skeu-text-muted group-hover/upload:bg-slate-50 transition-colors shadow-sm cursor-pointer relative z-20">Browse Files</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {(wizard.type === 'links') && (
          <div className="space-y-6">
            {/* Design Settings Accordion */}
            <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => toggleSection('design')}
                className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group"
                type="button"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-50 text-[#dc2626] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <PaletteIcon className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-[#0F172A] ">Design Settings</h3>
                    <p className="text-sm font-medium text-slate-400">Visual style, fonts and brand colors</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'design' ? 'rotate-180 text-[#dc2626]' : 'group-hover:text-slate-400'}`} />
              </button>

              {activeDesignSection === 'design' && (
                <div className="p-10 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-5">
                      <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Primary Brand Color</label>
                      <div className="flex items-center gap-6 p-2 bg-[#f0f0f0] rounded-2xl border-2 border-black/5 transition-all hover:border-[#dc2626]/20 hover:bg-white hover:shadow-lg hover:shadow-red-500/5 group">
                        <div className="w-16 h-12 rounded-xl border-2 border-white shadow-sm relative overflow-hidden ring-1 ring-slate-100" style={{ backgroundColor: wizard.business?.primaryColor }}>
                          <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-[2]"
                            value={wizard.business?.primaryColor}
                            onChange={(e) => updateBusinessField('primaryColor', e.target.value)}
                          />
                        </div>
                        <span className="font-bold text-slate-700 capitalize  text-sm">{wizard.business?.primaryColor}</span>
                      </div>
                    </div>
                    {true && (
                      <div className="space-y-5">
                        <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Typography</label>
                        <div className="relative group/select">
                          <select
                            value={wizard.business?.fontTitle}
                            onChange={(e) => updateBusinessField('fontTitle', e.target.value)}
                            className="w-full pl-8 pr-12 py-3 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] appearance-none transition-all shadow-inner focus:shadow-xl focus:shadow-red-500/5"
                          >
                            {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover/select:text-[#dc2626] transition-colors" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Accordion */}
            <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              <button
                onClick={() => toggleSection('content')}
                className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group"
                type="button"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Info className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-[#0F172A] ">
                      {wizard.type === 'pdf' ? 'PDF Document' : 'Page Content'}
                    </h3>
                    <p className="text-sm font-medium text-slate-400">
                      {wizard.type === 'pdf' ? 'Upload assets and files' : 'Modify names, headlines and links'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'content' ? 'rotate-180 text-green-600' : 'group-hover:text-slate-400'}`} />
              </button>

              {activeDesignSection === 'content' && (
                <div className="p-10 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">

                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Display Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. My Website"
                          value={wizard.business?.title || ''}
                          onChange={(e) => updateBusinessField('title', e.target.value)}
                          className="w-full px-8 py-5 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] transition-all shadow-inner focus:shadow-xl focus:shadow-red-500/5 placeholder:text-slate-200"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 capitalize  pl-1">Company / Sub-headline</label>
                        <input
                          type="text"
                          placeholder="e.g. Tech Solutions"
                          value={wizard.business?.company || ''}
                          onChange={(e) => updateBusinessField('company', e.target.value)}
                          className="w-full px-8 py-5 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl outline-none focus:ring-8 focus:ring-red-500/5 focus:border-[#dc2626] focus:bg-white font-bold text-[#0F172A] transition-all shadow-inner focus:shadow-xl focus:shadow-red-500/5 placeholder:text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[11px] font-black text-slate-400 capitalize ">Action Buttons / Links</label>
                        <button
                          type="button"
                          onClick={addLink}
                          className="bg-red-50 text-[#dc2626] px-6 py-3 rounded-2xl text-[11px] font-black capitalize  hover:bg-[#3eb5a9] hover:text-white transition-all flex items-center gap-2 shadow-sm hover:shadow-lg hover:shadow-red-500/20 active:scale-95 translate-y-0 hover:-translate-y-0.5"
                        >
                          <Plus className="w-4 h-4" /> Add Link
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {wizard.business?.buttons.map((link) => (
                          <div key={link.id} className="group/item flex items-center gap-4 p-3 bg-[#f0f0f0] border-2 border-black/5 rounded-2xl hover:bg-white hover:border-white hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 animate-in zoom-in-95">
                            <div className="flex-1 space-y-5">
                              <input
                                type="text"
                                value={link.text}
                                onChange={(e) => updateLink(link.id, 'text', e.target.value)}
                                placeholder="Button Name"
                                className="w-full bg-transparent border-none outline-none font-black text-[#0F172A] text-base p-0 focus:ring-0 placeholder:text-slate-200"
                              />
                              <div className="flex items-center gap-4 group/input bg-[#f0f0f0]/50 p-4 rounded-xl border border-black/5 focus-within:border-[#dc2626]/30 focus-within:bg-white transition-all shadow-inner">
                                <LinkIcon className="w-4 h-4 text-slate-300 group-focus-within/input:text-[#dc2626] transition-colors" />
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                  placeholder="https://..."
                                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-500 p-0 focus:ring-0 placeholder:text-slate-200"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLink(link.id)}
                              className="w-14 h-14 flex items-center justify-center rounded-[1.25rem] bg-white border border-slate-100 text-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100/50 transition-all shadow-sm hover:shadow-xl hover:shadow-red-500/10 active:scale-90"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* Save to Folder Section */}
        <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <button
            onClick={() => toggleSection('folder')}
            className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group"
            type="button"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                <FolderIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium skeu-text-primary ">Save To Folder</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Organize your codes by category.</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'folder' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>

          {activeDesignSection === 'folder' && (
            <div className="p-6 border-t border-black/5 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="space-y-5">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-[11px] font-bold text-slate-400 capitalize ">Choose Folder</label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(true)}
                    className="text-[#dc2626] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create New
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setWizard({ ...wizard, folderId: folder.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative group/folder cursor-pointer ${wizard.folderId === folder.id ? 'border-[#dc2626] bg-white shadow-xl shadow-red-500/10 z-10 scale-102' : 'skeu-input !border-transparent hover:!bg-white hover:!border-slate-200 hover:shadow-md hover:shadow-slate-200/50'}`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${wizard.folderId === folder.id ? 'bg-[#dc2626] text-white shadow-md shadow-[#dc2626]/20' : 'bg-white text-slate-300 border border-black/5 group-hover/folder:text-[#dc2626]'}`}>
                          <FolderIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-black  truncate text-sm ${wizard.folderId === folder.id ? 'text-[#0F172A]' : 'text-slate-700'}`}>{folder.name}</p>
                          <p className="text-[8px] font-black text-slate-400 capitalize  mt-0.5">{folder.count} codes</p>
                        </div>
                      </div>
                      {wizard.folderId === folder.id && (
                        <div className="absolute top-4 right-4 bg-[#dc2626] text-white p-0.5 rounded-full shadow-lg animate-in zoom-in duration-300">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {isCreatingFolder && (
                  <div className="mt-6 flex items-center gap-4 p-6 bg-red-50/50 rounded-3xl border border-red-100 animate-in slide-in-from-top-2">
                    <input
                      type="text"
                      placeholder="Folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="flex-1 px-5 py-3 rounded-xl border border-red-100 outline-none focus:ring-2 focus:ring-[#dc2626] font-bold"
                    />
                    <button
                      type="button"
                      onClick={createNewFolder}
                      className="px-6 py-3 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#3eb5a9]"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsCreatingFolder(false); setNewFolderName(''); }}
                      className="p-3 text-slate-400 hover:text-slate-600"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3Style = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left mb-10">
        <h2 className="skeu-step-header ml-1">3. Design the QR</h2>
      </div>

      <div className="space-y-6">
        {/* Frame Selection */}
        <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => toggleSection('frame')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                <Layout className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium skeu-text-primary ">Frame Layout</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Add a call-to-action frame</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'frame' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>
          {activeDesignSection === 'frame' && (
            <div className="p-4 border-t border-black/5 grid grid-cols-11 gap-2.5 animate-in slide-in-from-top-4 duration-500 origin-top">
              {FRAME_STYLES.map((style: any) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setWizard({ ...wizard, config: { ...wizard.config, frame: style.id } })}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-all group/item ${wizard.config.frame === style.id ? 'skeu-card scale-105 skeu-text-accent shadow-xl font-black' : 'skeu-card skeu-text-muted translate-y-0'}`}
                >
                  <div className={`transition-transform duration-500 ${wizard.config.frame === style.id ? 'scale-150' : 'scale-125'}`}>{style.icon}</div>
                  <span className={`text-[9px] font-black capitalize mt-4  ${wizard.config.frame === style.id ? 'skeu-text-accent' : 'skeu-text-muted opacity-50'}`}>{style.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color & Pattern */}
        <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <button onClick={() => toggleSection('pattern')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                <PaletteIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium skeu-text-primary ">QR Pattern & Colors</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Dots, squares and custom colors</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'pattern' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>

          {activeDesignSection === 'pattern' && (
            <div className="p-5 border-t border-black/5 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2.5">
                {PATTERN_OPTIONS.map((opt: any) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWizard({ ...wizard, config: { ...wizard.config, pattern: opt.id } })}
                    className={`aspect-square flex items-center justify-center rounded-xl transition-all group/item ${wizard.config.pattern === opt.id ? 'skeu-card scale-105 skeu-text-accent shadow-xl' : 'skeu-card skeu-text-muted translate-y-0'}`}
                  >
                    <div className={`p-1 transition-transform duration-500 ${wizard.config.pattern === opt.id ? 'scale-125' : 'group-hover/item:scale-110'}`}>{opt.icon}</div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3 px-1">
                  <label className="text-[11px] font-black skeu-text-muted capitalize  pl-1">Foreground Color</label>
                  <div className="flex items-center gap-4 p-2.5 skeu-input group/color">
                    <div className="w-16 h-12 rounded-xl skeu-mid border-2 border-black/5 shadow-inner relative overflow-hidden" style={{ backgroundColor: wizard.config.fgColor }}>
                      <input type="color" value={wizard.config.fgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, fgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5]" />
                    </div>
                    <span className="font-bold skeu-text-primary capitalize  text-sm">{wizard.config.fgColor}</span>
                  </div>
                </div>
                <div className="space-y-3 px-1">
                  <label className="text-[11px] font-black skeu-text-muted capitalize  pl-1">Background Color</label>
                  <div className="flex items-center gap-4 p-2.5 skeu-input group/color">
                    <div className="w-16 h-12 rounded-xl skeu-mid border-2 border-black/5 shadow-inner relative overflow-hidden" style={{ backgroundColor: wizard.config.bgColor }}>
                      <input type="color" value={wizard.config.bgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, bgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5]" />
                    </div>
                    <span className="font-bold skeu-text-primary capitalize  text-sm">{wizard.config.bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 bg-red-50/10 p-6 rounded-[2rem] border-2 border-red-50/20 hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-500 group/trans">
                <button
                  type="button"
                  onClick={() => setIsTransparent(!isTransparent)}
                  className={`w-7 h-7 rounded-[10px] border-2 flex items-center justify-center transition-all shadow-sm ${isTransparent ? 'bg-[#dc2626] border-[#dc2626] shadow-lg shadow-red-500/20' : 'bg-white border-slate-200 group-hover/trans:border-slate-300'}`}
                >
                  {isTransparent && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                </button>
                <div className="cursor-pointer" onClick={() => setIsTransparent(!isTransparent)}>
                  <p className="font-black text-[#0F172A] ">Transparent Background</p>
                  <p className="text-sm font-medium text-slate-400">Remove background for transparency</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <button onClick={() => toggleSection('corners')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                <ScanEye className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium skeu-text-primary ">Eye Styles</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Shape of the corner indicators</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'corners' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>

          {activeDesignSection === 'corners' && (
            <div className="p-5 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="space-y-6">
                <p className="text-[11px] font-black text-slate-400 capitalize  px-1">Eye Frame Shape</p>
                <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2.5">
                  {CORNER_SQUARE_OPTIONS.map((opt: any) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersSquareType: opt.id } })}
                      className={`aspect-square flex items-center justify-center rounded-xl transition-all group/item ${wizard.config.cornersSquareType === opt.id ? 'skeu-card scale-105 skeu-text-accent shadow-xl border-red-500/20' : 'skeu-card skeu-text-muted translate-y-0'}`}
                    >
                      <div className={`transition-transform duration-500 ${wizard.config.cornersSquareType === opt.id ? 'scale-125' : 'group-hover/item:scale-110'}`}>{opt.icon}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[11px] font-black text-slate-400 capitalize  px-1">Eye Dot Shape</p>
                <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2.5">
                  {CORNER_DOT_OPTIONS.map((opt: any) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersDotType: opt.id } })}
                      className={`aspect-square flex items-center justify-center rounded-xl transition-all group/item ${wizard.config.cornersDotType === opt.id ? 'skeu-card scale-105 skeu-text-accent shadow-xl border-red-500/20' : 'skeu-card skeu-text-muted translate-y-0'}`}
                    >
                      <div className={`transition-transform duration-500 ${wizard.config.cornersDotType === opt.id ? 'scale-125' : 'group-hover/item:scale-110'}`}>{opt.icon}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo Upload */}
        <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <button onClick={() => toggleSection('logo')} className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group" type="button">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium skeu-text-primary ">Add Center Logo</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Place your brand in the center</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'logo' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>

          {activeDesignSection === 'logo' && (
            <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="relative group">
                <div className={`border-2 border-solid skeu-dark rounded-[1rem] p-8 flex flex-col items-center justify-center gap-8 hover:border-[#dc2626] skeu-mid hover:shadow-2xl transition-all duration-500 group/upload ${!wizard.config.logoUrl ? 'cursor-pointer' : ''}`}>
                  {!wizard.config.logoUrl && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/png, image/jpeg" onChange={handleLogoUpload} />}
                  {wizard.config.logoUrl ? (
                    <div className="flex items-center gap-5 animate-in zoom-in duration-500 w-full justify-start">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative shrink-0 p-2 overflow-hidden">
                        <img src={wizard.config.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <h4 className="font-medium skeu-text-primary text-sm truncate">Center Logo</h4>
                        <p className="text-xs font-medium text-green-500 mt-0.5 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Uploaded successfully
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto relative z-20">
                        <button
                          type="button"
                          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-[#3eb5a9] hover:bg-[#3eb5a9]/10 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-90"
                          title="Delete Logo"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setWizard({ ...wizard, config: { ...wizard.config, logoUrl: undefined } });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <label
                          className="p-2.5 bg-[#dc2626] text-white hover:bg-[#3eb5a9] rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-90 flex items-center gap-1.5"
                          title="Change Logo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase">Edit</span>
                          <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleLogoUpload} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-5 w-full justify-start">
                      <div className="w-14 h-14 skeu-inset skeu-text-muted rounded-2xl flex items-center justify-center group-hover/upload:bg-gradient-to-br group-hover/upload:from-[#3eb5a9] group-hover/upload:to-[#2d8a81] group-hover/upload:text-white group-hover/upload:scale-110 transition-all duration-500 shadow-inner group-hover/upload:shadow-xl shrink-0 group-hover/upload:border-2 group-hover/upload:border-white/20">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium skeu-text-primary text-sm">Drop your logo or browse</p>
                        <p className="text-xs font-medium skeu-text-muted mt-0.5">Maximum file size: 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Name Section (Shifted to step 3) */}
        <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75 mb-6">
          <button
            onClick={() => toggleSection('name')}
            className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group"
            type="button"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                <Type className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium skeu-text-primary ">Name of the QR Code</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Give your QR code a name.</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'name' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>

          {activeDesignSection === 'name' && (
            <div className="p-6 border-t border-black/5 space-y-4 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 capitalize  pl-1">QR Code Name</label>
                <input
                  type="text"
                  placeholder="e.g. Website Launch Campaign"
                  value={wizard.name}
                  onChange={(e) => setWizard({ ...wizard, name: e.target.value })}
                  className="w-full px-5 py-4 skeu-input outline-none text-sm font-bold placeholder:opacity-40"
                />
              </div>
            </div>
          )}
        </div>

        {/* Security & Gatekeeper Section */}
        <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <button
            onClick={() => toggleSection('gatekeeper')}
            className="w-full flex items-center justify-between p-5 skeu-accordion-header transition-colors group"
            type="button"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 skeu-hero-icon text-white rounded-lg flex items-center justify-center relative skeu-gloss group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium skeu-text-primary ">Gatekeeper & Settings</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Lead capture and redirection settings.</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'gatekeeper' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>

          {activeDesignSection === 'gatekeeper' && (
            <div className="p-8 border-t border-slate-50/50 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Login Wall Toggle */}
                <div className="flex items-center gap-5 p-6 skeu-input !rounded-2xl hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 group/gate cursor-pointer" onClick={() => setWizard({ ...wizard, is_protected: !wizard.is_protected })}>
                  <button
                    type="button"
                    className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${wizard.is_protected ? 'bg-[#dc2626] border-[#dc2626]' : 'bg-white border-slate-200'}`}
                  >
                    {wizard.is_protected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                  </button>
                  <div>
                    <p className="font-black text-[#0F172A] text-sm tracking-tight text-left">Login Wall</p>
                    <p className="text-[10px] font-medium text-slate-400 text-left">Require login to view</p>
                  </div>
                </div>

                {/* Lead Capture Toggle */}
                <div className="flex items-center gap-5 p-6 skeu-input !rounded-2xl hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 group/lead cursor-pointer" onClick={() => setWizard({ ...wizard, is_lead_capture: !wizard.is_lead_capture })}>
                  <button
                    type="button"
                    className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${wizard.is_lead_capture ? 'bg-[#dc2626] border-[#dc2626]' : 'bg-white border-slate-200'}`}
                  >
                    {wizard.is_lead_capture && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                  </button>
                  <div>
                    <p className="font-black text-[#0F172A] text-sm text-left">Lead Capture</p>
                    <p className="text-[10px] font-medium text-slate-400 text-left">Collect visitor info</p>
                  </div>
                </div>

                {/* Show Preview Toggle */}
                <div className="flex items-center gap-5 p-6 skeu-input !rounded-2xl hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 group/preview_toggle cursor-pointer" onClick={() => {
                  const newPreviewState = !wizard.show_preview;
                  setWizard({ ...wizard, show_preview: newPreviewState });
                  setPhonePreviewMode(newPreviewState ? 'ui' : 'qr');
                }}>
                  <button
                    type="button"
                    className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${wizard.show_preview ? 'bg-[#dc2626] border-[#dc2626]' : 'bg-white border-slate-200'}`}
                  >
                    {wizard.show_preview && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                  </button>
                  <div>
                    <p className="font-black text-[#0F172A] text-sm tracking-tight text-left">Show Preview Page</p>
                    <p className="text-[10px] font-medium text-slate-400 text-left">Directly link if disabled</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FontLoader fonts={[wizard.business?.fontTitle, wizard.business?.fontText]} />
      {/* Header with Stepper */}
      <header className="bg-white/80 backdrop-blur-md lg:bg-white border-b border-slate-100 py-4 lg:py-6 sticky top-0 z-30 shadow-sm shrink-0 px-4 md:px-12">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center w-full">
          {renderStepper({ step: wizard.step })}
          <div className="lg:hidden flex items-center justify-between w-full px-4">
            <div className="w-20 flex items-center">
              <button 
                onClick={handleBackStep}
                className="flex items-center gap-1 -ml-2 text-slate-400 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                <span className="text-[11px] font-black tracking-tighter">BACK</span>
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <img src="/src/assets/logo-full.png" alt="Logo" className="h-8 object-contain" />
            </div>
            <div className="w-20" /> {/* Right Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content Area - Split Pane Layout */}
      <div className="flex-1 overflow-hidden relative px-0 lg:px-12 bg-[#F8FAFC]">
        <div className="max-w-[1600px] mx-auto h-full px-4 lg:px-0">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-16 h-full items-stretch">

            {/* Phone Preview Section - Priority 1 on mobile */}
            <div className={`lg:col-span-4 order-1 lg:order-2 flex flex-col items-center justify-center py-4 lg:py-6 shrink transition-all duration-300 ${wizard.step === 1 ? 'flex-1' : 'h-auto'}`}>
              {/* Preview Toggle Pill - Hidden on mobile, visible on desktop */}
              <div className="w-full hidden lg:flex justify-center mb-4 shrink-0 px-4">
                <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex items-center shadow-sm relative w-full max-w-[220px]">
                  <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#dc2626] rounded-xl shadow-md transition-all duration-300 ${phonePreviewMode === 'ui' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`} />

                  <button
                    onClick={() => setPhonePreviewMode('ui')}
                    className={`flex-1 py-1.5 text-[11px] font-black  transition-all duration-300 relative z-10 ${phonePreviewMode === 'ui' ? 'text-white' : 'text-slate-400'}`}
                  >
                    UI Preview
                  </button>
                  <button
                    onClick={() => setPhonePreviewMode('qr')}
                    className={`flex-1 py-1.5 text-[11px] font-black  transition-all duration-300 relative z-10 ${phonePreviewMode === 'qr' ? 'text-white' : 'text-slate-400'}`}
                  >
                    QR Code
                  </button>
                </div>
              </div>

              {/* PREVIEW AREA (Isolated Mobile/Desktop Architecture) */}
              
              {/* PC & Tablet View (lg and up) - Decreased Fixed Mockup */}
              <div className="hidden lg:flex flex-1 flex-col items-center justify-center w-full relative group transition-all duration-700">
                <div className="w-[280px] h-[600px] relative skeu-phone p-[10px] flex flex-col shadow-2xl transition-all duration-500 scale-[0.85] xl:scale-[0.9] pointer-events-auto">
                  
                  {/* Inner Screen Area */}
                  <div className={`flex-1 rounded-[2.5rem] overflow-hidden flex flex-col z-40 relative shadow-inner transition-colors duration-500 ${(hoveredType || wizard.type) === 'whatsapp' ? 'bg-[#075E54]' :
                    ['business', 'links', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'bg-[#dc2626]' : 'bg-[#f8fafc]'
                    }`} style={{
                      backgroundColor: ['business', 'links', 'pdf'].includes((hoveredType || wizard.type) as string)
                        ? (wizard.business?.primaryColor || '#dc2626')
                        : undefined
                    }}>
                    
                    {/* PC Status Bar & Notch - Resized for Compact Mockup */}
                    <div className="absolute top-0 left-0 right-0 h-14 z-[60] pointer-events-none flex flex-col items-center">
                       <div className="skeu-phone-notch mt-2 scale-[0.75]" />
                       <div className="absolute inset-0 flex items-center justify-between px-9 pt-1">
                          <span className="text-[11px] font-black" style={{ color: ['business', 'links', 'whatsapp', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'white' : 'black' }}>9:41</span>
                          <div className="flex items-center gap-1.5 opacity-80">
                             <Wifi className="w-3.5 h-3.5" style={{ color: ['business', 'links', 'whatsapp', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'white' : 'black' }} />
                             <Clock className="w-3.5 h-3.5" style={{ color: ['business', 'links', 'whatsapp', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'white' : 'black' }} />
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                      {phonePreviewMode === 'ui' ? (
                        <div className="h-full flex flex-col animate-in fade-in duration-500">
                          <GatekeeperPreview
                            category={hoveredType || wizard.type}
                            name={wizard.name}
                            brandColor={wizard.business?.primaryColor || '#dc2626'}
                            fullValue={pdfUrl || getQRValue()}
                            businessData={wizard.business}
                            is_lead_capture={wizard.is_lead_capture}
                            isAuthorized={previewIsAuthorized}
                            isFileMode={wizard.type === 'pdf'}
                            leadForm={leadForm}
                            setLeadForm={setLeadForm as any}
                            onLeadSubmit={handlePreviewLeadSubmit}
                            viewMode={previewViewMode}
                            setViewMode={setPreviewViewMode as any}
                            isPreview={true}
                            activeSection={activeDesignSection}
                          />
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-12 p-8 animate-in zoom-in-95 duration-700">
                          <div className="relative group p-4 border border-[#E0EAF2] rounded-[3rem] bg-transparent shadow-xl transition-transform duration-500 hover:scale-[1.02]">
                            <div className="bg-white p-3 rounded-[2.5rem] shadow-inner border border-white">
                              <QRFrameWrapper frame={wizard.config.frame}>
                                <div className="relative">
                                  <StyledQRCode options={qrStylingOptions} size={180} />
                                </div>
                              </QRFrameWrapper>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone View (below lg) - Resized Compact Adaptive Mockup */}
              <div className="lg:hidden flex-1 flex flex-col items-center justify-center w-full px-4 py-4 relative group transition-all duration-700 h-[500px] overflow-hidden">
                <div className="w-full max-w-[260px] h-[500px] relative skeu-phone p-[8px] flex flex-col shadow-2xl transition-all duration-500 scale-[0.8] pointer-events-auto">
                  
                  {/* Inner Screen Area */}
                  <div className={`flex-1 rounded-[2.2rem] overflow-hidden flex flex-col z-40 relative shadow-inner transition-colors duration-500 ${(hoveredType || wizard.type) === 'whatsapp' ? 'bg-[#075E54]' :
                    ['business', 'links', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'bg-[#dc2626]' : 'bg-[#f8fafc]'
                    }`} style={{
                      backgroundColor: ['business', 'links', 'pdf'].includes((hoveredType || wizard.type) as string)
                        ? (wizard.business?.primaryColor || '#dc2626')
                        : undefined
                    }}>
                    
                    {/* Mobile Status Bar & Notch - Ultra Compact */}
                    <div className="absolute top-0 left-0 right-0 h-10 z-[60] pointer-events-none flex flex-col items-center">
                       <div className="skeu-phone-notch mt-1.5 scale-[0.6]" />
                       <div className="absolute inset-0 flex items-center justify-between px-7 pt-1">
                          <span className="text-[9px] font-black" style={{ color: ['business', 'links', 'whatsapp', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'white' : 'black' }}>9:41</span>
                          <div className="flex items-center gap-1 opacity-60">
                             <Wifi className="w-2.5 h-2.5" style={{ color: ['business', 'links', 'whatsapp', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'white' : 'black' }} />
                             <Clock className="w-2.5 h-2.5" style={{ color: ['business', 'links', 'whatsapp', 'pdf'].includes((hoveredType || wizard.type) as string) ? 'white' : 'black' }} />
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        <div className="h-full flex flex-col animate-in fade-in duration-500">
                          <GatekeeperPreview
                            category={hoveredType || wizard.type}
                            name={wizard.name}
                            brandColor={wizard.business?.primaryColor || '#dc2626'}
                            fullValue={pdfUrl || getQRValue()}
                            businessData={wizard.business}
                            is_lead_capture={wizard.is_lead_capture}
                            isAuthorized={previewIsAuthorized}
                            isFileMode={wizard.type === 'pdf'}
                            leadForm={leadForm}
                            setLeadForm={setLeadForm as any}
                            onLeadSubmit={handlePreviewLeadSubmit}
                            viewMode={previewViewMode}
                            setViewMode={setPreviewViewMode as any}
                            isPreview={true}
                          />
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Label - Hidden on mobile, visible on desktop */}
              <div className="mt-2 text-center shrink-0 hidden lg:block">
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center justify-center gap-2">
                  Live Preview: <span className="text-[#dc2626] font-black">{selectedTypeConfig.name}</span>
                </p>
              </div>
            </div>

            {/* Content/Selection Section - Priority 2 on mobile */}
            <div className={`lg:col-span-8 order-2 lg:order-1 transition-all duration-300 ${wizard.step === 1 ? 'h-auto shrink-0 z-50 mb-6 pb-32 lg:mb-0 lg:pb-0 mt-[-2rem] lg:mt-0' : 'flex-1 overflow-y-auto scrollbar-hide py-4 lg:py-16 pb-48'}`}>
              {wizard.step === 1 ? (
                renderStep1TypeSelection()
              ) : wizard.step === 2 ? (
                <div className="space-y-12 overflow-y-auto scrollbar-hide py-4 lg:py-16 pb-48">
                  {renderStep2Content()}
                </div>
              ) : (
                <div className="space-y-12 overflow-y-auto scrollbar-hide py-4 lg:py-16 pb-48">
                  {renderStep3Style()}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Footer Navigation - Refactored to be part of flow */}
      <footer className={`${wizard.step === 1 ? 'hidden lg:block' : 'block'} skeu-toolbar border-t border-slate-100 py-6 z-[60] shrink-0 bg-white px-4 md:px-12 mt-auto`}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-center w-full">
          <button
            onClick={handleBackStep}
            disabled={wizard.step === 1}
            type="button"
            className="hidden lg:flex sm:w-48 py-3.5 skeu-btn-secondary text-[11px] font-medium capitalize items-center justify-center gap-2 rounded-xl active:scale-95 disabled:opacity-30 disabled:grayscale transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4" /> BACK
          </button>

          <button
            onClick={handleNextStep}
            type="button"
            className={`${wizard.step === 1 ? 'hidden lg:flex' : 'flex'} w-full lg:w-48 py-4 lg:py-3.5 skeu-btn text-[12px] lg:text-[11px] font-black lg:font-medium capitalize flex items-center justify-center gap-2 rounded-2xl lg:rounded-xl active:scale-95 transition-all shadow-lg ml-0`}
          >
            {wizard.step === 3 ? 'FINISH' : 'NEXT STEP'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
