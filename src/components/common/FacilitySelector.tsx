import FacilityBadge from './FacilityBadge';
import { FacilityScope, getFacilityOptions } from '@/src/constants/facilities';

interface Props {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  scope?: FacilityScope;
}

export default function FacilitySelector({
  options,
  value,
  onChange,
  scope = 'hotel',
}: Props) {
  const toggle = (label: string) => {
    if (value.includes(label)) {
      onChange(value.filter((f) => f !== label));
    } else {
      onChange([...value, label]);
    }
  };

  const filteredFacilities = getFacilityOptions(scope).filter((facility) =>
    options.includes(facility.label)
  );

  return (
    <div className="flex flex-wrap gap-3">
      {filteredFacilities.map(({ label, icon }) => (
        <FacilityBadge
          key={label}
          label={label}
          icon={icon}
          active={value.includes(label)}
          selectable
          onClick={() => toggle(label)}
        />
      ))}
    </div>
  );
}
