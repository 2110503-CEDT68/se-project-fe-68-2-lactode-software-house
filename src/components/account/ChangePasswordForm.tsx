import Button from '@/src/components/common/Button';

export type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordFormProps = {
  values: PasswordFormState;
  error: string;
  loading: boolean;
  onChange: (values: PasswordFormState) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ChangePasswordForm({
  values,
  error,
  loading,
  onChange,
  onCancel,
  onSubmit,
}: ChangePasswordFormProps) {
  return (
    <section className="card account-card" data-testid="change-password-form-card">
      <h3 className="account-card__title">Account Information</h3>

      <form onSubmit={onSubmit} className="account-form" data-testid="change-password-form">
        {error ? <div className="account-form__error" data-testid="change-password-error">{error}</div> : null}

        <div className="account-form__field">
          <label htmlFor="account-current-password">Current Password</label>
          <input
            id="account-current-password"
            data-testid="change-password-current"
            className="input"
            type="password"
            value={values.currentPassword}
            onChange={(e) =>
              onChange({ ...values, currentPassword: e.target.value })
            }
            placeholder="Current Password"
          />
        </div>

        <div className="account-form__field">
          <label htmlFor="account-new-password">New Password</label>
          <input
            id="account-new-password"
            data-testid="change-password-new"
            className="input"
            type="password"
            value={values.newPassword}
            onChange={(e) => onChange({ ...values, newPassword: e.target.value })}
            placeholder="New Password"
          />
        </div>

        <div className="account-form__field">
          <label htmlFor="account-confirm-password">Confirm New Password</label>
          <input
            id="account-confirm-password"
            data-testid="change-password-confirm"
            className="input"
            type="password"
            value={values.confirmPassword}
            onChange={(e) =>
              onChange({ ...values, confirmPassword: e.target.value })
            }
            placeholder="Confirm New Password"
          />
        </div>

        <div className="account-form__actions">
          <Button variant="disabled" className="btn-sm" onClick={onCancel} testId="change-password-cancel">
            cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="btn-sm"
            disabled={loading}
            testId="change-password-submit"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </section>
  );
}
