import { Suspense } from 'react';
import OwnerHotelPageClient from '@/src/components/hotel/OwnerHotelPageClient';

function OwnerHotelsPageFallback() {
  return <div>Loading...</div>;
}

export default function OwnerHotelsPage() {
  return (
    <Suspense fallback={<OwnerHotelsPageFallback />}>
      <OwnerHotelPageClient />
    </Suspense>
  );
}
