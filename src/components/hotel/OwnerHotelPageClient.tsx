'use client';

import { useEffect, useMemo, useState } from 'react';
import HotelCard from '@/src/components/hotel/HotelCard';
import { useApp } from '@/src/context/AppContext';
import { formatApiMessage, getHotelsByOwnerId } from '@/src/lib/api';
import { Hotel } from '@/types';

export default function OwnerHotelPageClient() {
  const { user, ready, loading } = useApp();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!ready) return;

      if (!user || user.role !== 'hotelOwner') {
        setHotels([]);
        setError('Hotel owner access only.');
        return;
      }

      try {
        setFetching(true);
        setError(null);
        const data = await getHotelsByOwnerId(user._id);
        if (!cancelled) {
          setHotels(data);
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) {
          setHotels([]);
          setError(formatApiMessage(err, 'Cannot load your hotels right now.'));
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  const hotelsPerPage = 6;
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);
  const currentHotels = useMemo(() => {
    const start = (page - 1) * hotelsPerPage;
    return hotels.slice(start, start + hotelsPerPage);
  }, [hotels, page]);

  if (!ready || loading || fetching) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Loading hotels...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Hotel list</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Manage your hotels</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          This page shows only hotels assigned to your owner account.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
      ) : hotels.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
          No hotels found for your account.
        </div>
      ) : (
        <>
          <section className="grid gap-8 lg:grid-cols-3">
            {currentHotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} detailHref={`/owner/hotels/${hotel._id}`} />
            ))}
          </section>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-slate-600">
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
