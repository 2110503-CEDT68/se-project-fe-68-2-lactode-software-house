'use client';

import { useState } from 'react';
import Button from '@/src/components/common/Button';
import DeletePopup from '@/src/components/common/DeletePopup';
import { useApp } from '@/src/context/AppContext';
import { Booking, Hotel, User } from '@/types';

type Props = {
  rows: Booking[];
  title: string;
  emptyText: string;
  isAdmin?: boolean;
  editBasePath?: string;
};

const getHotel = (hotel: Booking['hotel']) => (typeof hotel === 'string' ? null : (hotel as Hotel));
const getUser = (user: Booking['user']) => (typeof user === 'string' ? null : (user as User));

function getUserDisplayName(user: User | null) {
  if (!user) return 'User';
  const fullname = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim();
  if (fullname) return fullname;
  return user.username ?? 'User';
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function countNights(checkInDate: string, checkOutDate: string) {
  const start = new Date(checkInDate).getTime();
  const end = new Date(checkOutDate).getTime();
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

export default function BookingTable({
  rows,
  title,
  emptyText,
  isAdmin = false,
  editBasePath = '/user/bookings',
}: Props) {
  const { deleteBooking } = useApp();
  const [message, setMessage] = useState('');

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8" data-testid="booking-table">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Booking dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          {rows.length} booking{rows.length === 1 ? '' : 's'}
        </div>
      </div>

      {message ? (
        <div className="mb-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700" data-testid="booking-table-message">{message}</div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500" data-testid="booking-table-empty">
          {emptyText}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200" data-testid="booking-table-list">
          <div className="hidden grid-cols-[1.5fr_1.2fr_0.8fr_1fr] gap-4 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 md:grid">
            <div>Guest / Hotel</div>
            <div>Dates</div>
            <div>Nights</div>
            <div>Actions</div>
          </div>
          {rows.map((booking) => {
            const hotel = getHotel(booking.hotel);
            const bookingUser = getUser(booking.user);
            const nights = countNights(booking.checkInDate, booking.checkOutDate);

            return (
              <div key={booking._id} className="grid gap-4 border-t border-slate-200 px-5 py-5 md:grid-cols-[1.5fr_1.2fr_0.8fr_1fr] md:items-center" data-testid={`booking-row-${booking._id}`}>
                <div>
                  <p className="font-semibold text-slate-900">{hotel?.name ?? 'Hotel booking'}</p>
                  <p className="mt-1 text-sm text-slate-500">{hotel ? `${hotel.province} - ${hotel.tel}` : 'Hotel details unavailable'}</p>
                  {isAdmin ? <p className="mt-1 text-sm text-slate-500">{getUserDisplayName(bookingUser)} {bookingUser?.email ? `- ${bookingUser.email}` : ''}</p> : null}
                </div>
                <div className="text-sm text-slate-600">
                  <p>{formatDate(booking.checkInDate)}</p>
                  <p>{formatDate(booking.checkOutDate)}</p>
                </div>
                <div className="text-sm font-medium text-slate-700">{nights}</div>
                <div className="flex flex-wrap gap-2">
                  <DeletePopup
                    itemId={booking._id}
                    itemLabel="booking"
                    testIdPrefix={`booking-row-${booking._id}-delete`}
                    onDelete={async (bookingId) => {
                      const result = await deleteBooking(bookingId);
                      setMessage(result.message);
                    }}
                  />
                  <Button
                    variant="primary"
                    href={`${editBasePath}/${booking._id}/edit`}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    testId={`booking-row-${booking._id}-edit`}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
