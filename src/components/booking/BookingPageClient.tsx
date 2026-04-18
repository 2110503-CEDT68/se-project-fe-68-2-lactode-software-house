'use client';

import { useSearchParams } from 'next/navigation';
import { useApp } from '@/src/context/AppContext';
import BookingForm from '@/src/components/booking/BookingForm';

export default function BookingPageClient() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const { user, ready } = useApp();

  if (!ready) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center">Please login before booking</div>;
  }

  return <BookingForm defaultHotelId={hotelId || undefined} defaultRoomId={roomId || undefined} />;
}
