import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, X, Loader2 } from 'lucide-react';
import { FileRecord } from '../types';
import { getFile, revokeObjectURL } from '../src/services/fileStorage';

interface PdfViewerProps {
  fileId: string;
  onBack: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ fileId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileRecord, setFileRecord] = useState<FileRecord | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        setLoading(true);
        const result = await getFile(fileId);

        if (result) {
          setFileRecord(result.record);
          const url = URL.createObjectURL(result.blob);
          setFileUrl(url);
        } else {
          setError('File not found');
        }
      } catch (err) {
        setError('Failed to load file');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFile();

    return () => {
      if (fileUrl) {
        revokeObjectURL(fileUrl);
      }
    };
  }, [fileId]);

  const handleDownload = () => {
    if (!fileUrl || !fileRecord) return;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileRecord.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    window.history.back();
    onBack();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800">{error}</h2>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="font-black text-slate-800">{fileRecord?.name}</h1>
                <p className="text-xs text-slate-400">
                  {fileRecord && `${(fileRecord.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          {fileUrl && (
            <iframe
              src={fileUrl}
              className="w-full h-full"
              title="PDF Viewer"
            />
          )}
        </div>
      </main>
    </div>
  );
};
