const DB_NAME = 'AssetsDB';
const DB_VERSION = 1;

export interface FileRecord {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  mimeType: string;
  size: number;
  filePath: string;
  createdAt: string;
  qrCodeId?: string;
}

export interface Database {
  files: FileRecord[];
}

let db: IDBDatabase | null = null;

export const initDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains('files')) {
        database.createObjectStore('files', { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains('metadata')) {
        database.createObjectStore('metadata', { keyPath: 'id' });
      }
    };
  });
};

export const getDatabase = async (): Promise<IDBDatabase> => {
  if (!db) {
    return initDatabase();
  }
  return db;
};

export const addFileRecord = async (record: FileRecord): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['files', 'metadata'], 'readwrite');
    const filesStore = transaction.objectStore('files');
    const metadataStore = transaction.objectStore('metadata');

    filesStore.put({ ...record, blob: undefined });

    let metadata = { id: 'database', files: [] as FileRecord[] };
    const metadataRequest = metadataStore.get('database');
    
    metadataRequest.onsuccess = () => {
      if (metadataRequest.result) {
        metadata = metadataRequest.result;
      }
      
      const existingIndex = metadata.files.findIndex(f => f.id === record.id);
      if (existingIndex >= 0) {
        metadata.files[existingIndex] = record;
      } else {
        metadata.files.push(record);
      }
      
      metadataStore.put(metadata);
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getAllFileRecords = async (): Promise<FileRecord[]> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['metadata'], 'readonly');
    const metadataStore = transaction.objectStore('metadata');
    const request = metadataStore.get('database');

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.files);
      } else {
        resolve([]);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const getFileRecord = async (id: string): Promise<FileRecord | undefined> => {
  const files = await getAllFileRecords();
  return files.find(f => f.id === id);
};

export const deleteFileRecord = async (id: string): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['files', 'metadata'], 'readwrite');
    const filesStore = transaction.objectStore('files');
    const metadataStore = transaction.objectStore('metadata');

    filesStore.delete(id);

    const metadataRequest = metadataStore.get('database');
    metadataRequest.onsuccess = () => {
      if (metadataRequest.result) {
        const metadata = metadataRequest.result;
        metadata.files = metadata.files.filter((f: FileRecord) => f.id !== id);
        metadataStore.put(metadata);
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const saveFileBlob = async (id: string, blob: Blob): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['files'], 'readwrite');
    const filesStore = transaction.objectStore('files');
    
    filesStore.put({ id, blob });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getFileBlob = async (id: string): Promise<Blob | undefined> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['files'], 'readonly');
    const filesStore = transaction.objectStore('files');
    const request = filesStore.get(id);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.blob);
      } else {
        resolve(undefined);
      }
    };

    request.onerror = () => reject(request.error);
  });
};
