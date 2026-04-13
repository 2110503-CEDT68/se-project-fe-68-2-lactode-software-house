'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/src/context/AppContext';
import { Booking } from '@/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

type Props = {
  bookingId?: string;
  defaultHotelId?: string;
};

function formatDateInput(value?: string) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function dateDiff(checkInDate: string, checkOutDate: string) {
  if (!checkInDate || !checkOutDate) return 0;
  const start = new Date(`${checkInDate}T00:00:00`).getTime();
  const end = new Date(`${checkOutDate}T00:00:00`).getTime();
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

export default function BookingForm({ bookingId, defaultHotelId }: Props) {
  const router = useRouter();
  const { hotels, createBooking, fetchBookingById, loading, updateBooking, user } = useApp();
  const fullName = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim() || user?.username || '';

  const [existing, setExisting] = useState<Booking | null>(null);
  const [message, setMessage] = useState('');
  const [hydrating, setHydrating] = useState(Boolean(bookingId));
  const [hotelId, setHotelId] = useState(defaultHotelId ?? '');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  useEffect(() => {
    if (!bookingId) return;

    let ignore = false;

    const loadBooking = async () => {
      setHydrating(true);
      const booking = await fetchBookingById(bookingId);
      if (ignore) return;

      setExisting(booking);
      setHydrating(false);

      if (booking) {
        setHotelId(typeof booking.hotel === 'string' ? booking.hotel : booking.hotel._id);
        setCheckInDate(formatDateInput(booking.checkInDate));
        setCheckOutDate(formatDateInput(booking.checkOutDate));
      }
    };

    loadBooking();

    return () => {
      ignore = true;
    };
  }, [bookingId, fetchBookingById]);

  useEffect(() => {
    if (bookingId) return;
    if (defaultHotelId) {
      setHotelId(defaultHotelId);
    }
  }, [bookingId, defaultHotelId]);

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => hotel._id === hotelId),
    [hotelId, hotels]
  );

  const nights = dateDiff(checkInDate, checkOutDate);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hotelId) {
      setMessage('Hotel not found.');
      return;
    }

    const payload = { hotelId, checkInDate, checkOutDate };
    const result = bookingId
      ? await updateBooking(bookingId, payload)
      : await createBooking(payload);

    setMessage(result.message);

    if (result.ok) {
      router.push(user?.role === 'admin' ? '/admin/bookings' : '/user/bookings');
    }
  };

  if (hydrating || loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-500 shadow-soft">
        Loading booking form...
      </div>
    );
  }

  if (bookingId && !existing) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-soft">
        Booking not found.
      </div>
    );
  }

  if (!bookingId && !hotelId) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-soft">
        No hotel selected.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8"
      >
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            {bookingId ? 'Update booking' : 'Create booking'}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {bookingId ? 'Edit hotel reservation' : 'Book your hotel stay'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            You can book up to 3 days per booking.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

  {/* Fullname */}
  <label className="space-y-2 sm:col-span-2">
    <span className="text-sm font-medium text-slate-700">Fullname</span>
    <input
      type="text"
      value={fullName}
      readOnly
      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 outline-none"
    />
  </label>

  {/* Contact */}
  <label className="space-y-2 sm:col-span-2">
    <span className="text-sm font-medium text-slate-700">Contact</span>
    <input
      type="text"
      value={user?.tel || ''}
      readOnly
      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 outline-none"
    />
  </label>

  {/* Email */}
  <label className="space-y-2 sm:col-span-2">
    <span className="text-sm font-medium text-slate-700">Email</span>
    <input
      type="text"
      value={user?.email || ''}
      readOnly
      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 outline-none"
    />
  </label>

  {/* Check-in */}
  <label className="space-y-2">
    <span className="text-sm font-medium text-slate-700">Check-in date</span>
    <input
      type="date"
      value={checkInDate}
      onChange={(event) => setCheckInDate(event.target.value)}
      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
    />
  </label>

  {/* Check-out */}
  <label className="space-y-2">
    <span className="text-sm font-medium text-slate-700">Check-out date</span>
    <input
      type="date"
      value={checkOutDate}
      onChange={(event) => setCheckOutDate(event.target.value)}
      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
    />
  </label>

  {/* Trip summary */}
  <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
    <p className="text-sm font-medium text-slate-700">Trip summary</p>
    <p className="mt-2 text-sm text-slate-500">
      {nights > 0
        ? `${nights} day${nights > 1 ? 's' : ''}`
        : 'Select both dates to calculate your stay.'}
    </p>
  </div>

</div>

        {message ? (
          <p
            className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
              message.toLowerCase().includes('success')
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {message}
          </p>
        ) : null}

        <button className="mt-6 w-full rounded-2xl bg-brand-500 px-5 py-4 text-base font-semibold text-white transition hover:bg-brand-600">
          {bookingId ? 'Save changes' : 'Confirm booking'}
        </button>
      </form>

      <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Hotel overview
        </p>

        {selectedHotel ? (
          <div className="mt-4 space-y-4">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={selectedHotel.image || FALLBACK_IMAGE}
                alt={selectedHotel.name}
                className="h-60 w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedHotel.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {selectedHotel.address}, {selectedHotel.district}, {selectedHotel.province},{' '}
                {selectedHotel.region}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>{selectedHotel.tel}</p>
              <p className="mt-1">Postal code: {selectedHotel.postalcode}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Hotel not found.</p>
        )}
      </aside>
    </div>
  );
}
