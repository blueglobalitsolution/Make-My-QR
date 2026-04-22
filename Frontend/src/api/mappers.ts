import { GeneratedCode, User } from '../../types';

export const mapQRCodeData = (data: any): GeneratedCode => {
    if (!data) return data;
    return {
        ...data,
        id: data.id?.toString(),
        folderId: (data.folder || data.folderId)?.toString(),
        shortSlug: data.short_slug || data.shortSlug,
        isDynamic: data.is_dynamic ?? data.isDynamic,
        isLeadCapture: data.is_lead_capture ?? data.isLeadCapture,
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        userId: (data.user || data.userId)?.toString(),
    };
};

export const mapUserData = (data: any): User => {
    if (!data) return data;
    return {
        id: (data.user_id || data.id)?.toString(),
        email: data.email,
        name: `${data.first_name || data.firstName || ''} ${data.last_name || data.lastName || ''}`.trim() || data.email?.split('@')[0] || 'User',
        firstName: data.first_name || data.firstName,
        lastName: data.last_name || data.lastName,
        plan: (data.subscription?.plan || data.plan || 'free') as any,
        isAdmin: data.is_superuser || data.isAdmin || false,
        isStaff: data.is_staff || data.isStaff || false,
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        daysRemaining: data.subscription?.days_remaining ?? data.daysRemaining ?? 0,
        savedPalettes: data.savedPalettes || [],
        subscription: data.subscription
    };
};
