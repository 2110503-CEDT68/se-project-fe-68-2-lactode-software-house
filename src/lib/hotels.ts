import { Hotel } from '@/types';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getHotels(): Promise<Hotel[]> {
  const res = await fetch(`${BACKEND_URL}/hotels`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch hotels');
  const json = await res.json();
  return json.data;
}

export async function getHotelById(id: string): Promise<Hotel> {
  const res = await fetch(`${BACKEND_URL}/hotels/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch hotel');
  const json = await res.json();
  return json.data;
}