import { FileRecord, initDatabase, addFileRecord, getAllFileRecords, getFileRecord, deleteFileRecord, saveFileBlob, getFileBlob } from '../utils/database';

export const saveFile = async (file: File, qrCodeId?: string): Promise<FileRecord> => {
  await initDatabase();
  
  const id = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const type = extension === 'pdf' ? 'pdf' : 'image';
  
  const record: FileRecord = {
    id,
    name: file.name,
    type,
    mimeType: file.type,
    size: file.size,
    filePath: `/Assets/${id}.${extension}`,
    createdAt: new Date().toISOString(),
    qrCodeId
  };

  await addFileRecord(record);
  await saveFileBlob(id, file);

  return record;
};

export const getFile = async (id: string): Promise<{ record: FileRecord; blob: Blob } | null> => {
  await initDatabase();
  
  const record = await getFileRecord(id);
  if (!record) return null;

  const blob = await getFileBlob(id);
  if (!blob) return null;

  return { record, blob };
};

export const getAllFiles = async (): Promise<FileRecord[]> => {
  await initDatabase();
  return getAllFileRecords();
};

export const deleteFile = async (id: string): Promise<void> => {
  await initDatabase();
  await deleteFileRecord(id);
};

export const getFileUrl = (id: string): string => {
  return `/view/file/${id}`;
};

export const createObjectURL = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};
