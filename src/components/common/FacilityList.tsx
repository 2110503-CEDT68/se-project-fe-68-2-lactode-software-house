import FacilityBadge from "./FacilityBadge";

// ── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_FACILITIES: string[] = [
  "Non-Smoking",
  "Free Wi-Fi",
  "Swimming Pool",
  "Fitness Center",
  "Parking",
  "Restaurant",
  "Bar/Lounge",
  "Spa",
  "Room Service",
  "Laundry",
  "Airport Shuttle",
  "Pet Friendly",
  "Air Conditioning",
  "24-Hour Front Desk",
];

// ── Component ────────────────────────────────────────────────────────────────

export default function FacilityList({ facilities }: { facilities: string[] }) {
  if (facilities.length === 0) {
    return <p className="text-sm text-gray-400">No facilities listed.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
    {facilities.map((facility) => (
        <FacilityBadge key={facility} label={facility} />
    ))}
    </div>
  );
}