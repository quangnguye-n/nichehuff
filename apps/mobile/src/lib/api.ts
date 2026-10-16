import { supabase } from '@/lib/supabase';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!apiUrl) {
    throw new Error('Set EXPO_PUBLIC_API_URL.');
  }

  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  const token = data.session?.access_token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(new URL(path, apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`), {
    ...init,
    headers,
  });
}
