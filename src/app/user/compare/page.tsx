import { Suspense } from 'react';
import CompareHotelPageClient from '@/src/components/hotel/CompareHotelPageClient';

function ComparePageFallback() {
  return <div>Loading...</div>;
}

export default function ComparePage() {
  return (
    <Suspense fallback={<ComparePageFallback />}>
      <CompareHotelPageClient />
    </Suspense>
  );
}
