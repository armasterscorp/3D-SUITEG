@@
 import SenderProxyEditor from './sender-proxy-editor';
@@
   async function testSmtpAccounts() {
@@
   }
+
+  // Inline session proxy editor for SMTP sender
+  // Rendered below SMTP account controls
+  const smtpProxyEditor = <SenderProxyEditor senderKey="smtp" />;
@@
       <div style={{ marginTop: 20 }}>
-        <button onClick={() => void testSmtpAccounts()} disabled={testingSmtp}>Test SMTP Accounts</button>
+        <button onClick={() => void testSmtpAccounts()} disabled={testingSmtp}>Test SMTP Accounts</button>
+        {smtpProxyEditor}
       </div>
@@
   // Microsoft sender area: render session proxy editor near Microsoft controls
+  const microsoftProxyEditor = <SenderProxyEditor senderKey="microsoft" />;
+
@@
-            onClick={() => void sendAdobeShare()}
+            onClick={() => void sendAdobeShare()}
+            {microsoftProxyEditor}
