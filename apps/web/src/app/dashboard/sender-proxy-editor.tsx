// Inserted inline in SMTP sender area of dashboard/page.tsx
// This is a compact component snippet — integrate it near the SMTP account settings UI.

function SenderProxyEditor({ senderKey }: { senderKey: 'smtp' | 'microsoft' }) {
  'use client';
  const [enabled, setEnabled] = useState(false);
  const [proxiesText, setProxiesText] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [status, setStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch(`/api/session/proxies?sender=${senderKey}`)
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setEnabled(!!data.enabled);
          setProxiesText((data.proxies || []).join('\n'));
          setMaxAttempts(data.maxAttempts || 3);
        }
      })
      .catch(() => {});
  }, [senderKey]);

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
      body: JSON.stringify({ sender: senderKey, enabled, proxies, maxAttempts }),
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
      body: JSON.stringify({ sender: senderKey, proxy }),
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
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 6, marginTop: 12 }}>
      <h4>{senderKey.toUpperCase()} Session Proxies</h4>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enable proxy for this sender (proxy-only when enabled)
      </label>

      <textarea value={proxiesText} onChange={(e) => setProxiesText(e.target.value)} rows={4} style={{ width: '100%' }} placeholder="socks5://user:pass@127.0.0.1:1080" />
      <div style={{ marginTop: 8 }}>
        <label>Max attempts</label>
        <input type="number" value={maxAttempts} min={1} max={10} onChange={(e) => setMaxAttempts(Number(e.target.value))} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={handleSave}>Save</button>
        <span style={{ marginLeft: 12 }}>{status}</span>
      </div>

      <div style={{ marginTop: 10 }}>
        <h5>Test Proxies</h5>
        <div>
          {(proxiesText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)).map((p) => (
            <button key={p} onClick={() => handleTest(p)} disabled={testing} style={{ marginRight: 8, marginBottom: 8 }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
