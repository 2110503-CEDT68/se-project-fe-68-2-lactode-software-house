'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/src/components/common/Button';
import HotelCard from '@/src/components/hotel/HotelCard';
import { useApp } from '@/src/context/AppContext';

export default function AdminHotelPageClient() {
  const { hotels } = useApp();

  const [page, setPage] = useState(1);
  const hotelsPerPage = 6;
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const startIndex = (page - 1) * hotelsPerPage;
  const currentHotels = hotels.slice(startIndex, startIndex + hotelsPerPage);

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Admin hotels</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold text-slate-900">Manage hotel listings</h1>
          <Button
            href="/admin/hotels/create"
            variant="primary-icon"
            className="btn-md px-6 !rounded-full !border-transparent !bg-[#3248ce] text-white hover:!bg-[#2b3fb4]"
          >
            <span className="inline-flex items-center gap-1.5">
              <Plus size={18} strokeWidth={3} />
              create hotel
            </span>
          </Button>
        </div>
        <p className="mt-3 max-w-3xl text-slate-500">
          Create, review, and update hotel listings from the admin panel.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {currentHotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} detailHref={`/admin/hotels/${hotel._id}`} />
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

