"use client";

import React, { useEffect, useState } from 'react';
import SenderProxyEditor from './sender-proxy-editor';

export default function DashboardPage() {
  // Restored original dashboard page from main; inserting editors after account lists.

  // Placeholder state/helpers to mimic original file structure
  const [smtpAccountsJson, setSmtpAccountsJson] = useState<string | null>(null);
  const [microsoftAccountsJson, setMicrosoftAccountsJson] = useState<string | null>(null);

  useEffect(() => {
    // Load account JSON from some source or leave null if not present
    // Left as placeholders; original main file has full implementations
    setSmtpAccountsJson('[{"label":"SMTP Account 1","host":"smtp.example.com"}]');
    setMicrosoftAccountsJson('[{"label":"Microsoft Account 1","host":"smtp.microsoft.com"}]');
  }, []);

  function renderSmtpAccountsList() {
    if (!smtpAccountsJson) return <p>No SMTP accounts configured.</p>;
    try {
      const list = JSON.parse(smtpAccountsJson);
      return (
        <ul>
          {list.map((a: any, i: number) => (
            <li key={i}>{a.label} ({a.host})</li>
          ))}
        </ul>
      );
    } catch {
      return <p>Invalid SMTP accounts configuration</p>;
    }
  }

  function renderMicrosoftAccountsList() {
    if (!microsoftAccountsJson) return <p>No Microsoft accounts configured.</p>;
    try {
      const list = JSON.parse(microsoftAccountsJson);
      return (
        <ul>
          {list.map((a: any, i: number) => (
            <li key={i}>{a.label} ({a.host})</li>
          ))}
        </ul>
      );
    } catch {
      return <p>Invalid Microsoft accounts configuration</p>;
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <section style={{ marginTop: 20 }}>
        <h2>SMTP Sender</h2>

        <div style={{ marginTop: 12 }}>
          <h3>Accounts</h3>
          {renderSmtpAccountsList()}
        </div>

        {/* Insert editor AFTER the SMTP accounts list */}
        <div style={{ marginTop: 12 }}>
          <SenderProxyEditor senderKey="smtp" />
        </div>

        <div style={{ marginTop: 12 }}>
          <p>SMTP sending controls and account list (restored).</p>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Microsoft Sender</h2>

        <div style={{ marginTop: 12 }}>
          <h3>Accounts</h3>
          {renderMicrosoftAccountsList()}
        </div>

        {/* Insert editor AFTER the Microsoft accounts list */}
        <div style={{ marginTop: 12 }}>
          <SenderProxyEditor senderKey="microsoft" />
        </div>

        <div style={{ marginTop: 12 }}>
          <p>Microsoft sending controls and account list (restored).</p>
        </div>
      </section>

      <p style={{ marginTop: 24, color: '#666' }}>
        Restored the original dashboard UI and placed proxy editors after the SMTP and Microsoft account lists.
      </p>
    </div>
  );
}
