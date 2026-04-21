'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import FacilitySelector from '@/src/components/common/FacilitySelector';

type HotelSearchBarProps = {
  searchTerm: string;
  selectedProvince: string;
  selectedFacilities: string[];
  provinceOptions: string[];
  facilityOptions: string[];
  onSearchTermChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onFacilityChange: (value: string[]) => void;
  onReset: () => void;
};

export default function HotelSearchBar({
  searchTerm,
  selectedProvince,
  selectedFacilities,
  provinceOptions,
  facilityOptions,
  onSearchTermChange,
  onProvinceChange,
  onFacilityChange,
  onReset,
}: HotelSearchBarProps) {
  const hasActiveFilters =
    searchTerm.trim().length > 0 || selectedProvince.length > 0 || selectedFacilities.length > 0;

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-300 bg-white px-5 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search hotel name"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            aria-label="Search hotel by name"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:w-auto lg:flex-shrink-0">
          <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
            <SlidersHorizontal size={16} className="text-slate-400" />
            <label htmlFor="hotel-province-filter" className="whitespace-nowrap text-slate-500">
              Province
            </label>
            <select
              id="hotel-province-filter"
              value={selectedProvince}
              onChange={(event) => onProvinceChange(event.target.value)}
              className="min-w-[150px] bg-transparent text-sm text-slate-700 outline-none"
              aria-label="Filter hotels by province"
            >
              <option value="">All provinces</option>
              {provinceOptions.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
            >
              <X size={16} />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {facilityOptions.length > 0 ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Facilities
          </p>
          <FacilitySelector
            options={facilityOptions}
            value={selectedFacilities}
            onChange={onFacilityChange}
            scope="hotel"
          />
        </div>
      ) : null}
    </section>
  );
}
