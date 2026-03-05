// Helper to get the correct backend URL for QR code redirects
// This should always point to the backend server (port 8010), not the frontend
export const getBackendUrl = (): string => {
  // Use environment variable if available, otherwise default to the known backend URL
  return (import.meta as any).env?.VITE_BACKEND_URL || 'http://192.168.1.208:8010';
};

// Helper to construct QR code redirect URL
export const getQRRedirectUrl = (slug: string): string => {
  return `${getBackendUrl()}/r/${slug}`;
};
