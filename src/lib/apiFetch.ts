export const isGhPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function mapToMock(path: string, init?: RequestInit): string {
  // Normalize removing basePath if mistakenly included
  const clean = path.replace(/^https?:\/\/[^/]+/, '');
  const url = new URL(clean, 'http://local');
  const pathname = url.pathname;
  const search = url.searchParams;

  // Map well-known endpoints to mock files
  if (pathname === '/api/dashboard/summary') return '/api-mock/dashboard-summary.json';
  if (pathname === '/api/coaches') return '/api-mock/coaches.json';
  if (pathname === '/api/clients') return '/api-mock/clients.json';
  if (pathname === '/api/goals') return '/api-mock/goals.json';
  if (pathname.startsWith('/api/message-threads/')) {
    const id = pathname.split('/').pop();
    return `/api-mock/message-threads_${id}.json`;
  }
  if (pathname === '/api/message-threads') return '/api-mock/message-threads.json';
  if (pathname === '/api/messages') {
    const id = search.get('threadId') || '1';
    return `/api-mock/messages_${id}.json`;
  }

  // Default to a 404 mock
  return '/api-mock/404.json';
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!isGhPages) return fetch(path, init);

  const method = (init?.method || 'GET').toUpperCase();
  if (method === 'GET') {
    const mockPath = mapToMock(path, init);
    return fetch(`${basePath}${mockPath}`, { headers: { 'Content-Type': 'application/json' } });
  }

  // Simulate write operations in GH Pages mode
  const pathname = new URL(path, 'http://local').pathname;
  if (pathname === '/api/attachments/upload') {
    return new Response(JSON.stringify({ id: `att_${Date.now()}` }), { headers: { 'Content-Type': 'application/json' } });
  }
  if (pathname === '/api/messages') {
    return new Response(JSON.stringify({ id: `msg_${Date.now()}`, ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }
  if (pathname.startsWith('/api/goals/')) {
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }
  if (pathname === '/api/messages/export') {
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}


