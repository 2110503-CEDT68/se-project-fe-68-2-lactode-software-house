import FacilityBadge from "./FacilityBadge";

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