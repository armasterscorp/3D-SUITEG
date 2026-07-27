"use client";

import React from 'react';
import SenderProxyEditor from './sender-proxy-editor';

export default function DashboardPage() {
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
        {/* Inserted proxy editor at the top of the SMTP sender section */}
        <SenderProxyEditor senderKey="smtp" />
        <div style={{ marginTop: 12 }}>
          {/* original SMTP controls would go here; preserved in main branch version */}
          <p>SMTP sending controls and account list.</p>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Microsoft Sender</h2>
        {/* Inserted proxy editor at the top of the Microsoft sender section */}
        <SenderProxyEditor senderKey="microsoft" />
        <div style={{ marginTop: 12 }}>
          {/* original Microsoft controls would go here; preserved in main branch version */}
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
