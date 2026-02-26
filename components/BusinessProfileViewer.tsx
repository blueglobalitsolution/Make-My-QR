import React, { useEffect, useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Globe, Facebook, Instagram, 
  Twitter, Linkedin, Youtube, MessageCircle, ChevronLeft, ExternalLink,
  ArrowUpRight
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: profile?.primaryColor || '#527AC9' }}>
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
            <button onClick={onBack} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: profile.primaryColor, fontFamily: profile.fontText }}>
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl">
        {/* Header */}
        <div 
          className="relative px-6 pt-12 pb-16 text-center"
          style={{ backgroundColor: profile.primaryColor }}
        >
          {onBack && (
            <button 
              onClick={onBack}
              className="absolute top-4 left-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {/* Logo */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white/30 overflow-hidden bg-white shadow-lg flex items-center justify-center">
            {profile.logo ? (
              <img src={profile.logo} alt={profile.company} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-400">
                  {profile.company.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Company Name */}
          <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: profile.fontTitle }}>
            {profile.company || 'Company Name'}
          </h1>

          {/* Headline */}
          {profile.headline && (
            <p className="text-white/90 text-sm font-medium px-4">
              {profile.headline}
            </p>
          )}
        </div>

        {/* About Us */}
        {profile.aboutCompany && (
          <div className="px-6 py-6 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">About Us</h2>
            <p className="text-slate-700 leading-relaxed text-sm">
              {profile.aboutCompany}
            </p>
          </div>
        )}

        {/* Contact Info */}
        {(profile.phones.length > 0 || profile.emails.length > 0) && (
          <div className="px-6 py-6 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Contact</h2>
            
            {/* Phones */}
            {profile.phones.filter(p => p.value).map((phone) => (
              <button
                key={phone.id}
                onClick={() => handlePhoneClick(phone.value)}
                className="w-full flex items-center gap-4 py-3 px-4 bg-slate-50 rounded-xl mb-2 hover:bg-blue-50 transition-colors group text-left"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 font-medium">{phone.label}</div>
                  <div className="text-slate-800 font-bold">{phone.value}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
              </button>
            ))}

            {/* Emails */}
            {profile.emails.filter(e => e.value).map((email) => (
              <button
                key={email.id}
                onClick={() => handleEmailClick(email.value)}
                className="w-full flex items-center gap-4 py-3 px-4 bg-slate-50 rounded-xl mb-2 hover:bg-green-50 transition-colors group text-left"
              >
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 font-medium">{email.label}</div>
                  <div className="text-slate-800 font-bold">{email.value}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-green-500" />
              </button>
            ))}
          </div>
        )}

        {/* Address */}
        {profile.address && (
          <div className="px-6 py-6 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Location</h2>
            <button
              onClick={() => handleAddressClick(profile.address)}
              className="w-full flex items-center gap-4 py-4 px-4 bg-slate-50 rounded-xl hover:bg-red-50 transition-colors group text-left"
            >
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-slate-800 font-bold">{profile.address}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  Open in Maps <ExternalLink className="w-3 h-3" />
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-red-500" />
            </button>
          </div>
        )}

        {/* Opening Hours */}
        <div className="px-6 py-6 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Opening Hours</h2>
          <div className="space-y-2">
            {DAYS_ORDER.map((day) => {
              const dayConfig = profile.openingHours[day];
              if (!dayConfig) return null;
              
              return (
                <div key={day} className="flex items-center justify-between py-2">
                  <span className="text-slate-700 font-medium capitalize">{formatDay(day)}</span>
                  <span className={`text-sm font-bold ${dayConfig.isOpen ? 'text-green-600' : 'text-slate-400'}`}>
                    {dayConfig.isOpen 
                      ? dayConfig.slots.map(slot => `${slot.start} - ${slot.end}`).join(', ')
                      : 'Closed'
                    }
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Media Links */}
        {profile.socialNetworks.length > 0 && (
          <div className="px-6 py-6 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Follow Us</h2>
            <div className="flex flex-wrap gap-3">
              {profile.socialNetworks.map((social) => {
                if (!social.url) return null;
                const icon = SOCIAL_ICONS[social.platform] || <Globe className="w-5 h-5" />;
                const color = SOCIAL_COLORS[social.platform] || '#333333';
                
                return (
                  <button
                    key={social.id}
                    onClick={() => handleSocialClick(social.url)}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md"
                    style={{ backgroundColor: color, color: 'white' }}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-8 text-center">
          <p className="text-xs text-slate-400">
            Powered by <span className="font-bold text-slate-600">MakeMyQRCode</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileViewer;
