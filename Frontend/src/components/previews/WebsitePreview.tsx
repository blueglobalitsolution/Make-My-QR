import React from 'react';
import { Globe, ExternalLink, Shield, Info, User } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';

interface WebsitePreviewProps {
    name: string;
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

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({
    name,
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
        <div className="h-full flex flex-col bg-[#fcfdff] scrollbar-hide overflow-hidden relative font-inter pt-16 pb-6">
            {/* Background Curve */}
            <div
                className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[180%] h-[380px] rounded-b-[100%] z-0"
                style={{ backgroundColor: brandColor }}
            />

            <div className="relative z-10 w-full max-w-[340px] mx-auto flex flex-col items-center px-5">
                {/* URL Capsule */}
                <div className="w-full bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full flex items-center gap-3 mb-4 shadow-lg">
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                        <Globe className="w-3.5 h-3.5" style={{ color: brandColor }} />
                    </div>
                    <span className="text-white font-bold text-sm truncate ">
                        {fullValue?.replace(/^https?:\/\//, '') || "your-website.com"}
                    </span>
                </div>

                {/* Card Container */}
                <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 overflow-hidden relative flex flex-col mb-6">
                    {/* Visual Placeholder */}
                    <div className="w-full h-36 bg-slate-50 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
                        <div className="w-full h-full bg-white/50 rounded-2xl flex items-center justify-center border border-slate-200/50 shadow-inner">
                            <Globe className="w-12 h-12 text-slate-200" />
                        </div>
                    </div>

                    <div className="p-6 flex flex-col items-center space-y-4">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-slate-800  leading-tight">
                                {name || "Website Link"}
                            </h2>
                            {is_lead_capture && (
                                <div className="flex items-center justify-center pt-1">
                                    <span className="flex items-center gap-1 text-[9px] font-black uppercase  bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                                        <User className="w-3 h-3" /> Registration Required
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Skeletal UI Placeholders */}
                        <div className="w-full space-y-3 px-2">
                            <div className="w-full h-3 bg-slate-100/50 rounded-full animate-pulse" />
                            <div className="w-[90%] h-3 bg-slate-100/50 rounded-full animate-pulse" />
                            <div className="w-[95%] h-3 bg-slate-100/50 rounded-full animate-pulse" />
                        </div>

                        <div className="w-full p-6 bg-cyan-50/30 rounded-2xl flex items-center justify-center border border-cyan-100/20">
                            <div className="w-32 h-3.5 bg-cyan-200/40 rounded-full" />
                        </div>

                        {is_lead_capture && !isAuthorized ? (
                            <LeadCaptureForm
                                brandColor={brandColor}
                                leadForm={leadForm}
                                setLeadForm={setLeadForm}
                                onSubmit={onLeadSubmit}
                            />
                        ) : (
                            <div className="w-full space-y-4">
                                <button
                                    onClick={handleAction}
                                    style={{ backgroundColor: brandColor }}
                                    className="w-full py-4 rounded-xl text-white font-black text-[11px] uppercase  shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 px-6 shadow-blue-900/10"
                                >
                                    <ExternalLink className="w-4 h-4 shrink-0" /> Visit Website
                                </button>

                                <p className="text-[9px] text-slate-400 font-bold text-center uppercase  flex items-center justify-center gap-1.5 opacity-60">
                                    <Shield className="w-3 h-3" /> Secure Link Verified
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
