import React, { useRef } from 'react';
import { Search, Plus, Pencil, Trash2, Download, Grid3X3, Barcode, Folder as FolderIcon, ChevronRight, ExternalLink, ChevronLeft } from 'lucide-react';
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
  deleteFolder: (id: string) => Promise<void>;
  downloadCode: (code: GeneratedCode, format?: 'png' | 'svg') => void;
  startEditing: (code: GeneratedCode) => void;
  createNewFolder: () => Promise<void>;
  isCreatingFolder: boolean;
  setIsCreatingFolder: (show: boolean) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
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
  deleteFolder,
  downloadCode,
  startEditing,
  createNewFolder,
  isCreatingFolder,
  setIsCreatingFolder,
  newFolderName,
  setNewFolderName,
  setView,
  onNewQR,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollFolders = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-12 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in duration-700 pb-24 skeu-text-primary">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black skeu-text-primary tracking-tight">My QR Library</h1>
          <p className="skeu-text-muted font-medium">Quickly access and manage all your generated codes.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 skeu-text-muted group-focus-within:skeu-text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-8 py-4 skeu-search font-bold text-sm outline-none"
            />
          </div>
          <button
            onClick={onNewQR}
            className="px-8 py-4 skeu-btn text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
        </div>
      </div>

      {/* Horizontal Folders Bar */}
      <div className="flex items-center gap-2 -mx-2 px-2 relative">
        <button
          onClick={() => scrollFolders('left')}
          className="p-3 skeu-btn flex flex-shrink-0 z-10"
          style={{ padding: '14px' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 flex-1 scroll-smooth"
        >
          <button
            onClick={() => setActiveFolderId('all')}
            className={`px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider flex items-center gap-2 flex-shrink-0 transition-all ${activeFolderId === 'all' ? 'skeu-tag-active scale-105' : 'skeu-tag hover:scale-105'}`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>All ({history.length})</span>
          </button>

          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setActiveFolderId(folder.id)}
              className={`px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider flex items-center gap-2 flex-shrink-0 transition-all ${activeFolderId === folder.id ? 'skeu-tag-active scale-105' : 'skeu-tag hover:scale-105'}`}
            >
              <FolderIcon className={`w-3.5 h-3.5 ${activeFolderId === folder.id ? 'text-white' : 'text-red-400/30'}`} />
              <span>{folder.name} ({folder.count})</span>
            </button>
          ))}

          {isCreatingFolder ? (
            <div className="flex items-center gap-2 animate-in slide-in-from-left-2 flex-shrink-0">
              <input
                type="text"
                autoFocus
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="px-4 py-2.5 skeu-input text-xs font-bold w-40"
                onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
              />
              <button onClick={createNewFolder} className="p-2.5 skeu-btn">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={() => setIsCreatingFolder(false)} className="p-2.5 skeu-btn-secondary">
                <ChevronRight className="w-4 h-4 rotate-45" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider flex items-center gap-2 flex-shrink-0 skeu-tag hover:scale-105 transition-all text-red-500/60"
            >
              <Plus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
          )}
        </div>
        <button
          onClick={() => scrollFolders('right')}
          className="p-3 skeu-btn flex flex-shrink-0 z-10"
          style={{ padding: '14px' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Codes Table Header */}
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-[140px_1fr_180px_180px_200px] px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] skeu-text-muted opacity-50">
          <div>QR Code</div>
          <div>Details</div>
          <div className="text-center">Folder</div>
          <div className="text-center">Activity</div>
          <div className="text-right pr-6">Actions</div>
        </div>

        {/* Codes List */}
        <div className="space-y-4">
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
            filteredHistory.map(code => {
              const folder = folders.find(f => f.id === code.folderId);
              return (
                <div key={code.id} className="grid grid-cols-[140px_1fr_180px_180px_200px] items-center skeu-card px-10 py-8 group hover:translate-y-[-2px] transition-all duration-300 bg-white/50 backdrop-blur-sm ring-1 ring-red-100/20">
                  {/* QR Thumbnail */}
                  <div>
                    <div className="w-24 h-24 skeu-inset flex items-center justify-center relative overflow-hidden p-3 bg-white group-hover:shadow-inner transition-all duration-500">
                      {code.settings?.logoUrl ? (
                        <img src={code.settings.logoUrl} alt={code.name} className="w-full h-full object-contain relative z-10" />
                      ) : (
                        <Barcode className="skeu-text-accent w-10 h-10 opacity-20" />
                      )}
                      <div className="absolute inset-0 bg-red-100/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="font-black skeu-text-primary text-lg tracking-tight truncate px-1">{code.name}</h3>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] font-black uppercase skeu-tag-active px-2 py-0.5 rounded tracking-widest">{code.category}</span>
                      <span className="text-[10px] skeu-text-muted font-medium truncate shrink-0 max-w-[150px]">
                        {(code.shortSlug || (code as any).short_slug)
                          ? `192.168.1.208:8010/r/${code.shortSlug || (code as any).short_slug}`
                          : (code.value.startsWith('/') ? `192.168.1.208:8010${code.value}` : code.value)}
                      </span>
                    </div>
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] skeu-text-muted opacity-40 mt-1">
                      Created {new Date(code.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  {/* Folder & Quick Actions */}
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {folder ? (
                      <span className="text-[10px] font-black uppercase tracking-widest skeu-text-muted skeu-tag px-4 py-2 rounded-xl flex items-center gap-2 max-w-[140px] truncate bg-white/80">
                        <FolderIcon className="w-3.5 h-3.5 opacity-40 shrink-0 text-red-500" />
                        <span className="truncate">{folder.name}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] skeu-text-muted opacity-20 italic bg-white/50 px-4 py-2 rounded-xl">No Folder</span>
                    )}

                    <div className="flex gap-2 w-full justify-center">
                      <button
                        onClick={() => downloadCode(code, 'png')}
                        className="py-1.5 px-3 skeu-btn-secondary text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 flex-1 max-w-[70px]"
                        title="Download PNG"
                      >
                        <Download className="w-3 h-3" /> PNG
                      </button>
                      <button
                        onClick={() => downloadCode(code, 'svg')}
                        className="py-1.5 px-3 skeu-btn-secondary text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 flex-1 max-w-[70px]"
                        title="Download SVG"
                      >
                        <Download className="w-3 h-3" /> SVG
                      </button>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="text-center group-hover:scale-110 transition-transform duration-500">
                    <div className="text-3xl font-black skeu-text-primary leading-none tabular-nums tracking-tighter">{code.scans || 0}</div>
                    <div className="text-[9px] font-black skeu-text-muted uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400/40 animate-pulse" /> Total Scans
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pr-2">
                    <button
                      onClick={() => startEditing(code)}
                      className="w-12 h-12 flex items-center justify-center skeu-btn-secondary group-hover:shadow-lg transition-all"
                      title="Edit Code"
                    >
                      <Pencil className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    </button>
                    <button
                      onClick={() => downloadCode(code, 'png')}
                      className="w-12 h-12 flex items-center justify-center skeu-btn-secondary group-hover:shadow-lg transition-all"
                      title="Download"
                    >
                      <Download className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    </button>
                    <button
                      onClick={() => deleteCode(code.id)}
                      className="w-12 h-12 flex items-center justify-center skeu-btn-secondary hover:!bg-red-50 hover:!text-red-500 hover:!border-red-200 transition-all"
                      title="Delete Code"
                    >
                      <Trash2 className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
