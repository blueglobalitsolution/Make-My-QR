import React from 'react';
import {
    Globe, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter,
    Linkedin, Youtube, MessageCircle, Share2, ChevronRight, User
} from 'lucide-react';

interface BusinessPreviewProps {
    name: string;
    brandColor: string;
    businessData?: any;
    is_lead_capture: boolean;
    isAuthorized: boolean;
    onLeadSubmit: (e: React.FormEvent) => void;
}

export const BusinessPreview: React.FC<BusinessPreviewProps> = ({
    name,
    brandColor,
    businessData,
    is_lead_capture,
    isAuthorized,
    onLeadSubmit
}) => {
    const primaryColor = businessData?.primaryColor || brandColor || '#6366f1';
    const heroImg = businessData?.images?.[0] || businessData?.welcomeScreenImage;

    const getSocialIcon = (network: string) => {
        const n = (network || '').toLowerCase();
        switch (n) {
            case 'facebook': return <Facebook className="w-4 h-4" />;
            case 'instagram': return <Instagram className="w-4 h-4" />;
            case 'twitter': return <Twitter className="w-4 h-4" />;
            case 'linkedin': return <Linkedin className="w-4 h-4" />;
            case 'youtube': return <Youtube className="w-4 h-4" />;
            case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
            default: return <Share2 className="w-4 h-4" />;
        }
    };

    return (
        <div className="h-full flex flex-col overflow-y-auto scrollbar-hide relative font-inter bg-white">

            {/* ── TOP CURVED SECTION ───────────────────────── */}
            <div className="relative w-full flex-shrink-0">

                {/* Solid color block with curved bottom */}
                <div
                    className="w-full px-5 pt-16 pb-28 text-center"
                    style={{
                        backgroundColor: primaryColor,
                        borderBottomLeftRadius: '50% 40px',
                        borderBottomRightRadius: '50% 40px',
                    }}
                >
                    <p className="text-white/80 text-[12px] font-bold tracking-widest mb-1">
                        {businessData?.company || name || 'My Company'}
                    </p>
                    <h1 className="text-white text-[22px] font-black leading-tight tracking-tight">
                        {businessData?.title || 'Find me on social networks'}
                    </h1>
                    {businessData?.subtitle && (
                        <p className="text-white/70 text-[13px] font-medium mt-2 leading-snug">
                            {businessData.subtitle}
                        </p>
                    )}
                </div>

                {/* Hero Card — overlapping the curve */}
                <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 mx-4">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                        {/* Image area */}
                        <div className="w-full h-36 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                            {heroImg ? (
                                <img
                                    src={heroImg}
                                    alt="Business"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-30">
                                    <Globe className="w-12 h-12 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No image</span>
                                </div>
                            )}
                        </div>

                        {/* CTA Button */}
                        <div className="px-4 py-3">
                            <button
                                style={{ backgroundColor: businessData?.secondaryColor || '#7ec8a4' }}
                                className="w-full py-3 rounded-2xl text-white font-black text-[15px] shadow-md tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {businessData?.buttons?.[0]?.text || 'View More'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ─────────────────────────── */}
            {/* top padding accounts for the overlapping card */}
            <div className="flex-1 px-3 pt-36 pb-6 space-y-3">

                {/* Opening Hours */}
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                            <Clock className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h3 className="text-[12px] font-black text-slate-700 tracking-tight">Opening Hours</h3>
                    </div>
                    <div className="space-y-0.5">
                        {(() => {
                            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            const today = days[new Date().getDay()];
                            return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                const isToday = day === today;
                                const slots = businessData?.openingHours?.[day?.toLowerCase()]?.slots || [];
                                const isOpen = businessData?.openingHours?.[day?.toLowerCase()]?.isOpen !== false && slots.length > 0;
                                return (
                                    <div key={day} className={`flex justify-between items-center px-2 py-1 rounded-lg ${isToday ? 'bg-red-50' : ''}`}>
                                        <span className={`text-[10px] font-bold ${isToday ? 'text-red-500' : 'text-slate-500'}`}>{day}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[10px] font-bold whitespace-nowrap ${isToday ? 'text-red-500' : 'text-slate-500'}`}>
                                                {isOpen ? slots.map((slot: any, i: number) => <span key={i}>{slot.open} – {slot.close}</span>) : <span className="italic opacity-50">Closed</span>}
                                            </span>
                                            {isToday && <span className="bg-red-500 text-white text-[7px] font-black px-1 py-0.5 rounded-full uppercase tracking-wider">Today</span>}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* About Company */}
                {businessData?.aboutCompany && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                            </div>
                            <h3 className="text-[12px] font-black text-slate-700 tracking-tight">About Company</h3>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{businessData.aboutCompany}</p>
                    </div>
                )}

                {/* Services / Facilities */}
                {(businessData?.facilities?.length > 0) && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
                            </div>
                            <h3 className="text-[12px] font-black text-slate-700 tracking-tight">Services</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {businessData.facilities.map((item: string, idx: number) => (
                                <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Address */}
                {businessData?.location?.address && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
                            <p className="text-[11px] font-bold text-slate-700 leading-snug">{businessData.location.address}</p>
                        </div>
                    </div>
                )}

                {/* Social Networks */}
                {(businessData?.socialNetworks?.length > 0) && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                                <Share2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <h3 className="text-[12px] font-black text-slate-700 tracking-tight">Social Networks</h3>
                        </div>
                        <div className="space-y-2">
                            {businessData.socialNetworks.map((social: any, idx: number) => (
                                <div key={idx} className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3 group cursor-pointer hover:bg-slate-100 transition-all">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-50 text-blue-500 shrink-0">
                                        {getSocialIcon(social.platform || social.network || '')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-700 text-[11px] truncate">{social.platform || social.network}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{social.text || social.label || 'Social Account'}</p>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact */}
                {businessData?.contact && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2.5">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                                <User className="w-3.5 h-3.5 text-white" />
                            </div>
                            <h3 className="text-[12px] font-black text-slate-700 tracking-tight">Contact</h3>
                        </div>
                        {businessData.contact.name && (
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5 text-slate-300" /></div>
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Name</p>
                                    <p className="text-[11px] font-bold text-slate-700 truncate">{businessData.contact.name}</p>
                                </div>
                            </div>
                        )}
                        {businessData.contact.phones?.[0] && (
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><Phone className="w-3.5 h-3.5 text-slate-300" /></div>
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Phone</p>
                                    <p className="text-[11px] font-bold text-slate-700 truncate">{businessData.contact.phones[0]?.value || businessData.contact.phones[0]}</p>
                                </div>
                            </div>
                        )}
                        {businessData.contact.emails?.[0] && (
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-slate-300" /></div>
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Email</p>
                                    <p className="text-[11px] font-bold text-slate-700 truncate">{businessData.contact.emails[0]?.value || businessData.contact.emails[0]}</p>
                                </div>
                            </div>
                        )}
                        {businessData.contact.websites?.[0] && (
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><Globe className="w-3.5 h-3.5 text-slate-300" /></div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Website</p>
                                    <p className="text-[11px] font-bold text-cyan-600 underline truncate">{businessData.contact.websites[0]?.value || businessData.contact.websites[0]}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom spacer */}
                <div className="h-6" />
            </div>
        </div>
    );
};
