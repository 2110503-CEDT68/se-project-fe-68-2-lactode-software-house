'use client';

import BookingTable from '@/src/components/booking/BookingTable';
import { useApp } from '@/src/context/AppContext';

export default function AdminBookingsPage() {
  const { bookings, loading, ready, user } = useApp();

  if (!ready || loading) {
    return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 text-slate-500">Loading admin bookings...</main>;
  }

  if (user?.role !== 'hotel owner') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-10 text-amber-700 shadow-soft">
          Hotel owner access only. Sign in with a hotel account to view hotel booking.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingTable
        rows={bookings}
        title="Hotel booking management"
        emptyText="No booking record yet."
        isAdmin
      />
    </main>
  );
}
