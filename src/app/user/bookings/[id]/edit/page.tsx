'use client';

import { useParams } from 'next/navigation';
import BookingForm from '@/src/components/BookingForm';
import { useApp } from '@/src/context/AppContext';

export default function EditBookingPage() {
  const params = useParams<{ id: string }>();
  const { user } = useApp();

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-10 text-amber-700 shadow-soft">
          Please sign in before editing a booking.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingForm bookingId={params.id} />
    </main>
  );
}
