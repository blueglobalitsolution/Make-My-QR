import React from 'react';
import { Globe, Dribbble, Facebook, Circle, Github, Search, MessageCircle, Linkedin, Phone, Camera, Type, Twitter, Video, Share2, Youtube, Instagram, Music, Send, Utensils, ShoppingBag, Palette as PaletteIcon, Lock, CircleOff, Hand, Mail as MailIcon, FileText, Link as LinkIcon, UserCircle, Briefcase, ImageIcon, Smartphone, Tag, Gift, Bike, Mic } from 'lucide-react';
import { WizardState, OpeningHours, LocationConfig, ContactInfo, Palette, FrameType, QRType } from '../types';

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export const SOCIAL_ICONS_MAP: Record<string, { icon: React.FC<any>, color: string, label: string, field: 'URL' | 'User ID' }> = {
  globe: { icon: Globe, color: '#333333', label: 'Web', field: 'URL' },
  dribbble: { icon: Dribbble, color: '#ea4c89', label: 'Dribbble', field: 'User ID' },
  facebook: { icon: Facebook, color: '#1877f2', label: 'Facebook', field: 'User ID' },
  flickr: { icon: Circle, color: '#0063dc', label: 'Flickr', field: 'User ID' },
  github: { icon: Github, color: '#181717', label: 'Github', field: 'User ID' },
  gitlab: { icon: Github, color: '#fc6d26', label: 'Gitlab', field: 'User ID' },
  google: { icon: Search, color: '#4285f4', label: 'Google', field: 'URL' },
  line: { icon: MessageCircle, color: '#00c300', label: 'Line', field: 'User ID' },
  linkedin: { icon: Linkedin, color: '#0a66c2', label: 'LinkedIn', field: 'User ID' },
  pinterest: { icon: Circle, color: '#bd081c', label: 'Pinterest', field: 'User ID' },
  reddit: { icon: MessageCircle, color: '#ff4500', label: 'Reddit', field: 'User ID' },
  skype: { icon: Phone, color: '#00aff0', label: 'Skype', field: 'User ID' },
  snapchat: { icon: Camera, color: '#fffc00', label: 'Snapchat', field: 'User ID' },
  tripadvisor: { icon: Globe, color: '#34e0a1', label: 'Tripadvisor', field: 'User ID' },
  tumblr: { icon: Type, color: '#35465c', label: 'Tumblr', field: 'User ID' },
  twitter: { icon: Twitter, color: '#1da1f2', label: 'Twitter', field: 'User ID' },
  vimeo: { icon: Video, color: '#1ab7ea', label: 'Vimeo', field: 'User ID' },
  vk: { icon: MessageCircle, color: '#4c75a3', label: 'VK', field: 'User ID' },
  xing: { icon: Share2, color: '#006567', label: 'Xing', field: 'User ID' },
  youtube: { icon: Youtube, color: '#ff0000', label: 'Youtube', field: 'User ID' },
  instagram: { icon: Instagram, color: '#e4405f', label: 'Instagram', field: 'User ID' },
  tiktok: { icon: Music, color: '#000000', label: 'TikTok', field: 'User ID' },
  whatsapp: { icon: MessageCircle, color: '#25d366', label: 'WhatsApp', field: 'User ID' },
  telegram: { icon: Send, color: '#0088cc', label: 'Telegram', field: 'User ID' },
  messenger: { icon: MessageCircle, color: '#0084ff', label: 'Messenger', field: 'User ID' },
  yelp: { icon: Utensils, color: '#af0606', label: 'Yelp', field: 'User ID' },
  ubereats: { icon: ShoppingBag, color: '#06c167', label: 'Uber Eats', field: 'User ID' },
  bicycle: { icon: Bike, color: '#000000', label: 'Bicycle', field: 'URL' },
  redbubble: { icon: PaletteIcon, color: '#e3142c', label: 'Redbubble', field: 'User ID' },
  spotify: { icon: Music, color: '#1db954', label: 'Spotify', field: 'User ID' },
  soundcloud: { icon: Mic, color: '#ff3300', label: 'Soundcloud', field: 'User ID' },
  applemusic: { icon: Music, color: '#fa243c', label: 'Apple Music', field: 'User ID' },
  onlyfans: { icon: Lock, color: '#00aff0', label: 'OnlyFans', field: 'User ID' },
  doordash: { icon: ShoppingBag, color: '#ff3008', label: 'DoorDash', field: 'User ID' },
  deliveroo: { icon: Bike, color: '#00ccbc', label: 'Deliveroo', field: 'User ID' },
  signal: { icon: MessageCircle, color: '#3a76f0', label: 'Signal', field: 'User ID' },
  wechat: { icon: MessageCircle, color: '#7bb32e', label: 'WeChat', field: 'User ID' }
};

export const SOCIAL_ICONS_LIST = Object.keys(SOCIAL_ICONS_MAP);

export const QR_TYPES_CONFIG = [
  { id: 'website', name: 'Website', desc: 'Link to any website URL', icon: Globe },
  { id: 'pdf', name: 'PDF', desc: 'Show a PDF', icon: FileText },
  { id: 'business', name: 'Business Page', desc: 'Link to a business landing page', icon: Briefcase },
  { id: 'whatsapp', name: 'WhatsApp', desc: 'Get WhatsApp messages', icon: MessageCircle },
];

export const INITIAL_HOURS: OpeningHours = DAYS.reduce((acc, day) => ({
  ...acc,
  [day]: { isOpen: day !== 'sunday', slots: [{ start: '09:00', end: '17:00' }] }
}), {} as OpeningHours);

export const INITIAL_LOCATION: LocationConfig = {
  address: '123 Main St, New York, NY 10001',
  streetNumberFirst: true,
  street: 'Main St',
  number: '123',
  zipCode: '10001',
  city: 'New York',
  state: 'NY',
  country: 'USA'
};

export const INITIAL_CONTACT: ContactInfo = {
  name: '',
  phones: [],
  emails: [],
  websites: []
};

export const DEFAULT_BUSINESS_PRESETS: Palette[] = [
  { primary: '#156295', secondary: '#000000' }, // Deep Ocean
  { primary: '#1F2937', secondary: '#000000' }, // Midnight
  { primary: '#064e3b', secondary: '#000000' }, // Forest
  { primary: '#7f1d1d', secondary: '#000000' }, // Crimson Red
  { primary: '#581c87', secondary: '#000000' }, // Royal Purple
  { primary: '#334155', secondary: '#000000' }, // Slate Blue
];

export const LINKS_DESIGN_PRESETS = [
  { pageBg: '#156295', linkBg: '#F7F7F7', linkText: '#9DB3C2' },
  { pageBg: '#E5E7EB', linkBg: '#FFFFFF', linkText: '#1F2937' },
  { pageBg: '#DBF1F8', linkBg: '#FFFFFF', linkText: '#156295' },
  { pageBg: '#B19CD9', linkBg: '#FFFFFF', linkText: '#1F2937' },
  { pageBg: '#9DB3C2', linkBg: '#FFFFFF', linkText: '#1F2937' },
  { pageBg: '#F5D17E', linkBg: '#FFFFFF', linkText: '#1F2937' },
];

export const FONT_OPTIONS = [
  'Inter',
  'Montserrat',
  'Playfair Display',
  'Roboto',
  'Lora',
  'Poppins',
  'Open Sans',
  'Lato'
];

export const FRAME_STYLES: { id: FrameType; label: string; icon: React.ReactNode }[] = [
  { id: 'none', label: 'None', icon: <CircleOff className="w-6 h-6" /> },
  { id: 'basic-label', label: 'Classic', icon: <div className="w-6 h-6 border-2 border-current flex flex-col"><div className="flex-1" /><div className="h-1.5 bg-current" /></div> },
  { id: 'rounded-label', label: 'Modern', icon: <div className="w-6 h-6 border-2 border-current rounded-sm flex flex-col overflow-hidden"><div className="flex-1" /><div className="h-1.5 bg-current" /></div> },
  { id: 'thick-label', label: 'Bold', icon: <div className="w-6 h-6 border-[3px] border-current flex flex-col"><div className="flex-1" /><div className="h-1.5 bg-current" /></div> },
  { id: 'bubble', label: 'Bubble', icon: <MessageCircle className="w-6 h-6" /> },
  { id: 'shopping', label: 'Shop', icon: <ShoppingBag className="w-6 h-6" /> },
  { id: 'gift', label: 'Gift', icon: <Gift className="w-6 h-6" /> },
  { id: 'mail', label: 'Mail', icon: <MailIcon className="w-6 h-6" /> },
  { id: 'delivery', label: 'Scooter', icon: <Bike className="w-6 h-6" /> },
  { id: 'service', label: 'Tray', icon: <Utensils className="w-6 h-6" /> },
  { id: 'hands', label: 'Hands', icon: <Hand className="w-6 h-6" /> },
  { id: 'ribbon', label: 'Banner', icon: <div className="w-6 h-4 bg-current relative"><div className="absolute -bottom-1 -left-1 w-2 h-2 bg-current rotate-45" /><div className="absolute -bottom-1 -right-1 w-2 h-2 bg-current rotate-45" /></div> },
];

export const PATTERN_OPTIONS: { id: WizardState['config']['pattern']; icon: React.ReactNode; label: string }[] = [
  { id: 'square', label: 'Square', icon: <div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="bg-current" /> <div className="bg-current" /> <div className="bg-current" /> <div className="bg-slate-200" /> </div> },
  { id: 'classy', label: 'Classy', icon: <div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="bg-current rounded-full" /> <div className="bg-current rounded-full" /> <div className="bg-current rounded-full" /> <div className="bg-slate-200" /> </div> },
  { id: 'dots', label: 'Dots', icon: <div className="w-8 h-8 grid grid-cols-3 gap-0.5">{Array(9).fill(0).map((_, i) => <div key={i} className="bg-current rounded-full h-1.5 w-1.5" />)}</div> },
  { id: 'rounded', label: 'Rounded', icon: <div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="bg-current rounded-sm" /> <div className="bg-current rounded-sm" /> <div className="bg-current rounded-sm" /> <div className="bg-slate-200" /> </div> },
];

export const CORNER_SQUARE_OPTIONS = [
  { id: 'square', icon: <div className="w-6 h-6 border-2 border-current" /> },
  { id: 'dot', icon: <div className="w-6 h-6 border-2 border-current rounded-full" /> },
  { id: 'extra-rounded', icon: <div className="w-6 h-6 border-2 border-current rounded-md" /> },
];

export const CORNER_DOT_OPTIONS = [
  { id: 'square', icon: <div className="w-4 h-4 bg-current" /> },
  { id: 'dot', icon: <div className="w-4 h-4 bg-current rounded-full" /> },
  { id: 'extra-rounded', icon: <div className="w-4 h-4 bg-current rounded-sm" /> },
];
export const COUNTRY_CODES = [
  { name: 'India', code: '91', iso: 'in' },
  { name: 'United States', code: '1', iso: 'us' },
  { name: 'United Kingdom', code: '44', iso: 'gb' },
  { name: 'United Arab Emirates', code: '971', iso: 'ae' },
  { name: 'Saudi Arabia', code: '966', iso: 'sa' },
  { name: 'Canada', code: '1', iso: 'ca' },
  { name: 'Australia', code: '61', iso: 'au' },
  { name: 'Germany', code: '49', iso: 'de' },
  { name: 'France', code: '33', iso: 'fr' },
  { name: 'Italy', code: '39', iso: 'it' },
  { name: 'Spain', code: '34', iso: 'es' },
  { name: 'Brazil', code: '55', iso: 'br' },
  { name: 'Mexico', code: '52', iso: 'mx' },
  { name: 'Singapore', code: '65', iso: 'sg' },
  { name: 'Japan', code: '81', iso: 'jp' },
  { name: 'South Korea', code: '82', iso: 'kr' },
];
