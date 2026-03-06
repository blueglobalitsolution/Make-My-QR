import React from 'react';
import { Download, ChevronLeft, Eye, Globe, Clock, BarChart2 } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';

interface PdfPreviewProps {
    name: string;
    brandColor: string;
    fullValue: string;
    businessData?: any;
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
    businessData,
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
        <div className="h-full flex flex-col bg-[#fcfdff] overflow-x-hidden relative font-inter pt-10 pb-10">
            {/* Background Curve */}
            <div
                className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[180%] h-[380px] rounded-b-[100%] z-0"
                style={{ backgroundColor: brandColor || '#9b9cf2' }}
            />
            {/* Glow effects */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-100/60 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100/60 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-[340px] mx-auto flex flex-col items-center pt-[50px] px-5">

                {/* Header Text */}
                <div className="text-center space-y-2 mb-6 w-full">
                    <h3 className="text-[17px] font-medium text-slate-900 tracking-tight">
                        {businessData?.company || "Give Your Company Name"}
                    </h3>
                    <h1 className="text-[26px] font-black text-black leading-[1.1] tracking-tight px-2">
                        {businessData?.title || name || "Here PDF Title Placement"}
                    </h1>
                    <p className="text-[17px] font-medium text-slate-900 px-2 leading-snug mt-1 pt-1 whitespace-pre-wrap">
                        {businessData?.description || "Learn about how we can help\nwith all your business needs."}
                    </p>
                </div>

                {/* Card Container */}
                <div className="w-full bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 overflow-hidden relative flex flex-col mb-6 mt-1">

                    {/* Top Image Part */}
                    <div className="w-full relative bg-slate-100 flex-shrink-0 pt-6 px-6">
                        {isFileMode && fullValue ? (
                            <div className="w-full aspect-[1/1.4] relative shadow-2xl shadow-blue-900/20 border border-slate-200 rounded-lg overflow-hidden bg-white mx-auto">
                                <div className="absolute inset-0 pointer-events-none">
                                    <iframe
                                        src={`${fullValue}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                                        className="w-full h-full border-none object-cover scale-[1.02] origin-top"
                                        scrolling="no"
                                        title="PDF Preview Thumbnail"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-[180px] rounded-lg overflow-hidden shadow-lg mx-auto relative">
                                <img
                                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
                                    alt="Business meeting"
                                    className="w-full h-full object-cover"
                                />
                                {/* Business Tab (Top Right) */}
                                <div className="absolute top-0 right-4 bg-[#3b82f6] text-white px-5 py-3 rounded-b-xl flex flex-col items-center shadow-lg">
                                    <div className="w-[20px] h-[14px] border-[2px] border-white rounded-[2px] mb-[5px]" />
                                    <span className="text-[7.5px] font-black uppercase tracking-widest leading-none">Business</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Part */}
                    <div className="p-7 pb-8 flex flex-col items-center justify-center space-y-4">

                        {/* Button / Lead Capture */}
                        <div className="pt-4">
                            {is_lead_capture && !isAuthorized ? (
                                <LeadCaptureForm
                                    brandColor={brandColor}
                                    leadForm={leadForm}
                                    setLeadForm={setLeadForm}
                                    onSubmit={onLeadSubmit}
                                />
                            ) : (
                                <button
                                    onClick={handleAction}
                                    className="w-[180px] mx-auto bg-[#1e3a8a] py-[12px] rounded-xl flex items-center justify-center gap-2 font-medium text-[16px] text-white shadow-lg transition-all active:scale-95 border-none outline-none tracking-wide"
                                >
                                    <Eye className="w-5 h-5" /> {businessData?.buttons?.[0]?.text || "View PDF"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer URL */}
                <div className="flex items-center justify-center gap-2 text-slate-900 mt-2">
                    <Globe className="w-[22px] h-[22px]" />
                    <span className="text-[17px] font-medium tracking-wide">
                        {businessData?.buttons?.[0]?.url?.replace(/^https?:\/\//, '') || "www.google.com"}
                    </span>
                </div>

            </div>
        </div>
    );
};
