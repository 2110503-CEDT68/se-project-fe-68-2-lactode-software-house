'use client';

import { Suspense } from 'react';
import BookingPageClient from '@/src/components/booking/BookingPageClient';

export default function CreateBookingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <BookingPageClient />
      </Suspense>
    </main>
  );
}