import React from 'react';
import { ChevronLeft, Video, Phone, MoreVertical, Smile, Paperclip, Mic, User } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';
import { PasswordWall } from './PasswordWall';

interface WhatsAppPreviewProps {
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
    onPasswordSubmit?: (password: string) => boolean;
    isPasswordVerified?: boolean;
}

// WhatsApp-style chat background pattern (SVG as data URL)


export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
    name,
    brandColor,
    fullValue,
    is_lead_capture,
    isAuthorized,
    leadForm,
    setLeadForm,
    onLeadSubmit,
    onPasswordSubmit,
    isPasswordVerified = true
}) => {
    const handleOpen = () => { window.open(fullValue, '_blank'); };

    // Parse phone number and message from WhatsApp URL (https://wa.me/<phone>?text=<msg>)
    let phone = '';
    let message = 'Hello! I scanned your QR code.';
    try {
        const url = new URL(fullValue);
        // Extracts the number part from wa.me/12345
        const rawPhone = url.pathname.replace('/', '').trim();
        if (rawPhone) {
            phone = rawPhone;
        }

        const textParam = url.searchParams.get('text');
        if (textParam) message = textParam;
    } catch {
        // Fallback for non-URL values (raw numbers)
        phone = fullValue.replace(/\D/g, '');
    }

    // Format phone for display (e.g. +91 84606 87490)
    const formatPhone = (num: string) => {
        if (!num) return '';
        // If it looks like it has a CC (e.g. 91...)
        // This is a naive formatter but covers the user's specific case
        if (num.startsWith('91')) {
            return `+91 ${num.slice(2, 7)} ${num.slice(7)}`;
        }
        if (num.length > 10) {
            // General case for long numbers: CC + Number
            return `+${num.slice(0, num.length - 10)} ${num.slice(num.length - 10, num.length - 5)} ${num.slice(num.length - 5)}`;
        }
        return `+${num}`;
    };

    const displayPhone = phone ? formatPhone(phone) : (name || 'Contact');

    if (!isAuthorized && (is_lead_capture || !isPasswordVerified)) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-[#e5ddd5]">
                {!isPasswordVerified && onPasswordSubmit ? (
                    <PasswordWall
                        brandColor="#075E54"
                        onSubmit={onPasswordSubmit}
                    />
                ) : (
                    <LeadCaptureForm
                        brandColor="#25D366"
                        leadForm={leadForm}
                        setLeadForm={setLeadForm}
                        onSubmit={onLeadSubmit}
                    />
                )}
            </div>
        );
    }

    // Use only the actual message, set as 'me' to show on right side
    const messages = [
        { from: 'me', text: message },
    ];

    return (
        <div className="h-full flex flex-col font-inter overflow-hidden">

            {/* ── HEADER ─────────────────────────────────── */}
            <div
                className="flex items-center gap-3 px-3 pt-16 pb-2.5 shrink-0"
                style={{ backgroundColor: '#075E54' }}
            >

                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                    <User className="w-4 h-4 text-slate-300" />
                </div>

                {/* Name */}
                <div className="min-w-0">
                    <p className="text-white text-[11px] font-medium leading-tight whitespace-nowrap">
                        {displayPhone}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 text-white/90 shrink-0 ml-auto">
                    <Video className="w-4 h-4" />
                    <Phone className="w-4 h-4" />
                    <MoreVertical className="w-4 h-4" />
                </div>
            </div>

            {/* ── CHAT AREA ──────────────────────────────── */}
            <div
                className="flex-1 overflow-y-auto px-3 py-3 space-y-2 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{
                    backgroundColor: '#e5ddd5'
                }}
            >
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[78%] px-3 py-2 rounded-xl shadow-sm text-[11px] font-medium leading-relaxed relative ${msg.from === 'me'
                                ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-sm'
                                : 'bg-white text-slate-800 rounded-tl-sm'
                                }`}
                        >
                            {msg.text}
                            {/* Tick */}
                            {msg.from === 'me' && (
                                <span className="text-[8px] text-[#53bdeb] ml-2 float-right mt-1 font-bold">✓✓</span>
                            )}
                        </div>
                    </div>
                ))}

            </div>

            {/* ── INPUT BAR ──────────────────────────────── */}
            <div className="flex items-center gap-2 px-2 pt-2 pb-6 bg-[#f0f0f0] shrink-0">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm">
                    <Smile className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                    <span className="flex-1 text-[11px] text-slate-400 font-medium">Message</span>
                    <Paperclip className="w-[16px] h-[16px] text-slate-400 shrink-0" />
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow" style={{ backgroundColor: '#25D366' }}>
                    <Mic className="w-4 h-4 text-white" />
                </div>
            </div>
        </div>
    );
};
