'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BedDouble, Check, CircleDollarSign, UserRound } from 'lucide-react';
import Button from '@/src/components/common/Button';
import DeletePopup from '@/src/components/common/DeletePopup';
import FacilityList from '@/src/components/common/FacilityList';
import PhotoGrid from '@/src/components/common/PhotoGrid';
import { useApp } from '@/src/context/AppContext';
import { ROOM_FACILITY_OPTIONS } from '@/src/constants/facilities';
import { deleteRoom, formatApiMessage, getHotelById, getRoomById } from '@/src/lib/api';
import { Hotel, Room } from '@/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

function toReadable(value: string) {
  return value
    .split('_')
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[]; roomId: string | string[] }>();

  const hotelId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const roomId = Array.isArray(params?.roomId) ? params.roomId[0] : params?.roomId;

  const { user, hotels, ready, loading, token } = useApp();

  const cachedHotel = useMemo(
    () => (hotelId ? hotels.find((item) => item._id === hotelId) ?? null : null),
    [hotelId, hotels]
  );

  const [hotel, setHotel] = useState<Hotel | null>(cachedHotel);
  const [room, setRoom] = useState<Room | null>(null);
  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    if (!hotelId || !roomId) {
      setHotel(null);
      setRoom(null);
      setLoadError('Missing hotel ID or room ID.');
      setFetching(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setFetching(true);
        setLoadError(null);

        const [hotelData, roomData] = await Promise.all([
          cachedHotel ? Promise.resolve(cachedHotel) : getHotelById(hotelId),
          getRoomById(hotelId, roomId),
        ]);

        if (!cancelled) {
          setHotel(hotelData);
          setRoom(roomData);
        }
      } catch (error) {
        if (!cancelled) {
          setHotel(null);
          setRoom(null);
          setLoadError(formatApiMessage(error, 'Could not load room data.'));
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cachedHotel, hotelId, roomId, ready]);

  const handleDelete = async () => {
    if (!hotelId || !roomId) {
      setActionError('Missing hotel ID or room ID.');
      return;
    }

    if (!token) {
      setActionError('Please sign in first.');
      return;
    }

    try {
      setDeleting(true);
      setActionError(null);
      await deleteRoom(hotelId, roomId, token);
      router.push(`/owner/hotels/${hotelId}`);
    } catch (error) {
      setActionError(formatApiMessage(error, 'Cannot delete room.'));
    } finally {
      setDeleting(false);
    }
  };

  if (!ready || loading || fetching) {
    return (
      <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
        <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Loading room...
        </div>
      </main>
    );
  }

  if (loadError || !hotel || !room) {
    return (
      <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
        <div>
          <Button variant="disabled" className="btn-md" onClick={() => router.push('/owner/hotels')}>
            Back
          </Button>
        </div>

        <div className="py-8">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            {loadError ?? 'Room not found.'}
          </div>
        </div>
      </main>
    );
  }

  const displayAvailable = room.availableNumber ?? room.avaliableNumber ?? 0;
  const activeFacilities = room.facilities?.length
    ? room.facilities
    : ROOM_FACILITY_OPTIONS.slice(0, 3).map((facility) => facility.value);

  const galleryImages = (() => {
    const sources = [
      ...(Array.isArray(room.picture) ? room.picture : []),
      ...(room.image ? [room.image] : []),
      ...(Array.isArray(hotel.pictures) ? hotel.pictures : []),
      ...(hotel.image ? [hotel.image] : []),
    ].filter((item): item is string => typeof item === 'string' && item.trim().length > 0);

    const unique = Array.from(new Set(sources));
    return unique.length > 0 ? unique : [FALLBACK_IMAGE];
  })();

  const roomTypeLabel = toReadable(room.roomType || 'room');
  const bedTypeLabel = toReadable(room.bedType || 'bed');
  const roomEditHref =
    hotelId && roomId ? `/owner/hotels/${hotelId}/rooms/${roomId}/edit` : '/owner/hotels';
  const backToHotel = hotelId ? `/owner/hotels/${hotelId}` : '/owner/hotels';
  const hotelLocation = [hotel.location, hotel.district, hotel.province]
    .filter((value) => Boolean(value?.trim()))
    .join(', ');
  const canManage = user?.role === 'hotelOwner' || user?.role === 'admin';
  const canDelete = canManage && Boolean(token);

  return (
    <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="disabled" className="btn-md" onClick={() => router.push(backToHotel)}>
            Back
          </Button>
          {canManage ? (
            <Button variant="primary" className="btn-md" href={roomEditHref}>
              Edit
            </Button>
          ) : null}
        </div>

        {canManage ? (
          <DeletePopup
            itemId={roomId ?? ''}
            itemLabel="room"
            disabled={deleting || !canDelete}
            onDelete={handleDelete}
          />
        ) : null}
      </div>

      {actionError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {actionError}
        </div>
      ) : null}

      <div className="py-8 space-y-6">
        <PhotoGrid images={galleryImages} fallbackImage={FALLBACK_IMAGE} />

        <section className="space-y-3">
          <h1 className="text-title">Room Type {roomTypeLabel}</h1>
          <p className="text-subdetail">
            {room.description?.trim() ||
              'A cozy and comfortable room perfect for guests. Features practical amenities and a private bathroom.'}
          </p>
        </section>

        <div className="space-y-4 pt-1 text-subdetail text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-4">
              <CircleDollarSign className="h-6 w-6 text-brand-500" />
              <span>{room.price} baht/day</span>
            </div>
            <div className="flex items-center gap-4">
              <UserRound className="h-6 w-6 text-brand-500" />
              <span>
                {room.people} {room.people === 1 ? 'person' : 'people'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <BedDouble className="h-6 w-6 text-brand-500" />
              <span>
                {bedTypeLabel} Size Bed : {room.bed}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="h-6 w-6 text-brand-500" />
              <span>Room Available : {displayAvailable}</span>
            </div>
          </div>

        <section className="space-y-3">
          <h2 className="text-subtitle">Facilities</h2>
          <FacilityList facilities={activeFacilities} scope="room" />
        </section>

        <section className="space-y-3">
          <h2 className="text-subtitle">Hotel</h2>
          <div className="card-soft space-y-2">
            <p className="text-detail">{hotel.name?.trim() || 'Hotel name unavailable'}</p>
            <p className="text-subdetail">{hotelLocation || 'Location unavailable'}</p>
            <p className="text-subdetail">Tel: {hotel.tel?.trim() || 'Phone unavailable'}</p>
            <p className="text-subdetail">Email: {hotel.email?.trim() || 'Email unavailable'}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
