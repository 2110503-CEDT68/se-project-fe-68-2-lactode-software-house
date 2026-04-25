'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FavoriteRankingCard from '@/src/components/hotel/FavoriteRankingCard';
import HotelSearchBar from '@/src/components/hotel/HotelSearchBar';
import { useApp } from '@/src/context/AppContext';
import { normalizeFacilitiesForDisplay } from '@/src/constants/facilities';

export default function RankingPage() {
  const router = useRouter();
  const { user, hotels } = useApp();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const hotelsPerPage = 10;

  const getHotelDetailHref = (hotelId: string) => {
    if (user?.role === 'admin') {
      return `/admin/hotels/${hotelId}`;
    }

    if (user?.role === 'hotelOwner') {
      return `/owner/hotels/${hotelId}`;
    }

    return `/hotels/${hotelId}`;
  };

  const getOwnerId = (ownerID: unknown) => {
    if (typeof ownerID === 'string') {
      return ownerID;
    }

    if (ownerID && typeof ownerID === 'object' && '_id' in ownerID) {
      return String((ownerID as { _id?: string })._id ?? '');
    }

    return '';
  };

  const visibleHotels = useMemo(() => {
    if (user?.role !== 'hotelOwner') {
      return hotels;
    }

    return hotels.filter((hotel) => getOwnerId(hotel.ownerID) === user._id);
  }, [hotels, user]);

  const provinceOptions = useMemo(
    () =>
      [...new Set(visibleHotels.map((hotel) => hotel.province.trim()).filter((province) => province.length > 0))].sort(),
    [visibleHotels]
  );

  const facilityOptions = useMemo(
    () =>
      [
        ...new Set(
          visibleHotels.flatMap((hotel) => normalizeFacilitiesForDisplay(hotel.facilities ?? [], 'hotel'))
        ),
      ].sort(),
    [visibleHotels]
  );

  const filteredHotels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return visibleHotels.filter((hotel) => {
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
  }, [visibleHotels, searchTerm, selectedProvince, selectedFacilities]);

  const rankedHotels = useMemo(
    () =>
      [...filteredHotels].sort((a, b) => {
        const favoriteA = typeof a.favoriteBy === 'number' ? a.favoriteBy : 0;
        const favoriteB = typeof b.favoriteBy === 'number' ? b.favoriteBy : 0;

        return favoriteB - favoriteA;
      }),
    [filteredHotels]
  );

  const totalPages = Math.max(1, Math.ceil(rankedHotels.length / hotelsPerPage));
  const startIndex = (page - 1) * hotelsPerPage;
  const currentHotels = rankedHotels.slice(startIndex, startIndex + hotelsPerPage);

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

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="space-y-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Hotel ranking</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            {user?.role === 'hotelOwner' ? 'Your hotel ranking' : 'Top favorite hotels'}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-500">
            {user?.role === 'hotelOwner'
              ? 'View rankings for hotels that belong to you, sorted by favorite count.'
              : 'Browse hotels ranked by the number of users who added them to favorites.'}
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

        <section className="space-y-3">
          {currentHotels.length > 0 ? (
            currentHotels.map((hotel, index) => {
              const favoriteCount = typeof hotel.favoriteBy === 'number' ? hotel.favoriteBy : 0;
              const rank = startIndex + index + 1;

              return (
                <FavoriteRankingCard
                  key={hotel._id}
                  hotel={hotel}
                  favoriteCount={favoriteCount}
                  rank={rank}
                  onClick={() => router.push(getHotelDetailHref(hotel._id))}
                />
              );
            })
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-slate-900">No hotels found</h2>
              <p className="mt-3 text-slate-500">
                Try a different hotel name or clear the filters to see more results.
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
            disabled={page === totalPages || rankedHotels.length === 0}
            className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
