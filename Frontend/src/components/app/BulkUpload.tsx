import React, { useRef, useState } from 'react';
import {
  Upload, FileText, CheckCircle2, AlertTriangle, Download,
  Loader2, Sparkles, ArrowRight, Table2,
} from 'lucide-react';
import apiClient from '../../api/client';

interface BulkUploadProps {
  planCanBulk: boolean;
  bulkLimit: number;
  remaining: number;
  onDone: () => void;
  setView: (view: any) => void;
}

interface BulkResult {
  ok: boolean;
  message?: string;
  created?: number;
  codes?: { id: number; name: string; short_url?: string }[];
  rows?: { row: number | string; error: any }[];
}

/** Minimal CSV parser that understands quoted fields. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }

  const nonEmpty = rows.filter(r => r.some(v => v.trim() !== ''));
  if (!nonEmpty.length) return [];

  // Treat the first row as a header only if it looks like one.
  const first = nonEmpty[0].map(v => v.trim().toLowerCase());
  const hasHeader = first.includes('name') || first.includes('value');
  const header = hasHeader ? first : ['name', 'value', 'category'];
  const body = hasHeader ? nonEmpty.slice(1) : nonEmpty;

  return body.map(cells => {
    const obj: Record<string, string> = {};
    header.forEach((key, idx) => { obj[key] = (cells[idx] ?? '').trim(); });
    return obj;
  });
}

export const BulkUpload: React.FC<BulkUploadProps> = ({
  planCanBulk, bulkLimit, remaining, onDone, setView,
}) => {
  const [mode, setMode] = useState<'csv' | 'paste'>('csv');
  const [file, setFile] = useState<File | null>(null);
  const [pasted, setPasted] = useState('');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const parsedPaste = mode === 'paste' && pasted.trim() ? parseCsv(pasted) : [];
  const rowCount = mode === 'csv' ? (file ? '—' : 0) : parsedPaste.length;

  const downloadTemplate = () => {
    const csv = 'name,value,category\nTable 1,https://example.com/table-1,website\nTable 2,https://example.com/table-2,website\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const submit = async () => {
    setResult(null);
    if (mode === 'csv' && !file) {
      setResult({ ok: false, message: 'Choose a CSV file first.' });
      return;
    }
    if (mode === 'paste' && !parsedPaste.length) {
      setResult({ ok: false, message: 'Paste at least one row.' });
      return;
    }
    setBusy(true);
    try {
      let res;
      if (mode === 'csv' && file) {
        const fd = new FormData();
        fd.append('file', file);
        res = await apiClient.post('/v1/bulk/', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const codes = parsedPaste.map(r => ({
          name: r.name, value: r.value,
          category: r.category || 'website', type: 'qr',
        }));
        res = await apiClient.post('/v1/bulk/', { codes });
      }
      setResult({
        ok: true,
        created: res.data.created,
        codes: res.data.codes,
      });
      onDone();
    } catch (err: any) {
      const data = err?.response?.data || {};
      setResult({
        ok: false,
        message: data.detail || data.error || 'Upload failed. Please try again.',
        rows: data.rows,
      });
    } finally {
      setBusy(false);
    }
  };

  if (!planCanBulk) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <Sparkles className="mx-auto mb-4 text-[#bd1819]" size={36} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk upload is a paid feature</h1>
          <p className="text-gray-600 mb-6">
            Create hundreds of QR codes at once from a spreadsheet, and manage them through the
            API. Upgrade your plan to unlock it.
          </p>
          <button
            onClick={() => setView('billing')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#bd1819] text-white font-semibold rounded hover:bg-[#a31213] transition-colors"
          >
            View plans <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk upload</h1>
        <p className="text-gray-600 mt-1">
          Create many QR codes at once. Your plan allows up to{' '}
          <strong>{bulkLimit > 0 ? bulkLimit : 'unlimited'}</strong> rows per upload,
          and you have <strong>{remaining}</strong> code slots remaining.
        </p>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => { setMode('csv'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-colors ${
            mode === 'csv' ? 'bg-[#bd1819] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Table2 size={15} /> CSV file
        </button>
        <button
          onClick={() => { setMode('paste'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-colors ${
            mode === 'paste' ? 'bg-[#bd1819] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText size={15} /> Paste rows
        </button>
      </div>

      {mode === 'csv' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) { setFile(f); setResult(null); }
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
            dragging ? 'border-[#bd1819] bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <Upload className="mx-auto mb-3 text-gray-400" size={30} />
          {file ? (
            <p className="font-semibold text-gray-900">{file.name}</p>
          ) : (
            <>
              <p className="font-semibold text-gray-900">Drop a CSV here, or click to choose</p>
              <p className="text-sm text-gray-500 mt-1">Columns: name, value, category (optional)</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => { setFile(e.target.files?.[0] || null); setResult(null); }}
          />
        </div>
      ) : (
        <div>
          <textarea
            value={pasted}
            onChange={(e) => { setPasted(e.target.value); setResult(null); }}
            rows={10}
            spellCheck={false}
            placeholder={'name,value,category\nTable 1,https://example.com/1,website\nTable 2,https://example.com/2,website'}
            className="w-full rounded border border-gray-300 p-3 font-mono text-sm focus:outline-none focus:border-[#bd1819]"
          />
          <p className="text-sm text-gray-500 mt-1">
            {parsedPaste.length} row{parsedPaste.length === 1 ? '' : 's'} detected
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <button
          onClick={submit}
          disabled={busy}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#bd1819] text-white font-semibold rounded hover:bg-[#a31213] transition-colors disabled:opacity-60"
        >
          {busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {busy ? 'Creating…' : 'Create QR codes'}
        </button>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition-colors"
        >
          <Download size={16} /> Template CSV
        </button>
        {mode === 'paste' && rowCount > 0 && (
          <span className="text-sm text-gray-500">{rowCount} rows ready</span>
        )}
      </div>

      {result && (
        <div
          className={`mt-6 rounded-lg border p-5 ${
            result.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}
        >
          {result.ok ? (
            <>
              <div className="flex items-center gap-2 font-semibold text-green-800">
                <CheckCircle2 size={18} />
                {result.created} QR code{result.created === 1 ? '' : 's'} created
              </div>
              {result.codes && result.codes.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-green-900 max-h-56 overflow-auto">
                  {result.codes.slice(0, 50).map(c => (
                    <li key={c.id} className="flex justify-between gap-4">
                      <span className="truncate">{c.name}</span>
                      <span className="text-green-700 shrink-0">#{c.id}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setView('my_codes')}
                className="mt-4 text-sm font-semibold text-green-800 underline"
              >
                View in My QR Codes
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 font-semibold text-red-800">
                <AlertTriangle size={18} />
                {result.message || 'Upload failed'}
              </div>
              {result.rows && result.rows.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-red-900 max-h-56 overflow-auto">
                  {result.rows.map((r, i) => (
                    <li key={i}>
                      <strong>Row {r.row}:</strong> {JSON.stringify(r.error)}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-red-700">
                Nothing was created — bulk upload is all-or-nothing, so fix the rows above and try again.
              </p>
            </>
          )}
        </div>
      )}

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-600">
        <h2 className="font-semibold text-gray-900 mb-2">Tips</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Every row needs a <code>name</code> and a <code>value</code>. <code>category</code> defaults to <code>website</code>.</li>
          <li>Exporting from Excel works — UTF-8 with a BOM is handled.</li>
          <li>If any row fails validation, the whole batch is rolled back.</li>
          <li>Need to automate this? Use the REST API at <code>/api/v1/</code> with your token.</li>
        </ul>
      </div>
    </div>
  );
};
