import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Download, Eye, FileText, Loader2, Grid3X3, Upload, QrCode, Folder as FolderIcon } from 'lucide-react';
import { getAllFiles, deleteFile, saveFile } from '../../services/fileStorage';
import { FileRecord, Folder } from '../../../types';

interface MyFilesProps {
    folders: Folder[];
    activeFolderId: string | 'all';
    setActiveFolderId: (id: string | 'all') => void;
    createNewFolder: () => Promise<void>;
    isCreatingFolder: boolean;
    setIsCreatingFolder: (show: boolean) => void;
    newFolderName: string;
    setNewFolderName: (name: string) => void;
    setView: (view: any) => void;
    viewPdf: (fileId: string) => void;
    startQrFromAsset?: (file: FileRecord) => void;
}

export const MyFiles: React.FC<MyFilesProps> = ({
    folders,
    activeFolderId,
    setActiveFolderId,
    createNewFolder,
    isCreatingFolder,
    setIsCreatingFolder,
    newFolderName,
    setNewFolderName,
    setView,
    viewPdf,
    startQrFromAsset
}) => {
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const allFiles = await getAllFiles();
            setFiles(allFiles);
        } catch (err) {
            console.error("Failed to fetch files", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this file? This will break any QR codes pointing to it.")) return;
        try {
            await deleteFile(id);
            setFiles(files.filter(f => f.id !== id));
        } catch (err) {
            alert("Failed to delete file.");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const folderId = activeFolderId !== 'all' ? parseInt(activeFolderId) : undefined;
            const newFile = await saveFile(file, folderId);
            setFiles([newFile, ...files]);
            alert("File uploaded successfully!");
        } catch (err) {
            alert("Failed to upload file.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFolder = activeFolderId === 'all' || file.folderId === activeFolderId;
        return matchesSearch && matchesFolder;
    });

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto scrollbar-hide p-12 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700 pb-24 text-slate-800">
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="skeu-page-title">Assets Library</h1>
                    <p className="skeu-page-subtitle">Manage and organize your uploaded documents and media.</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,image/*"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-8 py-4 bg-[#dc2626] text-white rounded-2xl font-bold text-xs capitalize  flex items-center gap-2 hover:bg-[#991b1b] shadow-xl shadow-red-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {isUploading ? 'Uploading...' : 'Upload New Asset'}
                    </button>
                </div>
            </div>

            <div className="flex gap-10">
                {/* Sidebar */}
                <div className="w-72 shrink-0 space-y-6">
                    <div className="skeu-card p-6 space-y-3">
                        <h3 className="text-[11px] font-bold text-slate-400 capitalize  pl-2 mb-4">Folders</h3>
                        <button
                            onClick={() => setActiveFolderId('all')}
                            className={`w-full px-5 py-3.5 rounded-2xl text-left font-bold text-sm flex items-center justify-between transition-all ${activeFolderId === 'all' ? 'bg-[#dc2626] text-white shadow-lg shadow-red-500/20' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Grid3X3 className={`w-4 h-4 ${activeFolderId === 'all' ? 'text-white' : 'text-slate-400'}`} />
                                <span>All Assets</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFolderId === 'all' ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{files.length}</span>
                        </button>
                        {folders.map(folder => (
                            <button
                                key={folder.id}
                                onClick={() => setActiveFolderId(folder.id)}
                                className={`w-full px-5 py-3.5 rounded-2xl text-left font-bold text-sm flex items-center justify-between transition-all ${activeFolderId === folder.id ? 'bg-[#dc2626] text-white shadow-lg shadow-red-500/20' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FolderIcon className={`w-3.5 h-3.5 ${activeFolderId === folder.id ? 'text-white' : 'text-blue-400/30'}`} />
                                    <span>{folder.name}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFolderId === folder.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{folder.count}</span>
                            </button>
                        ))}

                        <div className="pt-4 mt-4 border-t border-slate-50">
                            {isCreatingFolder ? (
                                <div className="flex items-center gap-2 animate-in slide-in-from-top-2">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Folder name..."
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#dc2626]"
                                        onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
                                    />
                                    <button onClick={createNewFolder} className="p-2 bg-[#dc2626] text-white rounded-xl shadow-lg shadow-red-500/20">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsCreatingFolder(true)}
                                    className="w-full px-5 py-3 rounded-xl text-left font-bold text-xs text-[#dc2626] hover:bg-red-50/50 flex items-center gap-3 transition-all"
                                >
                                    <Plus className="w-4 h-4" /> New Folder
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-8">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#dc2626] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-8 py-5 bg-white border-2 border-slate-100/50 rounded-[1.5rem] font-bold text-slate-800 placeholder:text-slate-300 focus:border-[#dc2626] focus:ring-4 focus:ring-red-100 outline-none transition-all shadow-sm"
                        />
                    </div>

                    {filteredFiles.length === 0 ? (
                        <div className="skeu-card py-24 text-center">
                            <div className="w-24 h-24 bg-red-50 text-[#dc2626]/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2 ">No Assets Found</h3>
                            <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">You haven't uploaded any files yet, or no files match your search.</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-4 bg-[#dc2626] text-white rounded-2xl font-bold text-xs capitalize  hover:bg-[#991b1b] shadow-xl shadow-red-500/20 transition-all transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-4 h-4 mr-2 inline" /> Upload Your First Asset
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredFiles.map(file => (
                                <div key={file.id} className="skeu-card p-6 group hover:scale-[1.02] transition-all duration-300">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-white relative overflow-hidden">
                                            {file.type === 'image' ? (
                                                <img src={file.filePath} alt={file.name} className="w-full h-full object-cover relative z-10" />
                                            ) : (
                                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center relative z-10">
                                                    <FileText className="text-red-500 w-8 h-8 opacity-60" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-red-100/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="Delete Asset"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        <h3 className="font-black text-slate-800 text-lg  truncate px-1">{file.name}</h3>
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-[9px] font-black capitalize text-[#dc2626] bg-red-50 px-2 py-0.5 rounded ">{file.type === 'pdf' ? 'PDF Document' : 'Image'}</span>
                                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                                        <a
                                            href={file.filePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-3 bg-white border border-slate-100 hover:border-[#dc2626]/30 rounded-xl text-[10px] font-black capitalize  text-slate-600 hover:text-[#dc2626] transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Download
                                        </a>
                                        {file.type === 'pdf' ? (
                                            <button
                                                onClick={() => viewPdf(file.id)}
                                                className="py-3 bg-white border border-slate-100 hover:border-[#dc2626]/30 rounded-xl text-[10px] font-black capitalize  text-slate-600 hover:text-[#dc2626] transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </button>
                                        ) : (
                                            <a
                                                href={file.filePath}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="py-3 bg-white border border-slate-100 hover:border-[#dc2626]/30 rounded-xl text-[10px] font-black capitalize  text-slate-600 hover:text-[#dc2626] transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Open
                                            </a>
                                        )}
                                        <button
                                            onClick={() => startQrFromAsset?.(file)}
                                            className="col-span-2 py-3 bg-[#dc2626] text-white rounded-xl text-[10px] font-black capitalize  transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
                                        >
                                            <QrCode className="w-3.5 h-3.5" /> Generate QR Code
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
