
export type QRType = 
  | 'website' | 'pdf' | 'links' | 'vcard' | 'business' | 'video' 
  | 'images' | 'facebook' | 'instagram' | 'social' | 'whatsapp' | 'mp3' 
  | 'menu' | 'apps' | 'coupon' | 'wifi' | 'dynamic' | 'barcode';

export type BarcodeFormat = 
  | 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39' | 'ITF' | 'MSI' | 'pharmacode';

export type PlanType = 'free' | 'pro' | 'enterprise';

export type FrameType = 
  | 'none' | 'basic-label' | 'rounded-label' | 'thick-label' | 'clean-label' 
  | 'bubble' | 'ribbon' | 'cut-corners' | 'arrow-label' | 'hands' 
  | 'shopping' | 'gift' | 'banner' | 'mail' | 'delivery' | 'service';

export interface Palette {
  primary: string;
  secondary: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  isAdmin: boolean;
  createdAt: string;
  daysRemaining: number;
  savedPalettes?: Palette[];
}

export interface Folder {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

export interface GeneratedCode {
  id: string;
  userId: string;
  folderId?: string;
  type: 'qr' | 'barcode';
  category: QRType | BarcodeFormat;
  name: string;
  value: string;
  isDynamic: boolean;
  scans: number;
  status: 'active' | 'paused';
  createdAt: string;
  settings: any;
}

export type ViewState = 
  | 'landing' 
  | 'auth' 
  | 'wizard' 
  | 'dashboard' 
  | 'analytics' 
  | 'my_codes' 
  | 'account' 
  | 'billing' 
  | 'contact' 
  | 'faq'
  | 'admin'
  | 'scan'
  | 'gateway';

export interface BusinessButton {
  id: string;
  text: string;
  url: string;
  icon?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DayConfig {
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface OpeningHours {
  monday: DayConfig;
  tuesday: DayConfig;
  wednesday: DayConfig;
  thursday: DayConfig;
  friday: DayConfig;
  saturday: DayConfig;
  sunday: DayConfig;
}

export interface LocationConfig {
  searchAddress: string;
  streetNumberFirst: boolean;
  street: string;
  number: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

export interface ContactField {
  id: string;
  label: string;
  value: string;
  type: string;
}

export interface ContactInfo {
  name: string;
  phones: ContactField[];
  emails: ContactField[];
  websites: ContactField[];
}

export interface SocialNetwork {
  id: string;
  platform: string;
  url: string;
  text: string;
}

export interface BusinessConfig {
  primaryColor: string;
  secondaryColor: string;
  pageBackgroundColor?: string;
  linkBackgroundColor?: string;
  linkTextColor?: string;
  images: string[];
  company: string;
  title: string;
  subtitle: string;
  description: string;
  buttons: BusinessButton[];
  openingHours: OpeningHours;
  location: LocationConfig;
  contact: ContactInfo;
  socialNetworks: SocialNetwork[];
  aboutCompany: string;
  facilities: string[];
  fontTitle: string;
  fontText: string;
  fontTitleColor?: string;
  fontTextColor?: string;
  welcomeScreenImage?: string;
}

export interface WizardState {
  step: 1 | 2 | 3;
  mode: 'qr' | 'barcode';
  type: QRType | BarcodeFormat;
  value: string;
  name: string;
  password?: string;
  isPasswordActive: boolean;
  folderId?: string;
  business?: BusinessConfig;
  config: {
    fgColor: string;
    bgColor: string;
    level: 'L' | 'M' | 'Q' | 'H';
    logoUrl?: string;
    borderRadius: number;
    pattern: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
    cornerType: 'square' | 'dot' | 'extra-rounded';
    cornersSquareType?: string;
    cornersSquareColor?: string;
    cornersDotType?: string;
    cornersDotColor?: string;
    frame: FrameType;
  };
}