import { NextRequest, NextResponse } from 'next/server';
import { probeSmtpConnection } from '@/lib/email';

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const proxy = body?.proxy ? String(body.proxy) : null;

  const result = await probeSmtpConnection(proxy);
  if (result.ok) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
}
