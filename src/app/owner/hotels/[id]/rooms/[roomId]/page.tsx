'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/src/context/AppContext';
import { FACILITY_OPTIONS } from '@/src/constants/facilities';
import { Hotel, Room } from '@/types';

// ── Icon helpers ──────────────────────────────────────────
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="#2B4EE6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 8 6.5 12.5 14 4" />
    </svg>
  );
}
function IconBed() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="#5A5F6E" strokeWidth="1.7" strokeLinecap="round">
      <rect x="1" y="7.5" width="14" height="7" rx="1.5" />
      <path d="M4 7.5V6a4 4 0 018 0v1.5" />
    </svg>
  );
}
function IconPerson() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="#5A5F6E" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke="#5A5F6E" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5v3.5l2 2" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────
export default function RoomDetailPage() {
  const router  = useRouter();
  const params  = useParams();

  // Route: /hotel/[hotelId]/rooms/[roomId]  OR  /hotel/[id]
  // Supports both: viewing a hotel (with rooms) OR a specific room
  const hotelId = params?.hotelId as string ?? params?.id as string ?? '';
  const roomId  = params?.roomId as string | undefined;

  const { user, hotels, ready, loading } = useApp();

  const [hotel, setHotel]       = useState<Hotel | null>(null);
  const [room, setRoom]         = useState<Room | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1';

  // ── Fetch hotel + room data ───────────────────────────
  useEffect(() => {
    if (!ready) return;

    (async () => {
      try {
        // 1. Find hotel from context cache first
        let foundHotel = hotels.find((h) => h._id === hotelId) ?? null;

        // 2. If not in cache, fetch from API
        if (!foundHotel && hotelId) {
          const res  = await fetch(`${API}/hotels/${hotelId}`, { cache: 'no-store' });
          const data = await res.json();
          if (!res.ok || data.success === false)
            throw new Error(data.message ?? 'Failed to load hotel');
          foundHotel = data.data as Hotel;
        }
        setHotel(foundHotel);

        // 3. If roomId provided, fetch the specific room
        // Route: GET /hotels/:hotelId/rooms/:roomId
        if (roomId) {
          const res  = await fetch(`${API}/hotels/${hotelId}/rooms/${roomId}`, { cache: 'no-store' });
          const data = await res.json();
          if (!res.ok || data.success === false)
            throw new Error(data.message ?? 'Failed to load room');
          setRoom(data.data as Room);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load data.');
      } finally {
        setFetching(false);
      }
    })();
  }, [ready, hotelId, roomId, hotels, API]);

  // ── Loading ───────────────────────────────────────────
  if (!ready || loading || fetching) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Loading room…
        </div>
      </main>
    );
  }

  // ── Error ─────────────────────────────────────────────
  if (error || !hotel) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error ?? 'Hotel not found.'}
        </div>
        <button
          onClick={() => router.push('/hotel')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
        >
          ← Back to hotels
        </button>
      </main>
    );
  }

  // ── Use room data if available, else fall back to hotel-level data ──
  // This lets the page work both as hotel view AND room view
  const displayImage       = room?.picture?.[0] ?? hotel.image ?? null;
  const displayTitle       = room ? `${room.roomType}` : hotel.name;
  const displayDescription = room?.description
    ?? 'A cozy and comfortable room perfect for guests. Features a queen-size bed, air conditioning, free WiFi, and a private bathroom.';
  const displayPrice       = room?.price ?? null;
  const displayPeople      = room?.people ?? null;
  const displayBedType     = room?.bedType ?? null;
  const displayBedCount    = room?.bed ?? null;
  const displayAvailable   = room?.avaliableNumber ?? null;

  // Facilities: use real room facilities if available,
  // otherwise show all FACILITY_OPTIONS as a preview
  const activeFacilities = room?.facilities ?? FACILITY_OPTIONS.map((f) => f.label);

  // ── Book button — auth-aware ──────────────────────────
  const handleBook = () => {
    if (user) {
      router.push(`/booking?hotelId=${hotel._id}${room ? `&roomId=${room._id}` : ''}`);
    } else {
      router.push('/login');
    }
  };

  // ── Render ────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-4xl px-6 py-7 pb-16">

      {/* ← Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
      >
        ← Back
      </button>

      {/* Two-column grid */}
      <div className="mt-5 grid grid-cols-1 items-start gap-9 md:grid-cols-[1fr_220px]">

        {/* ── LEFT: image · info · facilities ── */}
        <div>

          {/* Room image */}
          <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayTitle}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span className="text-base italic text-slate-400">pic</span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-6 font-serif text-3xl font-normal tracking-tight text-slate-900">
            {displayTitle}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {displayDescription}
          </p>

          {/* Facilities — uses real FACILITY_OPTIONS from facilities.ts */}
          <h2 className="mb-4 mt-7 text-lg font-semibold text-slate-900">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {FACILITY_OPTIONS.map(({ label, icon: Icon }) => {
              const isActive = activeFacilities.includes(label);
              return (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition
                    ${isActive
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-400'
                    }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              );
            })}
          </div>

          {/* Book / Sign-in button */}
          <button
            onClick={handleBook}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {user ? 'Book this room' : 'Sign in to Book'}
          </button>

        </div>

        {/* ── RIGHT: stats panel ── */}
        <div className="flex flex-col gap-4 pt-1">

          {/* Room Available */}
          {displayAvailable !== null && (
            <div className="flex items-center gap-2.5 text-sm">
              <span className="flex w-[18px] shrink-0 items-center justify-center">
                <IconCheck />
              </span>
              Room Available : {displayAvailable}
            </div>
          )}

          {/* Bed type + count */}
          {displayBedType && (
            <div className="flex items-center gap-2.5 text-sm">
              <span className="flex w-[18px] shrink-0 items-center justify-center">
                <IconBed />
              </span>
              {displayBedType} : {displayBedCount}
            </div>
          )}

          {/* People */}
          {displayPeople !== null && (
            <div className="flex items-center gap-2.5 text-sm">
              <span className="flex w-[18px] shrink-0 items-center justify-center">
                <IconPerson />
              </span>
              {displayPeople} {displayPeople === 1 ? 'person' : 'people'}
            </div>
          )}

          {/* Price */}
          {displayPrice !== null && (
            <div className="flex items-center gap-2.5 text-sm">
              <span className="flex w-[18px] shrink-0 items-center justify-center">
                <IconClock />
              </span>
              {displayPrice} baht/day
            </div>
          )}

          {/* Hotel info */}
          <div className="mt-1 flex flex-col gap-3 border-t border-slate-200 pt-4">
            <div>
              <div className="mb-0.5 text-xs text-slate-400">Hotel</div>
              <div className="text-sm font-semibold">{hotel.name}</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-400">Province</div>
              <div className="text-sm font-semibold">{hotel.province}</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-400">Region</div>
              <div className="text-sm font-semibold">{hotel.region}</div>
            </div>
            <div>
              <div className="mb-0.5 text-xs text-slate-400">Tel</div>
              <div className="text-sm font-semibold">{hotel.tel}</div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}