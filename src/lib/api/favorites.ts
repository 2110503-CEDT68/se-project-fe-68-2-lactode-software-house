import { request } from './client';

export async function addFavorite(hotelId: string, token: string): Promise<void> {
  await request<{ success: boolean; data?: unknown; msg?: string; message?: string }>(
    `/favorites/${encodeURIComponent(hotelId)}`,
    { method: 'POST' },
    token
  );
}

export async function removeFavorite(hotelId: string, token: string): Promise<void> {
  await request<{ success: boolean; data?: unknown; msg?: string; message?: string }>(
    `/favorites/${encodeURIComponent(hotelId)}`,
    { method: 'DELETE' },
    token
  );
}
