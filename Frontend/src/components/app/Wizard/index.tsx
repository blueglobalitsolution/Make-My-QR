import React from 'react';
import { ChevronRight, ChevronLeft, Check, Plus, X, Folder as FolderIcon, ChevronDown, Globe, FileText, Link as LinkIcon, MessageCircle, Briefcase, Layout, Maximize, Image as ImageIcon, Upload, Trash2, CheckCheck, Star, Palette as PaletteIcon, Info, Barcode, Type, Video, Phone, MoreVertical, Smile, Paperclip, Mic, UserCircle, Camera } from 'lucide-react';
import { WizardState, Folder, BusinessConfig, BusinessButton } from '../../../../types';
import { QR_TYPES_CONFIG, FRAME_STYLES, PATTERN_OPTIONS, CORNER_SQUARE_OPTIONS, CORNER_DOT_OPTIONS, DEFAULT_BUSINESS_PRESETS, FONT_OPTIONS, LINKS_DESIGN_PRESETS } from '../../../../components/constants';
import { StyledQRCode } from '../../../../components/StyledQRCode';
import { QRFrameWrapper } from '../../../../components/QRFrameWrapper';

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
  handleCoverImageUpload,
  qrStylingOptions,
  selectedTypeConfig,
  phonePreviewMode,
  setPhonePreviewMode,
  createNewFolder,
  getQRValue,
}) => {
  const [hoveredType, setHoveredType] = React.useState<WizardState['type'] | null>(null);

  const renderStepper = ({ step }: { step: number }) => {
    const steps = [
      { n: 1, label: 'TYPE' },
      { n: 2, label: 'CONTENT' },
      { n: 3, label: 'STYLE' },
    ];
    return (
      <div className="flex items-center justify-center gap-12">
        {steps.map((s, idx) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 flex items-center justify-center text-[14px] font-black rounded-full transition-all ${step >= s.n ? 'skeu-tag-active shadow-lg shadow-blue-500/10 scale-110' : 'skeu-inset skeu-text-muted'}`}>
                {s.n}
              </div>
              <span className={`text-[11px] font-black tracking-widest transition-colors ${step >= s.n ? 'skeu-text-primary' : 'skeu-text-muted'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-16 h-[2px] skeu-inset" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStep1TypeSelection = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left">
        <h2 className="text-[11px] font-black skeu-text-muted uppercase tracking-[0.3em]">1. Select a type of QR code</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {QR_TYPES_CONFIG.map((type) => (
          <button
            key={type.id}
            onClick={() => setWizard({ ...wizard, type: type.id as any })}
            onMouseEnter={() => setHoveredType(type.id as any)}
            onMouseLeave={() => setHoveredType(null)}
            type="button"
            className={`group p-8 aspect-square rounded-[2.5rem] transition-all duration-500 flex flex-col items-center justify-center text-center gap-6 ${wizard.type === type.id ? 'skeu-card shadow-2xl scale-105 bg-white' : 'skeu-card hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1'}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 relative skeu-gloss ${wizard.type === type.id ? 'skeu-hero-icon text-white' : 'skeu-inset skeu-text-accent'}`}>
              <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {type.id === 'website' && <Globe className="w-8 h-8" strokeWidth={1.5} />}
                {type.id === 'pdf' && <FileText className="w-8 h-8" strokeWidth={1.5} />}
                {type.id === 'whatsapp' && <MessageCircle className="w-8 h-8" strokeWidth={1.5} />}
                {type.id === 'business' && <Briefcase className="w-8 h-8" strokeWidth={1.5} />}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className={`font-black text-lg tracking-tight transition-colors duration-300 ${wizard.type === type.id ? 'skeu-text-accent' : 'skeu-text-primary group-hover:skeu-text-accent'}`}>{type.name}</h3>
              <p className="text-[11px] font-normal skeu-text-muted leading-relaxed px-1">
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
        <h2 className="text-[11px] font-black skeu-text-muted uppercase tracking-[0.3em] ml-1">2. Add content to your QR code</h2>
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
                  <h3 className="text-base font-black skeu-text-primary tracking-tight uppercase">Website URL</h3>
                  <p className="text-[10px] font-medium skeu-text-muted">Link your QR code to any website.</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'content' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
            </button>

            {activeDesignSection === 'content' && (
              <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black skeu-text-muted uppercase tracking-widest">Destination URL *</label>
                  <span className="text-[9px] font-black skeu-text-muted uppercase tracking-widest italic opacity-60">Supports http:// and https://</span>
                </div>

                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    <Globe className="w-5 h-5 skeu-text-accent transition-colors" />
                    <div className="h-6 w-[1.5px] skeu-dark opacity-30" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://www.yourwebsite.com"
                    value={wizard.value}
                    onChange={(e) => setWizard({ ...wizard, value: e.target.value })}
                    className="w-full pl-20 pr-6 py-4 skeu-input text-sm font-bold placeholder:opacity-20 translate-y-0"
                  />
                </div>

                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 flex gap-4 animate-in fade-in duration-700">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-medium text-blue-600/80 leading-relaxed">
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
                    <h3 className="text-base font-black skeu-text-primary tracking-tight">WhatsApp Information</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Direct link to start a WhatsApp chat</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 skeu-text-muted" />
              </div>

              <div className="space-y-6">
                <div className="space-y-3 text-left">
                  <label className="text-[11px] font-bold skeu-text-muted uppercase tracking-widest pl-1">Phone number *</label>
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
                  <label className="text-[11px] font-bold skeu-text-muted uppercase tracking-widest pl-1">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Write your message"
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    className="w-full px-5 py-4 skeu-input resize-none text-sm font-bold"
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
                    <h3 className="text-base font-black skeu-text-primary tracking-tight">PDF Upload</h3>
                    <p className="text-[10px] font-medium skeu-text-muted">Select and upload your PDF document.</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'upload' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'upload' && (
                <div className="p-6 border-t border-black/5 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="relative group">
                    <div className="border-4 border-dashed skeu-dark rounded-[3rem] p-16 flex flex-col items-center justify-center gap-8 hover:border-[#156295] skeu-mid hover:shadow-2xl transition-all duration-500 cursor-pointer group/upload">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="application/pdf" onChange={handlePdfUpload} />
                      {pdfUrl ? (
                        <div className="text-center animate-in zoom-in duration-500">
                          <div className="w-24 h-24 skeu-hero-icon text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative skeu-gloss">
                            <FileText className="w-12 h-12" />
                          </div>
                          <h4 className="font-black skeu-text-primary text-xl tracking-tight">{pdfFileName}</h4>
                          <p className="text-sm font-medium skeu-text-muted mt-1">File uploaded successfully</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-24 h-24 skeu-inset skeu-text-muted rounded-[2.5rem] flex items-center justify-center group-hover/upload:skeu-hero-icon group-hover/upload:text-white group-hover/upload:scale-110 transition-all duration-500 shadow-inner group-hover/upload:shadow-xl">
                            <Upload className="w-12 h-12" />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="font-black skeu-text-primary text-xl tracking-tight">Drop your PDF or browse</p>
                            <p className="text-sm font-medium skeu-text-muted">Maximum file size: 20MB</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Design */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              <button onClick={() => toggleSection('design')} className="w-full flex items-center justify-between p-8 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 skeu-hero-icon text-white rounded-2xl flex items-center justify-center relative skeu-gloss">
                    <PaletteIcon className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black skeu-text-primary tracking-tight">Design</h3>
                    <p className="text-sm font-medium skeu-text-muted">Choose a color theme for your page.</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'design' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'design' && (
                <div className="p-10 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="space-y-6">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Color Palette</p>
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
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Color</label>
                      <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border-2 border-slate-50">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.primaryColor }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.primaryColor} onChange={(e) => updateBusinessField('primaryColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700 tracking-widest text-sm">{wizard.business?.primaryColor}</span>
                      </div>
                    </div>
                    <button type="button" onClick={swapColors} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#156295] hover:bg-blue-50 transition-colors mt-8">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                    <div className="flex-1 space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Secondary Color</label>
                      <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border-2 border-slate-50">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.secondaryColor }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.secondaryColor} onChange={(e) => updateBusinessField('secondaryColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700 tracking-widest text-sm">{wizard.business?.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PDF Information */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <button onClick={() => toggleSection('pdf_info')} className="w-full flex items-center justify-between p-8 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 skeu-hero-icon text-white rounded-2xl flex items-center justify-center relative skeu-gloss">
                    <Info className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black skeu-text-primary tracking-tight">PDF Information</h3>
                    <p className="text-sm font-medium skeu-text-muted">Details about the PDF content.</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'pdf_info' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'pdf_info' && (
                <div className="p-10 border-t border-slate-50/50 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Company Name</label>
                      <input type="text" placeholder="My Company" value={wizard.business?.company || ''} onChange={(e) => updateBusinessField('company', e.target.value)} className="w-full px-8 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">PDF Title</label>
                      <input type="text" placeholder="Find me on social networks" value={wizard.business?.title || ''} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-8 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                    <textarea rows={3} placeholder="New content every week in the links below" value={wizard.business?.description || ''} onChange={(e) => updateBusinessField('description', e.target.value)} className="w-full px-8 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Website</label>
                      <input type="text" placeholder="https://..." value={wizard.business?.buttons?.[0]?.url || ''} onChange={(e) => updateLink(wizard.business?.buttons?.[0]?.id || '1', 'url', e.target.value)} className="w-full px-8 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Button Name</label>
                      <input type="text" placeholder="My Website" value={wizard.business?.buttons?.[0]?.text || ''} onChange={(e) => updateBusinessField('welcomeScreenImage', e.target.value)} className="w-full px-8 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] transition-all" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fonts */}
            <div className="skeu-accordion overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <button onClick={() => toggleSection('fonts')} className="w-full flex items-center justify-between p-8 skeu-accordion-header transition-colors group" type="button">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 skeu-hero-icon text-white rounded-2xl flex items-center justify-center relative skeu-gloss">
                    <i className="font-serif text-2xl font-black">T</i>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black skeu-text-primary tracking-tight">Fonts</h3>
                    <p className="text-sm font-medium skeu-text-muted">Customize fonts and colors.</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'fonts' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
              </button>
              {activeDesignSection === 'fonts' && (
                <div className="p-10 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Title Font</label>
                      <select value={wizard.business?.fontTitle} onChange={(e) => updateBusinessField('fontTitle', e.target.value)} className="w-full pl-8 pr-12 py-5 skeu-input appearance-none">
                        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Text Font</label>
                      <select value={wizard.business?.fontText} onChange={(e) => updateBusinessField('fontText', e.target.value)} className="w-full pl-8 pr-12 py-5 skeu-input appearance-none">
                        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Title Color</label>
                      <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border-2 border-slate-50">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.fontTitleColor || '#ffffff' }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.fontTitleColor || '#ffffff'} onChange={(e) => updateBusinessField('fontTitleColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700 tracking-widest text-sm">{wizard.business?.fontTitleColor || '#ffffff'}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Text Color</label>
                      <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border-2 border-slate-50">
                        <div className="w-10 h-10 rounded-full shadow-sm relative overflow-hidden" style={{ backgroundColor: wizard.business?.fontTextColor || '#ffffff' }}>
                          <input type="color" className="absolute inset-0 opacity-0 cursor-pointer scale-[2]" value={wizard.business?.fontTextColor || '#ffffff'} onChange={(e) => updateBusinessField('fontTextColor', e.target.value)} />
                        </div>
                        <span className="font-bold text-slate-700 tracking-widest text-sm">{wizard.business?.fontTextColor || '#ffffff'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business, Links Types */}
        {(wizard.type === 'business' || wizard.type === 'links') && (
          <div className="space-y-6">
            {/* Design Settings Accordion */}
            <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => toggleSection('design')}
                className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group"
                type="button"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-50 text-[#156295] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <PaletteIcon className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Design Settings</h3>
                    <p className="text-sm font-medium text-slate-400">Visual style, fonts and brand colors</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'design' ? 'rotate-180 text-[#156295]' : 'group-hover:text-slate-400'}`} />
              </button>

              {activeDesignSection === 'design' && (
                <div className="p-10 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Brand Color</label>
                      <div className="flex items-center gap-6 p-2 bg-slate-50/50 rounded-2xl border-2 border-slate-50 transition-all hover:border-[#156295]/20 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 group">
                        <div className="w-16 h-12 rounded-xl border-2 border-white shadow-sm relative overflow-hidden ring-1 ring-slate-100" style={{ backgroundColor: wizard.business?.primaryColor }}>
                          <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-[2]"
                            value={wizard.business?.primaryColor}
                            onChange={(e) => updateBusinessField('primaryColor', e.target.value)}
                          />
                        </div>
                        <span className="font-bold text-slate-700 uppercase tracking-widest text-sm">{wizard.business?.primaryColor}</span>
                      </div>
                    </div>
                    {true && (
                      <div className="space-y-5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Typography</label>
                        <div className="relative group/select">
                          <select
                            value={wizard.business?.fontTitle}
                            onChange={(e) => updateBusinessField('fontTitle', e.target.value)}
                            className="w-full pl-8 pr-12 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] appearance-none transition-all shadow-inner focus:shadow-xl focus:shadow-blue-500/5"
                          >
                            {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover/select:text-[#156295] transition-colors" />
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
                    <h3 className="text-xl font-black text-[#0F172A] tracking-tight">
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
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Display Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. My Website"
                          value={wizard.business?.title || ''}
                          onChange={(e) => updateBusinessField('title', e.target.value)}
                          className="w-full px-8 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] transition-all shadow-inner focus:shadow-xl focus:shadow-blue-500/5 placeholder:text-slate-200"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Company / Sub-headline</label>
                        <input
                          type="text"
                          placeholder="e.g. Tech Solutions"
                          value={wizard.business?.company || ''}
                          onChange={(e) => updateBusinessField('company', e.target.value)}
                          className="w-full px-8 py-5 bg-slate-50/50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#156295] focus:bg-white font-bold text-[#0F172A] transition-all shadow-inner focus:shadow-xl focus:shadow-blue-500/5 placeholder:text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Action Buttons / Links</label>
                        <button
                          type="button"
                          onClick={addLink}
                          className="bg-blue-50 text-[#156295] px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#156295] hover:text-white transition-all flex items-center gap-2 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 translate-y-0 hover:-translate-y-0.5"
                        >
                          <Plus className="w-4 h-4" /> Add Link
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {wizard.business?.buttons.map((link) => (
                          <div key={link.id} className="group/item flex items-center gap-4 p-5 bg-slate-50/30 border-2 border-slate-50 rounded-2xl hover:bg-white hover:border-white hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 animate-in zoom-in-95">
                            <div className="flex-1 space-y-5">
                              <input
                                type="text"
                                value={link.text}
                                onChange={(e) => updateLink(link.id, 'text', e.target.value)}
                                placeholder="Button Name"
                                className="w-full bg-transparent border-none outline-none font-black text-[#0F172A] text-base p-0 focus:ring-0 placeholder:text-slate-200"
                              />
                              <div className="flex items-center gap-4 group/input bg-white/50 p-4 rounded-xl border border-slate-100/50 focus-within:border-[#156295]/30 focus-within:bg-white transition-all shadow-inner">
                                <LinkIcon className="w-4 h-4 text-slate-300 group-focus-within/input:text-[#156295] transition-colors" />
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

        {/* Name Section */}
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <button
            onClick={() => toggleSection('name')}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
            type="button"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Type className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">Name of the QR Code</h3>
                <p className="text-[10px] font-medium text-slate-400">Give your QR code a name.</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-all duration-500 ${activeDesignSection === 'name' ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'name' && (
            <div className="p-6 border-t border-slate-50/50 space-y-4 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">QR Code Name</label>
                <input
                  type="text"
                  placeholder="e.g. Website Launch Campaign"
                  value={wizard.name}
                  onChange={(e) => setWizard({ ...wizard, name: e.target.value })}
                  className="w-full px-5 py-4 skeu-input outline-none focus:ring-[10px] focus:ring-blue-500/5 focus:border-blue-500 bg-white font-bold text-sm text-[#0F172A] transition-all placeholder:text-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save to Folder Section */}
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <button
            onClick={() => toggleSection('folder')}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
            type="button"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <FolderIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-[#0F172A] tracking-tight uppercase">SAVE TO FOLDER</h3>
                <p className="text-[10px] font-medium text-slate-400">Organize your codes by category.</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-all duration-500 ${activeDesignSection === 'folder' ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'folder' && (
            <div className="p-6 border-t border-slate-50/50 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="space-y-5">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Choose Folder</label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(true)}
                    className="text-[#156295] font-bold text-xs hover:underline flex items-center gap-1"
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
                      className={`p-4 rounded-xl border-2 text-left transition-all relative group/folder ${wizard.folderId === folder.id ? 'border-[#156295] bg-white shadow-xl shadow-blue-500/10 z-10 scale-102' : 'bg-white border-slate-50 hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/50 shadow-sm'}`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${wizard.folderId === folder.id ? 'bg-[#156295] text-white shadow-md shadow-[#156295]/20' : 'bg-slate-50 text-slate-300 group-hover/folder:bg-white group-hover/folder:text-[#156295] border border-transparent group-hover/folder:border-slate-100'}`}>
                          <FolderIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-black tracking-tight truncate text-sm ${wizard.folderId === folder.id ? 'text-[#0F172A]' : 'text-slate-700'}`}>{folder.name}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{folder.count} codes</p>
                        </div>
                      </div>
                      {wizard.folderId === folder.id && (
                        <div className="absolute top-4 right-4 bg-[#156295] text-white p-0.5 rounded-full shadow-lg animate-in zoom-in duration-300">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {isCreatingFolder && (
                  <div className="mt-6 flex items-center gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in slide-in-from-top-2">
                    <input
                      type="text"
                      placeholder="Folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="flex-1 px-5 py-3 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-[#156295] font-bold"
                    />
                    <button
                      type="button"
                      onClick={createNewFolder}
                      className="px-6 py-3 bg-[#156295] text-white rounded-xl font-bold hover:bg-[#0E4677]"
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
        <h2 className="text-[11px] font-black skeu-text-muted uppercase tracking-[0.3em] ml-1">3. Design the QR</h2>
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
                <h3 className="text-base font-black skeu-text-primary tracking-tight">Frame Layout</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Add a call-to-action frame</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'frame' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>
          {activeDesignSection === 'frame' && (
            <div className="p-6 border-t border-black/5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 animate-in slide-in-from-top-4 duration-500 origin-top">
              {FRAME_STYLES.map((style: any) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setWizard({ ...wizard, config: { ...wizard.config, frame: style.id } })}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all group/item ${wizard.config.frame === style.id ? 'skeu-card scale-105 skeu-text-accent shadow-xl' : 'skeu-card skeu-text-muted translate-y-0'}`}
                >
                  <div className={`transition-transform duration-500 ${wizard.config.frame === style.id ? 'scale-150' : 'scale-125'}`}>{style.icon}</div>
                  <span className={`text-[9px] font-black uppercase mt-4 tracking-widest ${wizard.config.frame === style.id ? 'skeu-text-accent' : 'skeu-text-muted opacity-50'}`}>{style.label}</span>
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
                <h3 className="text-base font-black skeu-text-primary tracking-tight">QR Pattern & Colors</h3>
                <p className="text-[10px] font-medium skeu-text-muted">Dots, squares and custom colors</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 skeu-text-muted transition-all duration-500 ${activeDesignSection === 'pattern' ? 'rotate-180 skeu-text-accent' : 'group-hover:skeu-text-secondary'}`} />
          </button>

          {activeDesignSection === 'pattern' && (
            <div className="p-6 border-t border-black/5 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {PATTERN_OPTIONS.map((opt: any) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWizard({ ...wizard, config: { ...wizard.config, pattern: opt.id } })}
                    className={`aspect-square flex items-center justify-center rounded-2xl transition-all group/item ${wizard.config.pattern === opt.id ? 'skeu-card scale-105 skeu-text-accent shadow-xl' : 'skeu-card skeu-text-muted translate-y-0'}`}
                  >
                    <div className={`p-1 transition-transform duration-500 ${wizard.config.pattern === opt.id ? 'scale-125' : 'group-hover/item:scale-110'}`}>{opt.icon}</div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4 px-1">
                  <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Foreground Color</label>
                  <div className="flex items-center gap-6 p-3 skeu-input group/color">
                    <div className="w-16 h-12 rounded-xl skeu-mid border-2 border-black/5 shadow-inner relative overflow-hidden" style={{ backgroundColor: wizard.config.fgColor }}>
                      <input type="color" value={wizard.config.fgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, fgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5]" />
                    </div>
                    <span className="font-bold skeu-text-primary uppercase tracking-widest text-sm">{wizard.config.fgColor}</span>
                  </div>
                </div>
                <div className="space-y-4 px-1">
                  <label className="text-[11px] font-black skeu-text-muted uppercase tracking-widest pl-1">Background Color</label>
                  <div className="flex items-center gap-6 p-3 skeu-input group/color">
                    <div className="w-16 h-12 rounded-xl skeu-mid border-2 border-black/5 shadow-inner relative overflow-hidden" style={{ backgroundColor: wizard.config.bgColor }}>
                      <input type="color" value={wizard.config.bgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, bgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5]" />
                    </div>
                    <span className="font-bold skeu-text-primary uppercase tracking-widest text-sm">{wizard.config.bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-slate-50/30 p-8 rounded-[2.5rem] border-2 border-slate-50 hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group/trans">
                <button
                  type="button"
                  onClick={() => setIsTransparent(!isTransparent)}
                  className={`w-7 h-7 rounded-[10px] border-2 flex items-center justify-center transition-all shadow-sm ${isTransparent ? 'bg-[#156295] border-[#156295] shadow-lg shadow-blue-500/20' : 'bg-white border-slate-200 group-hover/trans:border-slate-300'}`}
                >
                  {isTransparent && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                </button>
                <div className="cursor-pointer" onClick={() => setIsTransparent(!isTransparent)}>
                  <p className="font-black text-[#0F172A] tracking-tight">Transparent Background</p>
                  <p className="text-sm font-medium text-slate-400">Remove background for transparency</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Eyes Style */}
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <button onClick={() => toggleSection('corners')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group" type="button">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Maximize className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">Eye Styles</h3>
                <p className="text-[10px] font-medium text-slate-400">Shape of the corner indicators</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-all duration-500 ${activeDesignSection === 'corners' ? 'rotate-180 text-amber-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'corners' && (
            <div className="p-6 border-t border-slate-50/50 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="space-y-6">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Eye Frame Shape</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {CORNER_SQUARE_OPTIONS.map((opt: any) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersSquareType: opt.id } })}
                      className={`aspect-square flex items-center justify-center rounded-2xl border-2 transition-all group/item ${wizard.config.cornersSquareType === opt.id ? 'border-[#156295] bg-white text-[#156295] shadow-2xl shadow-blue-500/20 z-10 scale-102' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-300 shadow-sm'}`}
                    >
                      <div className={`transition-transform duration-500 ${wizard.config.cornersSquareType === opt.id ? 'scale-125' : 'group-hover/item:scale-110'}`}>{opt.icon}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Eye Dot Shape</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {CORNER_DOT_OPTIONS.map((opt: any) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersDotType: opt.id } })}
                      className={`aspect-square flex items-center justify-center rounded-2xl border-2 transition-all group/item ${wizard.config.cornersDotType === opt.id ? 'border-[#156295] bg-white text-[#156295] shadow-2xl shadow-blue-500/20 z-10 scale-102' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-300 shadow-sm'}`}
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
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <button onClick={() => toggleSection('logo')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group" type="button">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">Add Center Logo</h3>
                <p className="text-[10px] font-medium text-slate-400">Place your brand in the center</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-all duration-500 ${activeDesignSection === 'logo' ? 'rotate-180 text-red-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'logo' && (
            <div className="p-6 border-t border-slate-50/50 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="relative group/logo-zone">
                <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center justify-center gap-8 hover:border-[#156295] hover:bg-blue-50/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 cursor-pointer group/item">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleLogoUpload} />
                  {wizard.config.logoUrl ? (
                    <div className="relative group/logo-preview animate-in zoom-in duration-500">
                      <img src={wizard.config.logoUrl} className="w-36 h-36 object-contain shadow-2xl rounded-3xl border-4 border-white transition-transform duration-500 group-hover/logo-preview:scale-105" alt="Logo" />
                      <div className="absolute inset-0 bg-[#156295]/20 rounded-3xl opacity-0 group-hover/logo-preview:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-[2px]">
                        <Upload className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50/50 group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-50/60 rounded-full flex items-center justify-center border border-blue-100/30">
                          <span className="text-[11px] font-black text-[#156295]/50 uppercase tracking-widest">LOGO</span>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="font-black text-[#0F172A] text-xl tracking-tight">Click or drag logo</p>
                        <p className="text-sm font-medium text-slate-400">PNG or JPG, maximum 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {wizard.config.logoUrl && (
                <button
                  type="button"
                  onClick={() => setWizard({ ...wizard, config: { ...wizard.config, logoUrl: undefined } })}
                  className="w-full py-5 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:shadow-red-500/20 uppercase text-xs tracking-widest active:scale-95"
                >
                  <Trash2 className="w-5 h-5" /> Remove current logo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Header with Stepper */}
      <header className="bg-white border-b border-slate-100 px-10 py-6 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center">
          {renderStepper({ step: wizard.step })}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        <div className="max-w-[1600px] mx-auto px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative items-start">
            {/* Left Side: Content */}
            <div className="lg:col-span-8 space-y-12 pb-24">
              {wizard.step === 1 ? (
                renderStep1TypeSelection()
              ) : wizard.step === 2 ? (
                renderStep2Content()
              ) : (
                renderStep3Style()
              )}
            </div>

            {/* Right Side: Phone Preview (Sticky) */}
            <div className="lg:col-span-4 sticky top-10 self-start flex flex-col items-center gap-6">
              {/* Preview Toggle Pill (Matches Screenshot 1 position) */}
              <div className="w-full flex justify-center mb-6">
                <div className="bg-[#f8fafc] border border-slate-200 p-1 rounded-xl flex items-center shadow-inner relative w-full max-w-[260px]">
                  {/* Sliding active background */}
                  <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#156295] rounded-lg shadow-md transition-all duration-300 ${phonePreviewMode === 'ui' ? 'left-1' : 'left-[calc(50%+2px)]'}`} />

                  <button
                    onClick={() => setPhonePreviewMode('ui')}
                    className={`flex-1 py-1.5 text-[12px] font-black tracking-wide transition-all duration-300 relative z-10 ${phonePreviewMode === 'ui' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    UI Preview
                  </button>
                  <button
                    onClick={() => setPhonePreviewMode('qr')}
                    className={`flex-1 py-1.5 text-[12px] font-black tracking-wide transition-all duration-300 relative z-10 ${phonePreviewMode === 'qr' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    QR Code
                  </button>
                </div>
              </div>

              <div className="relative group scale-90 origin-top">
                {/* Decorative Elements */}
                <div className="absolute -inset-20 bg-blue-500/5 blur-[120px] rounded-full -z-10 group-hover:bg-blue-500/10 transition-colors duration-1000" />

                <div className="skeu-phone w-[280px] h-[580px] relative shrink-0">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 skeu-phone-notch z-50 overflow-hidden" />

                  <div className="absolute inset-0 bg-white rounded-[2.8rem] overflow-hidden flex flex-col">
                    {/* Phone Status Bar (Matches Screenshot 10) */}
                    <div className="bg-[#000000] h-10 px-6 flex items-end pb-1.5 justify-between shrink-0 z-30">
                      <span className="text-white text-[10px] font-black tracking-tight">9:41</span>
                      <div className="flex items-center gap-1.5 text-white">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 19.5h3v-3h-3v3zm4.5 0h3v-6h-3v6zm4.5 0h3v-9h-3v9zm4.5 0h3v-12h-3v12z" /></svg>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
                        <div className="w-4 h-2 border-2 border-white/40 rounded-sm relative">
                          <div className="absolute inset-0.5 bg-white rounded-px w-2" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide relative">
                      {phonePreviewMode === 'ui' ? (
                        <div className="h-full flex flex-col animate-in fade-in duration-500">
                          {/* High Fidelity UI Previews */}
                          {(hoveredType || wizard.type) === 'website' && (
                            <div className="h-full flex flex-col bg-slate-50">
                              <div className="h-32 bg-[#4FD1C5] w-full flex flex-col justify-center px-6 shrink-0 shadow-sm">
                                <div className="flex items-center gap-3 w-full max-w-[280px] mx-auto">
                                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
                                    <Globe className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 h-8 bg-white/20 rounded-xl backdrop-blur-md flex items-center px-4 overflow-hidden">
                                    <span className="text-[11px] font-black text-white truncate">
                                      {wizard.value || 'https://yourwebsite.com'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 bg-white pt-8 px-6 space-y-6 flex flex-col">
                                <div className="w-full aspect-[4/3] rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-8 transition-colors duration-500 shrink-0">
                                  <Globe className="w-16 h-16 text-[#156295] opacity-10" />
                                </div>
                                <div className="space-y-3 px-2 shrink-0">
                                  <div className="h-2.5 w-3/4 bg-slate-100 rounded-full" />
                                  <div className="h-2.5 w-1/2 bg-slate-100 rounded-full opacity-60" />
                                </div>
                                <div className="pt-2 pb-8 mt-auto shrink-0">
                                  <div className="h-12 w-full bg-[#156295]/10 rounded-2xl border border-[#156295]/5" />
                                </div>
                              </div>
                            </div>
                          )}

                          {(hoveredType || wizard.type) === 'whatsapp' && (
                            <div className="h-full flex flex-col pt-0 bg-[#efe7de] relative">
                              {/* Custom Doodle Background Overlay */}
                              <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }} />

                              {/* WhatsApp Header (Matches Screenshot 10) */}
                              <div className="bg-[#075E54] p-3 pt-6 text-white flex items-center justify-between shrink-0 shadow-lg relative z-10">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xl overflow-hidden border border-white/10 shrink-0">
                                    <UserCircle className="w-full h-full" />
                                  </div>
                                  <div className="text-left min-w-0 flex-1">
                                    <h4 className="text-[13px] font-black tracking-tight leading-tight truncate">+{whatsappCountryCode} {whatsappPhone || '84606 87490'}</h4>
                                    <p className="text-[9px] font-bold opacity-60">Online</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2.5 pr-1 shrink-0">
                                  <Video className="w-4 h-4 text-white/90" />
                                  <Phone className="w-3.5 h-3.5 text-white/90" />
                                  <MoreVertical className="w-4 h-4 text-white/90" />
                                </div>
                              </div>

                              {/* Chat Area */}
                              <div className="flex-1 p-4 flex flex-col justify-start relative z-10 pt-8">
                                <div className="self-end max-w-[85%] relative mb-3 animate-in slide-in-from-right-4 duration-500">
                                  <div className="bg-[#DCF8C6] p-2 rounded-xl rounded-tr-none shadow-sm relative border border-green-200/50">
                                    <p className="text-[12px] font-medium text-slate-800 text-left leading-relaxed">
                                      {whatsappMessage || "Type a message."}
                                    </p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                      <span className="text-[8px] font-bold text-slate-400">9:41</span>
                                      <CheckCheck className="w-3 h-3 text-blue-400" />
                                    </div>
                                    {/* Bubble Tail */}
                                    <div className="absolute -right-1.5 top-0 w-2.5 h-2.5 bg-[#DCF8C6] clip-bubble-tail" />
                                  </div>
                                </div>
                              </div>

                              {/* WhatsApp Input Bar */}
                              <div className="p-3 bg-transparent relative z-10 flex items-center gap-2 mb-4 px-4">
                                <div className="flex-1 bg-white rounded-full h-12 flex items-center px-4 gap-3 shadow-sm border border-slate-200/50">
                                  <Smile className="w-6 h-6 text-slate-400" />
                                  <span className="text-sm font-medium text-slate-300">Message</span>
                                  <div className="ml-auto flex items-center gap-4">
                                    <Paperclip className="w-5 h-5 text-slate-400 -rotate-45" />
                                    <Camera className="w-6 h-6 text-slate-400" />
                                  </div>
                                </div>
                                <div className="w-12 h-12 bg-[#00A884] rounded-full flex items-center justify-center shadow-md">
                                  <Mic className="w-6 h-6 text-white" />
                                </div>
                              </div>
                            </div>
                          )}

                          {((hoveredType || wizard.type) === 'business' || (hoveredType || wizard.type) === 'links' || (hoveredType || wizard.type) === 'pdf') && (
                            <div className="h-full flex flex-col bg-white">
                              {/* Brand Header Section */}
                              <div className="px-6 py-12 text-center space-y-4 shrink-0 transition-all duration-700 relative overflow-hidden" style={{ backgroundColor: ((hoveredType || wizard.type) === wizard.type ? wizard.business?.primaryColor : '#156295') || '#156295' }}>
                                {/* Subtle Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                                <p className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10" style={{ color: wizard.business?.fontTitleColor || '#ffffff', opacity: 0.8 }}>
                                  {wizard.business?.company || 'MY COMPANY'}
                                </p>
                                <h2 className="text-2xl font-black leading-tight px-4 relative z-10" style={{ color: wizard.business?.fontTitleColor || '#ffffff', fontFamily: wizard.business?.fontTitle || 'Inter' }}>
                                  {wizard.business?.title || 'Find me on social networks'}
                                </h2>
                                <p className="text-xs font-medium px-6 relative z-10" style={{ color: wizard.business?.fontTextColor || '#ffffff', opacity: 0.9, fontFamily: wizard.business?.fontText || 'Inter' }}>
                                  {wizard.business?.description || 'New content every week in the links below'}
                                </p>
                              </div>

                              {/* Content Section */}
                              <div className="flex-1 bg-white rounded-t-[2.5rem] -mt-6 p-6 flex flex-col z-10 overflow-y-auto scrollbar-hide">
                                {(hoveredType || wizard.type) === 'pdf' ? (
                                  <div className="flex-1 bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex flex-col items-center justify-center p-8 text-center space-y-6">
                                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                                      <FileText className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {pdfFileName ? 'PDF UPLOADED' : 'NO PDF UPLOADED'}
                                      </p>
                                      <h4 className="font-black text-slate-700 text-base line-clamp-2">
                                        {pdfFileName || ''}
                                      </h4>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {wizard.business?.buttons.map((btn: any) => (
                                      <div
                                        key={btn.id}
                                        className="w-full p-5 rounded-[1.5rem] flex items-center gap-4 border border-white/10 shadow-xl shadow-blue-500/5 transition-all hover:translate-y-[-2px] active:scale-[0.97] cursor-pointer"
                                        style={{ backgroundColor: wizard.business?.primaryColor || '#156295', color: '#fff' }}
                                      >
                                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                          <LinkIcon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black truncate tracking-tight">{btn.text || 'Action Link'}</span>
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                      </div>
                                    ))}
                                    {(!wizard.business?.buttons || wizard.business?.buttons.length === 0) && (
                                      <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                          <Plus className="w-6 h-6 text-slate-200" />
                                        </div>
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Add your first link</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {!['website', 'pdf', 'business', 'links', 'whatsapp', 'vcard'].includes((hoveredType || wizard.type) as string) && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8">
                              <div className="w-28 h-28 bg-blue-50 text-[#156295] rounded-[3rem] flex items-center justify-center skeu-card shadow-blue-500/10">
                                <Barcode className="w-14 h-14" />
                              </div>
                              <div className="space-y-3">
                                <h4 className="font-black text-slate-800 text-2xl tracking-tight">QR Preview</h4>
                                <p className="text-[12px] font-bold text-slate-400 leading-relaxed px-4">Select a QR type on the left to start building your custom experience.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white space-y-20 p-10 animate-in zoom-in-95 duration-700">
                          <div className="relative group p-6 border border-[#E0EAF2] rounded-[3.5rem] bg-[#F8FAFC] shadow-2xl shadow-blue-500/10 transition-transform duration-500 hover:scale-[1.02]">
                            <div className="bg-white p-4 rounded-[3rem] shadow-inner border border-white">
                              <QRFrameWrapper frameType={wizard.config.frame}>
                                <div className="relative">
                                  <StyledQRCode
                                    options={qrStylingOptions}
                                    size={240}
                                  />
                                  {!wizard.config.logoUrl && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50/50">
                                      <div className="w-11 h-11 bg-blue-50/60 rounded-full flex items-center justify-center border border-blue-100/30">
                                        <span className="text-[10px] font-black text-[#156295]/50 uppercase tracking-widest">LOGO</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </QRFrameWrapper>
                            </div>
                          </div>

                          <div className="text-center space-y-6 px-6">
                            <h4 className="text-2xl font-black text-slate-800 leading-tight tracking-tight">
                              {wizard.name || 'Select a type of QR code on the left'}
                            </h4>
                            <div className="flex flex-col items-center gap-6">
                              <div className="bg-blue-50 text-[#156295] px-5 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-blue-100/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#156295] animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-wider">LIVE PREVIEW</span>
                              </div>
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">GENERATED BY QRCODE.IO</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="skeu-toolbar px-10 py-6 z-30 shrink-0">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <button
            onClick={handleBackStep}
            disabled={wizard.step === 1}
            type="button"
            className="px-8 py-3 skeu-btn-secondary text-[11px] uppercase tracking-widest flex items-center gap-2 group active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK
          </button>

          <button
            onClick={handleNextStep}
            type="button"
            className="px-10 py-3 skeu-btn text-[11px] uppercase tracking-widest flex items-center gap-2 active:scale-95 group transition-all"
          >
            {wizard.step === 3 ? 'FINISH' : 'NEXT STEP'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </footer>
    </div>
  );
};
