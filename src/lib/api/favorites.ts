import { request } from './client';
import { Hotel, Room } from '@/types';

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

export type CompareFavoritesParams = {
  hotel1: string;
  hotel2: string;
  province: string;
  people: number;
};

export type CompareFavoriteHotelSide = {
  hotel?: Hotel;
  rooms?: Room[];
  roomCount?: number;
  score?: number;
  reason?: string;
  [key: string]: unknown;
};

export type CompareFavoritesResponse = {
  success: boolean;
  data: {
    hotel1?: CompareFavoriteHotelSide;
    hotel2?: CompareFavoriteHotelSide;
    [key: string]: unknown;
  };
  msg?: string;
  message?: string;
};

export async function compareFavorites(params: CompareFavoritesParams, token: string): Promise<CompareFavoritesResponse> {
  const query = new URLSearchParams({
    hotel1: params.hotel1,
    hotel2: params.hotel2,
    province: params.province,
    people: String(params.people),
  });

  return request<CompareFavoritesResponse>(`/favorites/compare?${query.toString()}`, { method: 'GET' }, token);
}
