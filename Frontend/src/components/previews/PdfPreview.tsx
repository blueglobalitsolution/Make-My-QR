import React, { useState, useEffect } from 'react';
import { Download, ChevronLeft, Eye, Globe, Clock, BarChart2, FileText, Loader2 } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';
import { PasswordWall } from './PasswordWall';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const PdfPagePreview: React.FC<{ url: string; onViewPdf: () => void }> = ({ url, onViewPdf }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pageImage, setPageImage] = useState<string | null>(null);

    useEffect(() => {
        const renderPdfPage = async () => {
            try {
                setLoading(true);
                setError(false);

                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);

                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context!,
                    viewport: viewport
                }).promise;

                const imageUrl = canvas.toDataURL('image/png');
                setPageImage(imageUrl);
            } catch (err) {
                console.error('Error rendering PDF:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            renderPdfPage();
        }
    }, [url]);

    if (loading) {
        return (
            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Loading preview...</p>
                </div>
            </div>
        );
    }

    if (error || !pageImage) {
        return (
            <div
                className="absolute inset-0 bg-slate-50 flex items-center justify-center cursor-pointer"
                onClick={onViewPdf}
            >
                <div className="text-center p-4">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">PDF Document</p>
                    <p className="text-[10px] text-slate-400 mt-1">Tap to view</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="absolute inset-0 bg-white cursor-pointer overflow-hidden"
            onClick={onViewPdf}
        >
            <img
                src={pageImage}
                alt="PDF Preview"
                className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] font-medium">
                Tap to view full PDF
            </div>
        </div>
    );
};

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
    isMobile?: boolean;
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
    isPreview = false,
    isMobile = false
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
                    {isMobile ? (
                        <PdfPagePreview
                            url={fullValue}
                            onViewPdf={() => window.open(fullValue, '_blank')}
                        />
                    ) : (
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
                    )}
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
            className="h-full flex flex-col bg-[#fcfdff] overflow-y-auto scrollbar-hide relative"
            style={{ fontFamily: textFont }}
        >
            <div className="relative w-full flex-shrink-0">
                {/* Background Curve Header */}
                <div
                    className="w-full px-5 pt-20 pb-44 text-center"
                    style={{
                        backgroundColor: brandColor || '#9b9cf2',
                        borderBottomLeftRadius: '50% 40px',
                        borderBottomRightRadius: '50% 40px',
                    }}
                >
                    <h3 className="text-[12px] font-bold tracking-widest mb-1 uppercase opacity-80" style={{ fontFamily: titleFont, color: textColor }}>
                        {businessData?.company || "My Company"}
                    </h3>
                    <h1 className="text-[22px] font-black leading-tight tracking-tight" style={{ fontFamily: titleFont, color: titleColor }}>
                        {businessData?.title || name || "PDF Content Title"}
                    </h1>
                    <p className="text-[13px] font-medium px-2 leading-snug mt-2 opacity-90" style={{ fontFamily: textFont, color: textColor }}>
                        {businessData?.description || "Learn about how we can help\nwith all your business needs."}
                    </p>
                </div>

                {/* Card Container — overlapping the curve */}
                <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 mx-6">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">

                        {/* Top Image Part */}
                        <div className="w-full relative bg-white h-[250px] pt-4 px-4 pb-2">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 mx-auto relative group bg-slate-50 flex items-center justify-center">
                                {(fullValue && (fullValue.toLowerCase().includes('.pdf') || fullValue.startsWith('blob:'))) ? (
                                    isMobile ? (
                                        <PdfPagePreview
                                            url={fullValue}
                                            onViewPdf={() => isFileMode ? window.open(fullValue, '_blank') : setViewMode('preview')}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-white overflow-hidden">
                                            <iframe
                                                src={`${fullValue}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
                                                className="h-full border-none pointer-events-none bg-white"
                                                title="PDF First Page Preview"
                                                scrolling="no"
                                                style={{ overflow: 'hidden', background: 'white', width: 'calc(100% + 20px)' }}
                                            />
                                        </div>
                                    )
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
                                        className="w-full max-w-[200px] py-[10px] rounded-xl flex items-center justify-center gap-2.5 font-bold text-[13px] text-white transition-all active:scale-[0.98] border-none outline-none shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        style={{
                                            backgroundColor: businessData?.secondaryColor || '#1e3a8a',
                                            boxShadow: `0 10px 15px -3px ${businessData?.secondaryColor ? businessData.secondaryColor + '40' : 'rgba(30, 58, 138, 0.2)'}`
                                        }}
                                    >
                                        <Eye className="w-5 h-5" strokeWidth={3} /> {businessData?.buttons?.[0]?.text || "View PDF"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {businessData?.buttons?.[0]?.url && businessData?.buttons?.[0]?.url !== '#' && (
                <div className="mt-32 mb-12 flex flex-col items-center">
                    {/* Footer URL */}
                    <a
                        href={businessData.buttons[0].url.startsWith('http') ? businessData.buttons[0].url : `https://${businessData.buttons[0].url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-slate-900 mt-2 hover:opacity-80 transition-opacity"
                    >
                        <Globe className="w-[22px] h-[22px] shrink-0" />
                        <span className="text-[17px] font-medium break-all text-center">
                            {businessData.buttons[0].url.replace(/^https?:\/\//, '')}
                        </span>
                    </a>
                </div>
            )}
        </div>
    );
};