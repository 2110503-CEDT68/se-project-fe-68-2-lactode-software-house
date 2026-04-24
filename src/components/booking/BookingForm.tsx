'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, UserRound } from 'lucide-react';
import { getRoomById } from '@/src/lib/api';
import { useApp } from '@/src/context/AppContext';
import { Booking, Room } from '@/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

type Props = {
  bookingId?: string;
  defaultHotelId?: string;
  defaultRoomId?: string;
};

const SUBMIT_LOCK_MS = 1000;

function formatDateInput(value?: string) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateDiff(checkInDate: string, checkOutDate: string) {
  if (!checkInDate || !checkOutDate) return 0;
  const start = new Date(`${checkInDate}T00:00:00`).getTime();
  const end = new Date(`${checkOutDate}T00:00:00`).getTime();
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

function addDays(dateInput: string, days: number) {
  if (!dateInput) return '';
  const date = new Date(`${dateInput}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function BookingForm({ bookingId, defaultHotelId, defaultRoomId }: Props) {
  const router = useRouter();
  const { hotels, createBooking, fetchBookingById, loading, updateBooking, user } = useApp();


  const [existing, setExisting] = useState<Booking | null>(null);
  const [message, setMessage] = useState('');
  const [hydrating, setHydrating] = useState(Boolean(bookingId));
  const [hotelId, setHotelId] = useState(defaultHotelId ?? '');
  const [roomId, setRoomId] = useState(defaultRoomId ?? '');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);

  const bookingUser = existing
    ? (typeof existing.user === 'object' ? existing.user : null)
    : null;

  const displayUser = bookingUser ?? user;
  const fullName = `${displayUser?.firstname ?? ''} ${displayUser?.lastname ?? ''}`.trim() || displayUser?.username || '';

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
        const bookingHotel = booking.hotelID ?? booking.hotel;
        setHotelId(typeof bookingHotel === 'string' ? bookingHotel : bookingHotel._id);
        const bookingRoom = booking.roomID ?? booking.room;
        if (bookingRoom) {
          setRoomId(typeof bookingRoom === 'string' ? bookingRoom : bookingRoom._id);
        }
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
    if (defaultRoomId) {
      setRoomId(defaultRoomId);
    }
  }, [bookingId, defaultHotelId, defaultRoomId]);

  useEffect(() => {
    if (!hotelId || !roomId) {
      setRoomDetails(null);
      return;
    }

    let ignore = false;

    const loadRoomDetails = async () => {
      try {
        const room = await getRoomById(hotelId, roomId);
        if (!ignore) {
          setRoomDetails(room);
        }
      } catch {
        if (!ignore) {
          setRoomDetails(null);
        }
      }
    };

    loadRoomDetails();

    return () => {
      ignore = true;
    };
  }, [hotelId, roomId]);

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => hotel._id === hotelId),
    [hotelId, hotels]
  );
  const selectedRoom = useMemo(() => {
    if (roomDetails) return roomDetails;
    if (!selectedHotel || !roomId) return null;
    if (!Array.isArray(selectedHotel.rooms)) return null;

    const room = selectedHotel.rooms.find((item) => typeof item !== 'string' && item._id === roomId);
    return (room ?? null) as Room | null;
  }, [roomDetails, roomId, selectedHotel]);
  const overviewFacilities =
    selectedRoom?.facilities?.length
      ? selectedRoom.facilities
      : selectedHotel?.facilities?.length
        ? selectedHotel.facilities
        : [];
  const roomTypeText = selectedRoom?.roomType ?? 'A';
  const peopleText = selectedRoom?.people ?? 2;
  const bedText = selectedRoom ? `${selectedRoom.bedType} x${selectedRoom.bed}` : 'King size bed x1';
  const priceText = selectedRoom?.price ?? 500;

  const nights = dateDiff(checkInDate, checkOutDate);
  const minCheckOutDate = checkInDate ? addDays(checkInDate, 1) : undefined;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!bookingId && !hotelId) {
      setMessage('Hotel not found.');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setMessage('Please select booking dates.');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setMessage('Check-out date must be after check-in date.');
      return;
    }

    if (dateDiff(checkInDate, checkOutDate) > 3) {
      setMessage('Booking cannot exceed 3 days.');
      return;
    }

    const payload = { hotelId, roomId: roomId || undefined, checkInDate, checkOutDate };
    let result: Awaited<ReturnType<typeof updateBooking>>;

    setIsSubmitting(true);
    try {
      [result] = await Promise.all([
        bookingId
          ? updateBooking(bookingId, payload)
          : createBooking(payload),
        sleep(SUBMIT_LOCK_MS),
      ]);
    } finally {
      setIsSubmitting(false);
    }

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
      value={displayUser?.tel || ''}
      readOnly
      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 outline-none"
    />
  </label>

  {/* Email */}
  <label className="space-y-2 sm:col-span-2">
    <span className="text-sm font-medium text-slate-700">Email</span>
    <input
      type="text"
      value={displayUser?.email || ''}
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
      onChange={(event) => {
        const nextCheckInDate = event.target.value;
        setCheckInDate(nextCheckInDate);

        if (!nextCheckInDate) return;
        if (!checkOutDate || checkOutDate <= nextCheckInDate) {
          setCheckOutDate(addDays(nextCheckInDate, 1));
        }
      }}
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
      min={minCheckOutDate}
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

        <button
          disabled={isSubmitting}
          className="mt-6 w-full rounded-2xl bg-brand-500 px-5 py-4 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Processing...' : bookingId ? 'Save changes' : 'Confirm booking'}
        </button>
      </form>

      <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Hotel Overview
        </p>

        {selectedHotel ? (
          <div className="mt-4 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <img
                src={selectedHotel.image || FALLBACK_IMAGE}
                alt={selectedHotel.name}
                className="h-60 w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedHotel.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {selectedHotel.address}, {selectedHotel.district}, {selectedHotel.province}
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span>{selectedHotel.tel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span>{selectedHotel.email}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="space-y-1.5">
                <p>Room type : {roomTypeText}</p>
                <p>People : {peopleText}</p>
                <p>{bedText}</p>
                <p>Price : {priceText} baht/day</p>
              </div>

              <p className="mt-4 font-semibold text-slate-700">Facilities</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {overviewFacilities.slice(0, 2).map((facility) => (
                  <span
                    key={facility}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600"
                  >
                    <UserRound className="h-3.5 w-3.5 text-brand-500" />
                    {facility}
                  </span>
                ))}
                {overviewFacilities.length > 2 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600">
                    <UserRound className="h-3.5 w-3.5 text-brand-500" />
                    More ...
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Hotel not found.</p>
        )}
      </aside>
    </div>
  );
}
