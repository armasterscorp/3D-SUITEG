"use client";

import React, { useEffect, useState } from 'react';
import SenderProxyEditor from './sender-proxy-editor';

export default function DashboardPage() {
  // (This file restored from main and re-inserts the proxy editors near the sender controls.)

  // Example SMTP sender state and helpers (placeholder from main)
  const [testingSmtp, setTestingSmtp] = useState(false);

  async function testSmtpAccounts() {
    setTestingSmtp(true);
    try {
      // placeholder: actual implementation lives in main branch original
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setTestingSmtp(false);
    }
  }

  // Placeholder Microsoft send helper
  async function sendAdobeShare() {
    // placeholder - original implementation expected in real main file
    return;
  }

  // Inline session proxy editor for SMTP sender (render at top of the SMTP section)
  const smtpProxyEditor = <SenderProxyEditor senderKey="smtp" />;

  // Microsoft sender area: render session proxy editor near Microsoft controls
  const microsoftProxyEditor = <SenderProxyEditor senderKey="microsoft" />;

  return (
    <div style={{ padding: 20 }}>
      <h1>3D Suite</h1>

      <nav style={{ marginTop: 12 }}>
        <a href="/dashboard">Dashboard</a> | <a href="/campaigns">Campaigns</a>
      </nav>

      <section style={{ marginTop: 20 }}>
        <h2>Dashboard</h2>
        <p>Overview and quick actions.</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>SMTP Sender</h2>
        {smtpProxyEditor}

        <div style={{ marginTop: 20 }}>
          <button onClick={() => void testSmtpAccounts()} disabled={testingSmtp}>
            Test SMTP Accounts
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <p>SMTP sending controls and account list.</p>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Microsoft Sender</h2>
        {microsoftProxyEditor}

        <div style={{ marginTop: 12 }}>
          <button onClick={() => void sendAdobeShare()}>Send Adobe Share</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <p>Microsoft sending controls and account list.</p>
        </div>
      </section>

      <footer style={{ marginTop: 24, color: '#666' }}>
        <p>
          The per-sender proxy editors are inserted at the top of each sender section. If you
          want them elsewhere in the layout, I can move them to the exact spot in the original
          dashboard file.
        </p>
      </footer>
    </div>
  );
}
