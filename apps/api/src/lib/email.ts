import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = String(process.env.SMTP_PORT || '587') === '465';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@3dsuite.com';

/**
 * Send email with optional proxy behavior.
 *
 * options:
 * - proxyList: array of proxy URLs (full scheme). If provided, will try proxies sequentially.
 * - explicitProxyOverride: if provided will be used as first attempt.
 * - maxAttempts: total send attempts (including direct/no-proxy attempt if allowed). Default 3.
 * - enforceProxyOnly: if true, do not attempt direct/no-proxy fallback.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: any[],
  options?: {
    proxyList?: string[];
    explicitProxyOverride?: string | null;
    maxAttempts?: number;
    enforceProxyOnly?: boolean;
  }
) {
  const maxAttempts = options?.maxAttempts ?? 3;
  const tried: Array<{ proxy?: string | null; error?: string }> = [];

  // Build list of proxies to try in order
  const proxiesToTry: (string | null)[] = [];
  if (options?.explicitProxyOverride) proxiesToTry.push(options.explicitProxyOverride);
  if (options?.proxyList && options.proxyList.length) {
    for (const p of options.proxyList) proxiesToTry.push(p);
  }
  // Add direct attempt unless proxies are required
  const allowDirect = !options?.enforceProxyOnly;
  if (allowDirect) proxiesToTry.push(null);

  const attemptsList = proxiesToTry.slice(0, maxAttempts);

  for (const proxy of attemptsList) {
    try {
      const transportOptions: any = {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        ...(proxy ? { proxy } : {}),
        connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 30000),
      };

      const transporter = nodemailer.createTransport(transportOptions);

      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        html,
        attachments,
      });

      if (typeof transporter.close === 'function') transporter.close();

      return { success: true, messageId: info.messageId, proxyUsed: proxy ?? null, tried };
    } catch (err: any) {
      const message = err?.message ? String(err.message) : String(err);
      tried.push({ proxy: proxy ?? null, error: message });
      // continue to next proxy
    }
  }

  return { success: false, error: 'All send attempts failed', tried };
}

/**
 * Probe SMTP connection via optional proxy using transporter.verify()
 * Returns { ok: boolean, error?: string }
 */
export async function probeSmtpConnection(proxy?: string | null) {
  try {
    const transportOptions: any = {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      ...(proxy ? { proxy } : {}),
      connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
    };

    const transporter = nodemailer.createTransport(transportOptions);
    await transporter.verify();
    if (typeof transporter.close === 'function') transporter.close();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message ? String(err.message) : String(err) };
  }
}
