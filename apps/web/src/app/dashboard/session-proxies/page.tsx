'use client';

import { useEffect, useState } from 'react';

export default function SessionProxiesPage() {
  const [enabled, setEnabled] = useState(false);
  const [proxiesText, setProxiesText] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [status, setStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch('/api/session/proxies')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setEnabled(!!data.enabled);
          setProxiesText((data.proxies || []).join('\n'));
          setMaxAttempts(data.maxAttempts || 3);
        }
      })
      .catch(() => {});
  }, []);

  function validateProxyLine(line: string) {
    if (!line) return { ok: true };
    try {
      const url = new URL(line.trim());
      if (!['socks5:', 'http:'].includes(url.protocol)) {
        return { ok: false, message: 'Unsupported scheme (only socks5:// and http:// allowed)' };
      }
      return { ok: true };
    } catch {
      return { ok: false, message: 'Invalid URL' };
    }
  }

  async function handleSave() {
    const proxies = proxiesText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    // client-side validation
    for (const p of proxies) {
      const v = validateProxyLine(p);
      if (!v.ok) {
        setStatus(`Invalid proxy: ${p} — ${v.message}`);
        return;
      }
    }

    setStatus('Saving...');
    const res = await fetch('/api/session/proxies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, proxies, maxAttempts }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus('Saved');
    } else {
      setStatus(`Error: ${data?.error || 'unknown'}`);
    }
  }

  async function handleTest(proxy: string) {
    setTesting(true);
    setStatus('Testing...');
    const res = await fetch('/api/session/proxies/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proxy }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setStatus(`Proxy OK: ${proxy}`);
    } else {
      setStatus(`Proxy failed: ${data?.error || 'unknown'}`);
    }
    setTesting(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Session Proxies</h2>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enable proxy for this session (proxy-only mode when enabled)
      </label>

      <label style={{ display: 'block', marginTop: 12 }}>Proxies (one per line, schemes: socks5:// or http://)</label>
      <textarea value={proxiesText} onChange={(e) => setProxiesText(e.target.value)} rows={6} style={{ width: '100%' }} />

      <label style={{ display: 'block', marginTop: 12 }}>Max attempts (including proxy tries)</label>
      <input type="number" value={maxAttempts} min={1} max={10} onChange={(e) => setMaxAttempts(Number(e.target.value))} />

      <div style={{ marginTop: 12 }}>
        <button onClick={handleSave}>Save</button>
        <span style={{ marginLeft: 12 }}>{status}</span>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Test a proxy</h3>
        <p>Click a proxy below to run a non-sending SMTP connectivity check via that proxy.</p>
        <div>
          {(proxiesText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)).map((p) => (
            <button key={p} onClick={() => handleTest(p)} style={{ marginRight: 8, marginBottom: 8 }} disabled={testing}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
