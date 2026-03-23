import React, { useEffect, useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, Globe, Facebook, Instagram,
  Twitter, Linkedin, Youtube, MessageCircle, ChevronLeft, ExternalLink,
  ArrowUpRight, Share2, ChevronRight, User, Info
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { getBusinessProfile } from '../src/services/businessProfile';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  whatsapp: <MessageCircle className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
};

const SOCIAL_COLORS: Record<string, string> = {
  facebook: '#1877f2',
  instagram: '#e4405f',
  twitter: '#1da1f2',
  linkedin: '#0a66c2',
  youtube: '#ff0000',
  whatsapp: '#25d366',
  website: '#333333',
};

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const formatDay = (day: string) => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

interface BusinessProfileViewerProps {
  profileId: string;
  onBack?: () => void;
}

const BusinessProfileViewer: React.FC<BusinessProfileViewerProps> = ({ profileId, onBack }) => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const profileId = params.get('id');

        if (profileId) {
          const storedData = localStorage.getItem('business_' + profileId);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setProfile(parsedData as BusinessProfile);
          } else {
            setError('Business profile not found');
          }
        } else {
          setError('Business profile not found');
        }
      } catch (err) {
        setError('Failed to load business profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileId]);

  const handlePhoneClick = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleAddressClick = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const handleSocialClick = (url: string) => {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: profile?.primaryColor || '#156295' }}>
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8">
          <div className="text-red-500 text-xl font-bold mb-2">Error</div>
          <p className="text-slate-600">{error || 'Profile not found'}</p>
          {onBack && (
            <button onClick={onBack} className="mt-4 px-6 py-2 bg-[#156295] text-white rounded-lg">
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const getSocialIcon = (network: string) => {
    const n = (network || '').toLowerCase();
    switch (n) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'whatsapp': return <MessageCircle className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const heroImg = profile.logo || profile.welcomeScreenImage;

  return (
    <div className="min-h-screen w-full bg-[#fcfdff] font-inter overflow-y-auto scrollbar-hide flex justify-center">
      {/* Main constrained container for desktop/mobile look */}
      <div className="w-full max-w-[400px] bg-white min-h-screen flex flex-col relative sm:shadow-2xl sm:border sm:border-slate-100 overflow-y-auto scrollbar-hide">

        {/* ── TOP CURVED SECTION ───────────────────────── */}
        <div className="relative w-full flex-shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 z-10 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Solid color block with curved bottom */}
          <div
            className="w-full px-5 pt-20 pb-24 text-center"
            style={{
              backgroundColor: profile.primaryColor,
              borderBottomLeftRadius: '50% 40px',
              borderBottomRightRadius: '50% 40px',
            }}
          >
            <p className="text-white/80 text-[12px] font-bold tracking-widest mb-1 uppercase">
              {profile.company || 'My Company'}
            </p>
            <h1 className="text-white text-[22px] font-black leading-tight tracking-tight">
              {profile.title || profile.headline || 'Find me on social networks'}
            </h1>
            {profile.subtitle && (
              <p className="text-white/70 text-[13px] font-medium mt-2 mb-2 leading-snug">
                {profile.subtitle}
              </p>
            )}
          </div>

          {/* Hero Card — overlapping the curve */}
          <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 mx-6">
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
                  onClick={() => {
                    const btn = profile.buttons?.[0];
                    if (btn?.url) window.open(btn.url, '_blank');
                  }}
                  style={{ backgroundColor: profile.secondaryColor || '#7ec8a4' }}
                  className="w-full py-3 rounded-2xl text-white font-black text-[15px] shadow-md tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {profile.buttons?.[0]?.text || 'View More'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE CONTENT ─────────────────────────── */}
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
                  const dayLower = day.toLowerCase();
                  const dayConfig = profile.openingHours[dayLower as keyof typeof profile.openingHours];
                  const slots = dayConfig?.slots || [];
                  const isOpen = dayConfig?.isOpen !== false && slots.length > 0;
                  return (
                    <div key={day} className={`flex justify-between items-center px-2 py-1 rounded-lg ${isToday ? 'bg-red-50' : ''}`}>
                      <span className={`text-[10px] font-bold ${isToday ? 'text-red-500' : 'text-slate-500'}`}>{day}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold whitespace-nowrap ${isToday ? 'text-red-500' : 'text-slate-500'}`}>
                          {isOpen ? slots.map((slot, i) => <span key={i}>{slot.start} – {slot.end}</span>) : <span className="italic opacity-50">Closed</span>}
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
          {profile.aboutCompany && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-[12px] font-black text-slate-700 tracking-tight">About Company</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{profile.aboutCompany}</p>
            </div>
          )}

          {/* Services / Facilities */}
          {profile.facilities && profile.facilities.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-[12px] font-black text-slate-700 tracking-tight">Services</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.facilities.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {profile.address && (
            <div
              className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3 cursor-pointer hover:bg-slate-50"
              onClick={() => handleAddressClick(profile.address)}
            >
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
                <p className="text-[11px] font-bold text-slate-700 leading-snug">{profile.address}</p>
                <div className="text-[9px] font-bold text-red-500 mt-1 flex items-center gap-1 uppercase tracking-tight font-black">
                  Open in Maps <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
          )}

          {/* Social Networks */}
          {profile.socialNetworks.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                  <Share2 className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-[12px] font-black text-slate-700 tracking-tight">Social Networks</h3>
              </div>
              <div className="space-y-2">
                {profile.socialNetworks.map((social, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-3 group cursor-pointer hover:bg-slate-100 transition-all"
                    onClick={() => handleSocialClick(social.url)}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-50 text-blue-500 shrink-0">
                      {getSocialIcon(social.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-700 text-[11px] truncate">{social.platform}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{social.label || 'Social Account'}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          {(profile.phones.length > 0 || profile.emails.length > 0 || profile.websites?.length > 0) && (
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-[12px] font-black text-slate-700 tracking-tight">Contact Information</h3>
              </div>

              {profile.phones.map((p, i) => (
                <div key={i} className="flex items-center gap-2.5 cursor-pointer" onClick={() => handlePhoneClick(p.value)}>
                  <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><Phone className="w-3.5 h-3.5 text-slate-300" /></div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{p.label || 'Phone'}</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">{p.value}</p>
                  </div>
                </div>
              ))}

              {profile.emails.map((e, i) => (
                <div key={i} className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleEmailClick(e.value)}>
                  <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-slate-300" /></div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{e.label || 'Email'}</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">{e.value}</p>
                  </div>
                </div>
              ))}

              {profile.websites?.map((w, i) => (
                <div key={i} className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleSocialClick(w.value)}>
                  <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><Globe className="w-3.5 h-3.5 text-slate-300" /></div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{w.label || 'Website'}</p>
                    <p className="text-[11px] font-bold text-cyan-600 underline truncate">{w.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="py-8 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Powered by <span className="text-slate-400">BARQR.io</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileViewer;
