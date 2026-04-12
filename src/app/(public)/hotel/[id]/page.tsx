'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/src/context/AppContext';
import { Hotel } from '@/types';

// Facility tags — extend when your Hotel type gets a facilities field
const FACILITIES = [
  'Non-Smoking', 'Non-Smoking', 'Non-Smoking', 'Non-Smoking',
  'Non-Smoking', 'Non-Smoking', 'Non-Smoking', 'Non-Smoking',
  'Non-Smoking', 'Non-Smoking', 'Non-Smoking', 'Non-Smoking', 'Non-Smoking',
];

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
function IconPersonSm() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity={0.65}>
      <circle cx="7" cy="4.5" r="2.5" />
      <path d="M1 12c0-2.5 2.5-4 6-4s6 1.5 6 4" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────
export default function RoomDetailPage() {
  const router   = useRouter();
  const params   = useParams();
  const hotelId  = params?.id as string | undefined;

  // Pull auth state from AppContext (mirrors what your team uses everywhere)
  const { user, hotels, ready, loading } = useApp();

  const [hotel, setHotel]       = useState<Hotel | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // ── Fetch hotel data ──────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    // Try to find hotel in the already-loaded hotels list from context first
    // (avoids a redundant network call if HotelPageClient already fetched them)
    if (hotels.length > 0 && hotelId) {
      const found = hotels.find((h) => h._id === hotelId);
      if (found) {
        setHotel(found);
        setFetching(false);
        return;
      }
    }

    // Otherwise fetch individually: GET /hotels/:id
    if (!hotelId) {
      setError('No hotel ID provided.');
      setFetching(false);
      return;
    }

    (async () => {
      try {
        const res  = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api/v1'}/hotels/${hotelId}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        if (!res.ok || data.success === false) throw new Error(data.message ?? 'Failed to load hotel');
        setHotel(data.data as Hotel);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load hotel.');
      } finally {
        setFetching(false);
      }
    })();
  }, [ready, hotelId, hotels]);

  // ── Loading state ─────────────────────────────────────
  if (!ready || loading || fetching) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-3 text-slate-400 text-sm py-20 justify-center">
          <span className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
          Loading room…
        </div>
      </main>
    );
  }

  // ── Error state ───────────────────────────────────────
  if (error || !hotel) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 text-sm mb-4">
          {error ?? 'Hotel not found.'}
        </div>
        <button
          onClick={() => router.push('/hotel')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50 transition"
        >
          ← Back to hotels
        </button>
      </main>
    );
  }

  // ── Book button — auth-aware ──────────────────────────
  const handleBook = () => {
    if (user) {
      router.push(`/booking?hotelId=${hotel._id}`);
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
        className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50 transition"
      >
        ← Back
      </button>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-9 mt-5 items-start">

        {/* ── LEFT: image · info · facilities ── */}
        <div>

          {/* Room image */}
          <div className="bg-white border border-slate-200 rounded-2xl aspect-video flex items-center justify-center overflow-hidden shadow-sm">
            {hotel.image ? (
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span className="italic text-slate-400 text-base">pic</span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-6 text-3xl font-serif font-normal tracking-tight text-slate-900">
            {hotel.name}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            A cozy and comfortable room perfect for 2 guests. Features a queen-size bed,
            air conditioning, free WiFi, and a private bathroom. Ideal for travelers
            looking for a simple and affordable stay
          </p>

          {/* Facilities */}
          <h2 className="mt-7 mb-4 text-lg font-semibold text-slate-900">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {FACILITIES.map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-500 bg-white hover:bg-slate-50 transition"
              >
                <IconPersonSm />
                {label}
              </span>
            ))}
          </div>

          {/* Book button */}
          <button
            onClick={handleBook}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
          >
            {user ? 'Book this room' : 'Sign in to Book'}
          </button>

        </div>

        {/* ── RIGHT: stats panel ── */}
        <div className="flex flex-col gap-4 pt-1">

          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-[18px] flex items-center justify-center flex-shrink-0">
              <IconCheck />
            </span>
            Room Available : 3
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-[18px] flex items-center justify-center flex-shrink-0">
              <IconBed />
            </span>
            Queen Size Bed : 1
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-[18px] flex items-center justify-center flex-shrink-0">
              <IconPerson />
            </span>
            2 people
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-[18px] flex items-center justify-center flex-shrink-0">
              <IconClock />
            </span>
            500 baht/day
          </div>

          {/* Extra hotel info */}
          <div className="border-t border-slate-200 pt-4 mt-1 flex flex-col gap-3">
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Province</div>
              <div className="font-semibold text-sm">{hotel.province}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Region</div>
              <div className="font-semibold text-sm">{hotel.region}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Tel</div>
              <div className="font-semibold text-sm">{hotel.tel}</div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}