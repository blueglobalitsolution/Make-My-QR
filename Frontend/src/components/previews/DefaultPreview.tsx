import React from 'react';
import { Info, ExternalLink, Shield, User } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';

interface DefaultPreviewProps {
    name: string;
    category: string;
    brandColor: string;
    fullValue: string;
    is_lead_capture: boolean;
    isAuthorized: boolean;
    leadForm: {
        name: string;
        email: string;
    };
    setLeadForm: React.Dispatch<React.SetStateAction<{ name: string; email: string }>>;
    onLeadSubmit: (e: React.FormEvent) => void;
}

export const DefaultPreview: React.FC<DefaultPreviewProps> = ({
    name,
    category,
    brandColor,
    fullValue,
    is_lead_capture,
    isAuthorized,
    leadForm,
    setLeadForm,
    onLeadSubmit
}) => {
    const handleAction = () => {
        window.location.href = fullValue;
    };

    return (
        <div className="min-h-screen flex flex-col skeu-app-bg font-inter pb-12">
            <header className="px-8 py-8 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg shadow-sm" style={{ backgroundColor: brandColor }}>
                        <Info className="text-white w-5 h-5" />
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
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] shadow-inner flex items-center justify-center mx-auto mb-2 group relative">
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-current opacity-5 animate-pulse" style={{ color: brandColor }} />
                                    <Info className="w-12 h-12 text-slate-400 relative z-10" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight px-4">
                                        {name || "Secure Content Access"}
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium capitalize">
                                        {category || "Content"} Type
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        {is_lead_capture && (
                                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                                                <User className="w-3 h-3" /> Registration Required
                                            </span>
                                        )}
                                    </div>
                                </div>
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
                                        style={{ backgroundColor: brandColor }}
                                        className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <ExternalLink className="w-5 h-5" /> Continue
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

                </div>
            </main>
        </div>
    );
};
