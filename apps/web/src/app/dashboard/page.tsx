"use client";

import React from 'react';
import SenderProxyEditor from './sender-proxy-editor';

export default function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <section style={{ marginTop: 20 }}>
        <h2>SMTP Sender</h2>
        <SenderProxyEditor senderKey="smtp" />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Microsoft Sender</h2>
        <SenderProxyEditor senderKey="microsoft" />
      </section>

      <p style={{ marginTop: 24, color: '#666' }}>
        The dashboard page was reverted to a clean state and the per-sender proxy editors were
        inserted non-invasively. If you prefer the editor to appear elsewhere within the
        original dashboard UI, tell me the exact location and I will move it there.
      </p>
    </div>
  );
}
