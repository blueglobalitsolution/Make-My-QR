import apiClient from './client';

export const getCodes = async () => {
    const response = await apiClient.get('/qrcodes/');
    return response.data;
};

export const saveCode = async (codeData) => {
    const response = await apiClient.post('/qrcodes/', codeData);
    return response.data;
};

export const updateCode = async (id, codeData) => {
    const response = await apiClient.put(`/qrcodes/${id}/`, codeData);
    return response.data;
};

export const updateCodeImage = async (id: string, imageDataUrl: string): Promise<string> => {
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('image_file', blob, `qr_${id}.png`);
    
    const apiResponse = await apiClient.patch(`/qrcodes/${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return apiResponse.data;
};

export const deleteCode = async (id) => {
    const response = await apiClient.delete(`/qrcodes/${id}/`);
    return response.data;
};
export const getPublicCode = async (slug: string) => {
    const response = await apiClient.get(`/qrcodes/public/${slug}/`);
    return response.data;
};

export const getSummaryAnalytics = async (params: any = {}) => {
    const response = await apiClient.get('/qrcodes/summary-analytics/', { params });
    return response.data;
};

export const getCodeAnalytics = async (id: string | number, params: any = {}) => {
    const response = await apiClient.get(`/qrcodes/${id}/analytics/`, { params });
    return response.data;
};

export const exportScansCsv = async () => {
    try {
        const response = await apiClient.get('/qrcodes/export-scans-csv/', {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `qr_scans_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Failed to export CSV. Please try again.');
    }
};
