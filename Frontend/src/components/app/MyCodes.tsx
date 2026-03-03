import React from 'react';
import { Search, Plus, MoreVertical, Pencil, Trash2, Copy, ExternalLink, Download, Eye, Grid3X3, Barcode } from 'lucide-react';
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
  setView: (view: any) => void;
  viewPdf: (fileId: string) => void;
  onNewQR: () => void;
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
  onNewQR,
}) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-12 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in duration-700 pb-24 skeu-text-primary">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black skeu-text-primary tracking-tight">My QR Library</h1>
          <p className="skeu-text-muted font-medium">Manage, organize and track your generated codes.</p>
        </div>
        <button
          onClick={onNewQR}
          className="px-8 py-4 skeu-btn text-xs uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New QR
        </button>
      </div>

      <div className="flex gap-10">
        <div className="w-72 shrink-0 space-y-6">
          <div className="skeu-card p-6 space-y-3">
            <h3 className="text-[11px] font-bold skeu-text-muted uppercase tracking-widest pl-2 mb-4">Folders</h3>
            <button
              onClick={() => setActiveFolderId('all')}
              className={`w-full px-5 py-3.5 rounded-2xl text-left font-bold text-sm flex items-center justify-between transition-all ${activeFolderId === 'all' ? 'skeu-tag-active' : 'skeu-tag'}`}
            >
              <div className="flex items-center gap-3">
                <Grid3X3 className="w-4 h-4" />
                <span>All Codes</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFolderId === 'all' ? 'bg-white/20' : 'skeu-inset text-slate-400'}`}>{history.length}</span>
            </button>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className={`w-full px-5 py-3.5 rounded-2xl text-left font-bold text-sm flex items-center justify-between transition-all ${activeFolderId === folder.id ? 'skeu-tag-active' : 'skeu-tag'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activeFolderId === folder.id ? 'bg-white' : 'bg-blue-400/30'}`} />
                  <span>{folder.name}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFolderId === folder.id ? 'bg-white/20' : 'skeu-inset text-slate-400'}`}>{folder.count}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-black/5">
              {isCreatingFolder ? (
                <div className="flex items-center gap-2 animate-in slide-in-from-top-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="flex-1 px-4 py-2 skeu-input text-xs font-bold"
                    onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
                  />
                  <button onClick={createNewFolder} className="p-2 skeu-btn">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="w-full px-5 py-3 rounded-xl text-left font-bold text-xs skeu-text-accent hover:bg-blue-50/50 flex items-center gap-3 transition-all"
                >
                  <Plus className="w-4 h-4" /> New Folder
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 skeu-text-muted group-focus-within:skeu-text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search your QR codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-8 py-5 skeu-search font-bold"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <div className="skeu-card py-24 text-center">
              <div className="w-24 h-24 skeu-inset flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 skeu-text-muted" />
              </div>
              <h3 className="text-2xl font-black skeu-text-primary mb-2 tracking-tight">No Results Found</h3>
              <p className="skeu-text-muted font-medium mb-10 max-w-sm mx-auto">We couldn't find any QR codes matching your search or filter criteria.</p>
              <button onClick={() => setView('wizard')} className="skeu-btn px-8 py-4 text-xs uppercase tracking-widest">
                <Plus className="w-4 h-4 mr-2 inline" /> Create Your First Code
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredHistory.map(code => (
                <div key={code.id} className="skeu-card p-6 group hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-20 h-20 skeu-inset flex items-center justify-center relative overflow-hidden">
                      {code.settings?.logoUrl ? (
                        <img src={code.settings.logoUrl} alt={code.name} className="w-14 h-14 object-contain relative z-10" />
                      ) : (
                        <div className="w-14 h-14 skeu-card flex items-center justify-center relative z-10">
                          <Barcode className="skeu-text-accent w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-blue-100/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditing(code)}
                        className="w-10 h-10 flex items-center justify-center skeu-btn-secondary"
                        title="Edit Code"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCode(code.id)}
                        className="w-10 h-10 flex items-center justify-center skeu-btn-danger"
                        title="Delete Code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="font-black skeu-text-primary text-lg tracking-tight truncate px-1">{code.name}</h3>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] font-black uppercase skeu-tag-active px-2 py-0.5 rounded tracking-widest">{code.category}</span>
                      <span className="text-[10px] skeu-text-muted font-medium truncate shrink-0 max-w-[150px]">{code.value}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-black/5">
                    <button
                      onClick={() => downloadCode(code, 'png')}
                      className="py-3 skeu-btn-secondary text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                    <button
                      onClick={() => downloadCode(code, 'svg')}
                      className="py-3 skeu-btn-secondary text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" /> SVG
                    </button>
                    {code.category === 'pdf' && (
                      <button
                        onClick={() => {
                          const fileIdMatch = code.value.match(/\/view\/file\/([^?]+)/);
                          if (fileIdMatch) {
                            viewPdf(fileIdMatch[1]);
                          } else {
                            window.open(code.value, '_blank');
                          }
                        }}
                        className="col-span-2 py-3 skeu-btn text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                      >
                        <Eye className="w-3.5 h-3.5" /> View PDF Document
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
