import React from 'react';
import { Download, ChevronLeft, Eye, Globe, Clock, BarChart2 } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';
import { PasswordWall } from './PasswordWall';

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
    onPasswordSubmit?: (password: string) => boolean;
    isPasswordVerified?: boolean;
    viewMode: 'landing' | 'preview';
    setViewMode: React.Dispatch<React.SetStateAction<'landing' | 'preview'>>;
    isPreview?: boolean;
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
    onPasswordSubmit,
    isPasswordVerified = true,
    viewMode,
    setViewMode,
    isPreview = false
}) => {
    const titleFont = businessData?.fontTitle || 'Poppins';
    const textFont = businessData?.fontText || 'Inter';
    const titleColor = businessData?.fontTitleColor || '#ffffff';
    const textColor = businessData?.fontTextColor || '#ffffff';

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
                            <p className="text-[10px] text-slate-400 font-bold uppercase ">Scanner Studio Viewer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={fullValue} download className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase  transition-all shadow-lg flex items-center gap-2">
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
        if (isPreview) return;

        if (is_lead_capture && !isAuthorized) {
            return;
        }

        if (!isPasswordVerified && onPasswordSubmit) {
            return;
        }

        if (isFileMode) {
            window.open(fullValue, '_blank');
        } else {
            setViewMode('preview');
        }
    };

    return (
        <div
            className="h-full flex flex-col bg-[#fcfdff] overflow-y-auto scrollbar-hide relative pt-12 pb-20"
            style={{ fontFamily: textFont }}
        >
            {/* Background Curve */}
            <div
                className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[180%] h-[320px] rounded-b-[100%] z-0"
                style={{ backgroundColor: brandColor || '#9b9cf2' }}
            />
            {/* Glow effects */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-100/60 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100/60 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-[340px] mx-auto flex flex-col items-center pt-[30px] px-5 pb-12">

                {/* Header Text */}
                <div className="text-center space-y-1 mb-3 w-full">
                    <h3 className="text-[13px] font-medium " style={{ fontFamily: titleFont, color: titleColor }}>
                        {businessData?.company || "Give Your Company Name"}
                    </h3>
                    <h1 className="text-[20px] font-black leading-[1.1]  px-2" style={{ fontFamily: titleFont, color: titleColor }}>
                        {businessData?.title || name || "Here PDF Title Placement"}
                    </h1>
                    <p className="text-[13px] font-medium px-2 leading-snug mt-1 whitespace-pre-wrap opacity-90" style={{ fontFamily: textFont, color: textColor }}>
                        {businessData?.description || "Learn about how we can help\nwith all your business needs."}
                    </p>
                </div>

                {/* Card Container */}
                <div className="w-full bg-white rounded-[1.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden relative flex flex-col mb-3 mt-1">

                    {/* Top Image Part */}
                    <div className="w-full relative bg-white h-[250px] pt-4 px-4">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 mx-auto relative group bg-slate-50 flex items-center justify-center">
                            {(fullValue && (fullValue.toLowerCase().includes('.pdf') || fullValue.startsWith('blob:'))) ? (
                                <div className="absolute inset-0 bg-white overflow-hidden">
                                    <iframe
                                        src={`${fullValue}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
                                        className="h-full border-none pointer-events-none bg-white"
                                        title="PDF First Page Preview"
                                        scrolling="no"
                                        style={{ overflow: 'hidden', background: 'white', width: 'calc(100% + 20px)' }}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={businessData?.images?.[0] || "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"}
                                    alt="Business meeting"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                            {/* PDF Tag (Top Right) */}
                            <div className="absolute top-0 right-4 bg-red-600 text-white px-4 py-2.5 rounded-b-xl flex flex-col items-center shadow-lg transition-transform hover:-translate-y-1 z-10">
                                <div className="w-4 h-5 border-[2px] border-white/90 rounded-[3px] mb-[3px] relative flex items-center justify-center bg-red-600">
                                    <span className="text-[5px] font-black text-white">PDF</span>
                                </div>
                                <span className="text-[7px] font-black uppercase  leading-none text-white/90">FILE</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Part */}
                    <div className="p-4 pb-5 flex flex-col items-center justify-center w-full shrink-0">
                        {/* Button / Lead Capture */}
                        <div className="w-full flex justify-center mt-2">
                        {(!isAuthorized && (is_lead_capture || !isPasswordVerified)) ? (
                            (!isPasswordVerified && onPasswordSubmit) ? (
                                <div className="w-full">
                                    <PasswordWall 
                                        brandColor={brandColor} 
                                        onSubmit={onPasswordSubmit} 
                                    />
                                </div>
                            ) : (
                                <LeadCaptureForm
                                    brandColor={brandColor}
                                    leadForm={leadForm}
                                    setLeadForm={setLeadForm}
                                    onSubmit={onLeadSubmit}
                                />
                            )
                        ) : (
                            <button
                                onClick={handleAction}
                                className="w-full max-w-[200px] bg-[#1e3a8a] py-[10px] rounded-xl flex items-center justify-center gap-2.5 font-bold text-[13px] text-white shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] border-none outline-none "
                            >
                                <Eye className="w-5 h-5" /> {businessData?.buttons?.[0]?.text || "View PDF"}
                            </button>
                        )}
                        </div>
                    </div>
                </div>

                {/* Footer URL */}
                {businessData?.buttons?.[0]?.url && businessData?.buttons?.[0]?.url !== '#' && (
                    <a
                        href={businessData.buttons[0].url.startsWith('http') ? businessData.buttons[0].url : `https://${businessData.buttons[0].url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-slate-900 mt-2 hover:opacity-80 transition-opacity"
                    >
                        <Globe className="w-[22px] h-[22px]" />
                        <span className="text-[17px] font-medium ">
                            {businessData.buttons[0].url.replace(/^https?:\/\//, '')}
                        </span>
                    </a>
                )}

            </div>
        </div>
    );
};
