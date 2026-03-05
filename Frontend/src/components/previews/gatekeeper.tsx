import React from 'react';
import { WebsitePreview } from './WebsitePreview';
import { PdfPreview } from './PdfPreview';
import { WhatsAppPreview } from './WhatsAppPreview';
import { DefaultPreview } from './DefaultPreview';
import { QRType } from '../../../types';

export interface GatekeeperProps {
    category: QRType | string;
    name: string;
    brandColor: string;
    fullValue: string;
    is_lead_capture: boolean;
    isAuthorized: boolean;
    isFileMode: boolean;
    leadForm: {
        name: string;
        email: string;
    };
    setLeadForm: React.Dispatch<React.SetStateAction<{ name: string; email: string }>>;
    onLeadSubmit: (e: React.FormEvent) => void;
    viewMode: 'landing' | 'preview';
    setViewMode: React.Dispatch<React.SetStateAction<'landing' | 'preview'>>;
}

export const GatekeeperPreview: React.FC<GatekeeperProps> = ({
    category,
    name,
    brandColor,
    fullValue,
    is_lead_capture,
    isAuthorized,
    isFileMode,
    leadForm,
    setLeadForm,
    onLeadSubmit,
    viewMode,
    setViewMode
}) => {
    switch (category) {
        case 'website':
            return (
                <WebsitePreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                />
            );

        case 'pdf':
            return (
                <PdfPreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
                    isFileMode={isFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            );

        case 'whatsapp':
            return (
                <WhatsAppPreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                />
            );

        default:
            return (
                <DefaultPreview
                    name={name}
                    category={category}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                />
            );
    }
};

export default GatekeeperPreview;
