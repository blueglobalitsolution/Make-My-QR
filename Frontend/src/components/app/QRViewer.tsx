import React, { useEffect, useState } from 'react';
import { getPublicCode, getGatekeeperConfig } from '../../api/qrcodes';
import { Shield, Lock } from 'lucide-react';
import { GatekeeperPreview } from '../previews/gatekeeper';
import { PdfPreview } from '../previews/PdfPreview';
import { FontLoader } from '../FontLoader';
import apiClient from '../../api/client';
import type { GatekeeperConfigMap } from '../previews/gatekeeper';

interface QRViewerProps {
    slug: string;
    setView: (view: any) => void;
    isFileMode?: boolean;
}

const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
};

const QRViewer: React.FC<QRViewerProps> = ({ slug, setView, isFileMode = false }) => {
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrData, setQrData] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', email: '' });
    const [viewMode, setViewMode] = useState<'landing' | 'preview'>('landing');
    const [gatekeeperConfig, setGatekeeperConfig] = useState<GatekeeperConfigMap | null>(null);

    useEffect(() => {
        setIsMobile(isMobileDevice());

        const handleResize = () => {
            setIsMobile(isMobileDevice());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchCode = async () => {
            if (!slug) return;

            // Check if slug looks like a URL (happens if relative links break)
            if (slug.includes('.') || slug.startsWith('http')) {
                let target = slug;
                if (!target.startsWith('http')) target = `https://${target}`;
                console.log("Malformed slug detected, redirecting to target:", target);
                window.location.replace(target);
                return;
            }

            // Check for blocked=limit from URL
            const params = new URLSearchParams(window.location.search);
            if (params.get('blocked') === 'limit') {
                setError("This QR code has reached its maximum access limit and is no longer available.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setIsAuthorized(false);
                setError(null);
                const data = await getPublicCode(slug);
                setQrData(data);

                // Check if user is logged in
                const savedUser = localStorage.getItem('makemyqr_user');
                const hasSession = !!savedUser;
                setIsLoggedIn(hasSession);

                if (!data.is_protected && !data.is_lead_capture) {
                    setIsAuthorized(true);
                }

                if (!data.is_protected) {
                    setIsPasswordVerified(true);
                }

                // Fetch gatekeeper config (fire-and-forget, uses cache)
                getGatekeeperConfig().then(setGatekeeperConfig).catch(() => {});
            } catch (err) {
                console.error("Error fetching QR data:", err);
                setError("This QR code could not be found or is no longer active.");
            } finally {
                setLoading(false);
            }
        };

        fetchCode();
    }, [slug, setView]);

    const handlePasswordSubmit = async (password: string) => {
        try {
            await apiClient.post(`/qrcodes/${slug}/verify-password/`, { password });
            setIsPasswordVerified(true);
            if (!qrData.is_lead_capture) {
                setIsAuthorized(true);
            }
            return true;
        } catch (err) {
            console.error("Password Verification Error:", err);
            return false;
        }
    };

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (leadForm.name && leadForm.email) {
            try {
                // If password enabled, must be verified first
                if (qrData.is_protected && !isPasswordVerified) {
                    return;
                }

                await apiClient.post(`/qrcodes/${slug}/capture-lead/`, leadForm);
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
        // Source selection logic:
        // 1. file_url from backend (highest priority, should be the proxied endpoint)
        // 2. value if it's a direct URL
        let rawUrl = file_url || value;

        if (rawUrl) {
            if (rawUrl.startsWith('http')) {
                fullValue = rawUrl;
            } else if (rawUrl.startsWith('/')) {
                // Ensure it doesn't double slash if backendUrl has trailing slash
                const base = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
                fullValue = `${base}${rawUrl}`;
            } else {
                fullValue = rawUrl;
            }

            // Final protocol check for website category
            if (category === 'website' && fullValue && !fullValue.startsWith('http')) {
                fullValue = `https://${fullValue}`;
            }
        }
    }

    // For PDF type, always treat as file mode regardless of URL path
    const effectiveIsFileMode = isFileMode || category === 'pdf';

    useEffect(() => {
        // No auto-redirect — preview is always shown.
        // WhatsApp timer, password walls, lead capture are handled in GatekeeperPreview.
    }, [isAuthorized]);

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
                        onClick={() => setView('login')}
                        className="w-full py-4 skeu-btn text-[11px] capitalize "
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    // No early return for redirects anymore — preview is always shown
    // Gateway checks (password, lead capture, timer) are handled inside GatekeeperPreview

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
                    is_protected={is_protected}
                    isFileMode={effectiveIsFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={handleLeadSubmit}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    isMobile={isMobile}
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
                    isPasswordVerified={isPasswordVerified}
                    is_protected={is_protected}
                    isFileMode={effectiveIsFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={handleLeadSubmit}
                    onPasswordSubmit={handlePasswordSubmit}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    isMobile={isMobile}
                    gatekeeperConfig={gatekeeperConfig}
                />
            )}
        </>
    );
};

export default QRViewer;
