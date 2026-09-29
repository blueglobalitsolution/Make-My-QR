import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Pencil, Trash2, Download, Grid3X3, Barcode, Folder as FolderIcon, ChevronRight, ExternalLink, ChevronLeft, X, Lock, Share2, RotateCcw } from 'lucide-react';
import { GeneratedCode, Folder } from '../../../types';
import { StyledQRCode } from '../../../components/StyledQRCode';
import { QRFrameWrapper } from '../../../components/QRFrameWrapper';

interface MyCodesProps {
  history: GeneratedCode[];
  folders: Folder[];
  activeFolderId: string | 'all';
  setActiveFolderId: (id: string | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredHistory: GeneratedCode[];
  deleteCode: (id: string) => Promise<void>;
  resetAccess: (id: string) => void;
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
  resetAccess,
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
  const captureRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [downloadingCode, setDownloadingCode] = useState<GeneratedCode | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');
  const [previewCode, setPreviewCode] = useState<GeneratedCode | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounced search logic (#4)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 400); // 400ms delay
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync folder counts reliably (#1)
  const folderCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: history.length, general: 0 };
    history.forEach(code => {
      if (code.folderId && folders.some(f => f.id === code.folderId)) {
        counts[code.folderId] = (counts[code.folderId] || 0) + 1;
      } else {
        counts.general++;
      }
    });
    return counts;
  }, [history, folders]);

  // Trigger download when capturing area is ready
  useEffect(() => {
    if (downloadingCode && captureRef.current) {
      // Wait for rendering to settle
      const timer = setTimeout(async () => {
        try {
          await downloadCode(downloadingCode, downloadFormat, captureRef.current);
        } catch (err) {
          console.error("Capture failed", err);
        } finally {
          setDownloadingCode(null);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [downloadingCode, downloadFormat, downloadCode]);

  const getQRValue = (code: GeneratedCode) => {
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || window.location.origin;
    const slug = code.shortSlug || (code as any).short_slug;
    let qrValue = slug ? `${backendUrl}/r/${slug}` : code.value;
    if (qrValue?.startsWith('/')) qrValue = backendUrl + qrValue;
    return qrValue || 'https://makemyqrcode.com/';
  };

  const getQROptions = (code: GeneratedCode, size: number = 1000) => {
    return {
      width: size,
      height: size,
      data: getQRValue(code),
      dotsOptions: {
        color: code.settings?.fgColor || '#000000',
        type: code.settings?.pattern || 'square'
      },
      backgroundOptions: { color: code.settings?.bgColor || '#ffffff' },
      cornersSquareOptions: {
        type: code.settings?.cornersSquareType || 'square',
        color: code.settings?.cornersSquareColor || code.settings?.fgColor || '#000000',
      },
      cornersDotOptions: {
        type: code.settings?.cornersDotType || 'square',
        color: code.settings?.cornersDotColor || code.settings?.fgColor || '#000000',
      },
      image: code.settings?.logoUrl || undefined,
      imageOptions: { crossOrigin: "anonymous", margin: 10 }
    };
  };

  const CodeThumbnail = React.memo(({ code }: { code: GeneratedCode }) => {
    try {
      const options = React.useMemo(() => getQROptions(code, 300), [code]);

      return (
        <div className="absolute inset-0 flex items-center justify-center scale-[0.55] origin-center pointer-events-none">
          <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center">
            <QRFrameWrapper frame={code.settings?.frame || 'none'}>
              <StyledQRCode options={options} size={150} />
            </QRFrameWrapper>
          </div>
        </div>
      );
    } catch (error) {
      console.error("QR Render Error", error);
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-[10px] font-bold text-slate-400">
          Render Error
        </div>
      );
    }
  });

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
    <div className="flex-1 w-full space-y-4 sm:space-y-6 animate-in fade-in duration-500 py-4 sm:py-6 lg:py-10 px-3 sm:px-6 lg:px-10 pb-32 lg:pb-16 skeu-text-primary font-lato">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-0.5 sm:space-y-1">
          <h1 className="skeu-page-title text-2xl sm:text-3xl font-black">My QR Library</h1>
          <p className="skeu-page-subtitle text-xs sm:text-sm">Quickly access and manage all your generated codes.</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:w-72 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 skeu-text-muted group-focus-within:skeu-text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3.5 skeu-search font-medium text-xs sm:text-[14px] outline-none hover:border-[#3eb5a9] focus:border-[#3eb5a9] transition-colors rounded-xl"
            />
          </div>
          <button
            onClick={onNewQR}
            className="hidden md:flex px-5 py-3.5 skeu-btn text-xs sm:text-[14px] font-medium capitalize items-center gap-2 rounded-xl whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
        </div>
      </div>

      {/* Horizontal Folders Bar */}
      <div className="flex items-center gap-1 sm:gap-2 relative w-full">
        <button
          onClick={() => scrollFolders('left')}
          className="hidden sm:flex flex-shrink-0 z-10 text-red-500 hover:text-[#3eb5a9] transition-colors bg-transparent border-0 outline-none pr-2 p-1"
          aria-label="Scroll folders left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-1.5 flex-1 scroll-smooth touch-pan-x"
        >
          <button
            onClick={() => setActiveFolderId('all')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-[15px] font-bold text-xs sm:text-[14px] capitalize flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all font-poppins group/folder-tab whitespace-nowrap ${activeFolderId === 'all' ? 'skeu-tag-active' : 'skeu-tag'}`}
          >
            <Grid3X3 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${activeFolderId === 'all' ? 'text-white' : 'text-red-400/40 group-hover/folder-tab:text-white'}`} />
            <span>All ({folderCounts.all})</span>
          </button>

          <button
            onClick={() => setActiveFolderId('general')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-[15px] font-bold text-xs sm:text-[14px] capitalize flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all font-poppins group/folder-tab whitespace-nowrap ${activeFolderId === 'general' ? 'skeu-tag-active' : 'skeu-tag'}`}
          >
            <FolderIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${activeFolderId === 'general' ? 'text-white' : 'text-red-400/40 group-hover/folder-tab:text-white'}`} />
            <span>General ({folderCounts.general})</span>
          </button>

          {folders.map(folder => (
            <div key={folder.id} className="relative group/folder-tab flex-shrink-0">
              <button
                onClick={() => setActiveFolderId(folder.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-[15px] font-bold text-xs sm:text-[14px] capitalize flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0 transition-all font-poppins pr-9 sm:pr-12 whitespace-nowrap group/folder-tab ${activeFolderId === folder.id ? 'skeu-tag-active' : 'skeu-tag'}`}
              >
                <FolderIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${activeFolderId === folder.id ? 'text-white' : 'text-red-400/40 group-hover/folder-tab:text-white'}`} />
                <span>{folder.name} ({folderCounts[folder.id] || 0})</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder.id);
                }}
                className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 rounded-lg group-hover/folder-tab:opacity-100 transition-all hover:bg-black/5 ${activeFolderId === folder.id ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-red-400/50 group-hover/folder-tab:text-white/60 hover:!text-white hover:bg-red-50'}`}
                title="Delete Folder"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ))}

          {isCreatingFolder ? (
            <div className="flex items-center gap-1.5 animate-in slide-in-from-left-2 flex-shrink-0">
              <input
                type="text"
                autoFocus
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="px-3 py-2 sm:px-4 sm:py-2.5 skeu-input text-xs font-bold w-32 sm:w-40 rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && createNewFolder()}
              />
              <button onClick={createNewFolder} className="p-2 sm:p-2.5 skeu-btn rounded-xl">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button onClick={() => setIsCreatingFolder(false)} className="p-2 sm:p-2.5 skeu-btn-secondary rounded-xl">
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-[15px] font-bold text-xs sm:text-[14px] capitalize flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0 skeu-tag transition-all text-red-500/60 font-poppins whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>New Folder</span>
            </button>
          )}
        </div>
        <button
          onClick={() => scrollFolders('right')}
          className="hidden sm:flex flex-shrink-0 z-10 text-red-500 hover:text-[#3eb5a9] transition-colors bg-transparent border-0 outline-none pl-2 p-1"
          aria-label="Scroll folders right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* PC View: Table */}
      <div className="hidden lg:block w-full overflow-x-auto skeu-scroll-x">
        <div className="grid grid-cols-[160px_1.2fr_1fr_1fr_1.2fr_1fr_140px] px-8 py-4 gap-6 text-[10px] font-black capitalize tracking-[0.2em] skeu-text-muted opacity-50">
          <div>QR Code</div>
          <div>Details</div>
          <div className="text-center">Created</div>
          <div className="text-center">Location</div>
          <div className="text-center">Export</div>
          <div className="text-center">Activity</div>
          <div className="text-right pr-6">Actions</div>
        </div>

        {/* Codes List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="skeu-card py-24 text-center shadow-2xl ring-1 ring-black/5">
              <div className="w-24 h-24 skeu-inset flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 skeu-text-muted" />
              </div>
              <h3 className="text-2xl font-black skeu-text-primary mb-2 ">No Results Found</h3>
              <p className="skeu-text-muted font-medium mb-10 max-w-sm mx-auto">We couldn't find any QR codes matching your search or filter criteria.</p>

            </div>
          ) : (
            filteredHistory.map(code => {
              const folder = folders.find(f => f.id === code.folderId);
              return (
                <div key={code.id} className={`grid grid-cols-[160px_1.2fr_1fr_1fr_1.2fr_1fr_140px] items-center skeu-card rounded-[5px] px-8 py-4 gap-6 group hover:translate-y-[-1px] transition-all duration-300 bg-white/50 backdrop-blur-sm ring-1 ring-red-100/20 ${code.isOptimistic ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* QR Thumbnail */}
                  <div>
                    <button
                      onClick={() => setPreviewCode(code)}
                      className="w-20 h-20 skeu-inset flex items-center justify-center rounded-[5px] relative overflow-hidden bg-white group-hover:shadow-inner transition-all duration-500 cursor-zoom-in group/thumb"
                      title="Click to preview"
                    >
                      <CodeThumbnail code={code} />
                      <div className="absolute inset-0 bg-red-100/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/thumb:bg-black/5 transition-all opacity-0 group-hover/thumb:opacity-100">
                        <Search className="w-5 h-5 text-red-500/50" />
                      </div>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="skeu-text-primary text-lg truncate px-1" style={{ fontWeight: 700 }}>{code.name}</h3>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-black capitalize bg-[#3eb5a9] text-white px-2.5 py-1 rounded tracking-wider shadow-sm">{code.category}</span>
                      {code.show_preview === false && (
                        <span className="text-[11px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded tracking-wider shadow-sm">Direct</span>
                      )}
                      {code.is_protected && (
                        <span className="text-[11px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded tracking-wider shadow-sm flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Protected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Created Date Column */}
                  <div className="text-center">
                    <p className="text-[15px] font-bold" style={{ color: '#444444' }}>
                      {new Date(code.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  {/* Folder Location */}
                  <div className="flex flex-col items-center">
                    {folder ? (
                      <span className="text-[12px] font-black capitalize tracking-wide text-red-600 bg-red-50 border border-red-100/30 px-5 py-2 rounded-full flex items-center gap-2 max-w-[160px] shadow-sm transition-transform group-hover:scale-105">
                        <FolderIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </span>
                    ) : (
                      <span className="text-[12px] font-black capitalize tracking-wide text-gray-400 bg-gray-50 border border-gray-100/50 px-5 py-2 rounded-full flex items-center gap-2 max-w-[160px] shadow-sm">
                        <FolderIcon className="w-4 h-4 shrink-0" />
                        <span>No Folder</span>
                      </span>
                    )}
                  </div>

                  {/* Quick Export */}
                  <div className="flex flex-row gap-2 w-full px-2">
                    <button
                      onClick={() => {
                        setDownloadFormat('png');
                        setDownloadingCode(code);
                      }}
                      className="py-1.5 px-3 skeu-btn-secondary rounded-[5px] text-[12px] font-black font-medium capitalize tracking-wider transition-all flex items-center justify-center gap-1 flex-1"
                      title="Download PNG"
                    >
                      <Download className="w-3 h-3" /> PNG
                    </button>
                    <button
                      onClick={() => {
                        setDownloadFormat('svg');
                        setDownloadingCode(code);
                      }}
                      className="py-1.5 px-3 skeu-btn-secondary rounded-[5px] text-[12px] font-black font-medium capitalize tracking-wider transition-all flex items-center justify-center gap-1 flex-1"
                      title="Download SVG"
                    >
                      <Download className="w-3 h-3" /> SVG
                    </button>
                  </div>

                  {/* Activity */}
                  <div className="text-center group-hover:scale-105 transition-transform duration-500">
                    <div className="text-2xl font-black skeu-text-primary leading-none tabular-nums ">{code.scans || 0}</div>
                    <div className="text-[8px] font-black skeu-text-muted capitalize  mt-1.5 flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/40 animate-pulse" /> Scans
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pr-1">
                    <button
                      onClick={() => {
                        const baseUrl = window.location.origin;
                        const slug = code.shortSlug || (code as any).short_slug;
                        const isFile = code.category === 'file' || code.category === 'pdf';
                        const shareUrl = `${baseUrl}/view/${isFile ? 'file/' : ''}${slug}`;
                        navigator.clipboard.writeText(shareUrl);
                        setToast('Link copied to clipboard!');
                      }}
                      className="w-9 h-9 flex items-center justify-center skeu-btn-secondary rounded-[5px] group-hover:shadow-md transition-all"
                      title="Copy Share Link"
                    >
                      <Share2 className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </button>
                    <button
                      onClick={() => startEditing(code)}
                      className="w-9 h-9 flex items-center justify-center skeu-btn-secondary rounded-[5px] group-hover:shadow-md transition-all"
                      title="Edit Code"
                    >
                      <Pencil className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </button>
                    {code.max_access_count && (
                      <button
                        onClick={() => resetAccess(code.id)}
                        className="w-9 h-9 flex items-center justify-center skeu-btn-secondary rounded-[5px] hover:!bg-amber-500 hover:!text-white hover:!border-amber-500 transition-all"
                        title="Reset Access Count"
                      >
                        <RotateCcw className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteCode(code.id)}
                      className="w-9 h-9 flex items-center justify-center skeu-btn-secondary rounded-[5px] hover:!bg-[#3eb5a9] hover:!text-white hover:!border-[#3eb5a9] transition-all"
                      title="Delete Code"
                    >
                      <Trash2 className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile View: Cards (Only visible on Phone) */}
      <div className="lg:hidden space-y-4 sm:space-y-6">
        {filteredHistory.length === 0 ? (
          <div className="skeu-card py-12 sm:py-16 px-4 text-center shadow-md rounded-2xl bg-white">
            <div className="w-16 h-16 sm:w-20 sm:h-20 skeu-inset flex items-center justify-center mx-auto mb-4 rounded-2xl">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 skeu-text-muted" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black skeu-text-primary mb-1.5">No Results Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
              We couldn't find any QR codes matching your search or filter criteria.
            </p>
          </div>
        ) : (
          filteredHistory.map(code => {
            const folder = folders.find(f => f.id === code.folderId);
            return (
              <div key={code.id} className="skeu-card p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white/70 backdrop-blur-sm relative overflow-hidden ring-1 ring-red-100/20 rounded-2xl">
                <div className="flex gap-3.5 sm:gap-5">
                  <button onClick={() => setPreviewCode(code)} className="w-20 h-20 sm:w-24 sm:h-24 skeu-inset flex items-center justify-center bg-white rounded-xl shrink-0 overflow-hidden relative group cursor-zoom-in">
                    <CodeThumbnail code={code} />
                    <div className="absolute inset-0 bg-black/0 active:bg-black/5 transition-all flex items-center justify-center opacity-0 active:opacity-100">
                      <Search className="w-5 h-5 text-red-500/50" />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="space-y-0.5">
                      <h3 className="skeu-text-primary text-base sm:text-lg font-black truncate">{code.name}</h3>
                      <div className="text-xs sm:text-sm font-bold text-[#444444]">{new Date(code.createdAt).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-[11px] font-black capitalize bg-[#3eb5a9] text-white px-2.5 py-1 rounded-md shadow-sm">{code.category}</span>
                      {code.is_protected && (
                        <span className="text-[10px] sm:text-[11px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Protected
                        </span>
                      )}
                      {folder && (
                        <span className="text-[10px] sm:text-[11px] font-black capitalize text-red-600 bg-red-50 border border-red-100/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                          <FolderIcon className="w-3 h-3" /> {folder.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="skeu-inset p-3 sm:p-4 flex flex-col items-center justify-center gap-0.5 rounded-xl">
                    <div className="text-xl sm:text-2xl font-black skeu-text-primary leading-none">{code.scans || 0}</div>
                    <div className="text-[8px] sm:text-[9px] font-black skeu-text-muted uppercase tracking-wider">Total Scans</div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <button
                      onClick={() => downloadCode(code, 'png')}
                      className="flex-1 py-2 sm:py-3 skeu-btn-secondary rounded-xl text-[11px] font-black capitalize flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                    <button
                      onClick={() => downloadCode(code, 'svg')}
                      className="flex-1 py-2 sm:py-3 skeu-btn-secondary rounded-xl text-[11px] font-black capitalize flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> SVG
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-black/5">
                  <button
                    onClick={() => {
                      const baseUrl = window.location.origin;
                      const slug = code.shortSlug || (code as any).short_slug;
                      const isFile = code.category === 'file' || code.category === 'pdf';
                      const shareUrl = `${baseUrl}/view/${isFile ? 'file/' : ''}${slug}`;
                      navigator.clipboard.writeText(shareUrl);
                      setToast('Link copied to clipboard!');
                    }}
                    className="py-2.5 sm:py-3.5 skeu-btn-secondary rounded-xl text-xs font-black capitalize flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button onClick={() => startEditing(code)} className="py-2.5 sm:py-3.5 skeu-btn-secondary rounded-xl text-xs font-black capitalize flex items-center justify-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => deleteCode(code.id)} className="py-2.5 sm:py-3.5 skeu-btn-secondary rounded-xl !text-red-500 hover:!bg-[#3eb5a9] hover:!text-white transition-all text-xs font-black capitalize flex items-center justify-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
                {code.max_access_count && (
                  <button
                    onClick={() => resetAccess(code.id)}
                    className="w-full mt-2 py-2.5 skeu-btn-secondary rounded-xl text-xs font-black capitalize flex items-center justify-center gap-2 hover:!bg-amber-500 hover:!text-white hover:!border-amber-500 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Access
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* QR Preview Modal */}
      {
        previewCode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              onClick={() => setPreviewCode(null)}
            />

            <div className="relative w-full max-w-md sm:max-w-lg skeu-card p-6 sm:p-8 md:p-10 bg-white animate-in zoom-in-95 duration-300 shadow-2xl space-y-6 rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setPreviewCode(null)}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 text-center pt-2">
                <h2 className="text-xl sm:text-2xl font-black skeu-text-primary">{previewCode.name}</h2>
                <p className="font-bold text-xs sm:text-sm text-[#444444]">
                  Created on {new Date(previewCode.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="skeu-inset p-6 sm:p-8 flex items-center justify-center bg-white aspect-square relative overflow-hidden rounded-2xl">
                <div className="scale-100 sm:scale-110">
                  <QRFrameWrapper frame={previewCode.settings?.frame || 'none'}>
                    <StyledQRCode
                      options={{
                        data: getQRValue(previewCode),
                        dotsOptions: {
                          color: previewCode.settings?.fgColor || '#000000',
                          type: previewCode.settings?.pattern || 'square'
                        },
                        backgroundOptions: { color: previewCode.settings?.bgColor || '#ffffff' },
                        cornersSquareOptions: {
                          type: previewCode.settings?.cornersSquareType || 'square',
                          color: previewCode.settings?.cornersSquareColor || previewCode.settings?.fgColor || '#000000',
                        },
                        cornersDotOptions: {
                          type: previewCode.settings?.cornersDotType || 'square',
                          color: previewCode.settings?.cornersDotColor || previewCode.settings?.fgColor || '#000000',
                        },
                        image: previewCode.settings?.logoUrl || undefined,
                        imageOptions: { crossOrigin: "anonymous", margin: 5 }
                      }}
                      size={300}
                    />
                  </QRFrameWrapper>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setDownloadFormat('png');
                    setDownloadingCode(previewCode);
                    setPreviewCode(null);
                  }}
                  className="flex-1 skeu-btn py-4 text-xs capitalize  flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button
                  onClick={() => {
                    startEditing(previewCode);
                    setPreviewCode(null);
                  }}
                  className="flex-1 skeu-btn-secondary py-4 text-xs capitalize  flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit Code
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Hidden Capture Area */}
      <div
        ref={captureRef}
        className="fixed top-0 pointer-events-none bg-white flex items-center justify-center"
        style={{ left: '-2000px', width: '2000px', height: '2000px', zIndex: -999, visibility: 'visible' }}
      >
        {downloadingCode && (
          <div className="p-4 bg-white inline-block">
            <QRFrameWrapper frame={downloadingCode.settings?.frame || 'none'}>
              <StyledQRCode
                options={getQROptions(downloadingCode, 1000)}
                size={1000}
              />
            </QRFrameWrapper>
          </div>
        )}
      </div>

      {/* Modern Toast Notification */}
      {toast && createPortal(
        <div className="fixed bottom-8 right-8 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div className="skeu-card px-6 py-4 rounded-[5px] flex items-center gap-3 shadow-2xl bg-white ring-1 ring-black/5 bg-gradient-to-tr from-white to-red-50/30">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-sm font-black skeu-text-primary uppercase tracking-wider">{toast}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
