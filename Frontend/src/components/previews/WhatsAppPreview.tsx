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
            // Basic formatting: if starts with 91 (2 digits) or other, add a space after CC
            // Default to showing CC + space + number if it's long enough
            if (rawPhone.length > 3) {
                // Attempt to separate country code (assuming 1-3 digits)
                // Since CC is dynamic, we'll just show it as is or try to match common lengths
                phone = rawPhone;
            } else {
                phone = rawPhone;
            }
        }

        const textParam = url.searchParams.get('text');
        if (textParam) message = textParam;
    } catch {
        // Fallback for non-URL values
        phone = fullValue.replace(/\D/g, '');
    }

    // Format phone for display (e.g. +91 8460687490)
    const displayPhone = phone ? `+${phone}` : (name || 'Contact');

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
                <ChevronLeft className="w-5 h-5 text-white opacity-90 shrink-0" />

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                    <User className="w-5 h-5 text-slate-300" />
                </div>

                {/* Name */}
                <div className="min-w-0">
                    <p className="text-white text-[13px] font-normal leading-tight">
                        {displayPhone}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 text-white/90 shrink-0 ml-auto">
                    <Video className="w-[18px] h-[18px]" />
                    <Phone className="w-[18px] h-[18px]" />
                    <MoreVertical className="w-[18px] h-[18px]" />
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
