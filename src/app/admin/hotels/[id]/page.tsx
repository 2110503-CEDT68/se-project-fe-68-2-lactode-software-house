'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FacilityList from '@/src/components/common/FacilityList';
import PhotoGrid from '@/src/components/common/PhotoGrid';
import HotelAvailabilityRoomsSection from '@/src/components/hotel/HotelAvailabilityRoomsSection';
import HotelInfo from '@/src/components/hotel/HotelInfo';
import Button from '@/src/components/common/Button';
import { deleteHotel, formatApiMessage, getHotelById, getRoomsByHotelId } from '@/src/lib/api';
import { useApp } from '@/src/context/AppContext';
import { Hotel, Room } from '@/types';
import DeletePopup from '@/src/components/common/DeletePopup';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

export default function ViewHotelProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const hotelIdParam = params?.id;
  const hotelId = Array.isArray(hotelIdParam) ? hotelIdParam[0] : hotelIdParam;
  const { token, user, ready, refreshHotels } = useApp();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (!ready) {
      setActionError('Checking your session, please try again.');
      return;
    }

    if (!hotelId) {
      setActionError('Missing hotel ID.');
      return;
    }

    if (!token || !user || user.role !== 'admin') {
      setActionError('Admin access only. Please sign in first.');
      return;
    }

    try {
      setDeleting(true);
      setActionError(null);
      await deleteHotel(hotelId, token);
      await refreshHotels();
      router.push('/admin/hotels');
    } catch (err) {
      setActionError(formatApiMessage(err, 'Cannot delete hotel.'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Loading hotel...</div>
      </main>
    );
  }

  if (!hotel || error) {
    return (
      <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
        <div>
          <Button variant="disabled" className="btn-md" href="/admin/hotels">
            Back
          </Button>
        </div>

        <div className="py-8">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            {error ?? 'Hotel not found.'}
          </div>
        </div>
      </main>
    );
  }

  const resolvedHotelId = hotelId ?? hotel._id;
  const hotelEditHref = `/admin/hotels/${resolvedHotelId}/edit`;
  const images = hotel.pictures?.length ? hotel.pictures : [FALLBACK_IMAGE];
  const facilities = hotel.facilities?.length
    ? hotel.facilities
    : ['Facilities information is not available.'];

  return (
    <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="disabled" className="btn-md" href="/admin/hotels">
            Back
          </Button>
          <Button variant="primary" className="btn-md" href={hotelEditHref}>
            Edit
          </Button>
        </div>

        <DeletePopup
          itemId={resolvedHotelId}
          itemLabel="hotel"
          disabled={deleting}
          onDelete={handleDelete}
        />
      </div>

      {actionError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {actionError}
        </div>
      ) : null}

      <div className="py-8 space-y-6">
        <PhotoGrid images={images} />

        <HotelInfo hotel={hotel} />

        <section className="space-y-3">
          <h2 className="text-subtitle">Facilities</h2>
          <FacilityList facilities={facilities} />
        </section>

        <HotelAvailabilityRoomsSection
          hotelId={resolvedHotelId}
          initialRooms={rooms}
          detailBasePath="/admin/hotels"
          createRoomHref={`/admin/hotels/${resolvedHotelId}/rooms/create`}
        />
      </div>
    </main>
  );
}
