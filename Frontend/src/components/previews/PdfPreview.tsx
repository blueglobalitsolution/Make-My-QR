import React from 'react';
import { FileText, Download, Shield, Info, User, ChevronLeft, Smartphone } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';

interface PdfPreviewProps {
    name: string;
    brandColor: string;
    fullValue: string;
    is_lead_capture: boolean;
    isAuthorized: boolean;
    isFileMode: boolean;
    leadForm: {
        name: string;
        email: string;
    };
    setLeadForm: React.Dispatch<React.SetStateAction<{ name: string; email: string }>>;
    onLeadSubmit: (e: React.FormEvent) => void;
    viewMode: 'landing' | 'preview';
    setViewMode: React.Dispatch<React.SetStateAction<'landing' | 'preview'>>;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
    name,
    brandColor,
    fullValue,
    is_lead_capture,
    isAuthorized,
    isFileMode,
    leadForm,
    setLeadForm,
    onLeadSubmit,
    viewMode,
    setViewMode
}) => {
    if (viewMode === 'preview' && isAuthorized) {
        return (
            <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
                <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm relative z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setViewMode('landing')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-slate-900 font-bold text-sm truncate max-w-[200px] leading-tight">{name}</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scanner Studio Viewer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={fullValue} download className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
                            <Download className="w-4 h-4" /> Download
                        </a>
                    </div>
                </header>
                <div className="flex-1 w-full relative bg-slate-100">
                    <object
                        data={fullValue}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                        <iframe
                            src={fullValue}
                            className="w-full h-full border-none"
                            title="PDF Viewer"
                        />
                    </object>
                </div>
            </div>
        );
    }

    const handleAction = () => {
        if (is_lead_capture && !isAuthorized) {
            return;
        }

        if (isFileMode) {
            window.open(fullValue, '_blank');
        } else {
            setViewMode('preview');
        }
    };

    return (
        <div className="min-h-screen flex flex-col skeu-app-bg font-inter pb-12">
            <header className="px-8 py-8 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg shadow-sm" style={{ backgroundColor: brandColor }}>
                        <Smartphone className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">
                        Scanner <span style={{ color: brandColor }}>Studio</span>
                    </h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="skeu-card overflow-hidden">
                        <div className="h-2 w-full" style={{ backgroundColor: brandColor }} />

                        <div className="p-8 space-y-8">
                            <div className="text-center space-y-4">
                                {isFileMode ? (
                                    <div className="space-y-6">
                                        <div className="w-32 h-40 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center border border-slate-100 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
                                            <FileText className="w-16 h-16 text-red-500 relative z-10" />
                                            <div className="absolute bottom-2 right-2">
                                                <span className="text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-600 px-2 py-1 rounded">PDF</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                                {name || "PDF Document"}
                                            </h2>
                                            <p className="text-sm text-slate-500 font-medium">
                                                Click below to view the PDF file
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="w-32 h-40 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center border border-slate-100 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
                                            <FileText className="w-16 h-16 text-red-500 relative z-10" />
                                            <div className="absolute bottom-2 right-2">
                                                <span className="text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-600 px-2 py-1 rounded">PDF</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                                {name || "Secure Document Access"}
                                            </h2>
                                            <p className="text-sm text-slate-500 font-medium">
                                                Click below to view the PDF file
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center gap-2">
                                            {is_lead_capture && (
                                                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                                                    <User className="w-3 h-3" /> Registration Required
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {is_lead_capture && !isAuthorized ? (
                                <LeadCaptureForm
                                    brandColor={brandColor}
                                    leadForm={leadForm}
                                    setLeadForm={setLeadForm}
                                    onSubmit={onLeadSubmit}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={handleAction}
                                        style={{ backgroundColor: isFileMode ? '#dc2626' : brandColor }}
                                        className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <FileText className="w-5 h-5" /> {isFileMode ? "View PDF" : "View Document"}
                                    </button>

                                    <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Shield className="w-3 h-3" /> Secure Link Verified
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 skeu-card flex items-center justify-center shrink-0">
                                <Info className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                {is_lead_capture && !isAuthorized
                                    ? "Information provided is used to grant access to the requested content."
                                    : "This landing page ensures the destination is safe and provides a branded experience."}
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-40">
                            Powered by Scanner Studio Pro
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
