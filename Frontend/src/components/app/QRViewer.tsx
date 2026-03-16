import React, { useEffect, useState } from 'react';
import { getPublicCode } from '../../api/qrcodes';
import { Shield, Lock } from 'lucide-react';
import { GatekeeperPreview } from '../previews/gatekeeper';
import { PdfPreview } from '../previews/PdfPreview';
import { FontLoader } from '../FontLoader';

interface QRViewerProps {
    slug: string;
    setView: (view: any) => void;
    isFileMode?: boolean;
}

const QRViewer: React.FC<QRViewerProps> = ({ slug, setView, isFileMode = false }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qrData, setQrData] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', email: '' });
    const [viewMode, setViewMode] = useState<'landing' | 'preview'>('landing');

    useEffect(() => {
        const fetchCode = async () => {
            try {
                setLoading(true);
                setIsAuthorized(false);
                setError(null);
                const data = await getPublicCode(slug);
                setQrData(data);

                // Check if user is logged in
                const savedUser = localStorage.getItem('makemyqr_user') || localStorage.getItem('barqr_user');
                const hasSession = !!savedUser;
                setIsLoggedIn(hasSession);

                // Authourization logic:
                // 1. If protected, must be logged in
                // 2. If lead capture, must submit lead (not yet)
                // 3. Otherwise, authorized immediately
                
                if (!data.is_protected && !data.is_lead_capture) {
                    setIsAuthorized(true);
                } else if (data.is_protected && hasSession && !data.is_lead_capture) {
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

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (leadForm.name && leadForm.email) {
            try {
                const response = await fetch(`/r/${slug}/capture-lead/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadForm)
                });

                if (!response.ok) {
                    throw new Error(`Failed to capture lead: ${response.status}`);
                }

                console.log("Lead captured successfully");
                setIsAuthorized(true);
            } catch (err) {
                console.error("Lead Capture Error:", err);
                // Still allow them through even if capture fails to not break the user experience
                setIsAuthorized(true);
            }
        }
    };

    const { category, value, name, settings, is_lead_capture, is_protected, file_url, show_preview } = qrData || {};
    // For PDF type, use primaryColor from business settings, otherwise use fgColor
    const brandColor = (category === 'pdf' && settings?.business?.primaryColor)
        ? settings.business.primaryColor
        : (settings?.fgColor || '#dc2626');

    // Construct URL logic
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
    let fullValue = '';
    if (qrData) {
        // For PDF type, prefer file_url from backend, otherwise construct from value
        if (file_url) {
            fullValue = file_url;
        } else if (category === 'pdf') {
            // For PDF category, use value as the file path
            if (value?.startsWith('http')) {
                fullValue = value;
            } else if (value?.startsWith('/media/')) {
                fullValue = `${backendUrl}${value}`;
            } else if (value?.startsWith('/')) {
                fullValue = `${backendUrl}${value}`;
            } else {
                fullValue = value;
            }
        } else if (value?.startsWith('/media/')) {
            fullValue = `${backendUrl}${value}`;
        } else if (value?.startsWith('/')) {
            fullValue = `${backendUrl}${value}`;
        } else {
            fullValue = value;
        }
    }

    // For PDF type, always treat as file mode regardless of URL path
    const effectiveIsFileMode = isFileMode || category === 'pdf';

    useEffect(() => {
        // Only auto-redirect if preview is DISABLED and we are authorized
        if (isAuthorized && fullValue && !show_preview) {
            if (category === 'whatsapp' || category === 'website') {
                console.log(`Redirecting to ${category}:`, fullValue);
                // Ensure URL has protocol for website
                let redirectUrl = fullValue;
                if (category === 'website' && !redirectUrl.startsWith('http') && !redirectUrl.startsWith('https')) {
                    redirectUrl = `https://${redirectUrl}`;
                }
                window.location.replace(redirectUrl);
            } else if (category === 'pdf' || category === 'file' || category === 'links') {
                // For files and links, jump directly to the target
                window.location.replace(fullValue);
            }
        }
    }, [isAuthorized, category, fullValue, show_preview]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center skeu-app-bg p-6">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                    <p className="text-slate-500 font-bold capitalize  text-[10px]">Verifying Secure Link...</p>
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
                        <h2 className="text-2xl font-black text-slate-800 ">Access Denied</h2>
                        <p className="text-slate-500 font-medium">{error || "The link is broken or expired."}</p>
                    </div>
                    <button
                        onClick={() => setView('landing')}
                        className="w-full py-4 skeu-btn text-[11px] capitalize "
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    // ─── LOGIN WALL VIEW ───
    if (is_protected && !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center skeu-app-bg p-6">
                <div className="skeu-card p-12 max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-[2.5rem] animate-pulse" />
                        <div className="relative w-full h-full bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl border border-slate-50">
                            <Lock className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Protected Link</h2>
                        <p className="text-slate-500 font-medium px-4 leading-relaxed">
                            This QR code is private. Please log in to your account to view the content.
                        </p>
                    </div>
                    <button
                        onClick={() => setView('auth')}
                        className="w-full py-5 skeu-btn text-[12px] font-black tracking-widest uppercase transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/10"
                    >
                        Login to Access
                    </button>
                    <button
                        onClick={() => setView('landing')}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-tighter transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Hide everything if we are about to redirect
    if (isAuthorized && !show_preview && (category === 'website' || category === 'whatsapp' || category === 'pdf')) {
        return null;
    }

    return (
        <>
            <FontLoader fonts={[settings?.business?.fontTitle, settings?.business?.fontText]} />
            {viewMode === 'preview' && category === 'pdf' && isAuthorized ? (
                <PdfPreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
                    isFileMode={effectiveIsFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={handleLeadSubmit}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            ) : (
                <GatekeeperPreview
                    category={category}
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    businessData={settings?.business}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
                    isFileMode={effectiveIsFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={handleLeadSubmit}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            )}
        </>
    );
};

export default QRViewer;
