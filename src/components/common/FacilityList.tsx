import FacilityBadge from './FacilityBadge';
import { FACILITY_OPTIONS } from '@/src/constants/hotelFacilities';

type Props = {
  facilities: string[];
};

export default function FacilityList({ facilities }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {FACILITY_OPTIONS.filter((f) =>
        facilities.includes(f.label)
      ).map(({ label, icon }) => (
        <FacilityBadge
          key={label}
          label={label}
          icon={icon}
          active={false}
        />
      ))}
    </div>
  );
}
