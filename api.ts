import { Credentials, AuthResponse, Category, LiveStream, VODStream, Series } from './types';

const apiCall = async (creds: Credentials, action: string) => {
  const params = new URLSearchParams({
    server: creds.server,
    username: creds.username,
    password: creds.password,
    action,
  });
  const res = await fetch(`/api/iptv?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

export async function authenticate(creds: Credentials): Promise<AuthResponse> {
  const params = new URLSearchParams({
    server: creds.server,
    username: creds.username,
    password: creds.password,
    action: 'get_live_categories',
  });
  const res = await fetch(`/api/iptv?${params}`);
  if (!res.ok) throw new Error('Authentication failed');
  // Try to parse — if it returns an array it's valid
  const data = await res.json();
  if (!Array.isArray(data) && data.error) throw new Error(data.error);
  return data;
}

export async function getLiveCategories(creds: Credentials): Promise<Category[]> {
  const data = await apiCall(creds, 'get_live_categories');
  return Array.isArray(data) ? data : [];
}

export async function getLiveStreams(creds: Credentials): Promise<LiveStream[]> {
  const data = await apiCall(creds, 'get_live_streams');
  return Array.isArray(data) ? data : [];
}

export async function getVODCategories(creds: Credentials): Promise<Category[]> {
  const data = await apiCall(creds, 'get_vod_categories');
  return Array.isArray(data) ? data : [];
}

export async function getVODStreams(creds: Credentials): Promise<VODStream[]> {
  const data = await apiCall(creds, 'get_vod_streams');
  return Array.isArray(data) ? data : [];
}

export async function getSeriesCategories(creds: Credentials): Promise<Category[]> {
  const data = await apiCall(creds, 'get_series_categories');
  return Array.isArray(data) ? data : [];
}

export async function getSeries(creds: Credentials): Promise<Series[]> {
  const data = await apiCall(creds, 'get_series');
  return Array.isArray(data) ? data : [];
}

export function getLiveStreamURL(creds: Credentials, streamId: number): string {
  const base = creds.server.endsWith('/') ? creds.server.slice(0, -1) : creds.server;
  return `${base}/live/${creds.username}/${creds.password}/${streamId}.m3u8`;
}

export function getVODStreamURL(creds: Credentials, streamId: number, ext = 'mp4'): string {
  const base = creds.server.endsWith('/') ? creds.server.slice(0, -1) : creds.server;
  return `${base}/movie/${creds.username}/${creds.password}/${streamId}.${ext}`;
}
