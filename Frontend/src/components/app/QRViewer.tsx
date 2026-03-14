import React, { useEffect, useState } from 'react';
import { getPublicCode } from '../../api/qrcodes';
import { Shield } from 'lucide-react';
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

    const { category, value, name, settings, is_lead_capture, file_url } = qrData || {};
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

    // Effect for Redirections (WhatsApp, Website)
    useEffect(() => {
        if (isAuthorized && fullValue) {
            if (category === 'whatsapp' || category === 'website') {
                console.log(`Redirecting to ${category}:`, fullValue);
                // Ensure URL has protocol for website
                let redirectUrl = fullValue;
                if (category === 'website' && !redirectUrl.startsWith('http') && !redirectUrl.startsWith('https')) {
                    redirectUrl = `https://${redirectUrl}`;
                }
                window.location.replace(redirectUrl);
            }
        }
    }, [isAuthorized, category, fullValue]);

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

    // Hide everything if we are about to redirect
    if (isAuthorized && (category === 'website' || category === 'whatsapp')) {
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
