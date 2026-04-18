'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FacilityList from '@/src/components/common/FacilityList';
import PhotoGrid from '@/src/components/common/PhotoGrid';
import AvailabilitySearch from '@/src/components/common/AvailabilitySearch';
import HotelInfo from '@/src/components/hotel/HotelInfo';
import RoomCardList from '@/src/components/room/RoomCardList';
import Button from '@/src/components/common/Button';
import { formatApiMessage, getHotelById, getRoomsByHotelId } from '@/src/lib/api';
import { MOCK_FACILITIES, MOCK_IMAGES } from '@/src/lib/mockHotelDetail';
import { Hotel, Room } from '@/types';

export default function ViewHotelProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const hotelIdParam = params?.id;
  const hotelId = Array.isArray(hotelIdParam) ? hotelIdParam[0] : hotelIdParam;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadHotel = async () => {
      if (!hotelId) {
        setHotel(null);
        setRooms([]);
        setError('No hotel ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [hotelData, roomData] = await Promise.all([
          getHotelById(hotelId),
          getRoomsByHotelId(hotelId).catch(() => []),
        ]);
        if (!ignore) {
          setHotel(hotelData);
          setRooms(roomData);
        }
      } catch (err) {
        if (!ignore) {
          setHotel(null);
          setRooms([]);
          setError(formatApiMessage(err, 'Could not load hotel data.'));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadHotel();

    return () => {
      ignore = true;
    };
  }, [hotelId]);

  if (loading) {
    return (
      <main className="min-h-screen px-16 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Loading hotel...</div>
      </main>
    );
  }

  if (!hotel || error) {
    return (
      <main className="min-h-screen px-16 py-8 space-y-4">
        <Button variant="disabled" className="btn-md" onClick={() => router.back()}>
          Back
        </Button>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {error ?? 'Hotel not found.'}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-16 py-8">
      <div>
        <Button variant="disabled" className="btn-md" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className="max-w-4xl py-8 space-y-6">
        <PhotoGrid images={hotel.pictures?.length ? hotel.pictures : MOCK_IMAGES} />

        <HotelInfo hotel={hotel} />

        <section className="space-y-3">
          <h2 className="text-subtitle">Facilities</h2>
          <FacilityList facilities={hotel.facilities?.length ? hotel.facilities : MOCK_FACILITIES} />
        </section>

        <section className="space-y-3">
          <h2 className="text-subtitle">Availability</h2>
          <AvailabilitySearch />
        </section>

        <section className="space-y-3">
          <h2 className="text-subtitle">Rooms</h2>
          <RoomCardList rooms={rooms} />
        </section>
      </div>
    </main>
  );
}
