import Button from '@/src/components/common/Button';

type QuickAction = {
  label: string;
  href: string;
};

type QuickActionsCardProps = {
  actions: QuickAction[];
};

export default function QuickActionsCard({ actions }: QuickActionsCardProps) {
  return (
    <section className="card account-card">
      <h3 className="account-card__title">Quick Actions</h3>

      <div className="account-quick-actions">
        {actions.map((action) => (
          <Button
            key={action.href}
            href={action.href}
            variant="primary"
            className="btn-sm"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}