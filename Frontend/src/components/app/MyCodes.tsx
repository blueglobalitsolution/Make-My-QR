import React from 'react';
import { Search, Plus, MoreVertical, Pencil, Trash2, Copy, ExternalLink, Download, Eye } from 'lucide-react';
import { GeneratedCode, Folder } from '../../../types';

interface MyCodesProps {
  history: GeneratedCode[];
  folders: Folder[];
  activeFolderId: string | 'all';
  setActiveFolderId: (id: string | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredHistory: GeneratedCode[];
  deleteCode: (id: string) => Promise<void>;
  downloadCode: (code: GeneratedCode, format?: 'png' | 'svg') => void;
  startEditing: (code: GeneratedCode) => void;
  createNewFolder: () => Promise<void>;
  isCreatingFolder: boolean;
  setIsCreatingFolder: (show: boolean) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  setView: (view: any) => void;
  viewPdf: (fileId: string) => void;
}

export const MyCodes: React.FC<MyCodesProps> = ({
  history,
  folders,
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
  setView,
  viewPdf,
}) => {
  return (
    <div className="p-10 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black skeu-text-primary tracking-tight">My QR Codes</h1>
          <p className="mt-1 text-sm skeu-text-secondary font-medium">Manage and organize your QR codes</p>
        </div>
        <button
          onClick={() => setView('wizard')}
          className="skeu-btn px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <button
              onClick={() => setActiveFolderId('all')}
              className={`w-full px-4 py-2.5 rounded-xl text-left font-medium text-sm flex items-center justify-between ${activeFolderId === 'all' ? 'bg-[#156295] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>All Codes</span>
              <span className="text-xs opacity-70">{history.length}</span>
            </button>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className={`w-full px-4 py-2.5 rounded-xl text-left font-medium text-sm flex items-center justify-between ${activeFolderId === folder.id ? 'bg-[#156295] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span>{folder.name}</span>
                <span className="text-xs opacity-70">{folder.count}</span>
              </button>
            ))}
            {isCreatingFolder ? (
              <div className="flex items-center gap-2 p-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#156295]"
                  onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
                />
                <button onClick={createNewFolder} className="p-1.5 bg-[#156295] text-white rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="w-full px-4 py-2.5 rounded-xl text-left font-medium text-sm text-slate-400 hover:text-[#156295] hover:bg-slate-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Folder
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your QR codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:border-[#156295] focus:ring-2 focus:ring-[#156295]/10 outline-none transition-all"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No QR codes found</h3>
              <p className="text-sm text-slate-500 mb-6">Create your first QR code to get started</p>
              <button onClick={() => setView('wizard')} className="skeu-btn px-6 py-3 rounded-xl inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create QR Code
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHistory.map(code => (
                <div key={code.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center">
                      {code.settings?.logoUrl ? (
                        <img src={code.settings.logoUrl} alt={code.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 bg-[#156295]/10 rounded-lg flex items-center justify-center">
                          <span className="text-[#156295] font-black text-xs">QR</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(code)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#156295]"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCode(code.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 truncate">{code.name}</h3>
                  <p className="text-xs text-slate-500 truncate mb-3">{code.value}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCode(code, 'png')}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                    <button
                      onClick={() => downloadCode(code, 'svg')}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> SVG
                    </button>
                    {code.category === 'pdf' && code.value.includes('view/file/') && (
                      <button
                        onClick={() => viewPdf(code.value.split('view/file/')[1].split('?')[0])}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    )}
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
