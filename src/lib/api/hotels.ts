import { Hotel } from '@/types';
import { request } from './client';

export async function getHotels(): Promise<Hotel[]> {
  const response = await request<{ success: boolean; data: Hotel[] }>('/hotels', { method: 'GET' });
  return response.data;
}

export async function getHotelsByOwnerId(ownerId: string): Promise<Hotel[]> {
  const response = await request<{ success: boolean; data: Hotel[] }>(
    `/hotels?OwnerID=${encodeURIComponent(ownerId)}`,
    { method: 'GET' }
  );
  return response.data;
}

export async function getHotelById(id: string): Promise<Hotel> {
  const response = await request<{ success: boolean; data: Hotel }>(`/hotels/${id}`, { method: 'GET' });
  return response.data;
}

type UpdateHotelInput = Partial<{
  name: string;
  description: string;
  location: string;
  district: string;
  province: string;
  postalcode: string;
  region: string;
  tel: string;
  email: string;
  facilities: string[];
  pictures: string[];
  status: string;
}>;

export async function updateHotel(id: string, input: UpdateHotelInput, token: string): Promise<Hotel> {
  const response = await request<{ success: boolean; data: Hotel }>(
    `/hotels/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(input),
    },
    token
  );
  return response.data;
}
