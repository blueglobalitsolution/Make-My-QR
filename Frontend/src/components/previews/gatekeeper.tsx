import React from 'react';
import { WebsitePreview } from './WebsitePreview';
import { PdfPreview } from './PdfPreview';
import { WhatsAppPreview } from './WhatsAppPreview';
import { DefaultPreview } from './DefaultPreview';
import { BusinessPreview } from './BusinessPreview';
import { QRType } from '../../../types';

export type GatekeeperConfigMap = Record<string, {
    category: string;
    password_enabled: boolean;
    lead_capture_enabled: boolean;
    timer_enabled: boolean;
}> | null;

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
    onPasswordSubmit?: (password: string) => Promise<boolean> | boolean;
    viewMode: 'landing' | 'preview';
    setViewMode: React.Dispatch<React.SetStateAction<'landing' | 'preview'>>;
    isPreview?: boolean;
    activeSection?: string | null;
    isMobile?: boolean;
    is_protected: boolean;
    gatekeeperConfig?: GatekeeperConfigMap;
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
    activeSection,
    isMobile = false,
    is_protected,
    gatekeeperConfig,
}) => {
    // Resolve effective gate state based on admin config + model flags
    const categoryConfig = gatekeeperConfig?.[category];
    const effectivePasswordEnabled = categoryConfig?.password_enabled ?? true;
    const effectiveLeadCaptureEnabled = categoryConfig?.lead_capture_enabled ?? true;
    const effectiveTimerEnabled = categoryConfig?.timer_enabled ?? false;

    // Show gates only if the model flag AND admin config allow it
    const showPassword = is_protected && effectivePasswordEnabled;
    const showLeadCapture = is_lead_capture && effectiveLeadCaptureEnabled;

    switch (category) {
        case 'website':
            return (
                <WebsitePreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={showLeadCapture}
                    isAuthorized={isAuthorized}
                    isPasswordVerified={isPasswordVerified}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onPasswordSubmit={onPasswordSubmit}
                    isPreview={isPreview}
                    is_protected={showPassword}
                />
            );

        case 'pdf':
            return (
                <PdfPreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    businessData={businessData}
                    is_lead_capture={showLeadCapture}
                    isAuthorized={isAuthorized}
                    isPasswordVerified={isPasswordVerified}
                    isFileMode={isFileMode}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    setViewMode={setViewMode}
                    isPreview={isPreview}
                    isMobile={isMobile}
                    is_protected={showPassword}
                />
            );

        case 'whatsapp':
            return (
                <WhatsAppPreview
                    name={name}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={showLeadCapture}
                    isAuthorized={isAuthorized}
                    isPasswordVerified={isPasswordVerified}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                    onPasswordSubmit={onPasswordSubmit}
                    is_protected={showPassword}
                    timerEnabled={effectiveTimerEnabled}
                />
            );

        case 'business':
            return (
                <BusinessPreview
                    name={name}
                    brandColor={brandColor}
                    businessData={businessData}
                    is_lead_capture={showLeadCapture}
                    isAuthorized={isAuthorized}
                    isPasswordVerified={isPasswordVerified}
                    isPreview={isPreview}
                    activeSection={activeSection}
                    is_protected={showPassword}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                    onPasswordSubmit={onPasswordSubmit}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            );

        default:
            return (
                <DefaultPreview
                    name={name}
                    category={category}
                    brandColor={brandColor}
                    fullValue={fullValue}
                    is_lead_capture={showLeadCapture}
                    isAuthorized={isAuthorized}
                    isPasswordVerified={isPasswordVerified}
                    leadForm={leadForm}
                    setLeadForm={setLeadForm}
                    onLeadSubmit={onLeadSubmit}
                    onPasswordSubmit={onPasswordSubmit}
                    is_protected={showPassword}
                />
            );
    }
};

export default GatekeeperPreview;
