import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Scan, Smartphone, Globe, FileText, MessageCircle, X, ExternalLink, Copy, ChevronLeft } from 'lucide-react';

interface PublicScanProps {
    setView: (view: any) => void;
}

export const PublicScan: React.FC<PublicScanProps> = ({ setView }) => {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<{
        type: 'website' | 'pdf' | 'business' | 'whatsapp' | 'text';
        value: string;
    } | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (!scannedData) {
            // Use setTimeout to ensure the DOM element is ready
            const timer = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
                );
                scanner.render(onScanSuccess, onScanFailure);
                scannerRef.current = scanner;
            }, 100);

            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(error => {
                        console.error("Failed to clear scanner", error);
                    });
                }
            };
        }
    }, [scannedData]);

    const onScanSuccess = (decodedText: string) => {
        setScannedData(decodedText);
        detectType(decodedText);
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
        }
    };

    const onScanFailure = (error: string) => {
        // Silently ignore scanner parity errors
    };

    const detectType = (data: string) => {
        if (data.includes('wa.me') || data.includes('whatsapp.com/send')) {
            setScanResult({ type: 'whatsapp', value: data });
        } else if (data.toLowerCase().endsWith('.pdf') || data.includes('view/file/')) {
            setScanResult({ type: 'pdf', value: data });
        } else if (data.includes('view/business')) {
            setScanResult({ type: 'business', value: data });
        } else if (data.startsWith('http://') || data.startsWith('https://')) {
            setScanResult({ type: 'website', value: data });
        } else {
            setScanResult({ type: 'text', value: data });
        }
    };

    const resetScan = () => {
        setScannedData(null);
        setScanResult(null);
    };

    const handleAction = () => {
        if (!scanResult) return;

        if (scanResult.type === 'text') {
            navigator.clipboard.writeText(scanResult.value);
            alert("Content copied to clipboard!");
            return;
        }

        if (scanResult.type === 'business') {
            try {
                const url = new URL(scanResult.value);
                const path = url.pathname;
                const search = url.search;
                window.history.pushState({}, '', path + search);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } catch (e) {
                window.open(scanResult.value, '_blank');
            }
        } else {
            window.open(scanResult.value, '_blank');
        }
    };

    return (
        <div className="min-h-screen flex flex-col skeu-app-bg">
            <header className="sticky top-0 z-[100] flex items-center justify-between px-8 py-3 backdrop-blur-xl bg-white/70 border-b border-red-100/50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
                    <div className="bg-[#dc2626] p-1.5 rounded-lg shadow-lg">
                        <Scan className="text-white w-5 h-5" />
                    </div>
                    <h1 className="skeu-page-title !text-lg">
                        Scanner <span className="text-[#dc2626]">Studio</span>
                    </h1>
                    {/* The original content "Scanner <span className="text-[#dc2626]">Studio</span>" was replaced by "{code.name}" */}
                    {/* The instruction had a malformed snippet, so I've corrected it to be syntactically valid */}
                </div>
                <button onClick={() => setView('landing')} className="text-slate-400 hover:text-[#dc2626] transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 bg-red-50/50">
                {!scannedData ? (
                    <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Scan Any QR Code</h2>
                            <p className="text-slate-500 font-medium">Point your camera at a QR code to preview it.</p>
                        </div>

                        <div className="skeu-card p-6 aspect-square flex flex-col overflow-hidden">
                            <div id="reader" className="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-black"></div>
                        </div>

                        <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/50 flex items-start gap-3">
                            <Smartphone className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" />
                            <p className="text-xs text-[#dc2626] font-semibold leading-relaxed">
                                This public scanner works without an account. Detected links will be shown in a protected phone preview.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-8 w-full max-w-4xl lg:flex-row lg:justify-center">
                        {/* Phone Mockup Column */}
                        <div className="animate-in slide-in-from-bottom-10 duration-700">
                            <div className="skeu-phone w-[300px] h-[600px] shadow-2xl relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 skeu-phone-notch z-50 overflow-hidden" />

                                <div className="h-full w-full bg-white relative overflow-hidden pt-12">
                                    {/* Status Bar */}
                                    <div className="absolute top-0 left-0 right-0 h-10 px-6 flex items-center justify-between text-[10px] font-bold text-slate-800 bg-white/80 backdrop-blur-sm z-40">
                                        <span>9:41</span>
                                        <div className="flex items-center gap-1.5 font-black text-[8px]">
                                            <span>5G</span>
                                            <div className="w-4 h-2 rounded-[2px] border border-slate-800 flex items-center p-[1px]">
                                                <div className="w-full h-full bg-slate-800 rounded-[1px]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="h-full flex flex-col">
                                        {/* Browser Address Bar if Website */}
                                        {scanResult?.type === 'website' && (
                                            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
                                                <div className="flex-1 h-6 bg-white rounded-lg border border-slate-200 px-3 flex items-center gap-2 overflow-hidden">
                                                    <Globe className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[10px] text-slate-400 truncate font-medium">
                                                        {scanResult.value.replace('https://', '').replace('http://', '')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 flex flex-col items-center text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-3xl shadow-inner flex items-center justify-center mb-6">
                                                {scanResult?.type === 'website' && <Globe className="w-10 h-10 text-red-500" />}
                                                {scanResult?.type === 'pdf' && <FileText className="w-10 h-10 text-red-500" />}
                                                {scanResult?.type === 'business' && <Smartphone className="w-10 h-10 text-[#dc2626]" />}
                                                {scanResult?.type === 'whatsapp' && <MessageCircle className="w-10 h-10 text-green-500" />}
                                                {scanResult?.type === 'text' && <FileText className="w-10 h-10 text-slate-400" />}
                                            </div>

                                            <h3 className="text-xl font-black text-slate-800 mb-2">
                                                {scanResult?.type === 'website' && "Website Detected"}
                                                {scanResult?.type === 'pdf' && "PDF Document"}
                                                {scanResult?.type === 'business' && "Business Profile"}
                                                {scanResult?.type === 'whatsapp' && "WhatsApp Chat"}
                                                {scanResult?.type === 'text' && "Text Content"}
                                            </h3>

                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 w-full mb-6 max-h-40 overflow-hidden text-ellipsis break-all">
                                                <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
                                                    "{scanResult?.value}"
                                                </p>
                                            </div>

                                            <div className="space-y-3 w-full mt-auto pb-10">
                                                <button
                                                    onClick={handleAction}
                                                    className="w-full py-4 skeu-btn text-[11px] capitalize tracking-widest flex items-center justify-center gap-2"
                                                >
                                                    {scanResult?.type === 'text' ? (
                                                        <> <Copy className="w-4 h-4" /> Copy Content </>
                                                    ) : (
                                                        <> <ExternalLink className="w-4 h-4" /> Launch Preview </>
                                                    )}
                                                </button>
                                                <p className="text-[10px] text-slate-400 font-bold px-4">
                                                    Click to open the content in full view or perform the native action.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls and Information Column */}
                        <div className="w-full max-w-sm flex flex-col gap-4 animate-in fade-in slide-in-from-right-10 duration-700 delay-300">
                            <div className="skeu-card p-8 space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black capitalize text-[#dc2626] bg-red-50 px-3 py-1 rounded-full">Scan Verified</span>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Content successfully identified.</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 skeu-inset">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="text-[10px] text-slate-400 font-black capitalize tracking-widest">Destination</div>
                                            <div className="text-sm font-bold text-slate-700 truncate max-w-[180px]">
                                                {scanResult?.value.replace(/^https?:\/\//, '')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <button
                                        onClick={resetScan}
                                        className="w-full py-4 skeu-btn-secondary text-[11px] capitalize tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Scan Another QR
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-800 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="text-sm font-black mb-2 flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-red-400" /> Professional Scanner
                                    </h4>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                        This preview is rendered in a sandboxed environment to protect your device from potentially malicious links.
                                    </p>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-700" />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="py-6 text-center">
                <p className="text-[10px] text-slate-400 font-bold capitalize tracking-[0.2em]">
                    Powered by <span className="text-slate-600">MakeMyQRCode Studio</span>
                </p>
            </footer>
        </div>
    );
};
