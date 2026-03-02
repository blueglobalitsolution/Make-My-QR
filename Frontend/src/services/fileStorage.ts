import { uploadFile, listFiles, deleteFile as apiDeleteFile, getFile as apiGetFile, FileResponse } from '../api/files';

export interface FileRecord {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  mimeType: string;
  size: number;
  filePath: string;
  createdAt: string;
  qrCodeId?: string;
  folderId?: string;
}

const transformApiResponse = (file: FileResponse): FileRecord => ({
  id: file.id.toString(),
  name: file.name,
  type: file.file_type === 'pdf' ? 'pdf' : 'image',
  mimeType: file.file_type === 'pdf' ? 'application/pdf' : 'image/jpeg',
  size: file.size,
  filePath: file.file_url,
  createdAt: file.created_at,
  folderId: file.folder?.toString(),
});

export const saveFile = async (file: File, folderId?: number): Promise<FileRecord> => {
  const response = await uploadFile(file, folderId);
  return transformApiResponse(response);
};

export const getFile = async (id: string): Promise<{ record: FileRecord; blob: Blob } | null> => {
  try {
    const file = await apiGetFile(parseInt(id));
    const record = transformApiResponse(file);
    // Fetching blob from URL if needed.
    // In production, you might want to serve this differently, but fetching via browser/fetch is valid.
    const response = await fetch(file.file_url);
    const blob = await response.blob();

    return { record, blob };
  } catch (err) {
    console.error("Failed to fetch file from API", err);
    return null;
  }
};

export const getAllFiles = async (): Promise<FileRecord[]> => {
  const files = await listFiles();
  return files.map(transformApiResponse);
};

export const deleteFile = async (id: string): Promise<void> => {
  await apiDeleteFile(parseInt(id));
};

export const getFileUrl = (id: string): string => {
  // This might need refinement depending on how the frontend handles viewing files
  return `/view/file/${id}`;
};

export const createObjectURL = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};
