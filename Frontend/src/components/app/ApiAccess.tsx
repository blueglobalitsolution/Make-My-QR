import React, { useEffect, useState } from 'react';
import {
  KeyRound, Copy, Check, RefreshCw, Loader2, ExternalLink,
  Sparkles, ArrowRight, AlertTriangle, Eye, EyeOff,
} from 'lucide-react';
import apiClient from '../../api/client';

interface ApiAccessProps {
  canUseApi: boolean;
  quota: number;
  planName?: string;
  setView: (view: any) => void;
}

interface Usage {
  period: string;
  calls: number;
  limit: number;
  remaining: number;
}

export const ApiAccess: React.FC<ApiAccessProps> = ({
  canUseApi, quota, planName, setView,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canUseApi) return;
    let alive = true;
    setBusy(true);
    Promise.all([
      apiClient.get('/v1/token/'),
      apiClient.get('/v1/'),
    ])
      .then(([t, r]) => {
        if (!alive) return;
        setToken(t.data.token);
        setUsage(r.data.usage);
      })
      .catch((e) => {
        if (alive) setError(e?.response?.data?.detail || 'Could not load API credentials.');
      })
      .finally(() => alive && setBusy(false));
    return () => { alive = false; };
  }, [canUseApi]);

  const copy = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  const rotate = async () => {
    if (!token) return;
    if (!window.confirm('Regenerate the API key? Any integration using the current key will stop working immediately.')) return;
    setRotating(true);
    try {
      const r = await apiClient.post('/v1/token/');
      setToken(r.data.token);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Could not regenerate the key.');
    } finally {
      setRotating(false);
    }
  };

  if (!canUseApi) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <KeyRound className="mx-auto mb-4 text-[#bd1819]" size={36} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">API access is a paid feature</h1>
          <p className="text-gray-600 mb-2">
            Generate and manage QR codes from your own system: bulk import thousands of codes,
            re-point destinations after printing, and automate reports.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Available on Pro (5,000 calls/month) and above.
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

  const pct = usage && usage.limit > 0
    ? Math.min(100, Math.round((usage.calls / usage.limit) * 100))
    : 0;

  const masked = token ? `${token.slice(0, 8)}${'•'.repeat(20)}${token.slice(-4)}` : '';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <KeyRound size={22} className="text-[#bd1819]" /> API Access
        </h1>
        <p className="text-gray-600 mt-1">
          Use the REST API to create QR codes from your own system.
          {planName ? <> Current plan: <strong>{planName}</strong>.</> : null}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {/* Token */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Your API key</h2>
          <span className="text-xs text-gray-500">Send as <code className="bg-gray-100 px-1 rounded">Authorization: Bearer &lt;key&gt;</code></span>
        </div>

        {busy ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm"><Loader2 className="animate-spin" size={16} /> Loading…</div>
        ) : (
          <>
            <div className="flex items-stretch gap-2">
              <code className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-mono text-gray-800 break-all">
                {revealed ? token : masked}
              </code>
              <button
                onClick={() => setRevealed(v => !v)}
                className="px-3 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                title={revealed ? 'Hide' : 'Reveal'}
              >
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={copy}
                className="px-3 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                title="Copy"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <button
                onClick={rotate}
                disabled={rotating}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                {rotating ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                Regenerate key
              </button>
              <a
                href="/api/v1/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#bd1819] hover:underline"
              >
                API documentation <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Keep this key secret. Regenerating it invalidates the previous key immediately.
            </p>
          </>
        )}
      </div>

      {/* Usage */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-900">Usage this month</h2>
          <span className="text-xs text-gray-500">{usage?.period || ''}</span>
        </div>
        {usage ? (
          <>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">{usage.calls.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">/ {usage.limit.toLocaleString()} calls</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-[#bd1819]'}`}
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{usage.remaining.toLocaleString()} calls remaining · resets on the 1st</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Quota: {quota.toLocaleString()} calls / month</p>
        )}
      </div>

      {/* Quickstart */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-gray-900 mb-2">Quickstart</h2>
        <pre className="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-auto leading-relaxed">
{`BASE=https://app.makemyqrcode.com/api/v1
TOKEN=${token || 'YOUR_API_KEY'}

# create one QR code
curl -s -X POST "$BASE/qrcodes/" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Table 1","value":"https://example.com/menu"}'

# bulk import from CSV (name,value,category)
curl -s -X POST "$BASE/bulk/" \\
  -H "Authorization: Bearer $TOKEN" \\
  -F "file=@codes.csv"`}
        </pre>
        <p className="text-xs text-gray-500 mt-3">
          Rate limit and quota headers are returned on every response
          (<code className="bg-gray-100 px-1 rounded">X-RateLimit-Remaining</code>).
        </p>
      </div>
    </div>
  );
};
