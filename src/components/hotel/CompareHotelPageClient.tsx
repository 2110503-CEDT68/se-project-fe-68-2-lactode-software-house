'use client';

import { useMemo, useState } from 'react';
import Button from '@/src/components/common/Button';
import { useApp } from '@/src/context/AppContext';
import {
  compareFavorites,
  CompareFavoritesResponse,
  formatApiMessage,
} from '@/src/lib/api';
import { Hotel } from '@/types';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, User } from 'lucide-react';
import { normalizeFacilitiesForDisplay } from '@/src/constants/facilities';

const HOTEL_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

type ComparedHotelView = {
  _id: string;
  name: string;
  location: string;
  district: string;
  province: string;
  pictures: string[];
  facilities: string[];
  avgPrice: number | null;
  bestFor: string;
  summary: string;
};

type FacilityGroups = {
  general: string[];
  foodAndBeverage: string[];
  recreationAndWellness: string[];
  transportation: string[];
  services: string[];
  petAndPolicy: string[];
};

const EMPTY_GROUPS: FacilityGroups = {
  general: [],
  foodAndBeverage: [],
  recreationAndWellness: [],
  transportation: [],
  services: [],
  petAndPolicy: [],
};

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

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s_-]+/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function extractSidePayload(
  data: CompareFavoritesResponse['data'] | null,
  side: 'hotel1' | 'hotel2'
): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') return null;

  const source = data as Record<string, unknown>;
  const sideKeys = side === 'hotel1' ? ['hotel1', 'left', 'first', 'a'] : ['hotel2', 'right', 'second', 'b'];

  for (const key of sideKeys) {
    const direct = source[key];
    if (!direct || typeof direct !== 'object') continue;
    const directRecord = direct as Record<string, unknown>;

    if (directRecord.hotel && typeof directRecord.hotel === 'object') {
      return directRecord.hotel as Record<string, unknown>;
    }

    return directRecord;
  }

  return null;
}

function toComparedHotelFromPayload(payload: Record<string, unknown>): ComparedHotelView {
  const pictures = parseStringArray(payload.pictures);
  const facilities = parseStringArray(payload.facilities);
  const avgPriceRaw = payload.avgPrice;

  const district = typeof payload.district === 'string' ? payload.district.trim() : '';
  const province = typeof payload.province === 'string' ? payload.province.trim() : '';
  const locationRaw = typeof payload.location === 'string' ? payload.location.trim() : '';
  const location = locationRaw || [district, province].filter(Boolean).join(', ');

  const avgPrice =
    typeof avgPriceRaw === 'number' && Number.isFinite(avgPriceRaw)
      ? Math.max(0, Math.round(avgPriceRaw))
      : null;

  const idCandidate = payload._id ?? payload.id ?? payload.hotelID ?? payload.hotelId;
  const id = typeof idCandidate === 'string' ? idCandidate : '';

  const name = typeof payload.name === 'string' && payload.name.trim().length > 0
    ? payload.name.trim()
    : 'Unknown Hotel';

  const bestFor = typeof payload.bestFor === 'string' && payload.bestFor.trim().length > 0
    ? payload.bestFor.trim()
    : 'Unknown';

  const summary = typeof payload.summary === 'string' && payload.summary.trim().length > 0
    ? payload.summary.trim()
    : 'No summary';

  return {
    _id: id,
    name,
    location,
    district,
    province,
    pictures,
    facilities: normalizeFacilitiesForDisplay(facilities, 'hotel'),
    avgPrice,
    bestFor,
    summary,
  };
}

function toComparedHotelFromFallback(hotel: Hotel): ComparedHotelView {
  const pictures = Array.isArray(hotel.pictures)
    ? hotel.pictures.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const facilities = Array.isArray(hotel.facilities)
    ? normalizeFacilitiesForDisplay(hotel.facilities, 'hotel')
    : [];
  const location = hotel.location?.trim() || [hotel.district?.trim(), hotel.province?.trim()].filter(Boolean).join(', ');

  return {
    _id: readHotelId(hotel),
    name: hotel.name?.trim() || 'Unknown Hotel',
    location,
    district: hotel.district?.trim() || '',
    province: hotel.province?.trim() || '',
    pictures,
    facilities,
    avgPrice: null,
    bestFor: 'Unknown',
    summary: 'No summary',
  };
}

function resolveComparedHotel(
  data: CompareFavoritesResponse['data'] | null,
  side: 'hotel1' | 'hotel2',
  fallback: Hotel | null
) {
  const payload = extractSidePayload(data, side);
  if (payload) {
    return toComparedHotelFromPayload(payload);
  }

  if (fallback) {
    return toComparedHotelFromFallback(fallback);
  }

  return null;
}

function categorizeFacilities(facilities: string[]): FacilityGroups {
  const groups: FacilityGroups = {
    general: [],
    foodAndBeverage: [],
    recreationAndWellness: [],
    transportation: [],
    services: [],
    petAndPolicy: [],
  };
  const seen = new Set<string>();

  for (const facility of facilities) {
    if (!facility || typeof facility !== 'string') continue;
    const normalized = normalizeToken(facility);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);

    if (
      normalized.includes('pet')
    ) {
      groups.petAndPolicy.push(facility);
      continue;
    }

    if (
      normalized.includes('restaurant') ||
      normalized.includes('bar') ||
      normalized.includes('lounge') ||
      normalized.includes('room_service') ||
      normalized.includes('kitchen') ||
      normalized.includes('minibar')
    ) {
      groups.foodAndBeverage.push(facility);
      continue;
    }

    if (
      normalized.includes('pool') ||
      normalized.includes('fitness') ||
      normalized.includes('gym') ||
      normalized.includes('spa')
    ) {
      groups.recreationAndWellness.push(facility);
      continue;
    }

    if (
      normalized.includes('parking') ||
      normalized.includes('shuttle') ||
      normalized.includes('airport') ||
      normalized.includes('transport')
    ) {
      groups.transportation.push(facility);
      continue;
    }

    if (
      normalized.includes('laundry') ||
      normalized.includes('concierge') ||
      normalized.includes('elevator') ||
      normalized.includes('conference') ||
      normalized.includes('service')
    ) {
      groups.services.push(facility);
      continue;
    }

    groups.general.push(facility);
  }

  return groups;
}

function toRowText(values: string[]) {
  return values.length > 0 ? values.join(', ') : '-';
}

export default function CompareHotelPageClient() {
  const searchParams = useSearchParams();
  const initialProvince = searchParams.get('province')?.trim() ?? '';
  const initialPeople = searchParams.get('people')?.trim() ?? '0';

  const { user, token, hotels, ready, loading } = useApp();

  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [peopleInput, setPeopleInput] = useState(initialPeople);

  const [pool, setPool] = useState<Hotel[]>([]);
  const [champion, setChampion] = useState<Hotel | null>(null);
  const [challenger, setChallenger] = useState<Hotel | null>(null);
  const [challengerIndex, setChallengerIndex] = useState(1);
  const [eliminatedHotels, setEliminatedHotels] = useState<Hotel[]>([]);
  const [winner, setWinner] = useState<Hotel | null>(null);
  const [comparisonData, setComparisonData] = useState<CompareFavoritesResponse['data'] | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [infoText, setInfoText] = useState('');

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
      [...new Set(favoriteHotels.map((hotel) => hotel.province.trim()).filter((province) => province.length > 0))].sort(),
    [favoriteHotels]
  );

  const parsedPeople = useMemo(() => {
    const value = Number.parseInt(peopleInput.trim(), 10);
    if (!Number.isFinite(value) || value <= 0) return null;
    return value;
  }, [peopleInput]);

  const filteredHotelsByProvince = useMemo(() => {
    if (!selectedProvince.trim()) return favoriteHotels;
    return favoriteHotels.filter(
      (hotel) => hotel.province.trim().toLowerCase() === selectedProvince.trim().toLowerCase()
    );
  }, [favoriteHotels, selectedProvince]);

  const leftComparedHotel = useMemo(
    () => resolveComparedHotel(comparisonData, 'hotel1', champion),
    [champion, comparisonData]
  );
  const rightComparedHotel = useMemo(
    () => resolveComparedHotel(comparisonData, 'hotel2', challenger),
    [challenger, comparisonData]
  );
  const leftFacilityGroups = useMemo(
    () => (leftComparedHotel ? categorizeFacilities(leftComparedHotel.facilities) : EMPTY_GROUPS),
    [leftComparedHotel]
  );
  const rightFacilityGroups = useMemo(
    () => (rightComparedHotel ? categorizeFacilities(rightComparedHotel.facilities) : EMPTY_GROUPS),
    [rightComparedHotel]
  );

  const runCompareRound = async (leftHotel: Hotel, rightHotel: Hotel, people: number) => {
    if (!token) {
      setErrorText('Please sign in first.');
      return;
    }

    const selectedProvinceValue = selectedProvince.trim();
    if (!selectedProvinceValue) {
      setErrorText('Please select a province before comparing hotels.');
      return;
    }

    const hotel1 = readHotelId(leftHotel);
    const hotel2 = readHotelId(rightHotel);
    if (!hotel1 || !hotel2) {
      setErrorText('Invalid hotel selection for compare.');
      return;
    }

    try {
      setIsComparing(true);
      setErrorText('');
      const response = await compareFavorites(
        {
          hotel1,
          hotel2,
          province: selectedProvinceValue,
          people,
        },
        token
      );
      setComparisonData(response.data ?? null);
    } catch (error) {
      setComparisonData(null);
      setErrorText(formatApiMessage(error, 'Cannot compare these hotels right now.'));
    } finally {
      setIsComparing(false);
    }
  };

  const startComparison = async () => {
    setInfoText('');
    setErrorText('');

    if (!user || !token) {
      setErrorText('Please sign in to compare favorite hotels.');
      return;
    }

    if (!selectedProvince.trim()) {
      setErrorText('Please select a province before starting compare.');
      return;
    }

    if (parsedPeople === null) {
      setErrorText('Please enter a valid people value (number greater than 0).');
      return;
    }

    if (filteredHotelsByProvince.length < 2) {
      setErrorText('Need at least 2 favorite hotels for this province to start compare.');
      return;
    }

    const nextPool = filteredHotelsByProvince;
    const firstHotel = nextPool[0];
    const secondHotel = nextPool[1];

    setIsStarted(true);
    setWinner(null);
    setPool(nextPool);
    setChampion(firstHotel);
    setChallenger(secondHotel);
    setChallengerIndex(1);
    setEliminatedHotels([]);

    await runCompareRound(firstHotel, secondHotel, parsedPeople);
  };

  const handlePick = async (pick: 'left' | 'right') => {
    if (isComparing || !champion || !challenger) return;
    if (parsedPeople === null) {
      setErrorText('Please enter a valid people value (number greater than 0).');
      return;
    }

    const pickedHotel = pick === 'left' ? champion : challenger;
    const lostHotel = pick === 'left' ? challenger : champion;
    const nextIndex = challengerIndex + 1;

    setEliminatedHotels((current) => [...current, lostHotel]);

    if (nextIndex >= pool.length) {
      setWinner(pickedHotel);
      setChampion(pickedHotel);
      setChallenger(null);
      setComparisonData(null);
      setInfoText(`${pickedHotel.name} is your final winner.`);
      return;
    }

    const nextChallenger = pool[nextIndex];
    setWinner(null);
    setChampion(pickedHotel);
    setChallenger(nextChallenger);
    setChallengerIndex(nextIndex);
    setInfoText(`${lostHotel.name} was eliminated. Next challenger: ${nextChallenger.name}`);

    await runCompareRound(pickedHotel, nextChallenger, parsedPeople);
  };

  if (!ready || loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8" data-testid="compare-page-loading">
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Loading compare page...</h1>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8" data-testid="compare-page-requires-login">
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Sign in to compare favorites</h1>
          <p className="mt-3 text-slate-500">
            Please sign in with your user account before comparing hotels.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="/signin" variant="primary" className="btn-md" testId="compare-page-go-to-login">
              Go to Login
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8" data-testid="compare-page">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Hotel compare</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Compare your favorite hotels</h1>
        <p className="mt-3 max-w-3xl text-slate-500">
          Compare 2 hotels at a time. Pick your winner each round, and the unpicked hotel is eliminated.
        </p>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft" data-testid="compare-page-controls">
        <div className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end">
          <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
            <SlidersHorizontal size={16} className="text-slate-400" />
            <label htmlFor="compare-province-filter" className="whitespace-nowrap text-slate-500">
              Province
            </label>
            <select
              id="compare-province-filter"
              value={selectedProvince}
              onChange={(event) => setSelectedProvince(event.target.value)}
              data-testid="compare-page-province"
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

          <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3">
            <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <input
              id="compare-people"
              type="number"
              min={0}
              step={1}
              value={peopleInput}
              onChange={(event) => setPeopleInput(event.target.value)}
              data-testid="compare-page-people"
              placeholder="0"
              className="w-16 bg-transparent text-sm text-gray-500 outline-none"
            />
            <span className="text-sm text-gray-400">people</span>
          </div>

          <Button
            variant="primary"
            className="btn-md md:self-end"
            onClick={() => {
              void startComparison();
            }}
            disabled={isComparing || !selectedProvince.trim() || parsedPeople === null}
            testId="compare-page-start"
          >
            {isStarted ? 'Restart Compare' : 'Start Compare'}
          </Button>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Favorites in pool: {filteredHotelsByProvince.length} (Need at least 2)
        </p>
      </section>

      {errorText ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700" data-testid="compare-page-error">{errorText}</div>
      ) : null}

      {infoText ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700" data-testid="compare-page-info">
          {infoText}
        </div>
      ) : null}

      {winner ? (
        <section className="rounded-[28px] border border-emerald-200 bg-white p-8" data-testid="compare-page-winner">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Winner</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{winner.name}</h2>
          <p className="mt-2 text-slate-600">
            {winner.district}, {winner.province}
          </p>
          <div className="mt-5">
            <Button href={`/hotels/${winner._id}`} variant="primary" className="btn-md" testId="compare-page-winner-detail">
              View Winner Detail
            </Button>
          </div>
        </section>
      ) : null}

      {isStarted && champion && challenger ? (
        <section className="space-y-4" data-testid="compare-page-round">
          <p className="text-sm text-slate-500">
            Round {challengerIndex} of {Math.max(1, pool.length - 1)}
          </p>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full table-fixed text-sm text-slate-700" data-testid="compare-page-table">
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[38%]" />
                  <col className="w-[38%]" />
                </colgroup>
                <tbody>
                  <tr className="bg-slate-100/40">
                    <th className="px-6 py-5 text-left text-[28px] font-medium text-slate-700">Name</th>
                    <td className="px-6 py-5 text-center text-4xl font-bold text-slate-900">
                      {leftComparedHotel?.name ?? champion.name}
                    </td>
                    <td className="px-6 py-5 text-center text-4xl font-bold text-slate-900">
                      {rightComparedHotel?.name ?? challenger.name}
                    </td>
                  </tr>

                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-500"> </th>
                    <td className="px-6 py-4">
                      <img
                        src={leftComparedHotel?.pictures?.[0] ?? HOTEL_FALLBACK_IMAGE}
                        alt={leftComparedHotel?.name ?? champion.name}
                        className="mx-auto h-48 w-full max-w-[420px] rounded-xl object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={rightComparedHotel?.pictures?.[0] ?? HOTEL_FALLBACK_IMAGE}
                        alt={rightComparedHotel?.name ?? challenger.name}
                        className="mx-auto h-48 w-full max-w-[420px] rounded-xl object-cover"
                      />
                    </td>
                  </tr>

                  <tr className="bg-slate-100/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">location</th>
                    <td className="px-6 py-4 text-center">{leftComparedHotel?.location || '-'}</td>
                    <td className="px-6 py-4 text-center">{rightComparedHotel?.location || '-'}</td>
                  </tr>

                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">General</th>
                    <td className="px-6 py-4 text-center">{toRowText(leftFacilityGroups.general)}</td>
                    <td className="px-6 py-4 text-center">{toRowText(rightFacilityGroups.general)}</td>
                  </tr>

                  <tr className="bg-slate-100/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Food &amp; Beverage</th>
                    <td className="px-6 py-4 text-center">{toRowText(leftFacilityGroups.foodAndBeverage)}</td>
                    <td className="px-6 py-4 text-center">{toRowText(rightFacilityGroups.foodAndBeverage)}</td>
                  </tr>

                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Recreation &amp; Wellness</th>
                    <td className="px-6 py-4 text-center">{toRowText(leftFacilityGroups.recreationAndWellness)}</td>
                    <td className="px-6 py-4 text-center">{toRowText(rightFacilityGroups.recreationAndWellness)}</td>
                  </tr>

                  <tr className="bg-slate-100/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Transportation</th>
                    <td className="px-6 py-4 text-center">{toRowText(leftFacilityGroups.transportation)}</td>
                    <td className="px-6 py-4 text-center">{toRowText(rightFacilityGroups.transportation)}</td>
                  </tr>

                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Services</th>
                    <td className="px-6 py-4 text-center">{toRowText(leftFacilityGroups.services)}</td>
                    <td className="px-6 py-4 text-center">{toRowText(rightFacilityGroups.services)}</td>
                  </tr>

                  <tr className="bg-slate-100/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Pet &amp; Special Policy</th>
                    <td className="px-6 py-4 text-center">{toRowText(leftFacilityGroups.petAndPolicy)}</td>
                    <td className="px-6 py-4 text-center">{toRowText(rightFacilityGroups.petAndPolicy)}</td>
                  </tr>

                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">price</th>
                    <td className="px-6 py-4 text-center text-emerald-600">
                      {leftComparedHotel?.avgPrice !== null && leftComparedHotel?.avgPrice !== undefined
                        ? leftComparedHotel.avgPrice.toLocaleString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center text-emerald-600">
                      {rightComparedHotel?.avgPrice !== null && rightComparedHotel?.avgPrice !== undefined
                        ? rightComparedHotel.avgPrice.toLocaleString()
                        : '-'}
                    </td>
                  </tr>

                  <tr className="bg-slate-100/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">matching with</th>
                    <td className="px-6 py-4 text-center">{leftComparedHotel?.bestFor || 'Unknown'}</td>
                    <td className="px-6 py-4 text-center">{rightComparedHotel?.bestFor || 'Unknown'}</td>
                  </tr>

                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">summarize</th>
                    <td className="px-6 py-4 text-center">{leftComparedHotel?.summary || 'No summary'}</td>
                    <td className="px-6 py-4 text-center">{rightComparedHotel?.summary || 'No summary'}</td>
                  </tr>

                  <tr className="bg-slate-100/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-600"> </th>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="primary"
                        className="btn-md"
                        onClick={() => {
                          void handlePick('left');
                        }}
                        disabled={isComparing}
                        testId="compare-page-pick-left"
                      >
                        I prefer this !
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="primary"
                        className="btn-md"
                        onClick={() => {
                          void handlePick('right');
                        }}
                        disabled={isComparing}
                        testId="compare-page-pick-right"
                      >
                        I prefer this !
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {isComparing ? (
            <p className="text-sm text-slate-500" data-testid="compare-page-comparing">Comparing hotels with backend...</p>
          ) : null}
        </section>
      ) : null}

      {eliminatedHotels.length > 0 ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-6" data-testid="compare-page-eliminated">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Eliminated Hotels</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {eliminatedHotels.map((hotel) => (
              <span
                key={hotel._id}
                className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm text-slate-600"
              >
                {hotel.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
