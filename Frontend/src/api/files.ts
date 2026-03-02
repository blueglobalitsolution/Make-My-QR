import client from './client';

export interface FileResponse {
    id: number;
    name: string;
    file: string;
    file_type: string;
    size: number;
    created_at: string;
    file_url: string;
    folder: number | null;
}

export const uploadFile = async (file: File, folderId?: number): Promise<FileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    if (folderId) {
        formData.append('folder', folderId.toString());
    }

    const response = await client.post<FileResponse>('/files/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const listFiles = async (): Promise<FileResponse[]> => {
    const response = await client.get<FileResponse[]>('/files/');
    return response.data;
};

export const deleteFile = async (id: number): Promise<void> => {
    await client.delete(`/files/${id}/`);
};

export const getFile = async (id: number): Promise<FileResponse> => {
    const response = await client.get<FileResponse>(`/files/${id}/`);
    return response.data;
};

export const getDownloadUrl = async (id: number): Promise<string> => {
    const response = await client.get<{ download_url: string }>(`/files/${id}/download/`);
    return response.data.download_url;
};
