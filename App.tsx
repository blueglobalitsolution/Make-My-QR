
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import QRCodeStyling from 'qr-code-styling';
import { Html5QrcodeScanner } from 'html5-qrcode';
import CryptoJS from 'crypto-js';
import { 
  Link as LinkIcon, 
  Download, 
  RefreshCw, 
  FileImage, 
  FileText, 
  Sparkles, 
  Barcode, 
  LogOut, 
  Lock, 
  Grid3X3, 
  Music, 
  Utensils, 
  Smartphone, 
  Tag, 
  Share2, 
  User as UserIcon, 
  Video, 
  ChevronRight, 
  Wifi, 
  ChevronLeft, 
  ChevronUp,
  Search, 
  MessageCircle, 
  Globe, 
  BarChart3, 
  Edit3, 
  MoreVertical, 
  Plus, 
  Folder as FolderIcon, 
  HelpCircle, 
  Clock, 
  ChevronDown, 
  Info,
  CreditCard,
  Calendar,
  Maximize,
  Scan,
  Type as TypeIcon,
  ExternalLink,
  ShieldCheck,
  X,
  LockKeyhole,
  CheckCircle2,
  Palette as PaletteIcon,
  Briefcase,
  ArrowRightLeft,
  Image as ImageIcon,
  Trash2,
  Save,
  ChevronLeftCircle,
  ChevronRightCircle,
  Upload,
  CircleCheck,
  MapPin,
  Map as MapIcon,
  Home,
  Printer,
  Mail,
  LayoutGrid,
  UserCircle,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  Twitch,
  ArrowUp,
  ArrowDown,
  Monitor,
  Accessibility,
  Armchair,
  Baby,
  Coffee,
  Wine,
  Car,
  Bus,
  Bed,
  Dumbbell,
  Tent,
  Pointer,
  Mic,
  Smile,
  Paperclip,
  Camera,
  CheckCheck,
  FolderX,
  Square,
  Box,
  Layout,
  PlusSquare,
  Slash,
  Hand,
  ShoppingBag,
  Gift,
  Mail as MailIcon,
  Bike,
  CircleOff,
  Bell,
  Navigation,
  ArrowDownUp,
  AlertCircle,
  Pipette,
  Circle,
  Layers,
  Component,
  MousePointer2,
  Send,
  MoreHorizontal,
  Check,
  MoreVertical as MoreIcon,
  CalendarDays,
  Activity,
  Trash,
  Pencil,
  Copy,
  ExternalLink as LinkExternal,
  Eye,
  Settings2,
  Globe2,
  FileUp,
  ArrowLeftRight,
  Type,
  Dribbble,
  Slack,
  Figma,
  Chrome,
  Disc,
  Play,
  Volume2,
  Hash,
  Cloud,
  Layers as LayersIcon,
  Target,
  Rocket,
  Zap,
  Star,
  Heart,
  Anchor,
  Wind,
  Droplet,
  Flame,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Terminal,
  Code,
  Database,
  Cpu
} from 'lucide-react';
import { User, QRType, BarcodeFormat, ViewState, WizardState, GeneratedCode, Folder, BusinessConfig, BusinessButton, Palette, OpeningHours, DayConfig, TimeSlot, LocationConfig, ContactInfo, ContactField, SocialNetwork, FrameType } from './types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const SOCIAL_ICONS_MAP: Record<string, { icon: React.FC<any>, color: string, label: string, field: 'URL' | 'User ID' }> = {
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

const SOCIAL_ICONS_LIST = Object.keys(SOCIAL_ICONS_MAP);

const QR_TYPES_CONFIG = [
  { id: 'website', name: 'Website', desc: 'Link to any website URL', icon: Globe },
  { id: 'pdf', name: 'PDF', desc: 'Show a PDF', icon: FileText },
  { id: 'links', name: 'Social Networks', desc: 'Share multiple links', icon: LinkIcon },
  { id: 'vcard', name: 'vCard', desc: 'Share a digital business card', icon: UserCircle },
  { id: 'business', name: 'Business', desc: 'Share information about your business', icon: Briefcase },
  { id: 'video', name: 'Video', desc: 'Show a video', icon: Video },
  { id: 'images', name: 'Images', desc: 'Share multiple images', icon: ImageIcon },
  { id: 'facebook', name: 'Facebook', desc: 'Share your Facebook page', icon: Facebook },
  { id: 'instagram', name: 'Instagram', desc: 'Share your Instagram', icon: Instagram },
  { id: 'social', name: 'Social Media', desc: 'Share your social channels', icon: Share2 },
  { id: 'whatsapp', name: 'WhatsApp', desc: 'Get WhatsApp messages', icon: MessageCircle },
  { id: 'mp3', name: 'MP3', desc: 'Share an audio file', icon: Music },
  { id: 'menu', name: 'Menu', desc: 'Create a restaurant menu', icon: Utensils },
  { id: 'apps', name: 'Apps', desc: 'Redirect to an app store', icon: Smartphone },
  { id: 'coupon', name: 'Coupon', desc: 'Share a coupon', icon: Tag },
  { id: 'wifi', name: 'WiFi', desc: 'Connect to a Wi-Fi network', icon: Wifi },
];

const INITIAL_HOURS: OpeningHours = DAYS.reduce((acc, day) => ({
  ...acc,
  [day]: { isOpen: day !== 'sunday', slots: [{ start: '09:00', end: '17:00' }] }
}), {} as OpeningHours);

const INITIAL_LOCATION: LocationConfig = {
  searchAddress: '123 Main St, New York, NY 10001',
  streetNumberFirst: true,
  street: 'Main St',
  number: '123',
  postalCode: '10001',
  city: 'New York',
  state: 'NY',
  country: 'USA'
};

const INITIAL_CONTACT: ContactInfo = {
  name: 'John Doe',
  phones: [{ id: 'p1', label: 'Work', value: '123-456-7890', type: 'work' }],
  emails: [{ id: 'e1', label: 'Email', value: 'john@example.com', type: 'work' }],
  websites: [{ id: 'w1', label: 'Website', value: 'www.example.com', type: 'other' }]
};

const DEFAULT_BUSINESS_PRESETS: Palette[] = [
  { primary: '#527AC9', secondary: '#7EC09F' },
  { primary: '#E5E7EB', secondary: '#1F2937' },
  { primary: '#DBF1F8', secondary: '#3B82F6' },
  { primary: '#B19CD9', secondary: '#1F2937' },
  { primary: '#7EC09F', secondary: '#1F2937' },
  { primary: '#F5D17E', secondary: '#1F2937' },
];

const LINKS_DESIGN_PRESETS = [
  { pageBg: '#527AC9', linkBg: '#F7F7F7', linkText: '#7EC09F' },
  { pageBg: '#E5E7EB', linkBg: '#FFFFFF', linkText: '#1F2937' },
  { pageBg: '#DBF1F8', linkBg: '#FFFFFF', linkText: '#3B82F6' },
  { pageBg: '#B19CD9', linkBg: '#FFFFFF', linkText: '#1F2937' },
  { pageBg: '#7EC09F', linkBg: '#FFFFFF', linkText: '#1F2937' },
  { pageBg: '#F5D17E', linkBg: '#FFFFFF', linkText: '#1F2937' },
];

const FONT_OPTIONS = [
  'Inter',
  'Montserrat',
  'Playfair Display',
  'Roboto',
  'Lora',
  'Poppins',
  'Open Sans',
  'Lato'
];

const FRAME_STYLES: { id: FrameType; label: string; icon: React.ReactNode }[] = [
  { id: 'none', label: 'None', icon: <CircleOff className="w-6 h-6" /> },
  { id: 'basic-label', label: 'Classic', icon: <div className="w-6 h-6 border-2 border-black flex flex-col"><div className="flex-1" /><div className="h-1.5 bg-black" /></div> },
  { id: 'rounded-label', label: 'Modern', icon: <div className="w-6 h-6 border-2 border-black rounded-sm flex flex-col overflow-hidden"><div className="flex-1" /><div className="h-1.5 bg-black" /></div> },
  { id: 'thick-label', label: 'Bold', icon: <div className="w-6 h-6 border-[3px] border-black flex flex-col"><div className="flex-1" /><div className="h-1.5 bg-black" /></div> },
  { id: 'bubble', label: 'Bubble', icon: <MessageCircle className="w-6 h-6" /> },
  { id: 'shopping', label: 'Shop', icon: <ShoppingBag className="w-6 h-6" /> },
  { id: 'gift', label: 'Gift', icon: <Gift className="w-6 h-6" /> },
  { id: 'mail', label: 'Mail', icon: <MailIcon className="w-6 h-6" /> },
  { id: 'delivery', label: 'Scooter', icon: <Bike className="w-6 h-6" /> },
  { id: 'service', label: 'Tray', icon: <Utensils className="w-6 h-6" /> },
  { id: 'hands', label: 'Hands', icon: <Hand className="w-6 h-6" /> },
  { id: 'ribbon', label: 'Banner', icon: <div className="w-6 h-4 bg-black relative"><div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black rotate-45" /><div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black rotate-45" /></div> },
];

const QRFrameWrapper: React.FC<{ frame: FrameType; children: React.ReactNode }> = ({ frame, children }) => {
  if (frame === 'none') return <div className="p-4 bg-white rounded-2xl">{children}</div>;
  const renderLabel = (text = "Scan Me!") => (
    <div className="w-full bg-black py-1.5 text-center">
      <span className="text-[10px] font-black text-white uppercase tracking-widest">{text}</span>
    </div>
  );
  switch (frame) {
    case 'basic-label':
      return (
        <div className="border-[3px] border-black flex flex-col items-center bg-white">
          <div className="p-5">{children}</div>
          {renderLabel()}
        </div>
      );
    case 'rounded-label':
      return (
        <div className="border-[3px] border-black rounded-[2rem] overflow-hidden flex flex-col items-center bg-white">
          <div className="p-5">{children}</div>
          {renderLabel()}
        </div>
      );
    case 'thick-label':
      return (
        <div className="border-[6px] border-black flex flex-col items-center bg-white">
          <div className="p-5">{children}</div>
          {renderLabel()}
        </div>
      );
    case 'bubble':
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-black text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest relative">
            Scan Me!
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black"></div>
          </div>
          <div className="p-3 border-4 border-black rounded-[2.5rem] bg-white shadow-xl">{children}</div>
        </div>
      );
    case 'shopping':
      return (
        <div className="flex flex-col items-center">
          <div className="w-16 h-8 border-[3px] border-black border-b-0 rounded-t-full mb-[-3px] z-10"></div>
          <div className="border-[3px] border-black p-5 bg-white shadow-lg flex flex-col items-center rounded-sm">
            {children}
            <div className="mt-4 bg-black text-white px-4 py-1 rounded-sm text-[9px] font-black uppercase tracking-tighter">Shop Now!</div>
          </div>
        </div>
      );
    case 'gift':
      return (
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-6 flex gap-1 items-center justify-center z-20">
             <div className="w-6 h-6 border-[3px] border-black rounded-full rotate-[-45deg] bg-white"></div>
             <div className="w-6 h-6 border-[3px] border-black rounded-full rotate-[45deg] bg-white"></div>
          </div>
          <div className="border-[3px] border-black p-5 bg-white shadow-lg flex flex-col items-center relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-black/10"></div>
             <div className="relative z-10">{children}</div>
             <div className="mt-3 bg-black text-white px-4 py-1 text-[9px] font-black uppercase">Open Gift!</div>
          </div>
        </div>
      );
    case 'mail':
      return (
        <div className="flex flex-col items-center gap-3">
           <div className="p-4 border-[3px] border-black bg-white rounded-xl shadow-lg relative">
              <div className="absolute top-0 left-0 w-full h-full border-b border-black/5 flex items-center justify-center opacity-5">
                <MailIcon className="w-20 h-20" />
              </div>
              <div className="relative z-10">{children}</div>
           </div>
           <div className="bg-black text-white px-5 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
             <MailIcon className="w-3 h-3" /> Read Me!
           </div>
        </div>
      );
    case 'delivery':
      return (
        <div className="flex flex-col items-center">
           <div className="p-4 border-[3px] border-black bg-white rounded-2xl shadow-lg">
             {children}
           </div>
           <div className="mt-[-12px] bg-black text-white px-6 py-2 rounded-2xl text-[9px] font-black uppercase flex items-center gap-3 shadow-xl z-20">
             <Bike className="w-4 h-4" /> Fast Delivery!
           </div>
        </div>
      );
    case 'service':
      return (
        <div className="flex flex-col items-center">
           <div className="p-6 border-[3px] border-black bg-white rounded-full shadow-lg relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-full h-1/3 bg-black/5"></div>
             <div className="relative z-10">{children}</div>
           </div>
           <div className="mt-4 flex items-center gap-4">
             <div className="h-[2px] w-8 bg-black"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-black">Menu</span>
             <div className="h-[2px] w-8 bg-black"></div>
           </div>
        </div>
      );
    case 'hands':
      return (
        <div className="relative flex flex-col items-center">
           <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-black opacity-40"><Hand className="w-8 h-8 rotate-90" /></div>
           <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-black opacity-40"><Hand className="w-8 h-8 -rotate-90" /></div>
           <div className="p-5 border-2 border-slate-200 bg-white rounded-3xl shadow-sm">
             {children}
           </div>
           <div className="mt-4 font-black text-[10px] uppercase tracking-[0.2em] text-black">Scan To Interact</div>
        </div>
      );
    case 'ribbon':
      return (
        <div className="flex flex-col items-center">
          <div className="p-5 border-[3px] border-black bg-white">
            {children}
          </div>
          <div className="mt-[-10px] relative w-full flex justify-center z-20">
             <div className="bg-black text-white px-8 py-2 font-black text-[10px] uppercase tracking-[0.1em] shadow-xl">
               Save Discount!
               <div className="absolute top-0 -left-2 h-full w-2 bg-black/80 skew-y-[20deg] origin-right"></div>
               <div className="absolute top-0 -right-2 h-full w-2 bg-black/80 skew-y-[-20deg] origin-left"></div>
             </div>
          </div>
        </div>
      );
    default:
      return <div className="p-4 bg-white rounded-2xl">{children}</div>;
  }
};

const PATTERN_OPTIONS: { id: WizardState['config']['pattern']; icon: React.ReactNode; label: string }[] = [
  { id: 'square', label: 'Square', icon: <div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="bg-black" /> <div className="bg-black" /> <div className="bg-black" /> <div className="bg-slate-200" /> </div> },
  { id: 'classy-rounded', label: 'Classy Rounded', icon: <div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="bg-black rounded-[2px]" /> <div className="bg-black rounded-[2px]" /> <div className="bg-black rounded-[2px]" /> <div className="bg-slate-200" /> </div> },
  { id: 'classy', label: 'Classy', icon: <div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="bg-black rounded-full" /> <div className="bg-black rounded-full" /> <div className="bg-black rounded-full" /> <div className="bg-slate-200" /> </div> },
  { id: 'dots', label: 'Dots', icon: <div className="w-8 h-8 grid grid-cols-3 gap-0.5">{Array(9).fill(0).map((_, i) => <div key={i} className="bg-black rounded-full h-1.5 w-1.5" />)}</div> },
  { id: 'rounded', label: 'Rounded', icon: <div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="bg-black rounded-sm" /> <div className="bg-black rounded-sm" /> <div className="bg-black rounded-sm" /> <div className="bg-slate-200" /> </div> },
  { id: 'extra-rounded', label: 'Extra Rounded', icon: <div className="w-8 h-8 rotate-45 grid grid-cols-2 gap-1"><div className="bg-black" /> <div className="bg-black" /> <div className="bg-black" /> <div className="bg-slate-200" /> </div> },
];

const CORNER_SQUARE_OPTIONS = [
  { id: 'square', icon: <div className="w-6 h-6 border-2 border-black" /> },
  { id: 'dot', icon: <div className="w-6 h-6 border-2 border-black rounded-full" /> },
  { id: 'extra-rounded', icon: <div className="w-6 h-6 border-2 border-black rounded-md" /> },
  { id: 'rounded-square', icon: <div className="w-6 h-6 border-[3px] border-black rounded-sm" /> },
  { id: 'heavy-square', icon: <div className="w-6 h-6 border-4 border-black" /> },
];

const CORNER_DOT_OPTIONS = [
  { id: 'square', icon: <div className="w-4 h-4 bg-black" /> },
  { id: 'dot', icon: <div className="w-4 h-4 bg-black rounded-full" /> },
  { id: 'rounded-square', icon: <div className="w-4 h-4 bg-black rounded-sm" /> },
  { id: 'diamond', icon: <div className="w-4 h-4 bg-black rotate-45" /> },
];

const StyledQRCode: React.FC<{ options: any; size?: number; qrRef?: React.RefObject<HTMLDivElement> }> = ({ options, size = 200, qrRef: externalRef }) => {
  const localRef = useRef<HTMLDivElement>(null);
  const qrRef = externalRef || localRef;
  const qrInstance = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrInstance.current) {
      qrInstance.current = new QRCodeStyling({
        ...options,
        width: size,
        height: size
      });
      if (qrRef.current) qrInstance.current.append(qrRef.current);
    } else {
      qrInstance.current.update({
        ...options,
        width: size,
        height: size
      });
    }
  }, [options, size, qrRef]);

  return <div ref={qrRef} className="flex items-center justify-center" />;
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GeneratedCode[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'f1', name: 'Marketing Campaigns', count: 0, createdAt: new Date().toISOString() },
    { id: 'f2', name: 'Social Media', count: 0, createdAt: new Date().toISOString() },
  ]);
  const [activeFolderId, setActiveFolderId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [savedPalettes, setSavedPalettes] = useState<Palette[]>(DEFAULT_BUSINESS_PRESETS);
  
  const [whatsappPhone, setWhatsappPhone] = useState('84606 87490');
  const [whatsappMessage, setWhatsappMessage] = useState('Hello! I scanned your QR code.');

  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [phonePreviewMode, setPhonePreviewMode] = useState<'ui' | 'qr'>('ui');

  const [wizard, setWizard] = useState<WizardState>({
    step: 1,
    mode: 'qr',
    type: 'website',
    value: '',
    name: '',
    isPasswordActive: false,
    password: '',
    folderId: undefined,
    business: {
      primaryColor: '#527AC9',
      secondaryColor: '#7EC09F',
      pageBackgroundColor: '#527AC9',
      linkBackgroundColor: '#F7F7F7',
      linkTextColor: '#7EC09F',
      company: 'My Company',
      title: 'Find me on social networks',
      subtitle: '',
      description: 'New content every week in the links below',
      buttons: [
        { id: '1', text: 'My Website', url: '#', icon: 'globe' }
      ],
      openingHours: INITIAL_HOURS,
      images: [],
      location: INITIAL_LOCATION,
      contact: INITIAL_CONTACT,
      socialNetworks: [],
      aboutCompany: "",
      facilities: [],
      fontTitle: 'Inter',
      fontText: 'Inter',
      fontTitleColor: '#ffffff',
      fontTextColor: '#ffffff',
      welcomeScreenImage: undefined,
    },
    config: {
      fgColor: '#000000',
      bgColor: '#ffffff',
      level: 'H',
      borderRadius: 0,
      pattern: 'square',
      cornerType: 'square',
      cornersSquareType: 'square',
      cornersSquareColor: '#000000',
      cornersDotType: 'square',
      cornersDotColor: '#000000',
      frame: 'none'
    }
  });

  const [activeDesignSection, setActiveDesignSection] = useState<string | null>(null);
  const [isTransparent, setIsTransparent] = useState(false);
  const [useFgGradient, setUseFgGradient] = useState(false);
  const [useBgGradient, setUseBgGradient] = useState(false);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Set initial collapsible section based on type when step 2 is entered
  useEffect(() => {
    if (wizard.step === 2) {
      if (wizard.type === 'links' || wizard.type === 'pdf') {
        setActiveDesignSection('design');
      } else {
        setActiveDesignSection('content');
      }
    }
  }, [wizard.step, wizard.type]);

  useEffect(() => {
    const savedUserStr = localStorage.getItem('barqr_user');
    if (savedUserStr) {
      const user = JSON.parse(savedUserStr);
      setCurrentUser(user);
      if (user.savedPalettes) setSavedPalettes([...DEFAULT_BUSINESS_PRESETS, ...user.savedPalettes]);
      
      const savedHistory = localStorage.getItem('barqr_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedFolders = localStorage.getItem('barqr_folders');
      if (savedFolders) setFolders(JSON.parse(savedFolders));
    }
  }, []);

  const handleAuth = () => {
    const mockUser: User = {
      id: 'usr_' + Date.now(),
      email: 'demo@barqr.studio',
      name: 'Demo User',
      plan: 'free',
      isAdmin: false,
      createdAt: new Date().toISOString(),
      daysRemaining: 9,
      savedPalettes: []
    };
    setCurrentUser(mockUser);
    localStorage.setItem('barqr_user', JSON.stringify(mockUser));
    setView('my_codes');
  };

  const handleLogout = () => {
    localStorage.removeItem('barqr_user');
    setCurrentUser(null);
    setView('landing');
  };

  const handleNextStep = () => {
    if (wizard.step === 3) {
      const finalValue = (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links')
        ? (wizard.value || `https://qr-code.io/p/${Math.random().toString(36).substring(7)}`) 
        : wizard.type === 'whatsapp'
          ? `https://wa.me/${whatsappPhone.replace(/\s+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
          : (wizard.value || "https://qr-code.io");
      
      if (editingId) {
        const existingCode = history.find(h => h.id === editingId);
        if (existingCode?.folderId !== wizard.folderId) {
            let updatedFolders = [...folders];
            if (existingCode?.folderId) {
                updatedFolders = updatedFolders.map(f => f.id === existingCode.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f);
            }
            if (wizard.folderId) {
                updatedFolders = updatedFolders.map(f => f.id === wizard.folderId ? { ...f, count: f.count + 1 } : f);
            }
            setFolders(updatedFolders);
            localStorage.setItem('barqr_folders', JSON.stringify(updatedFolders));
        }

        const updatedHistory = history.map(h => h.id === editingId ? {
          ...h,
          folderId: wizard.folderId,
          category: wizard.type,
          name: wizard.name || `My ${selectedTypeConfig.name}`,
          value: finalValue,
          settings: { ...wizard.config, business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined }
        } : h);

        setHistory(updatedHistory);
        localStorage.setItem('barqr_history', JSON.stringify(updatedHistory));
        setEditingId(null);
      } else {
        const newCode: GeneratedCode = {
          id: 'qr_' + Date.now(),
          userId: currentUser?.id || 'guest',
          folderId: wizard.folderId,
          type: wizard.mode,
          category: wizard.type,
          name: wizard.name || `My ${selectedTypeConfig.name}`,
          value: finalValue,
          isDynamic: false,
          scans: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          settings: { ...wizard.config, business: (wizard.type === 'business' || wizard.type === 'pdf' || wizard.type === 'links') ? wizard.business : undefined }
        };

        const updatedHistory = [newCode, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('barqr_history', JSON.stringify(updatedHistory));

        if (wizard.folderId) {
          const updatedFolders = folders.map(f => 
            f.id === wizard.folderId ? { ...f, count: f.count + 1 } : f
          );
          setFolders(updatedFolders);
          localStorage.setItem('barqr_folders', JSON.stringify(updatedFolders));
        }
      }

      setView('my_codes');
      setWizard({ ...wizard, step: 1, value: '', name: '', folderId: undefined });
    } else {
      const nextStep = (wizard.step + 1) as 1 | 2 | 3;
      let nextWizard = { ...wizard, step: nextStep };
      
      if (nextStep === 3 && (wizard.type === 'pdf' || wizard.type === 'business' || wizard.type === 'links')) {
        if (!wizard.value) {
          const mockId = Math.random().toString(36).substring(2, 9);
          nextWizard.value = `https://qr-code.io/${wizard.type}/${mockId}`;
        }
      }

      setWizard(nextWizard);
      if (nextStep === 3) setPhonePreviewMode('qr');
    }
  };

  const handleBackStep = () => {
    const prevStep = Math.max(1, wizard.step - 1) as 1 | 2 | 3;
    if (wizard.step === 3 && prevStep === 2) setPhonePreviewMode('ui');
    setWizard({ ...wizard, step: prevStep });
  };

  const goToStep = (s: number) => {
    if (s < wizard.step) {
      if (wizard.step === 3 && s === 2) setPhonePreviewMode('ui');
      setWizard({ ...wizard, step: s as any });
    }
  };

  const createNewFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: 'f_' + Date.now(),
      name: newFolderName.trim(),
      count: 0,
      createdAt: new Date().toISOString()
    };
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem('barqr_folders', JSON.stringify(updatedFolders));
    setWizard({ ...wizard, folderId: newFolder.id });
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const deleteCode = (id: string) => {
    const codeToDelete = history.find(h => h.id === id);
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('barqr_history', JSON.stringify(updatedHistory));

    if (codeToDelete?.folderId) {
      const updatedFolders = folders.map(f => 
        f.id === codeToDelete.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f
      );
      setFolders(updatedFolders);
      localStorage.setItem('barqr_folders', JSON.stringify(updatedFolders));
    }
  };

  const startEditing = (code: GeneratedCode) => {
    setEditingId(code.id);
    
    let whatsappPhoneEdit = whatsappPhone;
    let whatsappMessageEdit = whatsappMessage;

    if (code.category === 'whatsapp') {
       try {
          const url = new URL(code.value);
          whatsappPhoneEdit = url.pathname.replace('/', '');
          whatsappMessageEdit = url.searchParams.get('text') || '';
       } catch(e) { /* ignore */ }
    }

    setWhatsappPhone(whatsappPhoneEdit);
    setWhatsappMessage(whatsappMessageEdit);

    setWizard({
      step: 2,
      mode: code.type,
      type: code.category as QRType,
      value: (code.category === 'whatsapp' || code.category === 'pdf' || code.category === 'business') ? '' : code.value,
      name: code.name,
      isPasswordActive: false,
      folderId: code.folderId,
      config: code.settings,
      business: code.settings.business || wizard.business
    });
    setPhonePreviewMode('ui');
    setView('wizard');
  };

  const downloadCode = (code: GeneratedCode, format: 'png' | 'svg' = 'png') => {
    const qr = new QRCodeStyling({
      width: 1000,
      height: 1000,
      data: code.value,
      dotsOptions: { color: code.settings.fgColor, type: code.settings.pattern },
      backgroundOptions: { color: code.settings.bgColor },
      cornersSquareOptions: { type: code.settings.cornersSquareType as any, color: code.settings.cornersSquareColor },
      cornersDotOptions: { type: code.settings.cornersDotType as any, color: code.settings.cornersDotColor },
      image: code.settings.logoUrl,
      imageOptions: { crossOrigin: "anonymous", margin: 5 }
    });
    qr.download({ name: code.name || 'qr-code', extension: format });
  };

  const getQRValue = () => {
    if (wizard.type === 'whatsapp') {
      return `https://wa.me/${whatsappPhone.replace(/\s+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    }
    return wizard.value || "https://qr-code.io";
  };

  const qrStylingOptions = {
    data: getQRValue(),
    dotsOptions: { 
      color: wizard.config.fgColor, 
      type: wizard.config.pattern as any,
      gradient: useFgGradient ? {
        type: 'linear',
        colorStops: [{ offset: 0, color: wizard.config.fgColor }, { offset: 1, color: '#3b82f6' }]
      } : undefined
    },
    backgroundOptions: { color: isTransparent ? 'transparent' : wizard.config.bgColor },
    cornersSquareOptions: { 
      type: (wizard.config.cornersSquareType || 'square') as any, 
      color: wizard.config.cornersSquareColor || wizard.config.fgColor 
    },
    cornersDotOptions: { 
      type: (wizard.config.cornersDotType || 'square') as any, 
      color: wizard.config.cornersDotColor || wizard.config.fgColor 
    },
    image: wizard.config.logoUrl,
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
  };

  const selectedTypeConfig = QR_TYPES_CONFIG.find(t => t.id === wizard.type) || QR_TYPES_CONFIG[0];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWizard({...wizard, config: {...wizard.config, logoUrl: reader.result as string}});
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(file));
      const mockId = Math.random().toString(36).substring(2, 9);
      setWizard(prev => ({ ...prev, value: `https://qr-code.io/pdf/${mockId}` }));
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWizard(prev => ({
          ...prev,
          business: prev.business ? { ...prev.business, images: [reader.result as string] } : undefined
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateBusinessField = (field: keyof BusinessConfig, val: any) => {
    setWizard(prev => ({
      ...prev,
      business: prev.business ? { ...prev.business, [field]: val } : undefined
    }));
  };

  const updateBusinessButton = (val: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newButtons = [...prev.business.buttons];
      if (newButtons.length > 0) {
        newButtons[0] = { ...newButtons[0], text: val };
      } else {
        newButtons.push({ id: '1', text: val, url: '#', icon: 'globe' });
      }
      return { ...prev, business: { ...prev.business, buttons: newButtons } };
    });
  };

  const addLink = () => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newLinks = [...prev.business.buttons, { id: Date.now().toString(), text: 'New Profile', url: '', icon: 'globe' }];
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const addLinkByIcon = (iconName: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newLinks = [...prev.business.buttons, { id: Date.now().toString(), text: 'Follow us', url: '', icon: iconName }];
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const updateLink = (id: string, field: keyof BusinessButton, val: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const newLinks = prev.business.buttons.map(b => b.id === id ? { ...b, [field]: val } : b);
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const removeLink = (id: string) => {
    setWizard(prev => {
      if (!prev.business) return prev;
      return { ...prev, business: { ...prev.business, buttons: prev.business.buttons.filter(b => b.id !== id) } };
    });
  };

  const reorderLink = (id: string, direction: 'up' | 'down') => {
    setWizard(prev => {
      if (!prev.business) return prev;
      const index = prev.business.buttons.findIndex(b => b.id === id);
      if (index === -1) return prev;
      const newLinks = [...prev.business.buttons];
      if (direction === 'up' && index > 0) {
        [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
      } else if (direction === 'down' && index < newLinks.length - 1) {
        [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
      }
      return { ...prev, business: { ...prev.business, buttons: newLinks } };
    });
  };

  const swapColors = () => {
    if (!wizard.business) return;
    setWizard(prev => ({
      ...prev,
      business: prev.business ? {
        ...prev.business,
        primaryColor: prev.business.secondaryColor,
        secondaryColor: prev.business.primaryColor
      } : undefined
    }));
  };

  const filteredHistory = history.filter(item => {
    const matchesFolder = activeFolderId === 'all' || item.folderId === activeFolderId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const toggleSection = (id: string) => {
    setActiveDesignSection(activeDesignSection === id ? null : id);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] overflow-hidden">
      {view !== 'landing' && view !== 'auth' && (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col z-40 shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => setView('landing')}>
              <div className="bg-[#0ea5e9] p-1.5 rounded-lg shadow-sm"><Barcode className="text-white w-5 h-5" /></div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">QR <span className="text-[#0ea5e9]">code.io</span></h1>
            </div>
            <nav className="space-y-1">
              {[{ id: 'wizard', name: 'Create QR Code', icon: Plus }, { id: 'scan', name: 'Scan Code', icon: Scan }, { id: 'my_codes', name: 'My QR Codes', icon: Grid3X3 }, { id: 'account', name: 'My Account', icon: UserIcon }].map((item) => (
                <button key={item.id} onClick={() => setView(item.id as ViewState)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${view === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <item.icon className="w-4 h-4" /> {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 text-sm font-medium hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {view === 'landing' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
            <div className="bg-[#0ea5e9] p-5 rounded-[2.5rem] shadow-2xl mb-10 transform -rotate-6"><Barcode className="text-white w-16 h-16" /></div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">The Ultimate <br /><span className="text-blue-600">Secure QR</span> <br />Experience</h1>
            <button onClick={handleAuth} className="px-14 py-6 bg-[#0ea5e9] text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all">Launch Studio</button>
          </div>
        )}

        {view === 'my_codes' && (
          <div className="p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight">My QR Library</h1>
                   <p className="text-slate-500 font-medium">Quickly access and manage all your generated codes.</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search by name or URL..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 font-bold text-sm w-72 transition-all" 
                      />
                   </div>
                   <button onClick={() => { setEditingId(null); setView('wizard'); }} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-2">
                     <Plus className="w-4 h-4" /> Create New
                   </button>
                </div>
             </div>

             <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide border-b border-slate-100">
                <button 
                  onClick={() => setActiveFolderId('all')}
                  className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeFolderId === 'all' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" /> All ({history.length})
                </button>
                {folders.map(folder => (
                  <button 
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeFolderId === folder.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'}`}
                  >
                    <FolderIcon className="w-3.5 h-3.5" /> {folder.name} ({folder.count})
                  </button>
                ))}
             </div>

             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                {filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32">
                     <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                       <Search className="w-10 h-10" />
                     </div>
                     <h3 className="text-xl font-black text-slate-800">No results found</h3>
                     <p className="text-slate-400 font-medium mb-8">Try adjusting your filters or search query.</p>
                     <button onClick={() => setSearchQuery('')} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Clear Search</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Code</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Folder</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Activity</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {filteredHistory.map(item => (
                            <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                               <td className="px-8 py-6">
                                  <div className="relative w-20 h-20 bg-white p-2 rounded-2xl border border-slate-100 group-hover:border-blue-200 shadow-sm group-hover:shadow-md transition-all flex items-center justify-center overflow-hidden">
                                     <div className="absolute inset-0 bg-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <StyledQRCode 
                                        options={{
                                          data: item.value,
                                          dotsOptions: { color: item.settings.fgColor, type: item.settings.pattern },
                                          backgroundOptions: { color: 'transparent' },
                                          cornersSquareOptions: { type: item.settings.cornersSquareType as any, color: item.settings.cornersSquareColor },
                                          cornersDotOptions: { type: item.settings.cornersDotType as any, color: item.settings.cornersDotColor },
                                          image: item.settings.logoUrl,
                                          imageOptions: { crossOrigin: "anonymous", margin: 5 }
                                        }} 
                                        size={64} 
                                     />
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex flex-col max-w-md">
                                     <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h4>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-tighter">
                                           {QR_TYPES_CONFIG.find(t => t.id === item.category)?.icon && (
                                              React.createElement(QR_TYPES_CONFIG.find(t => t.id === item.category)!.icon, { className: "w-2.5 h-2.5" })
                                           )}
                                           {item.category}
                                        </div>
                                     </div>
                                     <span className="text-[11px] text-slate-400 font-medium truncate opacity-60 flex items-center gap-1.5">
                                        <LinkIcon className="w-3 h-3" /> {item.value}
                                     </span>
                                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">
                                        Created {new Date(item.createdAt).toLocaleDateString()}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex justify-center">
                                     {item.folderId ? (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-tight border border-blue-100">
                                           <FolderIcon className="w-3.5 h-3.5" /> {folders.find(f => f.id === item.folderId)?.name}
                                        </div>
                                     ) : (
                                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No folder</div>
                                     )}
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex flex-col items-center">
                                     <div className="flex items-center gap-1.5 text-slate-800 font-black text-lg">
                                        {item.scans.toLocaleString()}
                                     </div>
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Activity className="w-2.5 h-2.5" /> Total Scans
                                     </span>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center justify-end gap-2">
                                     <button 
                                        onClick={() => startEditing(item)}
                                        className="p-2.5 bg-white text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl border border-slate-100 transition-all shadow-sm"
                                        title="Edit Style & Content"
                                     >
                                        <Settings2 className="w-4.5 h-4.5" />
                                     </button>
                                     <button 
                                        onClick={() => downloadCode(item, 'png')}
                                        className="p-2.5 bg-white text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl border border-slate-100 transition-all shadow-sm"
                                        title="Download as PNG"
                                     >
                                        <Download className="w-4.5 h-4.5" />
                                     </button>
                                     <button 
                                        onClick={() => deleteCode(item.id)}
                                        className="p-2.5 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-100 transition-all shadow-sm"
                                        title="Delete Permanently"
                                     >
                                        <Trash2 className="w-4.5 h-4.5" />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                )}
             </div>
          </div>
        )}

        {view === 'wizard' && (
          <div className="min-h-screen flex flex-col pb-32">
            <div className="flex items-center justify-center gap-12 py-6 border-b border-slate-100 bg-white sticky top-0 z-50">
              {[1, 2, 3].map(s => (
                <button key={s} onClick={() => goToStep(s)} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${wizard.step >= s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
                  <span className={`text-sm font-black uppercase tracking-widest ${wizard.step >= s ? 'text-slate-800' : 'text-slate-400'}`}>{s === 1 ? 'Type' : s === 2 ? 'Content' : 'Style'}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 grid lg:grid-cols-12 max-w-[1400px] mx-auto w-full p-8 lg:p-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                {wizard.step === 1 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-slate-800">{editingId ? '1. Update the code type' : '1. Select a type of QR code'}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {QR_TYPES_CONFIG.map(type => (
                        <button key={type.id} onClick={() => setWizard({...wizard, type: type.id as QRType, step: 2})} className={`group p-6 rounded-2xl shadow-sm flex flex-col items-center border-2 transition-all text-center ${wizard.type === type.id ? 'border-blue-500 bg-blue-50/50' : 'bg-white border-transparent hover:border-slate-100 hover:shadow-lg'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${wizard.type === type.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'}`}>
                            <type.icon className="w-6 h-6" />
                          </div>
                          <div className="font-bold text-slate-900 text-sm mb-1">{type.name}</div>
                          <div className="text-[10px] text-slate-400 leading-tight">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizard.step === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-slate-800">{editingId ? '2. Edit code content' : '2. Add content to your QR code'}</h2>
                    
                    {wizard.type === 'links' && (
                      <div className="space-y-8">
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('design')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <PaletteIcon className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800 leading-none">Design</h3>
                                    <p className="text-xs text-slate-400 mt-1">Choose a color theme for your page.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'design' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'design' && (
                              <div className="p-8 space-y-10 animate-in slide-in-from-top-2 duration-300">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Color Palette</label>
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                       {LINKS_DESIGN_PRESETS.map((p, idx) => (
                                          <button 
                                             key={idx} 
                                             onClick={() => {
                                                updateBusinessField('pageBackgroundColor', p.pageBg);
                                                updateBusinessField('linkBackgroundColor', p.linkBg);
                                                updateBusinessField('linkTextColor', p.linkText);
                                             }}
                                             className={`flex-shrink-0 w-24 h-12 rounded-xl border-2 transition-all p-1 flex gap-1 ${wizard.business?.pageBackgroundColor === p.pageBg ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-slate-50 bg-white'}`}
                                          >
                                             <div className="w-1/3 rounded-lg" style={{ backgroundColor: p.pageBg }} />
                                             <div className="w-1/3 rounded-lg" style={{ backgroundColor: p.linkBg }} />
                                             <div className="w-1/3 rounded-lg" style={{ backgroundColor: p.linkText }} />
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Background color</label>
                                       <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                                          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.pageBackgroundColor }}>
                                             <Pencil className="w-4 h-4 text-white/50" />
                                             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.pageBackgroundColor} onChange={(e) => updateBusinessField('pageBackgroundColor', e.target.value)} />
                                          </div>
                                          <span className="font-black text-slate-700 text-xs uppercase">{wizard.business?.pageBackgroundColor}</span>
                                       </div>
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Background color of the link</label>
                                       <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                                          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.linkBackgroundColor }}>
                                             <Pencil className="w-4 h-4 text-slate-400" />
                                             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.linkBackgroundColor} onChange={(e) => updateBusinessField('linkBackgroundColor', e.target.value)} />
                                          </div>
                                          <span className="font-black text-slate-700 text-xs uppercase">{wizard.business?.linkBackgroundColor}</span>
                                       </div>
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Link text color</label>
                                       <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                                          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.linkTextColor }}>
                                             <Pencil className="w-4 h-4 text-white/50" />
                                             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.linkTextColor} onChange={(e) => updateBusinessField('linkTextColor', e.target.value)} />
                                          </div>
                                          <span className="font-black text-slate-700 text-xs uppercase">{wizard.business?.linkTextColor}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('basic')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                    <Info className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800 leading-none">Basic Information *</h3>
                                    <p className="text-xs text-slate-400 mt-1">Add a headline and short description to introduce your list of links</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'basic' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'basic' && (
                              <div className="p-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Image <HelpCircle className="w-3 h-3" /></label>
                                    <div className="flex items-center gap-6">
                                       <div className="w-32 h-32 rounded-[2rem] border-2 border-slate-100 bg-slate-50 overflow-hidden relative group cursor-pointer">
                                          {wizard.business?.images[0] ? (
                                             <img src={wizard.business.images[0]} className="w-full h-full object-cover" />
                                          ) : (
                                             <div className="w-full h-full flex flex-col items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-slate-300" />
                                                <span className="text-[8px] font-black uppercase text-slate-400 mt-2">Upload</span>
                                             </div>
                                          )}
                                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleCoverImageUpload} />
                                       </div>
                                       {wizard.business?.images[0] && (
                                          <button onClick={() => updateBusinessField('images', [])} className="px-6 py-2 bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-200 hover:scale-105 transition-transform">Delete</button>
                                       )}
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Title *</label>
                                    <input type="text" placeholder="E.g. Find me on social networks" value={wizard.business?.title} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                                 </div>
                                 <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Description</label>
                                       <span className="text-[9px] font-bold text-slate-300">{wizard.business?.description.length}/4000</span>
                                    </div>
                                    <textarea rows={4} placeholder="E.g. New content every week in the links below" value={wizard.business?.description} onChange={(e) => updateBusinessField('description', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 resize-none" />
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('links_list')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <Globe className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800 leading-none">Social Networks</h3>
                                    <p className="text-xs text-slate-400 mt-1">Add social media links to your page.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'links_list' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'links_list' && (
                              <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                 <div className="space-y-6">
                                    {wizard.business?.buttons.map((link, index) => {
                                       const iconData = link.icon ? SOCIAL_ICONS_MAP[link.icon] : SOCIAL_ICONS_MAP.globe;
                                       return (
                                          <div key={link.id} className="p-8 bg-white rounded-3xl border border-slate-100 space-y-8 relative group shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                                             <div className="flex items-center justify-between">
                                                <div className="w-14 h-14 bg-white rounded-full border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden p-2">
                                                   {React.createElement(iconData.icon, { className: "w-full h-full", style: { color: iconData.color } })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                   <button onClick={() => reorderLink(link.id, 'up')} disabled={index === 0} className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-blue-100 text-blue-400 hover:bg-blue-50 transition-all disabled:opacity-20"><ChevronUp className="w-5 h-5" /></button>
                                                   <button onClick={() => reorderLink(link.id, 'down')} disabled={index === wizard.business!.buttons.length - 1} className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-blue-100 text-blue-400 hover:bg-blue-50 transition-all disabled:opacity-20"><ChevronDown className="w-5 h-5" /></button>
                                                   <button onClick={() => removeLink(link.id)} className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-5 h-5" /></button>
                                                </div>
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                   <label className="text-xs font-bold text-slate-400 block ml-1">{iconData.field}*</label>
                                                   <input 
                                                      type="text" 
                                                      placeholder={iconData.field === 'URL' ? "E.g. https://socialnetworks.com/" : "E.g. MyUserID"} 
                                                      value={link.url} 
                                                      onChange={(e) => updateLink(link.id, 'url', e.target.value)} 
                                                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 font-medium text-slate-700 transition-all" 
                                                   />
                                                </div>
                                                <div className="space-y-2">
                                                   <label className="text-xs font-bold text-slate-400 block ml-1">Text</label>
                                                   <input 
                                                      type="text" 
                                                      placeholder="E.g. Follow us" 
                                                      value={link.text} 
                                                      onChange={(e) => updateLink(link.id, 'text', e.target.value)} 
                                                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 font-medium text-slate-700 transition-all" 
                                                   />
                                                </div>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>

                                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                    <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-3">
                                       {SOCIAL_ICONS_LIST.map(iconName => (
                                          <button 
                                             key={iconName} 
                                             onClick={() => addLinkByIcon(iconName)}
                                             className="aspect-square rounded-2xl border border-slate-50 bg-white flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:z-10 group p-2.5"
                                          >
                                             {React.createElement(SOCIAL_ICONS_MAP[iconName].icon, { 
                                                className: "w-full h-full",
                                                style: { color: SOCIAL_ICONS_MAP[iconName].color }
                                             })}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('fonts')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <Type className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800">Fonts</h3>
                                    <p className="text-xs text-slate-400 mt-1">Make your page unique with original fonts and colors.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'fonts' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'fonts' && (
                              <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Title Font</label>
                                       <select value={wizard.business?.fontTitle} onChange={(e) => updateBusinessField('fontTitle', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 appearance-none">
                                          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Text Font</label>
                                       <select value={wizard.business?.fontText} onChange={(e) => updateBusinessField('fontText', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 appearance-none">
                                          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                       </select>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                                    <Grid3X3 className="w-5 h-5" />
                                 </div>
                                 <div className="text-left">
                                    <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                                    <p className="text-xs text-slate-400">Give your QR code a name to find it later.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'name' && (
                              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                                 <input type="text" placeholder="E.g. My QR code" value={wizard.name} onChange={(e) => setWizard({...wizard, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                              </div>
                           )}
                        </div>
                      </div>
                    )}

                    {wizard.type === 'pdf' && (
                      <div className="space-y-8">
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('upload')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                                    <FileUp className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800 leading-none">PDF Upload</h3>
                                    <p className="text-xs text-slate-400 mt-1">Select and upload your PDF document.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'upload' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'upload' && (
                              <div className="p-10 text-center flex flex-col items-center gap-6 animate-in slide-in-from-top-2 duration-300">
                                 <div className="w-20 h-20 rounded-[2rem] bg-red-50 text-red-500 flex items-center justify-center">
                                    <FileUp className="w-10 h-10" />
                                 </div>
                                 <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-800">Upload PDF File</h3>
                                    <p className="text-sm text-slate-400">Max size 20MB. Your PDF will be securely hosted.</p>
                                 </div>
                                 <label className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs cursor-pointer hover:scale-105 transition-all shadow-xl shadow-slate-200">
                                    {pdfFileName || 'Choose PDF File'}
                                    <input type="file" className="hidden" accept=".pdf" onChange={handlePdfUpload} />
                                 </label>

                                 <div className="w-full h-px bg-slate-100 my-2" />

                                 <div className="w-20 h-20 rounded-[2rem] bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <FileImage className="w-10 h-10" />
                                 </div>
                                 <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-800">Upload cover image</h3>
                                    <p className="text-sm text-slate-400">Upload a custom thumbnail for your PDF preview.</p>
                                 </div>
                                 <label className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs cursor-pointer hover:scale-105 transition-all shadow-xl shadow-blue-100">
                                    {wizard.business?.images[0] ? 'Change cover image' : 'Upload cover image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverImageUpload} />
                                 </label>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('design')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <PaletteIcon className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800 leading-none">Design</h3>
                                    <p className="text-xs text-slate-400 mt-1">Choose a color theme for your page.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'design' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'design' && (
                              <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Color Palette</label>
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                       {DEFAULT_BUSINESS_PRESETS.map((p, idx) => (
                                          <button 
                                             key={idx} 
                                             onClick={() => {
                                                updateBusinessField('primaryColor', p.primary);
                                                updateBusinessField('secondaryColor', p.secondary);
                                             }}
                                             className={`flex-shrink-0 w-24 h-12 rounded-xl border-2 transition-all p-1 flex gap-1 ${wizard.business?.primaryColor === p.primary ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-slate-50 bg-white'}`}
                                          >
                                             <div className="flex-1 rounded-lg" style={{ backgroundColor: p.primary }} />
                                             <div className="flex-1 rounded-lg" style={{ backgroundColor: p.secondary }} />
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-center gap-12 relative">
                                    <div className="space-y-3 flex-1">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Primary color</label>
                                       <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                                          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer group-hover:scale-105 transition-transform" style={{ backgroundColor: wizard.business?.primaryColor }}>
                                             <Pencil className="w-4 h-4 text-white/50" />
                                             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.primaryColor} onChange={(e) => updateBusinessField('primaryColor', e.target.value)} />
                                          </div>
                                          <span className="font-black text-slate-700 text-sm uppercase">{wizard.business?.primaryColor}</span>
                                       </div>
                                    </div>
                                    
                                    <button onClick={swapColors} className="w-12 h-12 rounded-full border-2 border-slate-100 bg-white text-blue-500 shadow-md flex items-center justify-center hover:rotate-180 transition-all duration-500 absolute z-10 hover:border-blue-500">
                                       <ArrowLeftRight className="w-5 h-5" />
                                    </button>

                                    <div className="space-y-3 flex-1">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Secondary color</label>
                                       <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                                          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer group-hover:scale-105 transition-transform" style={{ backgroundColor: wizard.business?.secondaryColor }}>
                                             <Pencil className="w-4 h-4 text-white/50" />
                                             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.secondaryColor} onChange={(e) => updateBusinessField('secondaryColor', e.target.value)} />
                                          </div>
                                          <span className="font-black text-slate-700 text-sm uppercase">{wizard.business?.secondaryColor}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('info')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                    <Info className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800 leading-none">PDF Information</h3>
                                    <p className="text-xs text-slate-400 mt-1">Details about the PDF content.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'info' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'info' && (
                              <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Company Name</label>
                                       <input type="text" placeholder="E.g. BarQR Studio" value={wizard.business?.company} onChange={(e) => updateBusinessField('company', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">PDF Title</label>
                                       <input type="text" placeholder="E.g. Product Catalog" value={wizard.business?.title} onChange={(e) => updateBusinessField('title', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Description</label>
                                    <textarea rows={3} placeholder="Tell your audience about this PDF..." value={wizard.business?.description} onChange={(e) => updateBusinessField('description', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 resize-none" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Website</label>
                                       <input type="text" placeholder="https://..." value={wizard.business?.location.searchAddress} onChange={(e) => updateBusinessField('location', { ...wizard.business!.location, searchAddress: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Button Name</label>
                                       <input type="text" placeholder="View PDF" value={wizard.business?.buttons[0].text} onChange={(e) => updateBusinessButton(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('fonts')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <Type className="w-6 h-6" />
                                 </div>
                                 <div className="text-left">
                                    <h3 className="text-xl font-black text-slate-800">Fonts</h3>
                                    <p className="text-xs text-slate-400 mt-1">Customize fonts and colors.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'fonts' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'fonts' && (
                              <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Title Font</label>
                                       <select value={wizard.business?.fontTitle} onChange={(e) => updateBusinessField('fontTitle', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 appearance-none">
                                          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Text Font</label>
                                       <select value={wizard.business?.fontText} onChange={(e) => updateBusinessField('fontText', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 appearance-none">
                                          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                       </select>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Title Color</label>
                                       <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                                          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.fontTitleColor }}>
                                             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.fontTitleColor} onChange={(e) => updateBusinessField('fontTitleColor', e.target.value)} />
                                          </div>
                                          <span className="font-black text-slate-700 text-sm uppercase">{wizard.business?.fontTitleColor}</span>
                                       </div>
                                    </div>
                                    <div className="space-y-3">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Text Color</label>
                                       <div className="flex items-center border-2 border-slate-100 rounded-2xl p-2 gap-4 bg-white group hover:border-blue-200 transition-all">
                                          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ backgroundColor: wizard.business?.fontTextColor }}>
                                             <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" value={wizard.business?.fontTextColor} onChange={(e) => updateBusinessField('fontTextColor', e.target.value)} />
                                          </div>
                                          <span className="font-black text-slate-700 text-sm uppercase">{wizard.business?.fontTextColor}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                                    <Grid3X3 className="w-5 h-5" />
                                 </div>
                                 <div className="text-left">
                                    <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                                    <p className="text-xs text-slate-400">Give your QR code a name to find it later.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'name' && (
                              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                                 <input type="text" placeholder="E.g. My QR code" value={wizard.name} onChange={(e) => setWizard({...wizard, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                              </div>
                           )}
                        </div>
                      </div>
                    )}

                    {wizard.type === 'whatsapp' && (
                      <div className="space-y-8">
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                          <button onClick={() => toggleSection('content')} className="w-full flex items-center justify-between p-6 bg-green-50/30 hover:bg-green-50 transition-colors border-b border-green-50">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                                <MessageCircle className="w-7 h-7" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">WhatsApp Messenger</h4>
                                <p className="text-xs text-slate-500 font-medium">Link your QR code directly to a WhatsApp chat.</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'content' ? 'rotate-180' : ''}`} />
                          </button>
                          {activeDesignSection === 'content' && (
                            <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Phone number *</label>
                                  <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                    <ShieldCheck className="w-3 h-3" /> Encrypted link
                                  </div>
                                </div>
                                <div className="flex items-center border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-50 transition-all bg-slate-50/50">
                                  <div className="px-5 py-4 flex items-center gap-2 border-r border-slate-100 bg-white cursor-pointer hover:bg-slate-50">
                                    <img src="https://flagcdn.com/in.svg" className="w-6 h-4 rounded-sm object-cover" alt="IN" />
                                    <span className="font-black text-slate-700 text-sm">+91</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="84606 87490"
                                    value={whatsappPhone} 
                                    onChange={(e) => setWhatsappPhone(e.target.value)} 
                                    className="flex-1 px-6 py-4 bg-transparent outline-none font-bold text-slate-800 text-lg placeholder:text-slate-300" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Pre-filled Message</label>
                                <div className="relative border-2 border-slate-100 rounded-2xl overflow-hidden focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-50 transition-all bg-slate-50/50">
                                  <textarea 
                                    rows={5} 
                                    placeholder="I'm interested in your services. Can you help me?"
                                    value={whatsappMessage}
                                    onChange={(e) => setWhatsappMessage(e.target.value)}
                                    className="w-full px-6 py-5 bg-transparent outline-none font-bold text-slate-800 resize-none placeholder:text-slate-300 leading-relaxed" 
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                                    <Grid3X3 className="w-5 h-5" />
                                 </div>
                                 <div className="text-left">
                                    <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                                    <p className="text-xs text-slate-400">Give your QR code a name.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'name' && (
                              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                                 <input type="text" placeholder="E.g. My QR code" value={wizard.name} onChange={(e) => setWizard({...wizard, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                              </div>
                           )}
                        </div>
                      </div>
                    )}

                    {wizard.type === 'website' && (
                      <div className="space-y-8">
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
                          <button onClick={() => toggleSection('content')} className="w-full flex items-center justify-between p-6 bg-blue-50/30 hover:bg-blue-50 transition-colors border-b border-blue-50">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                <Globe2 className="w-7 h-7" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">Website URL</h4>
                                <p className="text-xs text-slate-500 font-medium">Link your QR code to any website.</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'content' ? 'rotate-180' : ''}`} />
                          </button>
                          {activeDesignSection === 'content' && (
                            <div className="p-10 space-y-10 animate-in slide-in-from-top-2 duration-300">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Destination URL *</label>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-slate-300 uppercase italic">Supports http:// and https://</span>
                                  </div>
                                </div>
                                <div className="relative group">
                                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-blue-400 group-focus-within:scale-110 transition-transform" />
                                    <div className="h-6 w-[1px] bg-slate-200" />
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="https://www.yourwebsite.com" 
                                    value={wizard.value} 
                                    onChange={(e) => setWizard({...wizard, value: e.target.value})} 
                                    className="w-full pl-20 pr-6 py-5 bg-slate-50/50 border-2 border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white text-slate-900 font-bold text-xl transition-all placeholder:text-slate-300" 
                                  />
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
                                   <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                     Make sure to include <span className="text-blue-600 font-bold">https://</span> for a secure connection. Your QR code will redirect users instantly when scanned.
                                   </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                           <button onClick={() => toggleSection('name')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center">
                                    <Grid3X3 className="w-5 h-5" />
                                 </div>
                                 <div className="text-left">
                                    <h4 className="font-bold text-slate-800 text-lg">Name of the QR Code</h4>
                                    <p className="text-xs text-slate-400">Give your QR code a name.</p>
                                 </div>
                              </div>
                              <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'name' ? 'rotate-180' : ''}`} />
                           </button>
                           {activeDesignSection === 'name' && (
                              <div className="p-8 animate-in slide-in-from-top-2 duration-300">
                                 <input type="text" placeholder="E.g. My QR code" value={wizard.name} onChange={(e) => setWizard({...wizard, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800" />
                              </div>
                           )}
                        </div>
                      </div>
                    )}

                    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                      <button onClick={() => toggleSection('folder')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                            <FolderIcon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Save to Folder</h4>
                            <p className="text-xs text-slate-400 font-medium">Organize your codes by category.</p>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'folder' ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDesignSection === 'folder' && (
                        <div className="p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                             {folders.map(folder => (
                               <button 
                                 key={folder.id} 
                                 onClick={() => setWizard({...wizard, folderId: folder.id})}
                                 className={`p-4 rounded-2xl border-2 text-left transition-all relative ${wizard.folderId === folder.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}
                               >
                                  <div className="flex items-center gap-2 mb-1">
                                    <FolderIcon className={`w-4 h-4 ${wizard.folderId === folder.id ? 'text-blue-500' : 'text-slate-400'}`} />
                                    <span className={`text-xs font-black truncate ${wizard.folderId === folder.id ? 'text-blue-700' : 'text-slate-600'}`}>{folder.name}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400">{folder.count} codes</span>
                                  {wizard.folderId === folder.id && (
                                    <div className="absolute top-2 right-2">
                                      <Check className="w-3 h-3 text-blue-500" />
                                    </div>
                                  )}
                               </button>
                             ))}
                             <button 
                               onClick={() => setIsCreatingFolder(true)}
                               className="p-4 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400 hover:text-blue-600"
                             >
                                <Plus className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase">New Folder</span>
                             </button>
                          </div>

                          {isCreatingFolder && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <input 
                                 type="text" 
                                 autoFocus
                                 placeholder="Enter folder name..."
                                 value={newFolderName}
                                 onChange={(e) => setNewFolderName(e.target.value)}
                                 className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                 onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
                               />
                               <button onClick={createNewFolder} className="p-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all">
                                 <Plus className="w-5 h-5" />
                               </button>
                               <button onClick={() => {setIsCreatingFolder(false); setNewFolderName('');}} className="p-2 bg-white text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
                                 <X className="w-5 h-5" />
                               </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {wizard.step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">3. Design the QR</h2>
                    <div className="space-y-4">
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('frame')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Layout className="w-6 h-6" /></div>
                            <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">Frame Style</h4><p className="text-sm text-slate-400">Add a custom frame to your QR code.</p></div>
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'frame' ? 'rotate-180' : ''}`} />
                        </button>
                        {activeDesignSection === 'frame' && (
                          <div className="p-8 pt-2 border-t border-slate-50 grid grid-cols-4 md:grid-cols-6 gap-4 animate-in slide-in-from-top-2 duration-300">
                            {FRAME_STYLES.map(style => (
                              <button key={style.id} onClick={() => setWizard({...wizard, config: {...wizard.config, frame: style.id}})} className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all ${wizard.config.frame === style.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}>
                                {style.icon}
                                <span className="text-[8px] font-black uppercase mt-2">{style.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('pattern')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Grid3X3 className="w-6 h-6" /></div>
                            <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">Module Pattern</h4><p className="text-sm text-slate-400">Customize the dots and color of your code.</p></div>
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'pattern' ? 'rotate-180' : ''}`} />
                        </button>
                        {activeDesignSection === 'pattern' && (
                          <div className="p-8 pt-2 border-t border-slate-50 space-y-8 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-6 gap-3">
                              {PATTERN_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => setWizard({...wizard, config: {...wizard.config, pattern: opt.id}})} className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.pattern === opt.id ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}>
                                  {opt.icon}
                                </button>
                              ))}
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Color</label>
                                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                                     <input type="text" value={wizard.config.fgColor.toUpperCase()} onChange={(e) => setWizard({...wizard, config: {...wizard.config, fgColor: e.target.value}})} className="flex-1 px-4 font-bold text-xs uppercase outline-none" />
                                     <input type="color" value={wizard.config.fgColor} onChange={(e) => setWizard({...wizard, config: {...wizard.config, fgColor: e.target.value}})} className="w-12 h-12 border-none bg-transparent p-1 cursor-pointer" />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Background Color</label>
                                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                                     <input type="text" value={wizard.config.bgColor.toUpperCase()} onChange={(e) => setWizard({...wizard, config: {...wizard.config, bgColor: e.target.value}})} className="flex-1 px-4 font-bold text-xs uppercase outline-none" />
                                     <input type="color" value={wizard.config.bgColor} onChange={(e) => setWizard({...wizard, config: {...wizard.config, bgColor: e.target.value}})} className="w-12 h-12 border-none bg-transparent p-1 cursor-pointer" />
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <button onClick={() => setIsTransparent(!isTransparent)} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isTransparent ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-200'}`}>{isTransparent && <CheckCheck className="w-3 h-3 text-white" />}</button>
                               <span className="text-sm font-bold text-slate-600">Transparent Background</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('corners')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Maximize className="w-6 h-6" /></div>
                            <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">QR Eye Style</h4><p className="text-sm text-slate-400">Select the shape and color of corner squares.</p></div>
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'corners' ? 'rotate-180' : ''}`} />
                        </button>
                        {activeDesignSection === 'corners' && (
                          <div className="p-8 pt-2 border-t border-slate-50 space-y-10 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid md:grid-cols-2 gap-10">
                               <div className="space-y-4">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eye Frame Style</p>
                                  <div className="grid grid-cols-4 gap-2">
                                     {CORNER_SQUARE_OPTIONS.map(opt => (
                                       <button key={opt.id} onClick={() => setWizard({...wizard, config: {...wizard.config, cornersSquareType: opt.id}})} className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.cornersSquareType === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>{opt.icon}</button>
                                     ))}
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eye Dot Style</p>
                                  <div className="grid grid-cols-4 gap-2">
                                     {CORNER_DOT_OPTIONS.map(opt => (
                                       <button key={opt.id} onClick={() => setWizard({...wizard, config: {...wizard.config, cornersDotType: opt.id}})} className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${wizard.config.cornersDotType === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}>{opt.icon}</button>
                                     ))}
                                  </div>
                               </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eye Frame Color</label>
                                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                                     <input type="text" value={wizard.config.cornersSquareColor?.toUpperCase() || wizard.config.fgColor.toUpperCase()} onChange={(e) => setWizard({...wizard, config: {...wizard.config, cornersSquareColor: e.target.value}})} className="flex-1 px-4 font-bold text-xs uppercase outline-none" />
                                     <input type="color" value={wizard.config.cornersSquareColor || wizard.config.fgColor} onChange={(e) => setWizard({...wizard, config: {...wizard.config, cornersSquareColor: e.target.value}})} className="w-12 h-12 border-none bg-transparent p-1 cursor-pointer" />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eye Dot Color</label>
                                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                                     <input type="text" value={wizard.config.cornersDotColor?.toUpperCase() || wizard.config.fgColor.toUpperCase()} onChange={(e) => setWizard({...wizard, config: {...wizard.config, cornersDotColor: e.target.value}})} className="flex-1 px-4 font-bold text-xs uppercase outline-none" />
                                     <input type="color" value={wizard.config.cornersDotColor || wizard.config.fgColor} onChange={(e) => setWizard({...wizard, config: {...wizard.config, cornersDotColor: e.target.value}})} className="w-12 h-12 border-none bg-transparent p-1 cursor-pointer" />
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('logo')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><ImageIcon className="w-6 h-6" /></div>
                            <div className="text-left"><h4 className="font-bold text-slate-800 text-lg">Add Center Logo</h4><p className="text-sm text-slate-400">Upload your brand logo for better recognition.</p></div>
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform ${activeDesignSection === 'logo' ? 'rotate-180' : ''}`} />
                        </button>
                        {activeDesignSection === 'logo' && (
                          <div className="p-8 pt-2 border-t border-slate-50 space-y-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-blue-400 transition-all group relative cursor-pointer">
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                               {wizard.config.logoUrl ? (
                                 <img src={wizard.config.logoUrl} className="w-24 h-24 object-contain shadow-xl rounded-xl" />
                               ) : (
                                 <>
                                   <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors mb-4"><Upload className="w-8 h-8" /></div>
                                   <p className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Click or drag your logo here</p>
                                 </>
                               )}
                            </div>
                            {wizard.config.logoUrl && (
                               <button onClick={() => setWizard({...wizard, config: {...wizard.config, logoUrl: undefined}})} className="w-full py-3 border border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors text-xs uppercase tracking-widest">Remove Logo</button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 relative">
                <div className="sticky top-10 flex flex-col items-center gap-8">
                  <div className="bg-white p-1 rounded-[2rem] border-2 border-blue-400 shadow-sm flex items-center gap-1 self-center">
                    <button onClick={() => setPhonePreviewMode('ui')} className={`px-6 py-2 rounded-full text-[11px] font-black uppercase transition-all ${phonePreviewMode === 'ui' ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-blue-400 hover:bg-blue-50'}`}>Preview</button>
                    <button onClick={() => setPhonePreviewMode('qr')} className={`px-6 py-2 rounded-full text-[11px] font-black uppercase transition-all ${phonePreviewMode === 'qr' ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-blue-400 hover:bg-blue-50'}`}>QR code</button>
                  </div>

                  <div className="relative w-[340px] h-[680px] bg-slate-900 rounded-[4.5rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-700 transition-all duration-500">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-[60]" />
                    <div className="w-full h-full bg-white relative flex flex-col">
                      <div className="px-8 pt-6 pb-2 flex justify-between items-center text-[10px] font-black text-white bg-slate-900 z-40">
                        <span>9:41</span>
                        <div className="flex gap-1.5 items-center">
                           <Activity className="w-3 h-3" />
                           <Wifi className="w-3 h-3" />
                           <div className="w-4 h-2 border border-white rounded-[1px] relative">
                              <div className="absolute left-0 top-0 h-full w-[80%] bg-white" />
                           </div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white flex flex-col items-center justify-center relative overflow-hidden">
                        {wizard.step === 1 ? (
                          <div className="flex flex-col items-center justify-center h-full p-8">
                            <div className="p-8 border-2 border-slate-100 rounded-3xl bg-white relative mb-8 shadow-sm">
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full border shadow-sm z-10 flex items-center justify-center">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">LOGO</div>
                               </div>
                               <StyledQRCode options={qrStylingOptions} size={150} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 text-center leading-tight">Select a type of QR code on the left</h3>
                          </div>
                        ) : (
                          phonePreviewMode === 'qr' ? (
                            <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-slate-50">
                              <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 relative group transition-all duration-500 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-[2.5rem] pointer-events-none" />
                                <QRFrameWrapper frame={wizard.config.frame}>
                                  <StyledQRCode options={qrStylingOptions} size={180} />
                                </QRFrameWrapper>
                              </div>
                              <h4 className="mt-10 text-xl font-black text-slate-800 text-center leading-tight px-4 tracking-tight">{wizard.name || "My Secure QR"}</h4>
                              <div className="flex items-center gap-2 mt-3 px-4 py-1.5 bg-blue-50/50 rounded-full border border-blue-100/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Live Preview</span>
                              </div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-8 opacity-50">Generated by QRcode.io</p>
                            </div>
                          ) : (
                            wizard.type === 'links' ? (
                              <div className="flex flex-col h-full w-full relative animate-in fade-in duration-500 overflow-y-auto scrollbar-hide" style={{ backgroundColor: wizard.business?.pageBackgroundColor }}>
                                 <div className="flex flex-col items-center pt-16 px-6 text-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden mb-6 shadow-xl">
                                       {wizard.business?.images[0] ? (
                                          <img src={wizard.business.images[0]} className="w-full h-full object-cover" />
                                       ) : (
                                          <div className="w-full h-full bg-slate-200 flex items-center justify-center"><UserIcon className="w-10 h-10 text-slate-400" /></div>
                                       )}
                                    </div>
                                    <h4 className="text-xl font-black mb-2" style={{ color: wizard.business?.linkBackgroundColor, fontFamily: wizard.business?.fontTitle }}>{wizard.business?.title || "Your Title Here"}</h4>
                                    <p className="text-xs opacity-90 px-4" style={{ color: wizard.business?.linkBackgroundColor, fontFamily: wizard.business?.fontText }}>{wizard.business?.description || "Your description text goes here to tell your visitors more about you."}</p>
                                 </div>
                                 <div className="flex-1 px-6 pt-10 pb-20 space-y-4">
                                    {wizard.business?.buttons.map((link) => (
                                       <a 
                                          key={link.id} 
                                          href={link.url || '#'} 
                                          target="_blank" 
                                          className="w-full py-4 px-6 rounded-2xl flex items-center justify-between shadow-lg transition-transform active:scale-95 border border-white/5" 
                                          style={{ backgroundColor: wizard.business?.linkBackgroundColor, color: wizard.business?.linkTextColor, fontFamily: wizard.business?.fontText }}
                                       >
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
                                                {link.icon && SOCIAL_ICONS_MAP[link.icon] ? (
                                                   React.createElement(SOCIAL_ICONS_MAP[link.icon].icon, { className: "w-5 h-5" })
                                                ) : <Globe className="w-5 h-5" />}
                                             </div>
                                             <span className="font-black text-sm uppercase tracking-wider">{link.text}</span>
                                          </div>
                                          <ChevronRight className="w-4 h-4 opacity-50" />
                                       </a>
                                    ))}
                                 </div>
                                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full" />
                              </div>
                            ) : wizard.type === 'pdf' ? (
                              <div className="flex flex-col h-full w-full bg-slate-50 relative animate-in fade-in duration-500 overflow-y-auto scrollbar-hide">
                                <div className="w-full h-56 relative shrink-0 overflow-hidden" style={{ backgroundColor: wizard.business?.primaryColor }}>
                                   <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                                   <div className="absolute top-10 left-0 right-0 text-center px-6">
                                      <h5 className="text-[10px] font-black uppercase tracking-widest opacity-70" style={{ fontFamily: wizard.business?.fontText, color: wizard.business?.fontTextColor }}>{wizard.business?.company}</h5>
                                      <h4 className="text-2xl font-black mt-1 leading-tight" style={{ fontFamily: wizard.business?.fontTitle, color: wizard.business?.fontTitleColor }}>{wizard.business?.title}</h4>
                                      <p className="text-xs mt-2 px-4 opacity-80" style={{ fontFamily: wizard.business?.fontText, color: wizard.business?.fontTextColor }}>{wizard.business?.description}</p>
                                   </div>
                                </div>
                                <div className="px-6 -mt-10 relative z-10 space-y-6 pb-20">
                                   <div className="bg-white rounded-[2rem] shadow-xl p-6 flex flex-col items-center text-center gap-6 border border-slate-100">
                                      <div className="w-full h-[320px] rounded-xl overflow-hidden bg-slate-50 relative border border-slate-100">
                                         {wizard.business?.images[0] ? (
                                           <img src={wizard.business.images[0]} className="w-full h-full object-cover" alt="PDF Cover" />
                                         ) : pdfUrl ? (
                                           <iframe src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} className="w-full h-full border-none" title="PDF Preview" />
                                         ) : (
                                           <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                              <FileText className="w-12 h-12 text-slate-200" />
                                              <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">No PDF Uploaded</span>
                                           </div>
                                         )}
                                      </div>
                                      
                                      <button className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-lg transition-transform active:scale-95" style={{ backgroundColor: wizard.business?.secondaryColor, fontFamily: wizard.business?.fontText }}>
                                         {wizard.business?.buttons[0].text}
                                      </button>
                                      
                                      {wizard.business?.location.searchAddress && (
                                         <a href={wizard.business.location.searchAddress} target="_blank" className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-1.5 mt-1">
                                            <Globe className="w-3 h-3" /> Visit Website
                                         </a>
                                      )}
                                   </div>
                                </div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300/30 rounded-full" />
                              </div>
                            ) : wizard.type === 'whatsapp' ? (
                              <div className="flex flex-col h-full w-full bg-[#e5ddd5] relative animate-in fade-in duration-500">
                                <div className="absolute inset-0 z-0 opacity-[0.07] bg-[url('https://i.pinimg.com/originals/85/70/f6/8570f6339d318933fa581fc0f7980c06.jpg')] bg-repeat" />
                                <div className="bg-[#075e54] p-4 pt-6 flex items-center justify-between text-white shadow-lg relative z-10 shrink-0">
                                   <div className="flex items-center gap-3">
                                      <ChevronLeft className="w-6 h-6" />
                                      <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden border border-white/20">
                                         <UserCircle className="w-full h-full text-white/50" />
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-sm font-bold leading-none">{whatsappPhone || "Business Name"}</span>
                                         <span className="text-[10px] opacity-70">online</span>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-4">
                                      <Phone className="w-4 h-4" />
                                      <MoreVertical className="w-4 h-4" />
                                   </div>
                                </div>
                                <div className="flex-1 p-6 relative z-10 flex flex-col justify-end overflow-y-auto scrollbar-hide">
                                   <div className="self-center bg-white/60 px-3 py-1 rounded-lg text-[9px] font-bold text-slate-500 mb-6 uppercase tracking-wider">Today</div>
                                   <div className="flex flex-col items-end">
                                      <div className="max-w-[85%] bg-[#dcf8c6] p-3 pb-2 rounded-2xl rounded-tr-none shadow-sm relative animate-in slide-in-from-right duration-300">
                                         <p className="text-[13px] text-slate-800 leading-normal pr-10">{whatsappMessage || "Scan the QR code to see your message here..."}</p>
                                         <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className="text-[9px] text-slate-500">9:41 AM</span>
                                            <CheckCheck className="w-3 h-3 text-blue-500" />
                                         </div>
                                      </div>
                                   </div>
                                </div>
                                <div className="bg-[#f0f2f5] p-3 flex items-center gap-3 relative z-10 shrink-0">
                                   <Smile className="w-6 h-6 text-slate-400" />
                                   <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-slate-400 flex items-center justify-between">
                                      <span>Type a message</span>
                                      <Paperclip className="w-4 h-4 rotate-[-45deg]" />
                                   </div>
                                   <div className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center text-white shadow-md">
                                      <Mic className="w-5 h-5" />
                                   </div>
                                </div>
                              </div>
                            ) : wizard.type === 'website' ? (
                              <div className="flex flex-col h-full w-full bg-white relative animate-in fade-in zoom-in-95 duration-500">
                                <div className="h-[250px] bg-[#00cfd5] flex flex-col pt-8 px-6 transition-all duration-700">
                                   <div className="w-full bg-white/20 backdrop-blur-md rounded-full py-3.5 px-6 flex items-center gap-4 border border-white/30 shadow-lg">
                                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00cfd5] shrink-0">
                                         <Globe className="w-4 h-4" />
                                      </div>
                                      <div className="flex-1 overflow-hidden">
                                         <span className="text-white font-bold text-sm truncate block">{wizard.value || "https://yourlink.com"}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex-1 -mt-24 px-6 space-y-6">
                                   <div className="w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 h-[360px] flex flex-col gap-4">
                                      <div className="w-full h-full bg-slate-50/80 rounded-2xl animate-pulse" />
                                   </div>
                                   <div className="space-y-3 px-4">
                                      <div className="h-4 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                                      <div className="h-4 w-1/2 bg-slate-100 rounded-full animate-pulse" />
                                      <div className="h-4 w-2/3 bg-slate-100 rounded-full animate-pulse" />
                                   </div>
                                </div>
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-200 rounded-full" />
                              </div>
                            ) : (
                              <div className="flex-1 h-full w-full bg-[#f0f2f5] flex flex-col items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs p-10 text-center">
                                 <MousePointer2 className="w-8 h-8 mb-4 opacity-10" />
                                 UI Preview Active
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md border-t border-slate-100 p-8 fixed bottom-0 left-64 right-0 z-50 flex justify-between items-center shadow-lg rounded-t-[3rem]">
               <button onClick={handleBackStep} disabled={wizard.step === 1} className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-xs flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                 <ChevronLeft className="w-4 h-4" /> Back
               </button>
               <button onClick={handleNextStep} className="px-12 py-5 bg-[#0ea5e9] text-white rounded-2xl font-black uppercase text-xs flex items-center gap-2 hover:bg-blue-500 shadow-xl transition-all">
                 {wizard.step === 3 ? (editingId ? 'Update & Save' : 'Save & Finish') : 'Next Step'} <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
