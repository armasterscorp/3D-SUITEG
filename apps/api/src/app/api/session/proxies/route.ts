import { NextRequest, NextResponse } from 'next/server';
import { updateDashboardProxiesLocal, getDashboardProxiesLocal } from '@/lib/local-store';

export async function GET() {
  const current = getDashboardProxiesLocal();
  return NextResponse.json(current);
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const config = {
    enabled: !!body.enabled,
    proxies: Array.isArray(body.proxies) ? body.proxies.map(String) : [],
    maxAttempts: typeof body.maxAttempts === 'number' ? body.maxAttempts : undefined,
  };

  const updated = updateDashboardProxiesLocal(config);
  return NextResponse.json(updated);
}
