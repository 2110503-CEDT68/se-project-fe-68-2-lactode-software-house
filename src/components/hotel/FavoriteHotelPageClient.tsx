'use client';

import { useEffect, useMemo, useState } from 'react';
import HotelCard from '@/src/components/hotel/HotelCard';
import HotelSearchBar from '@/src/components/hotel/HotelSearchBar';
import Button from '@/src/components/common/Button';
import { useApp } from '@/src/context/AppContext';
import { normalizeFacilitiesForDisplay } from '@/src/constants/facilities';
import { Hotel } from '@/types';

function readHotelId(hotel: Hotel) {
  const source = hotel as unknown as Record<string, unknown>;
  const candidate = source._id ?? source.id ?? source.hotelID ?? source.hotelId;
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function readFavoriteHotelId(item: unknown) {
  if (typeof item === 'string') return item.trim();
  if (!item || typeof item !== 'object') return '';
  const source = item as Record<string, unknown>;
  const candidate = source._id ?? source.id ?? source.hotelID ?? source.hotelId;
  return typeof candidate === 'string' ? candidate.trim() : '';
}

export default function FavoriteHotelPageClient() {
  const { user, hotels, ready, loading } = useApp();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const hotelsPerPage = 6;

  const favoriteHotelIds = useMemo(() => {
    const favorites = Array.isArray(user?.favoriteHotels) ? user.favoriteHotels : [];
    return new Set(
      favorites
        .map((item) => readFavoriteHotelId(item))
        .filter((id) => id.length > 0)
        .map((id) => id.toLowerCase())
    );
  }, [user?.favoriteHotels]);

  const favoriteHotels = useMemo(
    () =>
      hotels.filter((hotel) => {
        const hotelId = readHotelId(hotel).toLowerCase();
        return hotelId.length > 0 && favoriteHotelIds.has(hotelId);
      }),
    [favoriteHotelIds, hotels]
  );

  const provinceOptions = useMemo(
    () =>
      [
        ...new Set(
          favoriteHotels
            .map((hotel) => hotel.province.trim())
            .filter((province) => province.length > 0)
        ),
      ].sort(),
    [favoriteHotels]
  );

  const facilityOptions = useMemo(
    () =>
      [
        ...new Set(
          favoriteHotels.flatMap((hotel) =>
            normalizeFacilitiesForDisplay(hotel.facilities ?? [], 'hotel')
          )
        ),
      ].sort(),
    [favoriteHotels]
  );

  const filteredHotels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return favoriteHotels.filter((hotel) => {
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
  }, [favoriteHotels, searchTerm, selectedProvince, selectedFacilities]);

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / hotelsPerPage));
  const startIndex = (page - 1) * hotelsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, startIndex + hotelsPerPage);
  const compareHref = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedProvince.trim()) {
      params.set('province', selectedProvince.trim());
    }
    const queryString = params.toString();
    return queryString ? `/user/compare?${queryString}` : '/user/compare';
  }, [selectedProvince]);

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

  if (!ready || loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" data-testid="favorites-page-loading">
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Loading favorites...</h1>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" data-testid="favorites-page-requires-login">
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Sign in to view favorites</h1>
          <p className="mt-3 text-slate-500">
            Please sign in with your user account to see your favorite hotels.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="/signin" variant="primary" className="btn-md" testId="favorites-page-go-to-login">
              Go to Login
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8" data-testid="favorites-page">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Favorite list</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Your favorite hotels</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Keep track of hotels you love and quickly return to compare details or book your next stay.
        </p>
      </section>

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

      <div className="flex justify-end">
        <Button
          href={compareHref}
          variant="primary"
          className="btn-md"
          disabled={favoriteHotels.length < 2}
          testId="favorites-page-compare"
        >
          Go to Compare
        </Button>
      </div>

      {favoriteHotels.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center" data-testid="favorites-page-empty">
          <h2 className="text-2xl font-bold text-slate-900">No favorite hotels yet</h2>
          <p className="mt-3 text-slate-500">
            Add hotels to favorites from the hotel list, then they will appear here.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="/hotels" variant="primary" className="btn-md" testId="favorites-page-browse-hotels">
              Browse Hotels
            </Button>
          </div>
        </section>
      ) : (
        <section className="grid gap-8 lg:grid-cols-3" data-testid="favorites-page-list">
          {currentHotels.length > 0 ? (
            currentHotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
          ) : (
            <div className="lg:col-span-3 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center" data-testid="favorites-page-no-filter-results">
              <h2 className="text-2xl font-bold text-slate-900">No hotels found</h2>
              <p className="mt-3 text-slate-500">
                Try a different hotel name or clear the filters to see more results.
              </p>
            </div>
          )}
        </section>
      )}

      {favoriteHotels.length > 0 ? (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            data-testid="favorites-page-previous"
            className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-slate-600" data-testid="favorites-page-pagination">
            Page {page} of {totalPages || 1}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages || filteredHotels.length === 0}
            data-testid="favorites-page-next"
            className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : null}
    </main>
  );
}
