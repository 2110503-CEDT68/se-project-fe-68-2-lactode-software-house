'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FacilityList from '@/src/components/common/FacilityList';
import PhotoGrid from '@/src/components/common/PhotoGrid';
import AvailabilitySearch from '@/src/components/common/AvailabilitySearch';
import HotelInfo from '@/src/components/hotel/HotelInfo';
import RoomCard from '@/src/components/room/RoomCard';
import Button from '@/src/components/common/Button';
import { useApp } from '@/src/context/AppContext';
import { formatApiMessage, getHotelById } from '@/src/lib/api';
import { MOCK_FACILITIES, MOCK_IMAGES, MOCK_ROOMS } from '@/src/lib/mockHotelDetail';
import { Hotel } from '@/types';

export default function ViewRoomPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const bookingIdParam = params?.id;
  const bookingId = Array.isArray(bookingIdParam) ? bookingIdParam[0] : bookingIdParam;

  const { fetchBookingById, ready, user } = useApp();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadHotelFromBooking = async () => {
      if (!ready) return;

      if (!user) {
        setHotel(null);
        setError('Please sign in first.');
        setLoading(false);
        return;
      }

      if (!bookingId) {
        setHotel(null);
        setError('No booking ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const booking = await fetchBookingById(bookingId);
        if (!booking) {
          throw new Error('Booking not found.');
        }

        const bookingHotel = booking.hotel;
        const resolvedHotel =
          typeof bookingHotel === 'string' ? await getHotelById(bookingHotel) : bookingHotel;

        if (!ignore) {
          setHotel(resolvedHotel ?? null);
          if (!resolvedHotel) {
            setError('Hotel data is unavailable for this booking.');
          }
        }
      } catch (err) {
        if (!ignore) {
          setHotel(null);
          setError(formatApiMessage(err, 'Could not load hotel data.'));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadHotelFromBooking();

    return () => {
      ignore = true;
    };
  }, [bookingId, fetchBookingById, ready, user]);

  if (!ready || loading) {
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
          <AvailabilitySearch
            onSearch={(values) => console.log(values)}
          />
        </section>

        <section className="space-y-4">
          <RoomCard room={MOCK_ROOMS[0]} />
          <RoomCard room={MOCK_ROOMS[1]} />
          <RoomCard room={MOCK_ROOMS[2]} />
        </section>
      </div>
    </main>
  );
}
