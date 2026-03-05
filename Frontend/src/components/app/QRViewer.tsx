import React, { useEffect, useState } from 'react';
import { getPublicCode } from '../../api/qrcodes';
import { FileText, Globe, MessageCircle, Smartphone, ExternalLink, Shield, Download, Info, ChevronLeft, Mail, User, ArrowRight } from 'lucide-react';

interface QRViewerProps {
    slug: string;
    setView: (view: any) => void;
    isFileMode?: boolean;
}

export const QRViewer: React.FC<QRViewerProps> = ({ slug, setView, isFileMode = false }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qrData, setQrData] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', email: '' });

    const [viewMode, setViewMode] = useState<'landing' | 'preview'>('landing');

    useEffect(() => {
        const fetchCode = async () => {
            try {
                setLoading(true);
                const data = await getPublicCode(slug);
                setQrData(data);

                // If no lead capture, authorize immediately
                if (!data.is_lead_capture) {
                    setIsAuthorized(true);
                }
            } catch (err) {
                console.error("Error fetching QR data:", err);
                setError("This QR code could not be found or is no longer active.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCode();
        }
    }, [slug, setView]);

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (leadForm.name && leadForm.email) {
            // Here you would typically send the lead data to the backend
            console.log("Lead captured:", leadForm);
            setIsAuthorized(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center skeu-app-bg p-6">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verifying Secure Link...</p>
                </div>
            </div>
        );
    }

    if (error || !qrData) {
        return (
            <div className="min-h-screen flex items-center justify-center skeu-app-bg p-6">
                <div className="skeu-card p-10 max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                        <Shield className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access Denied</h2>
                        <p className="text-slate-500 font-medium">{error || "The link is broken or expired."}</p>
                    </div>
                    <button
                        onClick={() => setView('landing')}
                        className="w-full py-4 skeu-btn text-[11px] uppercase tracking-widest"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const { category, value, name, settings, is_lead_capture, is_protected, file_url } = qrData;
    const brandColor = settings?.fgColor || '#156295';

    // Construct URL
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://192.168.1.208:8010';
    let fullValue;
    
    // Use file_url if available (for file-type QR codes)
    if (file_url) {
        fullValue = file_url;
    } else if (value?.startsWith('/media/')) {
        fullValue = `${backendUrl}${value}`;
    } else if (value?.startsWith('/')) {
        fullValue = `${backendUrl}${value}`;
    } else {
        fullValue = value;
    }

    const handleAction = () => {
        if (is_lead_capture && !isAuthorized) {
            // Scroll to form or show message
            return;
        }

        if (isFileMode) {
            // Open PDF directly in new tab
            window.open(fullValue, '_blank');
        } else if (category === 'pdf') {
            setViewMode('preview');
        } else {
            window.location.href = fullValue;
        }
    };

    if (viewMode === 'preview' && category === 'pdf' && isAuthorized) {
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
                    {/* Branded Card */}
                    <div className="skeu-card overflow-hidden">
                        <div className="h-2 w-full" style={{ backgroundColor: brandColor }} />

                        <div className="p-8 space-y-8">
                            <div className="text-center space-y-4">
                                {isFileMode ? (
                                    // File preview landing page
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
                                    // Regular QR landing page
                                    <>
                                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] shadow-inner flex items-center justify-center mx-auto mb-2 group relative">
                                            <div className="absolute inset-0 rounded-[2.5rem] bg-current opacity-5 animate-pulse" style={{ color: brandColor }} />
                                            {category === 'pdf' && <FileText className="w-12 h-12 text-red-500 relative z-10" />}
                                            {category === 'website' && <Globe className="w-12 h-12 text-blue-500 relative z-10" />}
                                            {category === 'whatsapp' && <MessageCircle className="w-12 h-12 text-green-500 relative z-10" />}
                                            {(!category || category === 'text') && <Info className="w-12 h-12 text-slate-400 relative z-10" />}
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight px-4">
                                                {name || "Secure Document Access"}
                                            </h2>
                                            <div className="flex items-center justify-center gap-2">
                                                {is_lead_capture && (
                                                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                                                        <User className="w-3 h-3" /> Registration Required
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {is_lead_capture && !isAuthorized ? (
                                <form onSubmit={handleLeadSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                                        <p className="text-xs text-slate-500 font-bold text-center mb-4 uppercase tracking-widest">Complete to View Content</p>

                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Your Full Name"
                                                required
                                                className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                                value={leadForm.name}
                                                onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                required
                                                className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                                value={leadForm.email}
                                                onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        style={{ backgroundColor: brandColor }}
                                        className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        Access Content <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={handleAction}
                                        style={{ backgroundColor: isFileMode ? '#dc2626' : brandColor }}
                                        className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        {isFileMode ? (
                                            <> <FileText className="w-5 h-5" /> View PDF </>
                                        ) : category === 'pdf' ? (
                                            <> <Download className="w-5 h-5" /> View Document </>
                                        ) : (
                                            <> <ExternalLink className="w-5 h-5" /> Continue to Site </>
                                        )}
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

                    {/* Footer Info */}
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
