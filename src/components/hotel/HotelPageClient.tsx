'use client';

import { useEffect, useMemo, useState } from 'react';
import HotelCard from '@/src/components/hotel/HotelCard';
import HotelSearchBar from '@/src/components/hotel/HotelSearchBar';
import { useApp } from '@/src/context/AppContext';
import { normalizeFacilitiesForDisplay } from '@/src/constants/facilities';

export default function HotelPageClient() {
  const { hotels } = useApp();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
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

  const startIndex = (page - 1) * hotelsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, startIndex + hotelsPerPage);

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
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Hotel list</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Browse and book your next hotel</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Find the right hotel for your next trip. Explore available stays, check the details, and book your dates
          with ease.
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

      <section className="grid gap-8 lg:grid-cols-3">
        {currentHotels.length > 0 ? (
          currentHotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
        ) : (
          <div className="lg:col-span-3 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">No hotels found</h2>
            <p className="mt-3 text-slate-500">
              Try a different hotel name or clear the province filter to see more results.
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
    </main>
  );
}
