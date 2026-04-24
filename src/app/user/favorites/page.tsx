import { Suspense } from 'react';
import FavoriteHotelPageClient from '@/src/components/hotel/FavoriteHotelPageClient';

function FavoriteHotelPageFallback() {
  return <div>Loading...</div>;
}

export default function FavoriteHotelPage() {
  return (
    <Suspense fallback={<FavoriteHotelPageFallback />}>
      <FavoriteHotelPageClient />
    </Suspense>
  );
}
