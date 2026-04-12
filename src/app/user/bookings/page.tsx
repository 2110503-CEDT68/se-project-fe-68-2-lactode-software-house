'use client';

import BookingTable from '@/src/components/booking/BookingTable';
import { useApp } from '@/src/context/AppContext';

export default function MyBookingPage() {
  const { bookings, loading, ready, user } = useApp();

  if (!ready || loading) {
    return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 text-slate-500">Loading bookings...</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-10 text-amber-700 shadow-soft">
          Please sign in to view your bookings.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingTable
        rows={bookings}
        title="My bookings"
        emptyText="You have not created any booking yet. Go to the Booking page to start one."
      />
    </main>
  );
}
