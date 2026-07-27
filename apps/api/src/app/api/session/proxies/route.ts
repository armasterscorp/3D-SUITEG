import { NextRequest, NextResponse } from 'next/server';
import { updateDashboardProxiesBySenderLocal, getDashboardProxiesBySenderLocal } from '@/lib/local-store';

export async function GET(request: NextRequest) {
  const sender = String(new URL(request.url).searchParams.get('sender') || 'smtp');
  const current = getDashboardProxiesBySenderLocal(sender);
  return NextResponse.json(current || {});
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const sender = String(body.sender || 'smtp');

  const config = {
    enabled: !!body.enabled,
    proxies: Array.isArray(body.proxies) ? body.proxies.map(String) : [],
    maxAttempts: typeof body.maxAttempts === 'number' ? body.maxAttempts : undefined,
  };

  const updated = updateDashboardProxiesBySenderLocal(sender, config);
  return NextResponse.json(updated);
}
