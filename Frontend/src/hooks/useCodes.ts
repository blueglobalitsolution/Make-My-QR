import React, { useState } from 'react';
import { GeneratedCode, Folder } from '../../types';
import { getCodes, deleteCode as apiDeleteCode } from '../api/qrcodes';
import { getFolders, createFolder as apiCreateFolder, deleteFolder as apiDeleteFolder } from '../api/folders';

export interface UseCodesReturn {
  history: GeneratedCode[];
  setHistory: React.Dispatch<React.SetStateAction<GeneratedCode[]>>;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  activeFolderId: string | 'all';
  setActiveFolderId: React.Dispatch<React.SetStateAction<string | 'all'>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredHistory: GeneratedCode[];
  deleteCode: (id: string) => Promise<void>;
  downloadCode: (code: GeneratedCode, format?: 'png' | 'svg') => Promise<void>;
  startEditing: (code: GeneratedCode) => void;
  createNewFolder: () => Promise<void>;
  isCreatingFolder: boolean;
  setIsCreatingFolder: React.Dispatch<React.SetStateAction<boolean>>;
  newFolderName: string;
  setNewFolderName: React.Dispatch<React.SetStateAction<string>>;
}

export const useCodes = (
  setWizard: React.Dispatch<React.SetStateAction<any>>,
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>,
  setView: React.Dispatch<React.SetStateAction<any>>,
  wizard: any,
  setPhonePreviewMode: React.Dispatch<React.SetStateAction<'ui' | 'qr'>>,
  setWhatsappPhone: React.Dispatch<React.SetStateAction<string>>,
  setWhatsappMessage: React.Dispatch<React.SetStateAction<string>>
): UseCodesReturn => {
  const [history, setHistory] = useState<GeneratedCode[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'f1', name: 'Marketing Campaigns', count: 0, createdAt: new Date().toISOString() },
    { id: 'f2', name: 'Social Media', count: 0, createdAt: new Date().toISOString() },
  ]);
  const [activeFolderId, setActiveFolderId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesFolder = activeFolderId === 'all' || item.folderId === activeFolderId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const deleteCode = async (id: string) => {
    try {
      await apiDeleteCode(id);
      const codeToDelete = history.find(h => h.id === id);
      const updatedHistory = history.filter(h => h.id !== id);
      setHistory(updatedHistory);

      if (codeToDelete?.folderId) {
        const updatedFolders = folders.map(f =>
          f.id === codeToDelete.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f
        );
        setFolders(updatedFolders);
      }
    } catch (err) {
      alert("Failed to delete QR code.");
    }
  };

  const downloadCode = async (code: GeneratedCode, format: 'png' | 'svg' = 'png') => {
    // Note: Most downloads now handled by App.tsx passed-down downloadCode
    console.log("Hook downloadCode triggered (fallback only)");
  };

  const startEditing = (code: GeneratedCode) => {
    setEditingId(code.id);

    let whatsappPhoneEdit = '84606 87490';
    let whatsappMessageEdit = 'Hello! I scanned your QR code.';

    if (code.category === 'whatsapp') {
      try {
        const url = new URL(code.value);
        whatsappPhoneEdit = url.pathname.replace('/', '');
        whatsappMessageEdit = url.searchParams.get('text') || '';
      } catch (e) { /* ignore */ }
    }

    setWhatsappPhone(whatsappPhoneEdit);
    setWhatsappMessage(whatsappMessageEdit);

    setWizard({
      step: 2,
      mode: code.type,
      type: code.category,
      value: (code.category === 'whatsapp' || code.category === 'pdf' || code.category === 'business') ? '' : code.value,
      name: code.name,
      isPasswordActive: false,
      folderId: code.folderId,
      config: code.settings,
      business: code.settings.business || wizard.business
    });
    setPhonePreviewMode('ui');
    setView('wizard');
  };

  const createNewFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folderData = await apiCreateFolder(newFolderName.trim());
      const newFolder: Folder = {
        ...folderData,
        id: folderData.id.toString(),
        count: 0
      };
      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      setWizard({ ...wizard, folderId: newFolder.id });
      setNewFolderName('');
      setIsCreatingFolder(false);
    } catch (err) {
      alert("Failed to create folder.");
    }
  };

  return {
    history,
    setHistory,
    folders,
    setFolders,
    activeFolderId,
    setActiveFolderId,
    searchQuery,
    setSearchQuery,
    filteredHistory,
    deleteCode,
    downloadCode,
    startEditing,
    createNewFolder,
    isCreatingFolder,
    setIsCreatingFolder,
    newFolderName,
    setNewFolderName,
  };
};
