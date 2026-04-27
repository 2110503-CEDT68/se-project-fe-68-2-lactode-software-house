import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  testId?: string;
};

export default function FacilityBadge({
  label,
  icon: Icon,
  active = false,
  selectable = false,
  onClick,
  testId,
}: Props) {
  const Component = selectable ? 'button' : 'span';

  return (
    <Component
      type={selectable ? 'button' : undefined}
      onClick={selectable ? onClick : undefined}
      data-testid={testId}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',

        // ✅ ถ้าเป็น view (ไม่ selectable) → ขาวตลอด
        !selectable
          ? 'border-gray-200 bg-white text-[var(--color-text-primary)]'

          // ✅ ถ้าเป็น select mode
          : active
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
          : 'border-gray-200 bg-white text-[var(--color-text-primary)]',

        // cursor
        selectable ? 'cursor-pointer hover:opacity-90' : 'cursor-default',
      ].join(' ')}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Component>
  );
}
