import { BusinessProfile, OpeningHours, ContactField, SocialNetwork } from '../../types';

const DB_NAME = 'BusinessProfilesDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

const INITIAL_OPENING_HOURS: OpeningHours = {
  monday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  tuesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  wednesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  thursday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  friday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  saturday: { isOpen: false, slots: [] },
  sunday: { isOpen: false, slots: [] },
};

export const getInitialBusinessProfile = (): Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'> => ({
  company: '',
  logo: '',
  headline: '',
  aboutCompany: '',
  phones: [{ id: 'p1', label: 'Work', value: '', type: 'work' }],
  emails: [{ id: 'e1', label: 'Email', value: '', type: 'work' }],
  address: '',
  openingHours: INITIAL_OPENING_HOURS,
  socialNetworks: [],
  primaryColor: '#527AC9',
  secondaryColor: '#7EC09F',
  fontTitle: 'Inter',
  fontText: 'Inter',
});

export const initBusinessProfilesDB = (): Promise<IDBDatabase> => {
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
      
      if (!database.objectStoreNames.contains('profiles')) {
        database.createObjectStore('profiles', { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains('metadata')) {
        database.createObjectStore('metadata', { keyPath: 'id' });
      }
    };
  });
};

export const getBusinessProfilesDB = async (): Promise<IDBDatabase> => {
  if (!db) {
    return initBusinessProfilesDB();
  }
  return db;
};

export const saveBusinessProfile = async (profile: BusinessProfile): Promise<BusinessProfile> => {
  await initBusinessProfilesDB();
  
  const database = await getBusinessProfilesDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['profiles', 'metadata'], 'readwrite');
    const profilesStore = transaction.objectStore('profiles');
    const metadataStore = transaction.objectStore('metadata');

    const profileWithTimestamp = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    profilesStore.put(profileWithTimestamp);

    let metadata = { id: 'database', profiles: [] as BusinessProfile[] };
    const metadataRequest = metadataStore.get('database');
    
    metadataRequest.onsuccess = () => {
      if (metadataRequest.result) {
        metadata = metadataRequest.result;
      }
      
      const existingIndex = metadata.profiles.findIndex(p => p.id === profile.id);
      if (existingIndex >= 0) {
        metadata.profiles[existingIndex] = profileWithTimestamp;
      } else {
        metadata.profiles.push(profileWithTimestamp);
      }
      
      metadataStore.put(metadata);
    };

    transaction.oncomplete = () => resolve(profileWithTimestamp);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const createBusinessProfile = async (profileData: Omit<BusinessProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessProfile> => {
  const id = 'bp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  
  const profile: BusinessProfile = {
    ...profileData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  
  return saveBusinessProfile(profile);
};

export const getBusinessProfile = async (id: string): Promise<BusinessProfile | null> => {
  await initBusinessProfilesDB();
  
  const database = await getBusinessProfilesDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['profiles'], 'readonly');
    const profilesStore = transaction.objectStore('profiles');
    const request = profilesStore.get(id);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const getAllBusinessProfiles = async (): Promise<BusinessProfile[]> => {
  await initBusinessProfilesDB();
  
  const database = await getBusinessProfilesDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['metadata'], 'readonly');
    const metadataStore = transaction.objectStore('metadata');
    const request = metadataStore.get('database');

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.profiles);
      } else {
        resolve([]);
      }
    };

    request.onerror = () => reject(request.error);
  });
};

export const deleteBusinessProfile = async (id: string): Promise<void> => {
  await initBusinessProfilesDB();
  
  const database = await getBusinessProfilesDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['profiles', 'metadata'], 'readwrite');
    const profilesStore = transaction.objectStore('profiles');
    const metadataStore = transaction.objectStore('metadata');

    profilesStore.delete(id);

    const metadataRequest = metadataStore.get('database');
    metadataRequest.onsuccess = () => {
      if (metadataRequest.result) {
        const metadata = metadataRequest.result;
        metadata.profiles = metadata.profiles.filter((p: BusinessProfile) => p.id !== id);
        metadataStore.put(metadata);
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};
