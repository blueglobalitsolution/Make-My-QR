import React from 'react';
import { ChevronRight, ChevronLeft, Check, Plus, X, Folder as FolderIcon, ChevronDown, Globe, FileText, Link as LinkIcon, MessageCircle, Briefcase, Grid3X3, Layout, Maximize, Image as ImageIcon, Upload, Trash2, CheckCheck, Star, Palette as PaletteIcon, Info } from 'lucide-react';
import { WizardState, Folder, BusinessConfig, BusinessButton } from '../../../../types';
import { QR_TYPES_CONFIG, FRAME_STYLES, PATTERN_OPTIONS, CORNER_SQUARE_OPTIONS, CORNER_DOT_OPTIONS, DEFAULT_BUSINESS_PRESETS, FONT_OPTIONS, LINKS_DESIGN_PRESETS } from '../../../../components/constants';

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
  const Step1TypeSelection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">1. Select Type</h2>
        <p className="text-slate-500 font-medium">Choose the type of QR code you want to create</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {QR_TYPES_CONFIG.filter(t => t.id !== 'dynamic' && t.id !== 'barcode').map((type) => (
          <button
            key={type.id}
            onClick={() => setWizard({ ...wizard, type: type.id as any })}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${wizard.type === type.id ? 'border-[#156295] bg-[#156295]/5 shadow-lg' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${wizard.type === type.id ? 'bg-[#156295] text-white' : 'bg-slate-100 text-slate-500'}`}>
              {type.id === 'website' && <Globe className="w-7 h-7" />}
              {type.id === 'pdf' && <FileText className="w-7 h-7" />}
              {type.id === 'links' && <LinkIcon className="w-7 h-7" />}
              {type.id === 'whatsapp' && <MessageCircle className="w-7 h-7" />}
              {type.id === 'business' && <Briefcase className="w-7 h-7" />}
              {type.id === 'vcard' && <Grid3X3 className="w-7 h-7" />}
              {type.id === 'wifi' && <Globe className="w-7 h-7" />}
              {type.id === 'menu' && <FileText className="w-7 h-7" />}
              {type.id === 'social' && <Globe className="w-7 h-7" />}
              {type.id === 'video' && <FileText className="w-7 h-7" />}
              {type.id === 'mp3' && <FileText className="w-7 h-7" />}
              {type.id === 'images' && <ImageIcon className="w-7 h-7" />}
              {type.id === 'coupon' && <Star className="w-7 h-7" />}
              {type.id === 'apps' && <Globe className="w-7 h-7" />}
            </div>
            <span className={`font-bold text-sm ${wizard.type === type.id ? 'text-[#156295]' : 'text-slate-600'}`}>{type.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const Step2Content = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">2. Add Content</h2>
      
      {(wizard.type === 'links' || wizard.type === 'pdf') && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('design')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <PaletteIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-slate-800 leading-none">Design</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose colors and fonts for your page.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'design' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'design' && (
              <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Color Palette</label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {LINKS_DESIGN_PRESETS.map((p: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          updateBusinessField('primaryColor', p.primary);
                          updateBusinessField('linkBackgroundColor', p.background);
                        }}
                        className={`flex-shrink-0 w-24 h-12 rounded-xl border-2 transition-all p-1 flex gap-1 ${wizard.business?.primaryColor === p.primary ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-slate-50 bg-white'}`}
                      >
                        <div className="flex-1 rounded-lg" style={{ backgroundColor: p.primary }} />
                        <div className="flex-1 rounded-lg" style={{ backgroundColor: p.background }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Primary color</label>
                    <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.primaryColor }}>
                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.primaryColor} onChange={(e) => updateBusinessField('primaryColor', e.target.value)} />
                      </div>
                      <span className="font-black text-slate-700 text-xs uppercase">{wizard.business?.primaryColor}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Background color</label>
                    <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.linkBackgroundColor }}>
                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.linkBackgroundColor} onChange={(e) => updateBusinessField('linkBackgroundColor', e.target.value)} />
                      </div>
                      <span className="font-black text-slate-700 text-xs uppercase">{wizard.business?.linkBackgroundColor}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Title Font</label>
                    <select value={wizard.business?.fontTitle} onChange={(e) => updateBusinessField('fontTitle', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 appearance-none">
                      {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Text Font</label>
                    <select value={wizard.business?.fontText} onChange={(e) => updateBusinessField('fontText', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 appearance-none">
                      {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('content')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-slate-800 leading-none">{wizard.type === 'pdf' ? 'PDF File' : 'Content'}</h3>
                  <p className="text-xs text-slate-400 mt-1">{wizard.type === 'pdf' ? 'Upload your PDF file' : 'Add links to your page'}</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'content' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'content' && (
              <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                {wizard.type === 'links' ? (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Page Title *</label>
                      <input type="text" placeholder="Your Title Here" value={wizard.business?.title} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Description</label>
                      <textarea rows={3} placeholder="Tell visitors about yourself..." value={wizard.business?.description} onChange={(e) => updateBusinessField('description', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 resize-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Links</label>
                      {wizard.business?.buttons.map((link, idx) => (
                        <div key={link.id} className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-xl">
                            <input type="text" value={link.text} onChange={(e) => updateLink(link.id, 'text', e.target.value)} placeholder="Link text" className="flex-1 bg-transparent outline-none font-bold text-slate-700" />
                            <input type="text" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} placeholder="https://..." className="flex-1 bg-transparent outline-none text-sm text-slate-500" />
                          </div>
                          <button onClick={() => removeLink(link.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={addLink} className="text-blue-500 font-bold text-xs flex items-center gap-1"><Plus className="w-4 h-4" /> Add Link</button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Company Name</label>
                      <input type="text" placeholder="Your Company Name" value={wizard.business?.company} onChange={(e) => updateBusinessField('company', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Title</label>
                      <input type="text" placeholder="Document Title" value={wizard.business?.title} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Upload PDF</label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-blue-400 transition-all group cursor-pointer relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={handlePdfUpload} />
                        {pdfUrl ? (
                          <div className="text-center">
                            <FileText className="w-12 h-12 text-green-500 mx-auto mb-2" />
                            <p className="font-bold text-slate-700">{pdfFileName}</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-500 transition-colors mb-3" />
                            <p className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Click to upload PDF</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                  <p className="text-xs text-slate-400">Give your QR code a name to find it later.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'name' && (
              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                <input type="text" placeholder="E.g. My QR code" value={wizard.name} onChange={(e) => setWizard({ ...wizard, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
              </div>
            )}
          </div>
        </div>
      )}

      {wizard.type === 'business' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('business_design')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                  <PaletteIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-slate-800 leading-none">Design</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose colors and fonts for your business page.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'business_design' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'business_design' && (
              <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Color Palette</label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {DEFAULT_BUSINESS_PRESETS.map((p: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          updateBusinessField('primaryColor', p.primary);
                          updateBusinessField('secondaryColor', p.secondary);
                        }}
                        className={`flex-shrink-0 w-24 h-12 rounded-xl border-2 transition-all p-1 flex gap-1 ${wizard.business?.primaryColor === p.primary ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-slate-50 bg-white'}`}
                      >
                        <div className="flex-1 rounded-lg" style={{ backgroundColor: p.primary }} />
                        <div className="flex-1 rounded-lg" style={{ backgroundColor: p.secondary }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Primary color</label>
                    <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.primaryColor }}>
                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.primaryColor} onChange={(e) => updateBusinessField('primaryColor', e.target.value)} />
                      </div>
                      <span className="font-black text-slate-700 text-xs uppercase">{wizard.business?.primaryColor}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Secondary color</label>
                    <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.secondaryColor }}>
                        <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.secondaryColor} onChange={(e) => updateBusinessField('secondaryColor', e.target.value)} />
                      </div>
                      <span className="font-black text-slate-700 text-xs uppercase">{wizard.business?.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('business_basic')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-slate-800 leading-none">Basic Information</h3>
                  <p className="text-xs text-slate-400 mt-1">Company name, logo, headline and description.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'business_basic' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'business_basic' && (
              <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Company Name *</label>
                  <input type="text" placeholder="Your Company Name" value={wizard.business?.company} onChange={(e) => updateBusinessField('company', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Headline</label>
                  <input type="text" placeholder="Welcome to our business" value={wizard.business?.title} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                  <p className="text-xs text-slate-400">Give your QR code a name to find it later.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'name' && (
              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                <input type="text" placeholder="E.g. My Business QR" value={wizard.name} onChange={(e) => setWizard({ ...wizard, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
              </div>
            )}
          </div>
        </div>
      )}

      {wizard.type === 'whatsapp' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('content')} className="w-full flex items-center justify-between p-6 bg-green-50/30 hover:bg-green-50 transition-colors border-b border-green-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">WhatsApp Messenger</h4>
                  <p className="text-xs text-slate-500 font-medium">Link your QR code directly to a WhatsApp chat.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'content' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'content' && (
              <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Phone number *</label>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      <CheckCheck className="w-3 h-3" /> Encrypted link
                    </div>
                  </div>
                  <div className="flex items-center border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-50 transition-all bg-slate-50/50">
                    <div className="px-5 py-4 flex items-center gap-2 border-r border-slate-100 bg-white cursor-pointer hover:bg-slate-50">
                      <img src="https://flagcdn.com/in.svg" className="w-6 h-4 rounded-sm object-cover" alt="IN" />
                      <span className="font-black text-slate-700 text-sm">+91</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="84606 87490"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      className="flex-1 px-6 py-4 bg-transparent outline-none font-bold text-slate-800 text-lg placeholder:text-slate-300"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Pre-filled Message</label>
                  <div className="relative border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-50 transition-all bg-slate-50/50">
                    <textarea
                      rows={5}
                      placeholder="I'm interested in your services. Can you help me?"
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      className="w-full px-6 py-5 bg-transparent outline-none font-bold text-slate-800 resize-none placeholder:text-slate-300 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                  <p className="text-xs text-slate-400">Give your QR code a name.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'name' && (
              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                <input type="text" placeholder="E.g. My QR code" value={wizard.name} onChange={(e) => setWizard({ ...wizard, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
              </div>
            )}
          </div>
        </div>
      )}

      {wizard.type === 'website' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
            <button onClick={() => toggleSection('content')} className="w-full flex items-center justify-between p-6 bg-blue-50/30 hover:bg-blue-50 transition-colors border-b border-blue-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">Website URL</h4>
                  <p className="text-xs text-slate-500 font-medium">Link your QR code to any website.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'content' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'content' && (
              <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Destination URL *</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-400 group-focus-within:scale-110 transition-transform" />
                      <div className="h-6 w-[1px] bg-slate-200" />
                    </div>
                    <input
                      type="text"
                      placeholder="https://www.yourwebsite.com"
                      value={wizard.value}
                      onChange={(e) => setWizard({ ...wizard, value: e.target.value })}
                      className="w-full pl-20 pr-6 py-5 bg-slate-50/50 border-2 border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white text-slate-900 font-bold text-xl transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                  <p className="text-xs text-slate-400">Give your QR code a name.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
            </button>
            {activeDesignSection === 'name' && (
              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                <input type="text" placeholder="E.g. My QR code" value={wizard.name} onChange={(e) => setWizard({ ...wizard, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <button onClick={() => toggleSection('folder')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <FolderIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Save to Folder</h4>
              <p className="text-xs text-slate-400 font-medium">Organize your codes by category.</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'folder' ? 'rotate-180' : ''}`} />
        </button>
        {activeDesignSection === 'folder' && (
          <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setWizard({ ...wizard, folderId: folder.id })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${wizard.folderId === folder.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FolderIcon className={`w-4 h-4 ${wizard.folderId === folder.id ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span className={`text-xs font-black truncate ${wizard.folderId === folder.id ? 'text-blue-700' : 'text-slate-600'}`}>{folder.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{folder.count} codes</span>
                  {wizard.folderId === folder.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-3 h-3 text-blue-500" />
                    </div>
                  )}
                </button>
              ))}
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="p-4 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase">New Folder</span>
              </button>
            </div>

            {isCreatingFolder && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
                />
                <button onClick={createNewFolder} className="p-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all">
                  <Plus className="w-5 h-5" />
                </button>
                <button onClick={() => { setIsCreatingFolder(false); setNewFolderName(''); }} className="p-2 bg-white text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const Step3Style = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">3. Design the QR</h2>
      <div className="space-y-4">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('frame')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Layout className="w-6 h-6" /></div>
              <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">Frame Style</h4><p className="text-sm text-slate-400">Add a custom frame to your QR code.</p></div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'frame' ? 'rotate-180' : ''}`} />
          </button>
          {activeDesignSection === 'frame' && (
            <div className="p-8 pt-2 border-t border-slate-50 grid grid-cols-4 md:grid-cols-6 gap-4 animate-in slide-in-from-top-2 duration-300">
              {FRAME_STYLES.map((style: any) => (
                <button key={style.id} onClick={() => setWizard({ ...wizard, config: { ...wizard.config, frame: style.id } })} className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all ${wizard.config.frame === style.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}>
                  {style.icon}
                  <span className="text-[8px] font-black uppercase mt-2">{style.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('pattern')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Grid3X3 className="w-6 h-6" /></div>
              <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">Module Pattern</h4><p className="text-sm text-slate-400">Customize the dots and color of your code.</p></div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'pattern' ? 'rotate-180' : ''}`} />
          </button>
          {activeDesignSection === 'pattern' && (
            <div className="p-8 pt-2 border-t border-slate-50 space-y-8 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-6 gap-3">
                {PATTERN_OPTIONS.map((opt: any) => (
                  <button key={opt.id} onClick={() => setWizard({ ...wizard, config: { ...wizard.config, pattern: opt.id } })} className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.pattern === opt.id ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}>
                    {opt.icon}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Color</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <input type="text" value={wizard.config.fgColor.toUpperCase()} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, fgColor: e.target.value } })} className="flex-1 px-4 font-bold text-xs uppercase outline-none" />
                    <input type="color" value={wizard.config.fgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, fgColor: e.target.value } })} className="w-12 h-12 border-none bg-transparent p-1 cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Background Color</label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <input type="text" value={wizard.config.bgColor.toUpperCase()} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, bgColor: e.target.value } })} className="flex-1 px-4 font-bold text-xs uppercase outline-none" />
                    <input type="color" value={wizard.config.bgColor} onChange={(e) => setWizard({ ...wizard, config: { ...wizard.config, bgColor: e.target.value } })} className="w-12 h-12 border-none bg-transparent p-1 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsTransparent(!isTransparent)} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isTransparent ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-200'}`}>{isTransparent && <CheckCheck className="w-3 h-3 text-white" />}</button>
                <span className="text-sm font-bold text-slate-600">Transparent Background</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('corners')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Maximize className="w-6 h-6" /></div>
              <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">QR Eye Style</h4><p className="text-sm text-slate-400">Select the shape and color of corner squares.</p></div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'corners' ? 'rotate-180' : ''}`} />
          </button>
          {activeDesignSection === 'corners' && (
            <div className="p-8 pt-2 border-t border-slate-50 space-y-10 animate-in slide-in-from-top-2 duration-300">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eye Frame Style</p>
                  <div className="grid grid-cols-4 gap-2">
                    {CORNER_SQUARE_OPTIONS.map((opt: any) => (
                      <button key={opt.id} onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersSquareType: opt.id } })} className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.cornersSquareType === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>{opt.icon}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eye Dot Style</p>
                  <div className="grid grid-cols-4 gap-2">
                    {CORNER_DOT_OPTIONS.map((opt: any) => (
                      <button key={opt.id} onClick={() => setWizard({ ...wizard, config: { ...wizard.config, cornersDotType: opt.id } })} className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.cornersDotType === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>{opt.icon}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('logo')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><ImageIcon className="w-6 h-6" /></div>
              <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">Add Center Logo</h4><p className="text-sm text-slate-400">Upload your brand logo for better recognition.</p></div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'logo' ? 'rotate-180' : ''}`} />
          </button>
          {activeDesignSection === 'logo' && (
            <div className="p-8 pt-2 border-t border-slate-50 space-y-6 animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-blue-400 transition-all group relative cursor-pointer">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                {wizard.config.logoUrl ? (
                  <img src={wizard.config.logoUrl} className="w-24 h-24 object-contain shadow-xl rounded-xl" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors mb-4"><Upload className="w-8 h-8" /></div>
                    <p className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Click or drag your logo here</p>
                  </>
                )}
              </div>
              {wizard.config.logoUrl && (
                <button onClick={() => setWizard({ ...wizard, config: { ...wizard.config, logoUrl: undefined } })} className="w-full py-3 border border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors text-xs uppercase tracking-widest">Remove Logo</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
        <div className="lg:col-span-4 space-y-4">
          {wizard.step === 1 && <Step1TypeSelection />}
          {wizard.step === 2 && <Step2Content />}
          {wizard.step === 3 && <Step3Style />}

          <div className="bg-white/80 backdrop-blur-md border-t border-black/5 p-4 fixed bottom-0 left-64 right-0 z-50 flex justify-between items-center">
            <button onClick={handleBackStep} disabled={wizard.step === 1} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-black uppercase text-[10px] flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-3 h-3" /> Back
            </button>
            <button onClick={handleNextStep} className="px-6 py-2.5 bg-[#156295] text-white rounded-lg font-black uppercase text-[10px] flex items-center gap-2 hover:bg-[#0E4677] shadow-md transition-all">
              {wizard.step === 3 ? 'Save & Finish' : 'Next Step'} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
