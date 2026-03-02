import React from 'react';
import { ChevronRight, ChevronLeft, Check, Plus, X, Folder as FolderIcon, ChevronDown, Globe, FileText, Link as LinkIcon, MessageCircle, Briefcase, Layout, Maximize, Image as ImageIcon, Upload, Trash2, CheckCheck, Star, Palette as PaletteIcon, Info, Barcode, Type } from 'lucide-react';
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
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-black transition-all ${step >= s.n ? 'bg-[#156295] text-white shadow-xl shadow-[#156295]/20' : 'bg-slate-200 text-slate-400'}`}>
                {s.n}
              </div>
              <span className={`text-[11px] font-black tracking-widest transition-colors ${step >= s.n ? 'text-slate-800' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-16 h-[2px] bg-slate-100" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStep1TypeSelection = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left">
        <h2 className="text-[32px] font-black text-[#0F172A] tracking-tight">1. Select a type of QR code</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {QR_TYPES_CONFIG.map((type) => (
          <button
            key={type.id}
            onClick={() => setWizard({ ...wizard, type: type.id as any })}
            type="button"
            className={`group p-8 aspect-square rounded-[2.5rem] border-2 transition-all flex flex-col items-center justify-center text-center gap-6 ${wizard.type === type.id ? 'border-[#156295] bg-white shadow-2xl shadow-blue-500/20' : 'border-transparent bg-white shadow-sm hover:shadow-md hover:shadow-slate-200/50'}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${wizard.type === type.id ? 'bg-[#156295] text-white shadow-lg shadow-[#156295]/20' : 'bg-white border border-slate-100 text-[#156295] shadow-sm'}`}>
              {type.id === 'website' && <Globe className="w-8 h-8" strokeWidth={1.5} />}
              {type.id === 'pdf' && <FileText className="w-8 h-8" strokeWidth={1.5} />}
              {type.id === 'whatsapp' && <MessageCircle className="w-8 h-8" strokeWidth={1.5} />}
              {type.id === 'business' && <Briefcase className="w-8 h-8" strokeWidth={1.5} />}
            </div>
            <div className="space-y-1">
              <h3 className={`font-bold text-lg tracking-tight ${wizard.type === type.id ? 'text-[#156295]' : 'text-slate-800'}`}>{type.name}</h3>
              <p className="text-[11px] font-normal text-slate-400 leading-relaxed px-1">
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
        <h2 className="text-[26px] font-black text-[#0F172A] tracking-tight ml-1">2. Add content to your QR code</h2>
      </div>

      <div className="space-y-6">
        {/* Website Content Section */}
        {wizard.type === 'website' && (
          <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group"
              type="button"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">Website URL</h3>
                  <p className="text-sm font-medium text-slate-400">Link your QR code to any website.</p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'content' ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-400'}`} />
            </button>

            {activeDesignSection === 'content' && (
              <div className="p-10 border-t border-slate-50/50 space-y-8 animate-in slide-in-from-top-4 duration-500 origin-top">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Destination URL *</label>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Supports http:// and https://</span>
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-5">
                    <Globe className="w-6 h-6 text-blue-500 group-focus-within:text-blue-600 transition-colors" />
                    <div className="h-8 w-[1.5px] bg-slate-100" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://www.yourwebsite.com"
                    value={wizard.value}
                    onChange={(e) => setWizard({ ...wizard, value: e.target.value })}
                    className="w-full pl-24 pr-8 py-7 bg-white border-[2.5px] border-blue-200 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-blue-500/5 focus:border-blue-500 text-[#0F172A] font-black text-2xl transition-all placeholder:text-slate-200 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.15)] group-focus-within:shadow-blue-500/10"
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
          <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-10 space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0F172A] tracking-tight text-left">WhatsApp Messenger</h3>
                  <p className="text-sm font-medium text-slate-400 text-left">Direct link to a WhatsApp chat</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone number *</label>
                  <div className="flex items-center border-[2.5px] border-green-200 rounded-[2rem] overflow-hidden focus-within:border-green-500 focus-within:ring-[12px] focus-within:ring-green-500/5 focus-within:shadow-lg focus-within:shadow-green-500/10 focus-within:bg-white transition-all bg-white group shadow-[0_10px_30px_-10px_rgba(34,197,94,0.1)]">
                    <div className="px-6 py-6 bg-white border-r border-slate-100 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                      <img src="https://flagcdn.com/in.svg" className="w-6 h-4 rounded-sm object-cover shadow-sm" alt="IN" />
                      <span className="font-bold text-slate-700">+91</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="84606 87490"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      className="flex-1 px-8 py-5 bg-transparent outline-none font-bold text-[#0F172A] text-xl transition-all placeholder:text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Pre-filled Message</label>
                  <textarea
                    rows={4}
                    placeholder="Hello, I'm reaching out from your QR code..."
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    className="w-full px-8 py-6 bg-white border-[2.5px] border-green-200 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-green-500/5 focus:border-green-500 focus:shadow-lg focus:shadow-green-500/10 transition-all font-bold text-[#0F172A] resize-none placeholder:text-slate-200 shadow-[0_10px_30px_-10px_rgba(34,197,94,0.1)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business, Links, PDF Types */}
        {(wizard.type === 'business' || wizard.type === 'links' || wizard.type === 'pdf') && (
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
                    {wizard.type !== 'pdf' && (
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
                  {wizard.type === 'pdf' ? (
                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">PDF File Selection</label>
                      <div className="relative group">
                        <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center justify-center gap-8 hover:border-[#156295] hover:bg-blue-50/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 cursor-pointer group/upload">
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={handlePdfUpload} />
                          {pdfUrl ? (
                            <div className="text-center animate-in zoom-in duration-500">
                              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/10 border-2 border-white">
                                <FileText className="w-12 h-12" />
                              </div>
                              <h4 className="font-black text-[#0F172A] text-xl tracking-tight">{pdfFileName}</h4>
                              <p className="text-sm font-medium text-slate-400 mt-1">File uploaded successfully</p>
                            </div>
                          ) : (
                            <>
                              <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2.5rem] flex items-center justify-center group-hover/upload:bg-[#156295] group-hover/upload:text-white group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-all duration-500 shadow-inner group-hover/upload:shadow-xl group-hover/upload:shadow-blue-500/20 border-2 border-white/50">
                                <Upload className="w-12 h-12" />
                              </div>
                              <div className="text-center space-y-2">
                                <p className="font-black text-[#0F172A] text-xl tracking-tight">Drop your PDF or browse</p>
                                <p className="text-sm font-medium text-slate-400">Maximum file size: 20MB</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
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
                            <div key={link.id} className="group/item flex items-center gap-6 p-8 bg-slate-50/30 border-2 border-slate-50 rounded-[2.5rem] hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 animate-in zoom-in-95">
                              <div className="flex-1 space-y-5">
                                <input
                                  type="text"
                                  value={link.text}
                                  onChange={(e) => updateLink(link.id, 'text', e.target.value)}
                                  placeholder="Button Name"
                                  className="w-full bg-transparent border-none outline-none font-black text-[#0F172A] text-xl p-0 focus:ring-0 placeholder:text-slate-200"
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Name Section */}
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <button
            onClick={() => toggleSection('name')}
            className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group"
            type="button"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Type className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Name of the QR Code</h3>
                <p className="text-sm font-medium text-slate-400">Give your QR code a name.</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'name' ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'name' && (
            <div className="p-10 border-t border-slate-50/50 space-y-6 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">QR Code Name</label>
                <input
                  type="text"
                  placeholder="e.g. Website Launch Campaign"
                  value={wizard.name}
                  onChange={(e) => setWizard({ ...wizard, name: e.target.value })}
                  className="w-full px-8 py-6 bg-white border-[2.5px] border-blue-200 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-blue-500/5 focus:border-blue-500 bg-white font-black text-[#0F172A] transition-all shadow-[0_10px_30px_-10px_rgba(59,130,246,0.15)] focus:shadow-blue-500/10 placeholder:text-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save to Folder Section */}
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <button
            onClick={() => toggleSection('folder')}
            className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group"
            type="button"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <FolderIcon className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">SAVE TO FOLDER</h3>
                <p className="text-sm font-medium text-slate-400">Organize your codes by category.</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'folder' ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'folder' && (
            <div className="p-10 border-t border-slate-50/50 space-y-12 animate-in slide-in-from-top-4 duration-500 origin-top">
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
                      className={`p-6 rounded-[2rem] border-2 text-left transition-all relative group/folder ${wizard.folderId === folder.id ? 'border-[#156295] bg-white shadow-2xl shadow-blue-500/20 z-10 scale-102' : 'bg-white border-slate-50 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 shadow-sm'}`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 ${wizard.folderId === folder.id ? 'bg-[#156295] text-white shadow-lg shadow-[#156295]/20' : 'bg-slate-50 text-slate-300 group-hover/folder:bg-white group-hover/folder:text-[#156295] border border-transparent group-hover/folder:border-slate-100'}`}>
                          <FolderIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-black tracking-tight truncate ${wizard.folderId === folder.id ? 'text-[#0F172A]' : 'text-slate-700'}`}>{folder.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{folder.count} codes</p>
                        </div>
                      </div>
                      {wizard.folderId === folder.id && (
                        <div className="absolute top-6 right-6 bg-[#156295] text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
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
        <h2 className="text-[26px] font-black text-[#0F172A] tracking-tight ml-1">3. Design the QR</h2>
      </div>

      <div className="space-y-6">
        {/* Frame Selection */}
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => toggleSection('frame')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group" type="button">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 text-[#156295] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Layout className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Frame Layout</h3>
                <p className="text-sm font-medium text-slate-400">Add a call-to-action frame</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'frame' ? 'rotate-180 text-[#156295]' : 'group-hover:text-slate-400'}`} />
          </button>
          {activeDesignSection === 'frame' && (
            <div className="p-10 border-t border-slate-50/50 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 animate-in slide-in-from-top-4 duration-500 origin-top">
              {FRAME_STYLES.map((style: any) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setWizard({ ...wizard, config: { ...wizard.config, frame: style.id } })}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all group/item ${wizard.config.frame === style.id ? 'border-[#156295] bg-white text-[#156295] shadow-2xl shadow-blue-500/20 z-10 scale-102' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-400 hover:shadow-lg hover:shadow-slate-200/50 shadow-sm'}`}
                >
                  <div className={`transition-transform duration-500 ${wizard.config.frame === style.id ? 'scale-150' : 'scale-125 group-hover/item:scale-135'}`}>{style.icon}</div>
                  <span className={`text-[9px] font-black uppercase mt-4 tracking-widest ${wizard.config.frame === style.id ? 'text-[#156295]' : 'text-slate-300'}`}>{style.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color & Pattern */}
        <div className="skeu-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <button onClick={() => toggleSection('pattern')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group" type="button">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Maximize className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-[#0F172A] tracking-tight">QR Pattern & Colors</h3>
                <p className="text-sm font-medium text-slate-400">Dots, squares and custom colors</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'pattern' ? 'rotate-180 text-purple-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'pattern' && (
            <div className="p-10 border-t border-slate-50/50 space-y-12 animate-in slide-in-from-top-4 duration-500 origin-top">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {PATTERN_OPTIONS.map((opt: any) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWizard({ ...wizard, config: { ...wizard.config, pattern: opt.id } })}
                    className={`aspect-square flex items-center justify-center rounded-2xl border-2 transition-all group/item ${wizard.config.pattern === opt.id ? 'border-[#156295] bg-white text-[#156295] shadow-2xl shadow-blue-500/20 z-10 scale-102' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-300 shadow-sm'}`}
                  >
                    <div className={`p-1 transition-transform duration-500 ${wizard.config.pattern === opt.id ? 'scale-125' : 'group-hover/item:scale-110'}`}>{opt.icon}</div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Foreground Color</label>
                  <div className="flex items-center gap-6 p-2 bg-slate-50/50 rounded-2xl border-2 border-slate-50 transition-all hover:border-[#156295]/20 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 group/color">
                    <div className="w-16 h-12 rounded-xl border-2 border-white shadow-sm relative overflow-hidden ring-1 ring-slate-100" style={{ backgroundColor: wizard.config.fgColor }}>
                      <input type="color" value={wizard.config.fgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, fgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5]" />
                    </div>
                    <span className="font-bold text-slate-700 uppercase tracking-widest text-sm">{wizard.config.fgColor}</span>
                  </div>
                </div>
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Background Color</label>
                  <div className="flex items-center gap-6 p-2 bg-slate-50/50 rounded-2xl border-2 border-slate-50 transition-all hover:border-[#156295]/20 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 group/color">
                    <div className="w-16 h-12 rounded-xl border-2 border-white shadow-sm relative overflow-hidden ring-1 ring-slate-100" style={{ backgroundColor: wizard.config.bgColor }}>
                      <input type="color" value={wizard.config.bgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, bgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5]" />
                    </div>
                    <span className="font-bold text-slate-700 uppercase tracking-widest text-sm">{wizard.config.bgColor}</span>
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
          <button onClick={() => toggleSection('corners')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group" type="button">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Maximize className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Eye Styles</h3>
                <p className="text-sm font-medium text-slate-400">Shape of the corner indicators</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'corners' ? 'rotate-180 text-amber-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'corners' && (
            <div className="p-10 border-t border-slate-50/50 space-y-12 animate-in slide-in-from-top-4 duration-500 origin-top">
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
          <button onClick={() => toggleSection('logo')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors group" type="button">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Add Center Logo</h3>
                <p className="text-sm font-medium text-slate-400">Place your brand in the center</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-all duration-500 ${activeDesignSection === 'logo' ? 'rotate-180 text-red-600' : 'group-hover:text-slate-400'}`} />
          </button>

          {activeDesignSection === 'logo' && (
            <div className="p-10 border-t border-slate-50/50 space-y-10 animate-in slide-in-from-top-4 duration-500 origin-top">
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
            <div className="lg:col-span-4 sticky top-0 flex flex-col items-center gap-8">
              {/* Preview Toggle Pill (Matches Screenshot 1 position) */}
              <div className="w-full flex justify-center mb-6">
                <div className="bg-[#156295] p-1 rounded-full flex items-center gap-1 shadow-md">
                  <button
                    onClick={() => setPhonePreviewMode('ui')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all focus:outline-none ${phonePreviewMode === 'ui' ? 'bg-white text-[#156295] border-2 border-[#156295] shadow-sm' : 'text-white'}`}
                  >
                    PREVIEW
                  </button>
                  <button
                    onClick={() => setPhonePreviewMode('qr')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all focus:outline-none ${phonePreviewMode === 'qr' ? 'bg-white text-[#156295] border-2 border-[#156295] shadow-sm' : 'text-white'}`}
                  >
                    QR CODE
                  </button>
                </div>
              </div>

              <div className="relative group">
                {/* Decorative Elements */}
                <div className="absolute -inset-20 bg-blue-500/5 blur-[120px] rounded-full -z-10 group-hover:bg-blue-500/10 transition-colors duration-1000" />

                <div className="skeu-phone w-[320px] h-[650px] relative shrink-0">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 skeu-phone-notch z-50 overflow-hidden">
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/10 rounded-full" />
                  </div>

                  <div className="absolute inset-0 bg-white rounded-[2.8rem] overflow-hidden flex flex-col">
                    {/* Phone Status Bar (Matches Screenshot 10) */}
                    <div className="bg-[#0F172A] h-11 px-8 flex items-end pb-1.5 justify-between shrink-0 z-30">
                      <span className="text-white text-[11px] font-black tracking-tight">9:41</span>
                      <div className="flex items-center gap-1.5 text-white">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 19.5h3v-3h-3v3zm4.5 0h3v-6h-3v6zm4.5 0h3v-9h-3v9zm4.5 0h3v-12h-3v12z" /></svg>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
                        <div className="w-5 h-2.5 border-2 border-white/40 rounded-sm relative">
                          <div className="absolute inset-0.5 bg-white rounded-px w-3" />
                          <div className="absolute -right-1 top-0.5 w-0.5 h-1 bg-white/40 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide relative">
                      {phonePreviewMode === 'ui' ? (
                        <div className="h-full flex flex-col animate-in fade-in duration-500">
                          {/* High Fidelity UI Previews */}
                          {wizard.type === 'website' && (
                            <div className="h-full flex flex-col pt-8 px-6 space-y-8">
                              <div className="h-28 bg-[#4FD1C5] relative flex flex-col justify-end p-6 gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <Globe className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 h-8 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 flex items-center px-4">
                                    <span className="text-[9px] font-black text-white/50 truncate">
                                      {wizard.value || 'https://yourwebsite.com'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 bg-white p-6 space-y-6">
                                <div className="w-full aspect-[4/3] rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-8 group-hover:bg-blue-50/30 transition-colors duration-500">
                                  <Globe className="w-16 h-16 text-[#156295] opacity-10" />
                                </div>
                                <div className="space-y-3 px-2">
                                  <div className="h-2.5 w-3/4 bg-slate-100 rounded-full" />
                                  <div className="h-2.5 w-1/2 bg-slate-100 rounded-full opacity-60" />
                                </div>
                                <div className="pt-2">
                                  <div className="h-12 w-full bg-[#156295]/10 rounded-2xl border border-[#156295]/5" />
                                </div>
                              </div>
                            </div>
                          )}

                          {wizard.type === 'whatsapp' && (
                            <div className="h-full flex flex-col pt-0">
                              <div className="bg-[#075E54] p-5 pt-6 text-white flex items-center gap-4 shrink-0 shadow-lg relative text-left">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-lg border-2 border-white/10">W</div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-black tracking-tight">WhatsApp Chat</h4>
                                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Online Now</p>
                                </div>
                                <div className="flex gap-3 pr-2">
                                  <div className="w-2 h-2 rounded-full bg-white/40" />
                                  <div className="w-2 h-2 rounded-full bg-white/40" />
                                </div>
                              </div>
                              <div className="flex-1 bg-[#E5DDD5] p-6 flex flex-col justify-end relative">
                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }} />
                                <div className="bg-[#DCF8C6] p-4.5 rounded-[1.5rem] rounded-tr-none self-end max-w-[90%] shadow-xl border border-green-200 animate-in slide-in-from-right-8 duration-700">
                                  <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">{whatsappMessage || "Hello! I'm interested in your QR services."}</p>
                                  <div className="flex items-center justify-end gap-1 mt-3">
                                    <span className="text-[9px] font-bold text-green-700/60 uppercase">12:34 PM</span>
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {(wizard.type === 'business' || wizard.type === 'links' || wizard.type === 'pdf') && (
                            <div className="space-y-10 pt-10 px-6">
                              <div className="text-center space-y-6">
                                <div className="w-28 h-28 mx-auto rounded-[2.5rem] bg-white skeu-card flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl relative group/avatar transition-transform duration-500 hover:scale-105">
                                  {wizard.config.logoUrl ? (
                                    <img src={wizard.config.logoUrl} className="w-full h-full object-contain p-2" alt="Avatar" />
                                  ) : (
                                    <Barcode className="w-12 h-12 text-[#156295] opacity-20" />
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-black text-slate-800 text-2xl tracking-tighter leading-tight" style={{ fontFamily: wizard.business?.fontTitle }}>
                                    {wizard.business?.title || 'Your Brand Name'}
                                  </h4>
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="h-[1px] w-4 bg-slate-200" />
                                    <p className="text-[10px] font-black text-[#156295] uppercase tracking-[0.25em]">{wizard.business?.company || 'Organization'}</p>
                                    <div className="h-[1px] w-4 bg-slate-200" />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                {wizard.business?.buttons.map((btn: any) => (
                                  <div
                                    key={btn.id}
                                    className="w-full p-5 rounded-[1.5rem] flex items-center gap-4 border border-white/40 shadow-xl shadow-blue-500/5 transition-all hover:translate-y-[-2px] active:scale-[0.97] cursor-pointer"
                                    style={{ backgroundColor: wizard.business?.primaryColor, color: '#fff' }}
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
                            </div>
                          )}

                          {wizard.type === 'pdf' && (
                            <div className="h-full flex flex-col pt-10 px-6">
                              <div className="flex-1 bg-slate-50/80 rounded-[3rem] border-2 border-slate-100 flex flex-col items-center justify-center p-12 text-center space-y-10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-24 bg-red-500 opacity-[0.03] rotate-[-4deg] scale-125" />
                                <div className="relative">
                                  <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-red-200 border-4 border-white transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <FileText className="w-12 h-12" />
                                  </div>
                                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em]">Ready to View</p>
                                  <h4 className="font-black text-slate-800 text-xl leading-tight line-clamp-3">
                                    {pdfFileName || 'your-document.pdf'}
                                  </h4>
                                  <div className="h-1.5 w-12 bg-red-200 rounded-full mx-auto" />
                                </div>
                                <div className="w-full pt-8">
                                  <div className="w-full py-5 bg-red-500 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 active:scale-95 transition-all">
                                    DOWNLOAD PDF
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {!['website', 'pdf', 'business', 'links', 'whatsapp', 'vcard'].includes(wizard.type) && (
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
      <footer className="bg-white border-t border-slate-100 px-10 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-30 shrink-0">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <button
            onClick={handleBackStep}
            disabled={wizard.step === 1}
            type="button"
            className="px-8 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK
          </button>



          <button
            onClick={handleNextStep}
            type="button"
            className="px-10 py-3 bg-[#156295] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#0E4677] shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 group"
          >
            {wizard.step === 3 ? 'FINISH' : 'NEXT STEP'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </footer>
    </div>
  );
};
