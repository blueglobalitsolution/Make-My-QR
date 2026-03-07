import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Pencil, Trash2, Download, Grid3X3, Barcode, Folder as FolderIcon, ChevronRight, ExternalLink, ChevronLeft, X } from 'lucide-react';
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
  const captureRef = useRef<HTMLDivElement>(null);
  const [downloadingCode, setDownloadingCode] = useState<GeneratedCode | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');
  const [previewCode, setPreviewCode] = useState<GeneratedCode | null>(null);

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
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://192.168.1.114:8010';
    const slug = code.shortSlug || (code as any).short_slug;
    let qrValue = slug ? `${backendUrl}/r/${slug}` : code.value;
    if (qrValue?.startsWith('/')) qrValue = backendUrl + qrValue;
    return qrValue || 'https://makemyqr.com';
  };

  const getQROptions = (code: GeneratedCode) => {
    return {
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
      imageOptions: { crossOrigin: "anonymous", margin: 5 }
    };
  };

  const CodeThumbnail = React.memo(({ code }: { code: GeneratedCode }) => {
    const options = React.useMemo(() => getQROptions(code), [code]);

    return (
      <div className="absolute inset-0 flex items-center justify-center scale-[0.55] origin-center pointer-events-none">
        <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center">
          <QRFrameWrapper frame={code.settings?.frame || 'none'}>
            <StyledQRCode options={options} size={150} />
          </QRFrameWrapper>
        </div>
      </div>
    );
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
          className="flex flex-shrink-0 z-10 text-red-500 hover:text-red-700 transition-colors bg-transparent border-0 outline-none pr-4"
        >
          <ChevronLeft className="w-8 h-8" />
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
          className="flex flex-shrink-0 z-10 text-red-500 hover:text-red-700 transition-colors bg-transparent border-0 outline-none pl-4"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Codes Table Header */}
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-[220px_1fr_180px_180px_200px] px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] skeu-text-muted opacity-50">
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
                <div key={code.id} className="grid grid-cols-[220px_1fr_180px_180px_180px] items-center skeu-card px-8 py-4 group hover:translate-y-[-1px] transition-all duration-300 bg-white/50 backdrop-blur-sm ring-1 ring-red-100/20">
                  {/* QR Thumbnail */}
                  <div>
                    <button
                      onClick={() => setPreviewCode(code)}
                      className="w-24 h-24 skeu-inset flex items-center justify-center relative overflow-hidden bg-white group-hover:shadow-inner transition-all duration-500 cursor-zoom-in group/thumb"
                      title="Click to preview"
                    >
                      <CodeThumbnail code={code} />
                      <div className="absolute inset-0 bg-red-100/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/thumb:bg-black/5 transition-all opacity-0 group-hover/thumb:opacity-100">
                        <Search className="w-5 h-5 text-red-500/50" />
                      </div>
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="font-black skeu-text-primary text-base tracking-tight truncate px-1">{code.name}</h3>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] font-black uppercase skeu-tag-active px-2 py-0.5 rounded tracking-widest">{code.category}</span>
                      <span className="text-[10px] skeu-text-muted font-medium truncate shrink-0 max-w-[150px]">
                        {(code.shortSlug || (code as any).short_slug)
                          ? `192.168.1.208:8010/r/${code.shortSlug || (code as any).short_slug}`
                          : (code.value.startsWith('/') ? `192.168.1.208:8010${code.value}` : code.value)}
                      </span>
                    </div>
                    <p className="text-[8px] uppercase font-black tracking-[0.2em] skeu-text-muted opacity-40 mt-0.5">
                      Created {new Date(code.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  {/* Folder & Quick Actions */}
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {folder ? (
                      <span className="text-[9px] font-black uppercase tracking-widest skeu-text-muted skeu-tag px-3 py-1.5 rounded-lg flex items-center gap-1.5 max-w-[120px] truncate bg-white/80">
                        <FolderIcon className="w-3 h-3 opacity-40 shrink-0 text-red-500" />
                        <span className="truncate">{folder.name}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] skeu-text-muted opacity-20 italic bg-white/50 px-3 py-1.5 rounded-lg">No Folder</span>
                    )}

                    <div className="flex gap-2 w-full justify-center">
                      <button
                        onClick={() => {
                          setDownloadFormat('png');
                          setDownloadingCode(code);
                        }}
                        className="py-1.5 px-3 skeu-btn-secondary text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 flex-1 max-w-[70px]"
                        title="Download PNG"
                      >
                        <Download className="w-3 h-3" /> PNG
                      </button>
                      <button
                        onClick={() => {
                          setDownloadFormat('svg');
                          setDownloadingCode(code);
                        }}
                        className="py-1.5 px-3 skeu-btn-secondary text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 flex-1 max-w-[70px]"
                        title="Download SVG"
                      >
                        <Download className="w-3 h-3" /> SVG
                      </button>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="text-center group-hover:scale-105 transition-transform duration-500">
                    <div className="text-2xl font-black skeu-text-primary leading-none tabular-nums tracking-tighter">{code.scans || 0}</div>
                    <div className="text-[8px] font-black skeu-text-muted uppercase tracking-[0.1em] mt-1.5 flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/40 animate-pulse" /> Scans
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pr-1">
                    <button
                      onClick={() => startEditing(code)}
                      className="w-9 h-9 flex items-center justify-center skeu-btn-secondary group-hover:shadow-md transition-all"
                      title="Edit Code"
                    >
                      <Pencil className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </button>
                    <button
                      onClick={() => {
                        setDownloadFormat('png');
                        setDownloadingCode(code);
                      }}
                      className="w-9 h-9 flex items-center justify-center skeu-btn-secondary group-hover:shadow-md transition-all"
                      title="Download"
                    >
                      <Download className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </button>
                    <button
                      onClick={() => deleteCode(code.id)}
                      className="w-9 h-9 flex items-center justify-center skeu-btn-secondary hover:!bg-red-50 hover:!text-red-500 hover:!border-red-200 transition-all"
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

      {/* QR Preview Modal */}
      {previewCode && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-white/20 backdrop-blur-xl cursor-pointer"
            onClick={() => setPreviewCode(null)}
          />

          <div className="relative w-full max-w-xl skeu-card p-12 bg-white animate-in zoom-in-95 duration-300 shadow-2xl space-y-8">
            <button
              onClick={() => setPreviewCode(null)}
              className="absolute right-6 top-6 p-2 skeu-btn-secondary hover:!bg-red-50 hover:!text-red-500 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black skeu-text-primary tracking-tight">{previewCode.name}</h2>
              <p className="skeu-text-muted font-medium text-sm tabular-nums tracking-wide">
                Created on {new Date(previewCode.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="skeu-inset p-12 flex items-center justify-center bg-white aspect-square relative overflow-hidden">
              <div className="scale-125">
                <QRFrameWrapper frame={previewCode.settings?.frame || 'none'}>
                  <StyledQRCode
                    options={{
                      data: (previewCode.shortSlug || (previewCode as any).short_slug)
                        ? `http://local:8010/r/${previewCode.shortSlug || (previewCode as any).short_slug}`
                        : previewCode.value,
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
                className="flex-1 skeu-btn py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button
                onClick={() => {
                  startEditing(previewCode);
                  setPreviewCode(null);
                }}
                className="flex-1 skeu-btn-secondary py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit Code
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Hidden Capture Area for High-Fidelity Downloads */}
      <div
        ref={captureRef}
        className="fixed top-0 left-0 pointer-events-none bg-white flex items-center justify-center translate-x-[-100%]"
        style={{ width: '1200px', height: '1200px', zIndex: -999, visibility: 'visible' }}
      >
        {downloadingCode && (
          <div className="p-24 bg-white inline-block">
            <QRFrameWrapper frame={downloadingCode.settings?.frame || 'none'}>
              <StyledQRCode
                options={getQROptions(downloadingCode)}
                size={800}
              />
            </QRFrameWrapper>
          </div>
        )}
      </div>
    </div>
  );
};
