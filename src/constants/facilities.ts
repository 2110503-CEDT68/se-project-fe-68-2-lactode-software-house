import {
  Bath,
  Bell,
  Car,
  Dumbbell,
  LucideIcon,
  Phone,
  Refrigerator,
  Shirt,
  ShieldCheck,
  Sparkles,
  Tv,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  Wine,
} from 'lucide-react';

export type FacilityScope = 'hotel' | 'room';

export type FacilityOption = {
  value: string;
  label: string;
  icon: LucideIcon;
  aliases?: string[];
};

export const HOTEL_FACILITY_OPTIONS: FacilityOption[] = [
  { value: 'wifi', label: 'Free Wi-Fi', icon: Wifi, aliases: ['wifi', 'wi-fi', 'free wifi', 'free wi-fi'] },
  { value: 'parking', label: 'Parking', icon: Car },
  { value: 'pool', label: 'Swimming Pool', icon: Waves, aliases: ['swimming pool'] },
  { value: 'gym', label: 'Fitness Center', icon: Dumbbell, aliases: ['gym'] },
  { value: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
  { value: 'bar', label: 'Bar/Lounge', icon: Wine, aliases: ['bar'] },
  { value: 'spa', label: 'Spa', icon: Sparkles },
  { value: 'laundry', label: 'Laundry', icon: Shirt },
  { value: 'room_service', label: 'Room Service', icon: Bell, aliases: ['room service'] },
  { value: 'air_conditioning', label: 'Air Conditioning', icon: Wind, aliases: ['air conditioning', 'ac'] },
  { value: 'heating', label: 'Heating', icon: Wind },
  { value: 'concierge', label: 'Concierge', icon: Bell },
  { value: 'conference_room', label: 'Conference Room', icon: ShieldCheck, aliases: ['conference room'] },
  { value: 'elevator', label: 'Elevator', icon: ShieldCheck },
  { value: 'garden', label: 'Garden', icon: Sparkles },
  { value: 'library', label: 'Library', icon: ShieldCheck },
  { value: 'safe', label: 'In-room Safe', icon: ShieldCheck, aliases: ['safe'] },
  { value: 'tv', label: 'TV', icon: Tv },
  { value: 'minibar', label: 'Minibar', icon: Refrigerator, aliases: ['refrigerator'] },
  { value: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
];

export const ROOM_FACILITY_OPTIONS: FacilityOption[] = [
  { value: 'wifi', label: 'Free Wi-Fi', icon: Wifi, aliases: ['wifi', 'wi-fi', 'free wifi', 'free wi-fi'] },
  { value: 'air_conditioning', label: 'Air Conditioning', icon: Wind, aliases: ['air conditioning', 'ac'] },
  { value: 'heating', label: 'Heating', icon: Wind },
  { value: 'tv', label: 'TV', icon: Tv },
  { value: 'minibar', label: 'Minibar', icon: Refrigerator, aliases: ['refrigerator'] },
  { value: 'safe', label: 'In-room Safe', icon: ShieldCheck, aliases: ['safe'] },
  { value: 'bathroom', label: 'Bathroom', icon: Bath },
  { value: 'balcony', label: 'Balcony', icon: Sparkles },
  { value: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { value: 'shower', label: 'Shower', icon: Bath },
  { value: 'bathtub', label: 'Bathtub', icon: Bath },
  { value: 'hairdryer', label: 'Hair Dryer', icon: Wind, aliases: ['hair dryer'] },
  { value: 'iron', label: 'Iron', icon: ShieldCheck },
  { value: 'desk', label: 'Work Desk', icon: ShieldCheck, aliases: ['desk'] },
  { value: 'sofa', label: 'Sofa', icon: ShieldCheck },
  { value: 'telephone', label: 'Telephone', icon: Phone },
  { value: 'coffee_maker', label: 'Coffee Maker', icon: UtensilsCrossed, aliases: ['coffee maker'] },
  { value: 'dining_area', label: 'Dining Area', icon: UtensilsCrossed, aliases: ['dining area'] },
  { value: 'work_area', label: 'Work Area', icon: ShieldCheck, aliases: ['work area'] },
  { value: 'room_service', label: 'Room Service', icon: Bell, aliases: ['room service'] },
];

const DEFAULT_FACILITY_ICON: LucideIcon = ShieldCheck;

type FacilityRegistry = {
  options: FacilityOption[];
  byValue: Map<string, FacilityOption>;
  byLabelOrAlias: Map<string, FacilityOption>;
};

const normalizeFacilityKey = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s_-]+/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

const titleCaseFromKey = (value: string) =>
  value
    .split('_')
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');

const createRegistry = (options: FacilityOption[]): FacilityRegistry => {
  const byValue = new Map<string, FacilityOption>();
  const byLabelOrAlias = new Map<string, FacilityOption>();

  for (const option of options) {
    byValue.set(normalizeFacilityKey(option.value), option);
    byLabelOrAlias.set(option.label.trim().toLowerCase(), option);

    for (const alias of option.aliases ?? []) {
      byLabelOrAlias.set(alias.trim().toLowerCase(), option);
    }
  }

  return {
    options,
    byValue,
    byLabelOrAlias,
  };
};

const FACILITY_REGISTRIES: Record<FacilityScope, FacilityRegistry> = {
  hotel: createRegistry(HOTEL_FACILITY_OPTIONS),
  room: createRegistry(ROOM_FACILITY_OPTIONS),
};

const resolveFacilityOption = (input: string, scope: FacilityScope) => {
  const raw = input.trim();
  if (!raw) {
    return {
      known: false,
      option: { value: '', label: '', icon: DEFAULT_FACILITY_ICON } as FacilityOption,
    };
  }

  const registry = FACILITY_REGISTRIES[scope];

  const byLabel = registry.byLabelOrAlias.get(raw.toLowerCase());
  if (byLabel) {
    return { known: true, option: byLabel };
  }

  const normalizedKey = normalizeFacilityKey(raw);
  const byValue = registry.byValue.get(normalizedKey);
  if (byValue) {
    return { known: true, option: byValue };
  }

  return {
    known: false,
    option: {
      value: normalizedKey || raw.toLowerCase(),
      label: titleCaseFromKey(normalizedKey || raw.toLowerCase()),
      icon: DEFAULT_FACILITY_ICON,
    },
  };
};

export function getFacilityOptions(scope: FacilityScope = 'hotel') {
  return FACILITY_REGISTRIES[scope].options;
}

export function getFacilityOption(input: string, scope: FacilityScope = 'hotel') {
  return resolveFacilityOption(input, scope).option;
}

export function normalizeFacilityLabel(input: string, scope: FacilityScope = 'hotel') {
  return getFacilityOption(input, scope).label;
}

export function normalizeFacilityApiValue(input: string, scope: FacilityScope = 'hotel') {
  const resolved = resolveFacilityOption(input, scope);
  return resolved.known ? resolved.option.value : '';
}

export function normalizeFacilitiesForDisplay(facilities: string[], scope: FacilityScope = 'hotel') {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const facility of facilities) {
    if (typeof facility !== 'string') continue;
    const label = normalizeFacilityLabel(facility, scope);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }

  return labels;
}

export function normalizeFacilitiesForApi(facilities: string[], scope: FacilityScope = 'hotel') {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const facility of facilities) {
    if (typeof facility !== 'string') continue;
    const value = normalizeFacilityApiValue(facility, scope);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    values.push(value);
  }

  return values;
}
