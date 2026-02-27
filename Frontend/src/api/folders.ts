import apiClient from './client';

export const getFolders = async () => {
    const response = await apiClient.get('/folders/');
    return response.data;
};

export const createFolder = async (name) => {
    const response = await apiClient.post('/folders/', { name });
    return response.data;
};

export const deleteFolder = async (id) => {
    const response = await apiClient.delete(`/folders/${id}/`);
    return response.data;
};
