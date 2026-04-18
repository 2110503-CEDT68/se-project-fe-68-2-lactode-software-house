import FacilityBadge from './FacilityBadge';
import { FacilityScope, getFacilityOption, normalizeFacilitiesForDisplay } from '@/src/constants/facilities';

type Props = {
  facilities: string[];
  scope?: FacilityScope;
};

export default function FacilityList({ facilities, scope = 'hotel' }: Props) {
  const normalizedFacilities = normalizeFacilitiesForDisplay(facilities, scope);

  return (
    <div className="flex flex-wrap gap-3">
      {normalizedFacilities.map((label) => {
        const { icon } = getFacilityOption(label, scope);
        return (
          <FacilityBadge
            key={label}
            label={label}
            icon={icon}
          />
        );
      })}
    </div>
  );
}
