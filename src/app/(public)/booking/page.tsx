import { Suspense } from 'react';
import BookingPageClient from '../../../components/booking/BookingPageClient';

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-500 shadow-soft">
            Loading booking page...
          </div>
        </main>
      }
    >
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingPageClient  />
    </div>
      
    </Suspense>
  );
}