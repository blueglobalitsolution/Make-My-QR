const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf-8');
const lines = content.split('\n');

const constStart1 = lines.findIndex(l => l.startsWith('const DAYS ='));
let end1 = lines.findIndex(l => l.startsWith('const FRAME_STYLES'));
while (end1 < lines.length && !lines[end1].includes('];')) end1++;

const constStart2 = lines.findIndex(l => l.startsWith('const PATTERN_OPTIONS'));
let constEnd2 = lines.findIndex(l => l.startsWith('const CORNER_DOT_OPTIONS'));
while (constEnd2 < lines.length && !lines[constEnd2].includes('];')) constEnd2++;

const imports = `import React from 'react';
import { Globe, Dribbble, Facebook, Circle, Github, Search, MessageCircle, Linkedin, Phone, Camera, Type, Twitter, Video, Share2, Youtube, Instagram, Music, Send, Utensils, ShoppingBag, Palette as PaletteIcon, Lock, CircleOff, Hand, Mail as MailIcon, FileText, Link as LinkIcon, UserCircle, Briefcase, ImageIcon, Smartphone, Tag, Wifi, Gift, Bike } from 'lucide-react';
import { WizardState, OpeningHours, LocationConfig, ContactInfo, Palette, FrameType, QRType } from '../types';

`;

let constantsCode = imports;
for (let i = constStart1; i <= end1; i++) {
    constantsCode += lines[i].replace(/^const /, 'export const ') + '\n';
}
constantsCode += '\n';
for (let i = constStart2; i <= constEnd2; i++) {
    constantsCode += lines[i].replace(/^const /, 'export const ') + '\n';
}

if (!fs.existsSync('components')) fs.mkdirSync('components');
fs.writeFileSync('components/constants.tsx', constantsCode);

// Optional: modify App.tsx
// Instead of modifying, I will use multi_replace_file_content tool, but I can output line numbers here
console.log('constants mapped', constStart1, end1, constStart2, constEnd2);
