type FacilityBadgeProps = {
    label: string;
    active?: boolean;
  };
  
  export default function FacilityBadge({
    label,
    active = false,
  }: FacilityBadgeProps) {
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
          active
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-bg-card-2)] text-[var(--color-text-secondary)]"
        }`}
      >
        {label}
      </span>
    );
  }