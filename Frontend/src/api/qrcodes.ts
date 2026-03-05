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

export const deleteCode = async (id) => {
    const response = await apiClient.delete(`/qrcodes/${id}/`);
    return response.data;
};
export const getPublicCode = async (slug: string) => {
    const response = await apiClient.get(`/qrcodes/public/${slug}/`);
    return response.data;
};
