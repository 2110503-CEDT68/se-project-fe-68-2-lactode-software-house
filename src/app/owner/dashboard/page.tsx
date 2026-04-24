'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@/src/components/common/Button';
import BookingTable from '@/src/components/booking/BookingTable';
import { useApp } from '@/src/context/AppContext';
import { formatApiMessage, request } from '@/src/lib/api/client';
import { Booking, Hotel, User } from '@/types';

type ApiListResponse<T> = {
  success: boolean;
  count?: number;
  data: T[];
};

type Summary = {
  totalBookings: number;
  totalHotels: number;
};

function readBackendCount(payload: unknown) {
  if (!payload || typeof payload !== 'object') return 0;
  const source = payload as Record<string, unknown>;
  const candidates = [source.count, source.total, source.totalCount, source.totalUsers];
  for (const value of candidates) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return 0;
}

function toTimestamp(value?: string) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export default function OwnerDashboardPage() {
  const { ready, loading: appLoading, user, token } = useApp();

  const [summary, setSummary] = useState<Summary>({
    totalBookings: 0,
    totalHotels: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [hotelById, setHotelById] = useState<Record<string, Hotel>>({});
  const [userById, setUserById] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDashboardData = useCallback(async () => {
    if (!token || !user) return;

    setLoading(true);
    setError('');

    try {
      const [bookingsResponse, hotelsResponse] = await Promise.all([
        request<ApiListResponse<Booking>>('/bookings', { method: 'GET' }, token),
        request<ApiListResponse<Hotel>>('/hotels', { method: 'GET' }, token),
      ]);

      const bookings = Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [];
      const hotels = Array.isArray(hotelsResponse.data) ? hotelsResponse.data : [];

      const ownerHotels = hotels.filter((hotel) => {
      const ownerId = typeof hotel.ownerID === 'string' 
        ? hotel.ownerID 
        : hotel.ownerID?._id;
      return ownerId === user._id;
    });

      const ownerHotelIds = new Set(ownerHotels.map((h) => h._id));

      const ownerBookings = bookings.filter((booking) => {
        const hotelId = typeof booking.hotel === 'string'
          ? booking.hotel
          : booking.hotel?._id;
        const hotelIdAlt = typeof booking.hotelID === 'string'
          ? booking.hotelID
          : booking.hotelID?._id;
        return ownerHotelIds.has(hotelId ?? '') || ownerHotelIds.has(hotelIdAlt ?? '');
      });

      const nextHotelById: Record<string, Hotel> = {};
      for (const hotel of ownerHotels) {
        nextHotelById[hotel._id] = hotel;
      }

      const nextUserById: Record<string, User> = {};
      for (const booking of ownerBookings) {
        if (typeof booking.user === 'object' && booking.user !== null) {
          nextUserById[booking.user._id] = booking.user;
        }
      }

      const sortedBookings = [...ownerBookings].sort((a, b) => {
        const left = Math.max(
          toTimestamp(a.createdAt),
          toTimestamp(a.updatedAt),
          toTimestamp(a.checkInDate)
        );
        const right = Math.max(
          toTimestamp(b.createdAt),
          toTimestamp(b.updatedAt),
          toTimestamp(b.checkInDate)
        );
        return right - left;
      });

      setSummary({
        totalBookings: ownerBookings.length,
        totalHotels: ownerHotels.length,
      });
      setRecentBookings(sortedBookings.slice(0, 5));
      setHotelById(nextHotelById);
      setUserById(nextUserById);
    } catch (loadError) {
      setError(formatApiMessage(loadError, 'Could not load dashboard data.'));
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (!ready || !token || user?.role !== 'hotelOwner') return;
    loadDashboardData();
  }, [loadDashboardData, ready, token, user?.role]);

  const isPageLoading = !ready || appLoading || loading;
  const recentBookingRows = useMemo(
    () =>
      recentBookings.map((booking) => {
        const hotelSource = booking.hotel ?? booking.hotelID;
        const resolvedHotel =
          typeof hotelSource === 'string' ? hotelById[hotelSource] : hotelSource;
        const userSource = booking.user;
        const resolvedUser =
          typeof userSource === 'string' ? userById[userSource] : userSource;

        return {
          ...booking,
          hotel: resolvedHotel ?? booking.hotel,
          hotelID: resolvedHotel ?? booking.hotelID,
          user: resolvedUser ?? booking.user,
        };
      }),
    [hotelById, recentBookings, userById]
  );

  const welcomeName = useMemo(() => {
    if (!user) return 'Admin';
    const fullname = `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim();
    return fullname || user.username || 'Admin';
  }, [user]);

  if (isPageLoading) {
    return (
      <main className="mx-auto w-full max-w-[1100px] px-8 py-10 text-slate-500">
        Loading hotel owner dashboard...
      </main>
    );
  }

  if (!user || user.role !== 'hotelOwner') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-10 text-amber-700 shadow-soft">
          Hotel owner access only. Sign in with an hotel owner account to view this dashboard.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-8 py-10">
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Hotel Owner Dashboard
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Welcome back, {welcomeName}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Manage your hotels and monitor recent activity.
        </p>
      </section>

      {error ? (
        <section className="mb-8 rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
          {error}
        </section>
      ) : null}

      <section className="card mb-8 rounded-[32px] px-8 py-7">
        <h2 className="mb-4 text-[24px] font-bold text-[var(--color-text-primary)]">
          Summary
        </h2>

        <ul className="list-disc space-y-2 pl-8 text-[18px] text-[var(--color-text-primary)]">
          <li>Total Bookings: {summary.totalBookings}</li>
          <li>Total Hotels: {summary.totalHotels}</li>
        </ul>
      </section>

      <section className="card mb-8 rounded-[32px] px-8 py-7">
        <h2 className="mb-6 text-[24px] font-bold text-[var(--color-text-primary)]">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link href="/owner/hotels">
            <Button className="btn-md" variant="primary">
              Manage Hotel
            </Button>
          </Link>

          <Link href="/owner/bookings">
            <Button className="btn-md" variant="primary">
              View booking
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <BookingTable
          rows={recentBookingRows}
          title="Recent booking"
          emptyText="No recent booking."
          isAdmin={true}
          editBasePath="/owner/bookings"
        />
      </section>
    </main>
  );
}
