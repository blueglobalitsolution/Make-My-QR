import React, { useEffect, useState } from 'react';
import { getPublicCode } from '../../api/qrcodes';
import { Shield } from 'lucide-react';
import { GatekeeperPreview } from '../previews/gatekeeper';
import { PdfPreview } from '../previews/PdfPreview';

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

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (leadForm.name && leadForm.email) {
            console.log("Lead captured:", leadForm);
            setIsAuthorized(true);
        }
    };

    const { category, value, name, settings, is_lead_capture, file_url } = qrData || {};
    const brandColor = settings?.fgColor || '#156295';

    // Construct URL logic
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
    let fullValue = '';
    if (qrData) {
        if (file_url) {
            fullValue = file_url;
        } else if (value?.startsWith('/media/')) {
            fullValue = `${backendUrl}${value}`;
        } else if (value?.startsWith('/')) {
            fullValue = `${backendUrl}${value}`;
        } else {
            fullValue = value;
        }
    }

    // Effect for WhatsApp redirection
    useEffect(() => {
        if (isAuthorized && category === 'whatsapp' && fullValue) {
            console.log("Redirecting to WhatsApp:", fullValue);
            window.location.replace(fullValue);
        }
    }, [isAuthorized, category, fullValue]);

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

    // Direct redirect for WhatsApp without showing preview UI
    if (category === 'whatsapp' && isAuthorized) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-2 h-2 bg-slate-200 rounded-full" />
                </div>
            </div>
        );
    }

    if (viewMode === 'preview' && category === 'pdf' && isAuthorized) {
        return (
            <PdfPreview
                name={name}
                brandColor={brandColor}
                fullValue={fullValue}
                is_lead_capture={is_lead_capture}
                isAuthorized={isAuthorized}
                isFileMode={isFileMode}
                leadForm={leadForm}
                setLeadForm={setLeadForm}
                onLeadSubmit={handleLeadSubmit}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
        );
    }

    return (
        <GatekeeperPreview
            category={category}
            name={name}
            brandColor={brandColor}
            fullValue={fullValue}
            businessData={settings?.business}
            is_lead_capture={is_lead_capture}
            isAuthorized={isAuthorized}
            isFileMode={isFileMode}
            leadForm={leadForm}
            setLeadForm={setLeadForm}
            onLeadSubmit={handleLeadSubmit}
            viewMode={viewMode}
            setViewMode={setViewMode}
        />
    );
};
