import { Room, RoomInput } from '@/types';
import { normalizeFacilitiesForApi, normalizeFacilitiesForDisplay } from '@/src/constants/facilities';
import { request } from './client';

function normalizeRoom(room: Room): Room {
  const source = room as unknown as Record<string, unknown>;
  const rawPicture = source.picture;
  const picture = Array.isArray(rawPicture)
    ? rawPicture.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const available =
    typeof source.available === 'number'
      ? source.available
      : typeof source.availableNumber === 'number'
        ? source.availableNumber
        : typeof source.avaliableNumber === 'number'
          ? source.avaliableNumber
          : 0;
  const image =
    typeof source.image === 'string' && source.image.trim().length > 0
      ? source.image.trim()
      : picture[0] ?? null;
  const hotelID = (source.hotelID ?? source.hotel) as Room['hotelID'];
  const facilities = Array.isArray(source.facilities)
    ? normalizeFacilitiesForDisplay(
        source.facilities.filter((item): item is string => typeof item === 'string'),
        'room'
      )
    : [];

  return {
    ...room,
    hotelID,
    hotel: hotelID,
    picture,
    image,
    facilities,
    available,
    availableNumber: available,
    avaliableNumber: available,
  };
}

export async function createRoom(input: RoomInput, token: string): Promise<Room> {
  const availableNumber =
    typeof input.availableNumber === 'number'
      ? input.availableNumber
      : (input.avaliableNumber ?? 0);

  const response = await request<{ success: boolean; data: Room }>(
    `/hotels/${input.hotelId}/rooms`,
    {
      method: 'POST',
      body: JSON.stringify({
        hotelID: input.hotelId,
        picture: input.picture,
        roomType: input.roomType,
        price: input.price,
        people: input.people,
        bedType: input.bedType,
        bed: input.bed,
        description: input.description,
        facilities: normalizeFacilitiesForApi(input.facilities, 'room'),
        availableNumber,
        status: input.status,
      }),
    },
    token
  );

  return normalizeRoom(response.data);
}

export async function updateRoom(
  hotelId: string,
  roomId: string,
  input: Partial<Omit<RoomInput, 'hotelId'>>,
  token: string
): Promise<Room> {
  const availableNumber =
    typeof input.availableNumber === 'number'
      ? input.availableNumber
      : typeof input.avaliableNumber === 'number'
        ? input.avaliableNumber
        : undefined;

  const payload: Record<string, unknown> = {
    picture: input.picture,
    roomType: input.roomType,
    price: input.price,
    people: input.people,
    bedType: input.bedType,
    bed: input.bed,
    description: input.description,
    status: input.status,
  };

  if (Array.isArray(input.facilities)) {
    payload.facilities = normalizeFacilitiesForApi(input.facilities, 'room');
  }

  if (typeof availableNumber === 'number') {
    payload.availableNumber = availableNumber;
  }

  const response = await request<{ success: boolean; data: Room }>(
    `/hotels/${hotelId}/rooms/${roomId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token
  );

  return normalizeRoom(response.data);
}

export async function getRoomById(hotelId: string, roomId: string): Promise<Room> {
  const response = await request<{ success: boolean; data: Room }>(
    `/hotels/${hotelId}/rooms/${roomId}`,
    { method: 'GET' }
  );
  return normalizeRoom(response.data);
}

type RoomAvailabilityQuery = {
  checkInDate?: string;
  checkOutDate?: string;
  people?: number;
};

function buildRoomsByHotelPath(hotelId: string, query?: RoomAvailabilityQuery) {
  const params = new URLSearchParams();

  if (query?.checkInDate) {
    params.set('checkInDate', query.checkInDate);
  }

  if (query?.checkOutDate) {
    params.set('checkOutDate', query.checkOutDate);
  }

  const people = typeof query?.people === 'number' && Number.isFinite(query.people)
    ? Math.trunc(query.people)
    : undefined;

  if (typeof people === 'number' && people > 0) {
    params.set('people', String(people));
  }

  const queryString = params.toString();
  return queryString ? `/hotels/${hotelId}/rooms?${queryString}` : `/hotels/${hotelId}/rooms`;
}

export async function getRoomsByHotelId(hotelId: string, query?: RoomAvailabilityQuery): Promise<Room[]> {
  const response = await request<{ success: boolean; data: Room[] }>(
    buildRoomsByHotelPath(hotelId, query),
    { method: 'GET' }
  );
  return response.data.map(normalizeRoom);
}

export async function deleteRoom(hotelId: string, roomId: string, token: string): Promise<void> {
  await request<{ success: boolean; data: Record<string, never> }>(
    `/hotels/${hotelId}/rooms/${roomId}`,
    { method: 'DELETE' },
    token
  );
}
