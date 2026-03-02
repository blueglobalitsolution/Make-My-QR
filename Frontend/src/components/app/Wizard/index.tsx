import React from 'react';
import { ChevronRight, ChevronLeft, Check, Plus, X, Folder as FolderIcon, ChevronDown, Globe, FileText, Link as LinkIcon, MessageCircle, Briefcase, Grid3X3, Layout, Maximize, Image as ImageIcon, Upload, Trash2, CheckCheck, Star, Palette as PaletteIcon, Info, Barcode } from 'lucide-react';
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
  const Stepper = ({ step }: { step: number }) => {
    const steps = [
      { n: 1, label: 'TYPE' },
      { n: 2, label: 'CONTENT' },
      { n: 3, label: 'STYLE' },
    ];
    return (
      <div className="flex items-center justify-center gap-14 mb-14">
        {steps.map((s, idx) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s.n ? 'bg-[#156295] text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                {s.n}
              </div>
              <span className={`text-[11px] font-bold tracking-widest ${step === s.n ? 'text-slate-800' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-20 h-[1.5px] bg-slate-100" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const Step1TypeSelection = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left">
        <h2 className="text-[26px] font-black text-[#0F172A] tracking-tight ml-1">1. Select a type of QR code</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {QR_TYPES_CONFIG.map((type) => (
          <button
            key={type.id}
            onClick={() => setWizard({ ...wizard, type: type.id as any })}
            type="button"
            className={`group py-12 px-8 aspect-[4/5] rounded-[2.5rem] border-2 transition-all flex flex-col items-center justify-center text-center gap-8 ${wizard.type === type.id ? 'border-[#156295] bg-white skeu-card scale-[1.02]' : 'border-slate-50 hover:border-slate-100 bg-white/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50'}`}
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${wizard.type === type.id ? 'bg-[#156295] text-white shadow-xl shadow-[#156295]/30' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#156295]'}`}>
              {type.id === 'website' && <Globe className="w-8 h-8" />}
              {type.id === 'pdf' && <FileText className="w-8 h-8" />}
              {type.id === 'links' && <LinkIcon className="w-8 h-8" />}
              {type.id === 'whatsapp' && <MessageCircle className="w-8 h-8" />}
              {type.id === 'business' && <Briefcase className="w-8 h-8" />}
              {type.id === 'vcard' && <Grid3X3 className="w-8 h-8" />}
            </div>
            <div className="space-y-2">
              <h3 className={`font-black text-xl tracking-tight transition-colors ${wizard.type === type.id ? 'text-[#156295]' : 'text-slate-800'}`}>{type.name}</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed px-2">{type.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const Step2Content = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left mb-10">
        <h2 className="text-[26px] font-black text-[#0F172A] tracking-tight ml-1">2. Add Content</h2>
      </div>

      <div className="space-y-6">
        {/* Website Type */}
        {wizard.type === 'website' && (
          <div className="skeu-card overflow-hidden">
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-[#156295] rounded-2xl flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Website URL</h3>
                  <p className="text-sm text-slate-400">Where should your QR code link to?</p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <Globe className="w-6 h-6 text-slate-300 group-focus-within:text-[#156295] transition-colors" />
                  <div className="h-8 w-[1.5px] bg-slate-100" />
                </div>
                <input
                  type="text"
                  placeholder="https://www.yourwebsite.com"
                  value={wizard.value}
                  onChange={(e) => setWizard({ ...wizard, value: e.target.value })}
                  className="w-full pl-22 pr-8 py-6 bg-slate-50 border-2 border-slate-50 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#156295] focus:bg-white text-slate-900 font-bold text-2xl transition-all placeholder:text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Type */}
        {wizard.type === 'whatsapp' && (
          <div className="skeu-card overflow-hidden">
            <div className="p-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">WhatsApp Messenger</h3>
                  <p className="text-sm text-slate-400">Direct link to a WhatsApp chat</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone number *</label>
                  <div className="flex items-center border-2 border-slate-50 rounded-2xl overflow-hidden focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-50 transition-all bg-slate-50">
                    <div className="px-6 py-5 bg-white border-r border-slate-100 flex items-center gap-2 cursor-pointer">
                      <img src="https://flagcdn.com/in.svg" className="w-6 h-4 rounded-sm object-cover" alt="IN" />
                      <span className="font-bold text-slate-700">+91</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="84606 87490"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      className="flex-1 px-8 py-5 bg-transparent outline-none font-bold text-slate-800 text-xl"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Pre-filled Message</label>
                  <textarea
                    rows={4}
                    placeholder="Hello, I'm reaching out from your QR code..."
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-green-50 focus:border-green-400 transition-all font-bold text-slate-800 resize-none"
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
            <div className="skeu-card overflow-hidden">
              <button
                onClick={() => toggleSection('design')}
                className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors"
                type="button"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-50 text-[#156295] rounded-2xl flex items-center justify-center">
                    <PaletteIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-800">Design Settings</h3>
                    <p className="text-sm text-slate-400">Visual style, fonts and brand colors</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeDesignSection === 'design' ? 'rotate-180' : ''}`} />
              </button>

              {activeDesignSection === 'design' && (
                <div className="p-10 border-t border-slate-50 space-y-10 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Brand Color</label>
                      <div className="flex items-center gap-6 p-1.5 bg-slate-50 rounded-2xl border-2 border-slate-50 transition-all hover:border-[#156295]/30">
                        <div className="w-16 h-12 rounded-xl border border-white/20 relative overflow-hidden" style={{ backgroundColor: wizard.business?.primaryColor }}>
                          <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-[2]"
                            value={wizard.business?.primaryColor}
                            onChange={(e) => updateBusinessField('primaryColor', e.target.value)}
                          />
                        </div>
                        <span className="font-bold text-slate-700 uppercase tracking-wider">{wizard.business?.primaryColor}</span>
                      </div>
                    </div>
                    {wizard.type !== 'pdf' && (
                      <div className="space-y-5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Typography</label>
                        <div className="relative group">
                          <select
                            value={wizard.business?.fontTitle}
                            onChange={(e) => updateBusinessField('fontTitle', e.target.value)}
                            className="w-full pl-8 pr-12 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#156295] font-bold text-slate-800 appearance-none transition-all"
                          >
                            {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-[#156295] transition-colors" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Accordion */}
            <div className="skeu-card overflow-hidden">
              <button
                onClick={() => toggleSection('content')}
                className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors"
                type="button"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <Info className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-800">
                      {wizard.type === 'pdf' ? 'PDF Document' : 'Page Content'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {wizard.type === 'pdf' ? 'Upload assets and files' : 'Modify names, headlines and links'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeDesignSection === 'content' ? 'rotate-180' : ''}`} />
              </button>

              {activeDesignSection === 'content' && (
                <div className="p-10 border-t border-slate-50 space-y-10 animate-in slide-in-from-top-4 duration-300">
                  {wizard.type === 'pdf' ? (
                    <div className="space-y-6">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">PDF File Selection</label>
                      <div className="relative group">
                        <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 hover:border-[#156295] hover:bg-blue-50/30 transition-all cursor-pointer">
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={handlePdfUpload} />
                          {pdfUrl ? (
                            <div className="text-center">
                              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
                                <FileText className="w-10 h-10" />
                              </div>
                              <h4 className="font-bold text-slate-800 text-lg">{pdfFileName}</h4>
                              <p className="text-xs text-slate-400 mt-1">Ready for QR encoding</p>
                            </div>
                          ) : (
                            <>
                              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center group-hover:bg-[#156295] group-hover:text-white transition-all duration-500">
                                <Upload className="w-10 h-10" />
                              </div>
                              <div className="text-center space-y-1">
                                <p className="font-bold text-slate-800 text-lg">Drop your PDF or browse</p>
                                <p className="text-sm text-slate-400">Max size 20MB</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Display Title *</label>
                          <input
                            type="text"
                            placeholder="e.g. My Website"
                            value={wizard.business?.title || ''}
                            onChange={(e) => updateBusinessField('title', e.target.value)}
                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#156295] font-bold text-slate-800 transition-all"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Company / Sub-headline</label>
                          <input
                            type="text"
                            placeholder="e.g. Tech Solutions"
                            value={wizard.business?.company || ''}
                            onChange={(e) => updateBusinessField('company', e.target.value)}
                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#156295] font-bold text-slate-800 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action Buttons / Links</label>
                          <button
                            type="button"
                            onClick={addLink}
                            className="bg-blue-50 text-[#156295] px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#156295] hover:text-white transition-all flex items-center gap-2"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Link
                          </button>
                        </div>
                        <div className="space-y-4">
                          {wizard.business?.buttons.map((link) => (
                            <div key={link.id} className="flex items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                              <div className="flex-1 space-y-4">
                                <input
                                  type="text"
                                  value={link.text}
                                  onChange={(e) => updateLink(link.id, 'text', e.target.value)}
                                  placeholder="Button Name"
                                  className="w-full bg-transparent border-none outline-none font-bold text-slate-800 text-lg p-0 focus:ring-0"
                                />
                                <div className="flex items-center gap-3">
                                  <LinkIcon className="w-3.5 h-3.5 text-slate-300" />
                                  <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-500 p-0 focus:ring-0"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeLink(link.id)}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
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

        {/* Name and Folder Section (Always shown at bottom of Step 2) */}
        <div className="skeu-card overflow-hidden">
          <button
            onClick={() => toggleSection('name_folder')}
            className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <FolderIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-800">Finalize & Organize</h3>
                <p className="text-sm text-slate-400">Name your code and pick a save location</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeDesignSection === 'name_folder' ? 'rotate-180' : ''}`} />
          </button>

          {activeDesignSection === 'name_folder' && (
            <div className="p-10 border-t border-slate-50 space-y-12 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Internal Reference Name</label>
                <input
                  type="text"
                  placeholder="e.g. Website Launch Campaign"
                  value={wizard.name}
                  onChange={(e) => setWizard({ ...wizard, name: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#156295] font-bold text-slate-800 transition-all"
                />
              </div>

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
                      className={`p-6 rounded-[1.5rem] border-2 text-left transition-all relative ${wizard.folderId === folder.id ? 'border-[#156295] bg-blue-50 shadow-blue-500/5' : 'bg-white border-slate-50 hover:border-slate-200'}`}
                    >
                      <div className="flex flex-col gap-2">
                        <FolderIcon className={`w-6 h-6 ${wizard.folderId === folder.id ? 'text-[#156295]' : 'text-slate-300'}`} />
                        <div>
                          <p className={`font-bold truncate ${wizard.folderId === folder.id ? 'text-[#156295]' : 'text-slate-700'}`}>{folder.name}</p>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{folder.count} codes</p>
                        </div>
                      </div>
                      {wizard.folderId === folder.id && (
                        <div className="absolute top-4 right-4 bg-[#156295] text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
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

  const Step3Style = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left mb-10">
        <h2 className="text-[26px] font-black text-[#0F172A] tracking-tight ml-1">3. Customizing styling</h2>
      </div>

      <div className="space-y-6">
        {/* Frame Selection */}
        <div className="skeu-card overflow-hidden">
          <button onClick={() => toggleSection('frame')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors" type="button">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-50 text-[#156295] rounded-2xl flex items-center justify-center">
                <Layout className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-800">Frame Layout</h3>
                <p className="text-sm text-slate-400">Add a call-to-action frame</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeDesignSection === 'frame' ? 'rotate-180' : ''}`} />
          </button>
          {activeDesignSection === 'frame' && (
            <div className="p-10 border-t border-slate-50 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 animate-in slide-in-from-top-4 duration-300">
              {FRAME_STYLES.map((style: any) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setWizard({ ...wizard, config: { ...wizard.config, frame: style.id } })}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all ${wizard.config.frame === style.id ? 'border-[#156295] bg-blue-50 text-[#156295] shadow-lg shadow-blue-500/5' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-400'}`}
                >
                  <div className="scale-125">{style.icon}</div>
                  <span className="text-[9px] font-bold uppercase mt-3 tracking-widest">{style.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color & Pattern */}
        <div className="skeu-card overflow-hidden">
          <button onClick={() => toggleSection('pattern')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors" type="button">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Grid3X3 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-800">QR Pattern & Colors</h3>
                <p className="text-sm text-slate-400">Dots, squares and custom colors</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeDesignSection === 'pattern' ? 'rotate-180' : ''}`} />
          </button>

          {activeDesignSection === 'pattern' && (
            <div className="p-10 border-t border-slate-50 space-y-12 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {PATTERN_OPTIONS.map((opt: any) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWizard({ ...wizard, config: { ...wizard.config, pattern: opt.id } })}
                    className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.pattern === opt.id ? 'border-[#156295] bg-blue-50 text-[#156295] shadow-lg shadow-blue-500/5' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-300'}`}
                  >
                    <div className="p-1">{opt.icon}</div>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Foreground Color</label>
                  <div className="flex items-center gap-6 p-1.5 bg-slate-50 rounded-2xl border-2 border-slate-50">
                    <div className="w-16 h-12 rounded-xl border border-white/20 relative overflow-hidden" style={{ backgroundColor: wizard.config.fgColor }}>
                      <input type="color" value={wizard.config.fgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, fgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-150" />
                    </div>
                    <span className="font-bold text-slate-700 uppercase tracking-widest">{wizard.config.fgColor}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Background Color</label>
                  <div className="flex items-center gap-6 p-1.5 bg-slate-50 rounded-2xl border-2 border-slate-50">
                    <div className="w-16 h-12 rounded-xl border border-white/20 relative overflow-hidden" style={{ backgroundColor: wizard.config.bgColor }}>
                      <input type="color" value={wizard.config.bgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, bgColor: e.target.value } })} className="absolute inset-0 opacity-0 cursor-pointer scale-150" />
                    </div>
                    <span className="font-bold text-slate-700 uppercase tracking-widest">{wizard.config.bgColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTransparent(!isTransparent)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isTransparent ? 'bg-[#156295] border-[#156295]' : 'bg-white border-slate-200'}`}
                >
                  {isTransparent && <Check className="w-4 h-4 text-white" />}
                </button>
                <div>
                  <p className="font-bold text-slate-800">Transparent Background</p>
                  <p className="text-xs text-slate-400 font-medium">Remove background for transparency</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Eyes Style */}
        <div className="skeu-card overflow-hidden">
          <button onClick={() => toggleSection('corners')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors" type="button">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <Maximize className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-800">Eye Styles</h3>
                <p className="text-sm text-slate-400">Shape of the corner indicators</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeDesignSection === 'corners' ? 'rotate-180' : ''}`} />
          </button>

          {activeDesignSection === 'corners' && (
            <div className="p-10 border-t border-slate-50 space-y-12 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Eye Frame Shape</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {CORNER_SQUARE_OPTIONS.map((opt: any) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersSquareType: opt.id } })}
                      className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.cornersSquareType === opt.id ? 'border-[#156295] bg-blue-50 text-[#156295]' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-300'}`}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Eye Dot Shape</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {CORNER_DOT_OPTIONS.map((opt: any) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersDotType: opt.id } })}
                      className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.cornersDotType === opt.id ? 'border-[#156295] bg-blue-50 text-[#156295]' : 'border-slate-50 bg-white hover:border-slate-200 text-slate-300'}`}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo Upload */}
        <div className="skeu-card overflow-hidden">
          <button onClick={() => toggleSection('logo')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-colors" type="button">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-800">Add Center Logo</h3>
                <p className="text-sm text-slate-400">Place your brand in the center</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform ${activeDesignSection === 'logo' ? 'rotate-180' : ''}`} />
          </button>

          {activeDesignSection === 'logo' && (
            <div className="p-10 border-t border-slate-50 space-y-8 animate-in slide-in-from-top-4 duration-300">
              <div className="relative group">
                <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 hover:border-[#156295] hover:bg-blue-50/30 transition-all cursor-pointer">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                  {wizard.config.logoUrl ? (
                    <div className="relative group/logo">
                      <img src={wizard.config.logoUrl} className="w-32 h-32 object-contain shadow-2xl rounded-2xl border-4 border-white" alt="Logo" />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center group-hover:bg-[#156295] group-hover:text-white transition-all duration-500">
                        <Upload className="w-10 h-10" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-bold text-slate-800 text-lg">Click or drag logo</p>
                        <p className="text-sm text-slate-400">PNG or JPG, max 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {wizard.config.logoUrl && (
                <button
                  type="button"
                  onClick={() => setWizard({ ...wizard, config: { ...wizard.config, logoUrl: undefined } })}
                  className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Remove current logo
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
          <Stepper step={wizard.step} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        <div className="max-w-[1600px] mx-auto px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative items-start">
            {/* Left Side: Content */}
            <div className="lg:col-span-8 space-y-12 pb-24">
              {wizard.step === 1 ? (
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
                        className={`group p-8 aspect-[4/5] rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center text-center gap-8 ${wizard.type === type.id ? 'border-[#156295] bg-white shadow-xl shadow-blue-500/5' : 'border-slate-50 bg-white/40 hover:bg-white hover:border-slate-100 hover:shadow-lg'}`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${wizard.type === type.id ? 'bg-[#156295] text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#156295]'}`}>
                          {type.id === 'website' && <Globe className="w-7 h-7" />}
                          {type.id === 'pdf' && <FileText className="w-7 h-7" />}
                          {type.id === 'links' && <LinkIcon className="w-7 h-7" />}
                          {type.id === 'whatsapp' && <MessageCircle className="w-7 h-7" />}
                          {type.id === 'business' && <Briefcase className="w-7 h-7" />}
                          {type.id === 'vcard' && <Grid3X3 className="w-7 h-7" />}
                        </div>
                        <div className="space-y-2">
                          <h3 className={`font-bold text-lg tracking-tight ${wizard.type === type.id ? 'text-[#156295]' : 'text-slate-800'}`}>{type.name}</h3>
                          <p className="text-[11px] font-medium text-slate-400 leading-relaxed px-2">
                            {type.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : wizard.step === 2 ? (
                <Step2Content />
              ) : (
                <Step3Style />
              )}
            </div>

            {/* Right Side: Phone Preview (Sticky) */}
            <div className="lg:col-span-4 sticky top-0 flex flex-col items-center gap-8">
              {/* Preview Toggle Pill (Matches Screenshot 1 position) */}
              <div className="w-full flex justify-end mb-4">
                <div className="bg-slate-200/50 p-1 rounded-full flex items-center gap-1 border border-slate-200 shadow-inner">
                  <button
                    onClick={() => setPhonePreviewMode('ui')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${phonePreviewMode === 'ui' ? 'bg-[#156295] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 font-bold'}`}
                  >
                    PREVIEW
                  </button>
                  <button
                    onClick={() => setPhonePreviewMode('qr')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${phonePreviewMode === 'qr' ? 'bg-[#156295] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 font-bold'}`}
                  >
                    QR CODE
                  </button>
                </div>
              </div>

              <div className="relative group">
                {/* Decorative Elements */}
                <div className="absolute -inset-20 bg-blue-500/5 blur-[120px] rounded-full -z-10 group-hover:bg-blue-500/10 transition-colors duration-1000" />

                <div className="skeu-phone w-[320px] h-[650px] relative shrink-0">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 skeu-phone-notch z-20" />
                  <div className="absolute inset-2.5 bg-white rounded-[3.25rem] overflow-hidden overflow-y-auto scrollbar-hide">
                    {phonePreviewMode === 'ui' ? (
                      <div className="h-full flex flex-col animate-in fade-in duration-500">
                        {/* High Fidelity UI Previews */}
                        {wizard.type === 'website' && (
                          <div className="h-full flex flex-col pt-12 px-6 space-y-8">
                            <div className="bg-slate-50 p-3.5 rounded-2xl flex items-center gap-3 border border-slate-100 shadow-sm">
                              <div className="flex gap-1.5 flex-none">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                              </div>
                              <div className="h-7 flex-1 bg-white rounded-xl border border-slate-200/50 px-3 flex items-center overflow-hidden">
                                <span className="text-[10px] font-bold text-slate-300 truncate">
                                  {wizard.value || 'https://yourwebsite.com'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 flex flex-col items-center justify-center p-12 text-center space-y-8">
                              <div className="w-24 h-24 bg-white rounded-[2rem] skeu-card flex items-center justify-center shadow-blue-500/5">
                                <Globe className="w-12 h-12 text-[#156295] opacity-20" />
                              </div>
                              <div className="space-y-4 w-full">
                                <div className="h-4 w-3/4 bg-slate-100 rounded-full mx-auto" />
                                <div className="h-4 w-1/2 bg-slate-100 rounded-full mx-auto" />
                                <div className="h-4 w-2/3 bg-slate-100 rounded-full mx-auto opacity-50" />
                              </div>
                              <div className="pt-8 w-full">
                                <div className="h-12 w-full bg-[#156295]/10 rounded-2xl border border-[#156295]/5" />
                              </div>
                            </div>
                          </div>
                        )}

                        {wizard.type === 'whatsapp' && (
                          <div className="h-full flex flex-col pt-0">
                            <div className="bg-[#075E54] p-5 pt-12 text-white flex items-center gap-4 shrink-0 shadow-lg relative">
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full md:hidden" />
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
                                <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">{whatsappMessage || 'Hello! I would like more information about your QR code services.'}</p>
                                <div className="flex items-center justify-end gap-1 mt-3">
                                  <span className="text-[9px] font-bold text-green-700/60 uppercase">12:34 PM</span>
                                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {(wizard.type === 'business' || wizard.type === 'links' || wizard.type === 'vcard') && (
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
                      <div className="h-full flex flex-col items-center justify-center bg-white space-y-10 p-10 animate-in zoom-in-95 duration-700">
                        <div className="relative group p-6 border-4 border-slate-50 rounded-[2.5rem] bg-white shadow-sm transition-transform duration-500 hover:scale-[1.02]">
                          <QRFrameWrapper frameType={wizard.config.frame}>
                            <StyledQRCode
                              value={getQRValue()}
                              fgColor={wizard.config.fgColor}
                              bgColor={isTransparent ? 'transparent' : wizard.config.bgColor}
                              pattern={wizard.config.pattern}
                              cornersSquareType={wizard.config.cornersSquareType}
                              cornersSquareColor={wizard.config.cornersSquareColor}
                              cornersDotType={wizard.config.cornersDotType}
                              cornersDotColor={wizard.config.cornersDotColor}
                              logoUrl={wizard.config.logoUrl}
                            />
                          </QRFrameWrapper>
                        </div>

                        <div className="text-center space-y-2 px-4">
                          <h4 className="text-2xl font-black text-[#0F172A] leading-tight tracking-tight">
                            Select a type of QR code on the left
                          </h4>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] flex items-center gap-3 mt-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" /> Live Preview Active
              </p>
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
