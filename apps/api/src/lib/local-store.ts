export function updateDashboardProxiesBySenderLocal(senderKey: string, config: Partial<Record<'enabled'|'proxies'|'maxAttempts', any>>) {
  const state = getState();
  const base = (state.dashboardSession as any) || {
    provider: 'smtp',
    batchSize: '10',
    delay: '1000',
    rotateIds: false,
    subject: '',
    message: '',
    recipientsCount: 0,
    files: [],
    updatedAt: new Date().toISOString(),
  };

  const bySender = base.proxiesBySender || {};
  const existing: DashboardProxyConfig = bySender[senderKey] || {
    enabled: false,
    proxies: [],
    rotationIndex: 0,
    maxAttempts: 3,
  };

  const next: DashboardProxyConfig = {
    enabled: typeof config.enabled === 'boolean' ? config.enabled : existing.enabled,
    proxies: Array.isArray(config.proxies) ? config.proxies : existing.proxies,
    rotationIndex: existing.rotationIndex ?? 0,
    maxAttempts: typeof config.maxAttempts === 'number' ? config.maxAttempts : existing.maxAttempts ?? 3,
  };

  bySender[senderKey] = next;
  base.proxiesBySender = bySender;
  base.updatedAt = new Date().toISOString();
  state.dashboardSession = base;

  addEvent('dashboard.proxies_by_sender.updated', { senderKey, enabled: next.enabled, proxiesCount: next.proxies.length });
  return next;
}

export function getDashboardProxiesBySenderLocal(senderKey: string): DashboardProxyConfig | null {
  const state = getState();
  const base = (state.dashboardSession as any) || null;
  if (!base) return null;
  const bySender = base.proxiesBySender || {};
  return bySender[senderKey] ?? null;
}

export function pickNextSessionProxyForSender(senderKey: string): string | null {
  const state = getState();
  const session = (state.dashboardSession as any) || null;
  if (!session || !session.proxiesBySender) return null;
  const cfg: DashboardProxyConfig = session.proxiesBySender[senderKey];
  if (!cfg || !cfg.enabled || !Array.isArray(cfg.proxies) || cfg.proxies.length === 0) return null;
  const idx = (cfg.rotationIndex ?? 0) % cfg.proxies.length;
  const proxy = cfg.proxies[idx];
  cfg.rotationIndex = ((cfg.rotationIndex ?? 0) + 1) % cfg.proxies.length;
  session.proxiesBySender[senderKey] = cfg;
  state.dashboardSession = session;
  addEvent('dashboard.proxy.rotation', { senderKey, proxy, nextIndex: cfg.rotationIndex });
  return proxy;
}
