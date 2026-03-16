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
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://192.168.1.208:8010';
    const slug = code.shortSlug || (code as any).short_slug;
    let qrValue = slug ? `${backendUrl}/r/${slug}` : code.value;
    if (qrValue?.startsWith('/')) qrValue = backendUrl + qrValue;
    return qrValue || 'https://makemyqr.com';
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
    <div className="flex-1 py-12 w-full space-y-6 animate-in fade-in duration-700 pb-24 skeu-text-primary font-lato">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="skeu-page-title">My QR Library</h1>
          <p className="skeu-page-subtitle">Quickly access and manage all your generated codes.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 skeu-text-muted group-focus-within:skeu-text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-8 py-4 skeu-search font-medium text-[14px] outline-none"
            />
          </div>
          <button
            onClick={onNewQR}
            className="px-8 py-4 skeu-btn text-[14px] font-medium capitalize flex items-center gap-2"
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
            className={`px-6 py-3.5 rounded-2xl font-bold text-[14px] capitalize flex items-center gap-2 flex-shrink-0 transition-all font-poppins ${activeFolderId === 'all' ? 'skeu-tag-active' : 'skeu-tag'}`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>All ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveFolderId('general')}
            className={`px-6 py-3.5 rounded-2xl font-bold text-[14px] capitalize flex items-center gap-2 flex-shrink-0 transition-all font-poppins ${activeFolderId === 'general' ? 'skeu-tag-active' : 'skeu-tag'}`}
          >
            <FolderIcon className={`w-4 h-4 ${activeFolderId === 'general' ? 'text-white' : 'text-slate-400/30'}`} />
            <span>General ({history.filter(c => !folders.some(f => f.id === c.folderId)).length})</span>
          </button>

          {folders.map(folder => (
            <div key={folder.id} className="relative group/folder-tab">
              <button
                onClick={() => setActiveFolderId(folder.id)}
                className={`px-6 py-3.5 rounded-2xl font-bold text-[14px] capitalize flex items-center gap-2 flex-shrink-0 transition-all font-poppins pr-12 ${activeFolderId === folder.id ? 'skeu-tag-active' : 'skeu-tag'}`}
              >
                <FolderIcon className={`w-4 h-4 ${activeFolderId === folder.id ? 'text-white' : 'text-red-400/30'}`} />
                <span>{folder.name} ({folder.count || 0})</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder.id);
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover/folder-tab:opacity-100 transition-all hover:bg-black/5 ${activeFolderId === folder.id ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-red-400/50 hover:text-red-500 hover:bg-red-50'}`}
                title="Delete Folder"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
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
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="px-6 py-3.5 rounded-2xl font-bold text-[14px] capitalize flex items-center gap-2 flex-shrink-0 skeu-tag transition-all text-red-500/60 font-poppins"
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
        <div className="grid grid-cols-[220px_1fr_150px_160px_120px_150px] px-8 py-4 gap-6 text-[10px] font-black capitalize tracking-[0.2em] skeu-text-muted opacity-50">
          <div>QR Code</div>
          <div>Details</div>
          <div className="text-center">Location</div>
          <div className="text-center">Export</div>
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
              <h3 className="text-2xl font-black skeu-text-primary mb-2 ">No Results Found</h3>
              <p className="skeu-text-muted font-medium mb-10 max-w-sm mx-auto">We couldn't find any QR codes matching your search or filter criteria.</p>
              <button onClick={() => setView('wizard')} className="skeu-btn px-8 py-4 text-xs capitalize ">
                <Plus className="w-4 h-4 mr-2 inline" /> Create Your First Code
              </button>
            </div>
          ) : (
            filteredHistory.map(code => {
              const folder = folders.find(f => f.id === code.folderId);
              return (
                <div key={code.id} className="grid grid-cols-[220px_1fr_150px_160px_120px_150px] items-center skeu-card px-8 py-4 gap-6 group hover:translate-y-[-1px] transition-all duration-300 bg-white/50 backdrop-blur-sm ring-1 ring-red-100/20">
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
                    <h3 className="skeu-text-primary text-xl  truncate px-1" style={{ fontWeight: 700 }}>{code.name}</h3>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] font-black capitalize skeu-tag-active px-2 py-0.5 rounded tracking-widest">{code.category}</span>
                      {code.show_preview === false && (
                        <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded tracking-widest shadow-sm">Direct</span>
                      )}
                    </div>
                    <p className="text-[12px] capitalize font-black  skeu-text-muted opacity-50 mt-1">
                      Created {new Date(code.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  {/* Folder Location */}
                  <div className="flex flex-col items-center">
                    {folder ? (
                      <span className="text-[10px] font-black capitalize tracking-wide text-red-600 bg-red-50 border border-red-100/50 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-[140px] shadow-sm transition-transform group-hover:scale-105">
                        <FolderIcon className="w-3 h-3 shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-black capitalize tracking-wide text-slate-400 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2 max-w-[140px]">
                        <Grid3X3 className="w-3 h-3 shrink-0 opacity-40" />
                        <span>General</span>
                      </span>
                    )}
                  </div>

                  {/* Quick Export */}
                  <div className="flex flex-col gap-2 w-full px-2">
                    <button
                      onClick={() => {
                        setDownloadFormat('png');
                        setDownloadingCode(code);
                      }}
                      className="py-1.5 px-3 skeu-btn-secondary text-[9px] font-black capitalize tracking-wider transition-all flex items-center justify-center gap-1 w-full"
                      title="Download PNG"
                    >
                      <Download className="w-3 h-3" /> PNG
                    </button>
                    <button
                      onClick={() => {
                        setDownloadFormat('svg');
                        setDownloadingCode(code);
                      }}
                      className="py-1.5 px-3 skeu-btn-secondary text-[9px] font-black capitalize tracking-wider transition-all flex items-center justify-center gap-1 w-full"
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
                      onClick={() => startEditing(code)}
                      className="w-9 h-9 flex items-center justify-center skeu-btn-secondary group-hover:shadow-md transition-all"
                      title="Edit Code"
                    >
                      <Pencil className="w-4 h-4 opacity-70 group-hover:opacity-100" />
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
      {
        previewCode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-white/40 backdrop-blur-md cursor-pointer"
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
                <h2 className="text-3xl font-black skeu-text-primary ">{previewCode.name}</h2>
                <p className="skeu-text-muted font-medium text-sm tabular-nums ">
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
    </div>
  );
};
