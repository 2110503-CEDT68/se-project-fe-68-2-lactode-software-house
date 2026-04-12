import { Booking, BookingInput, Hotel, LoginInput, RegisterInput, Room, RoomInput, User } from '@/types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

export const TOKEN_KEY = 'hotel-booking-token';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok || data.success === false) {
    const message = data.message || data.msg || 'Request failed';
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export function formatApiMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function registerUser(input: RegisterInput): Promise<{ token: string }> {
  return request<{ success: boolean; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: LoginInput): Promise<{ token: string }> {
  return request<{ success: boolean; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getMe(token: string): Promise<User> {
  const response = await request<{ success: boolean; data: User }>('/auth/me', { method: 'GET' }, token);
  return response.data;
}

export async function logoutUser(token: string): Promise<void> {
  await request<{ success: boolean; data: Record<string, never> }>('/auth/logout', { method: 'GET' }, token);
}

export async function getHotels(): Promise<Hotel[]> {
  const response = await request<{ success: boolean; data: Hotel[] }>('/hotels', { method: 'GET' });
  return response.data;
}

export async function createRoom(input: RoomInput, token: string): Promise<Room> {
  const response = await request<{ success: boolean; data: Room }>(
    `/hotels/${input.hotelId}/rooms`,
    {
      method: 'POST',
      body: JSON.stringify({
        picture: input.picture,
        title: input.roomType,
        roomType: input.roomType,
        price: input.price,
        people: input.people,
        bedType: input.bedType,
        bed: input.bed,
        description: input.description,
        facilities: input.facilities,
        avaliableNumber: input.avaliableNumber,
        availableNumber: input.avaliableNumber,
        status: input.status,
      }),
    },
    token
  );

  return response.data;
}

export async function getBookings(token: string): Promise<Booking[]> {
  const response = await request<{ success: boolean; data: Booking[] }>('/bookings', { method: 'GET' }, token);
  return response.data;
}

export async function getBookingById(id: string, token: string): Promise<Booking> {
  const response = await request<{ success: boolean; data: Booking }>(`/bookings/${id}`, { method: 'GET' }, token);
  return response.data;
}

export async function createBooking(input: BookingInput, token: string): Promise<Booking> {
  const response = await request<{ success: boolean; data: Booking }>(`/hotels/${input.hotelId}/bookings`, {
    method: 'POST',
    body: JSON.stringify({
      checkInDate: input.checkInDate,
      checkOutDate: input.checkOutDate,
    }),
  }, token);
  return response.data;
}

export async function updateBooking(id: string, input: BookingInput, token: string): Promise<Booking> {
  const response = await request<{ success: boolean; data: Booking }>(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      hotel: input.hotelId,
      checkInDate: input.checkInDate,
      checkOutDate: input.checkOutDate,
    }),
  }, token);
  return response.data;
}

export async function deleteBooking(id: string, token: string): Promise<void> {
  await request<{ success: boolean; data: Record<string, never> }>(`/bookings/${id}`, { method: 'DELETE' }, token);
}

export async function updateUser(
  id: string,
  data: Partial<{ name: string; email: string; tel: string }>,
  token: string
) {
  const response = await request<{ success: boolean; data: User }>(
    `/auth/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token
  );

  return response.data;
}


export async function updatePassword(
  userId: string,
  payload: { currentPassword?: string; newPassword: string },
  token: string
): Promise<{ success: boolean; msg: string }> {
  return request(`/auth/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token);
}

export { API_BASE_URL };
