'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import BookingForm from '@/src/components/booking/BookingForm';
import HotelCard from '@/src/components/hotel/HotelCard';
import { useApp } from '@/src/context/AppContext';

export default function BookingPageClient() {
  const params = useSearchParams();
  const defaultHotelId = params.get('hotelId') ?? undefined;
  const { hotels, loading, ready, user } = useApp();

  const [page, setPage] = useState(1);
  const hotelsPerPage = 6;
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const startIndex = (page - 1) * hotelsPerPage;
  const currentHotels = hotels.slice(startIndex, startIndex + hotelsPerPage);

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Hotel list</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Browse and book your next hotel</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Find the right hotel for your next trip. Explore available stays, check the details, and book your dates with ease.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {currentHotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
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

      
    </main>
  );
}