import React from 'react';
import { WebsitePreview } from './WebsitePreview';
import { PdfPreview } from './PdfPreview';
import { WhatsAppPreview } from './WhatsAppPreview';
import { DefaultPreview } from './DefaultPreview';
import { BusinessPreview } from './BusinessPreview';
import { QRType } from '../../../types';

export interface GatekeeperProps {
    category: QRType | string;
    name: string;
    brandColor: string;
    fullValue: string;
    businessData?: any;
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
    isPreview?: boolean;
}

export const GatekeeperPreview: React.FC<GatekeeperProps> = ({
    category,
    name,
    brandColor,
    fullValue,
    businessData,
    is_lead_capture,
    isAuthorized,
    isFileMode,
    leadForm,
    setLeadForm,
    onLeadSubmit,
    viewMode,
    setViewMode,
    isPreview = false
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
                    isPreview={isPreview}
                />
            );

        case 'pdf':
            return (
                <PdfPreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    businessData={businessData}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
                    isFileMode={isFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    isPreview={isPreview}
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

        case 'business':
            return (
                <BusinessPreview
                    name={name}
                    brandColor={brandColor}
                    businessData={businessData}
                    is_lead_capture={is_lead_capture}
                    isAuthorized={isAuthorized}
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
