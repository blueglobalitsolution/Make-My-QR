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
    isPasswordVerified: boolean;
    isFileMode: boolean;
    leadForm: {
        name: string;
        email: string;
    };
    setLeadForm: React.Dispatch<React.SetStateAction<{ name: string; email: string }>>;
    onLeadSubmit: (e: React.FormEvent) => void;
    onPasswordSubmit: (password: string) => boolean;
    viewMode: 'landing' | 'preview';
    setViewMode: React.Dispatch<React.SetStateAction<'landing' | 'preview'>>;
    isPreview?: boolean;
    activeSection?: string | null;
}

export const GatekeeperPreview: React.FC<GatekeeperProps> = ({
    category,
    name,
    brandColor,
    fullValue,
    businessData,
    is_lead_capture,
    isAuthorized,
    isPasswordVerified,
    isFileMode,
    leadForm,
    setLeadForm,
    onLeadSubmit,
    onPasswordSubmit,
    viewMode,
    setViewMode,
    isPreview = false,
    activeSection
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
                    isPasswordVerified={isPasswordVerified}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                    onPasswordSubmit={onPasswordSubmit}
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
                    isPasswordVerified={isPasswordVerified}
                    isFileMode={isFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onPasswordSubmit={onPasswordSubmit}
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
                    isPasswordVerified={isPasswordVerified}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                    onPasswordSubmit={onPasswordSubmit}
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
                    isPasswordVerified={isPasswordVerified}
                    onLeadSubmit={onLeadSubmit}
                    onPasswordSubmit={onPasswordSubmit}
                    isPreview={isPreview}
                    activeSection={activeSection}
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
                    isPasswordVerified={isPasswordVerified}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                    onPasswordSubmit={onPasswordSubmit}
                />
            );
    }
};

export default GatekeeperPreview;
