import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const server = searchParams.get('server');
  const username = searchParams.get('username');
  const password = searchParams.get('password');
  const action = searchParams.get('action') || 'get_live_categories';

  if (!server || !username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  try {
    const base = server.endsWith('/') ? server.slice(0, -1) : server;
    const url = `${base}/player_api.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&action=${action}`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
