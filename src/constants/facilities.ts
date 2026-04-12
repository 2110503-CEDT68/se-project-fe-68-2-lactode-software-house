import {
  Bath,
  LucideIcon,
  Refrigerator,
  ShieldCheck,
  Tv,
  UtensilsCrossed,
  Wifi,
  Wind,
} from 'lucide-react';

export type FacilityOption = {
  label: string;
  icon: LucideIcon;
};

export const FACILITY_OPTIONS: FacilityOption[] = [
  { label: 'Free Wi-Fi', icon: Wifi },
  { label: 'Breakfast', icon: UtensilsCrossed },
  { label: 'Shower', icon: Bath },
  { label: 'Refrigerator', icon: Refrigerator },
  { label: 'TV', icon: Tv },
  { label: 'Air Conditioning', icon: Wind },
  { label: 'Smoke Alarm', icon: ShieldCheck },
  { label: 'Non-Smoking', icon: ShieldCheck },
];
