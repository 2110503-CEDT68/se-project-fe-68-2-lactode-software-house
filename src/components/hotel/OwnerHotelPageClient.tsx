'use client';

import { useEffect, useMemo, useState } from 'react';
import HotelCard from '@/src/components/hotel/HotelCard';
import HotelSearchBar from '@/src/components/hotel/HotelSearchBar';
import { normalizeFacilitiesForDisplay } from '@/src/constants/facilities';
import { useApp } from '@/src/context/AppContext';
import { formatApiMessage, getHotelsByOwnerId } from '@/src/lib/api';
import { Hotel } from '@/types';

export default function OwnerHotelPageClient() {
  const { user, ready, loading } = useApp();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!ready) return;

      if (!user || user.role !== 'hotelOwner') {
        setHotels([]);
        setError('Hotel owner access only.');
        return;
      }

      try {
        setFetching(true);
        setError(null);
        const data = await getHotelsByOwnerId(user._id);
        if (!cancelled) {
          setHotels(data);
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) {
          setHotels([]);
          setError(formatApiMessage(err, 'Cannot load your hotels right now.'));
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  const hotelsPerPage = 6;
  const provinceOptions = useMemo(
    () =>
      [...new Set(hotels.map((hotel) => hotel.province.trim()).filter((province) => province.length > 0))].sort(),
    [hotels]
  );

  const facilityOptions = useMemo(
    () =>
      [
        ...new Set(
          hotels.flatMap((hotel) => normalizeFacilitiesForDisplay(hotel.facilities ?? [], 'hotel'))
        ),
      ].sort(),
    [hotels]
  );

  const filteredHotels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return hotels.filter((hotel) => {
      const matchesName =
        normalizedSearch.length === 0 || hotel.name.toLowerCase().includes(normalizedSearch);
      const matchesProvince =
        selectedProvince.length === 0 || hotel.province.toLowerCase() === selectedProvince.toLowerCase();
      const normalizedHotelFacilities = normalizeFacilitiesForDisplay(hotel.facilities ?? [], 'hotel');
      const matchesFacilities =
        selectedFacilities.length === 0 ||
        selectedFacilities.every((facility) => normalizedHotelFacilities.includes(facility));

      return matchesName && matchesProvince && matchesFacilities;
    });
  }, [hotels, searchTerm, selectedProvince, selectedFacilities]);

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / hotelsPerPage));
  const currentHotels = useMemo(() => {
    const start = (page - 1) * hotelsPerPage;
    return filteredHotels.slice(start, start + hotelsPerPage);
  }, [filteredHotels, page]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedProvince, selectedFacilities]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('');
    setSelectedFacilities([]);
    setPage(1);
  };

  if (!ready || loading || fetching) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Loading hotels...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Hotel list</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Manage your hotels</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          This page shows only hotels assigned to your owner account.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
      ) : hotels.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
          No hotels found for your account.
        </div>
      ) : (
        <>
          <HotelSearchBar
            searchTerm={searchTerm}
            selectedProvince={selectedProvince}
            selectedFacilities={selectedFacilities}
            provinceOptions={provinceOptions}
            facilityOptions={facilityOptions}
            onSearchTermChange={setSearchTerm}
            onProvinceChange={setSelectedProvince}
            onFacilityChange={setSelectedFacilities}
            onReset={handleResetFilters}
          />

          <section className="grid gap-8 lg:grid-cols-3">
            {currentHotels.length > 0 ? (
              currentHotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} detailHref={`/owner/hotels/${hotel._id}`} />
              ))
            ) : (
              <div className="lg:col-span-3 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="text-2xl font-bold text-slate-900">No hotels found</h2>
                <p className="mt-3 text-slate-500">
                  Try a different hotel name or clear the active filters to see more results.
                </p>
              </div>
            )}
          </section>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-slate-600">
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages || filteredHotels.length === 0}
              className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
