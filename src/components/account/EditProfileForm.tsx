import Button from '@/src/components/common/Button';

export type ProfileFormState = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
};

type EditProfileFormProps = {
  values: ProfileFormState;
  error: string;
  loading: boolean;
  onChange: (values: ProfileFormState) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function EditProfileForm({
  values,
  error,
  loading,
  onChange,
  onCancel,
  onSubmit,
}: EditProfileFormProps) {
  return (
    <section className="card account-card">
      <h3 className="account-card__title">Account Information</h3>

      <form onSubmit={onSubmit} className="account-form">
        {error ? <div className="account-form__error">{error}</div> : null}

        <div className="account-form__field">
          <label htmlFor="account-firstname">First Name</label>
          <input
            id="account-firstname"
            className="input"
            type="text"
            value={values.firstname}
            onChange={(e) => onChange({ ...values, firstname: e.target.value })}
          />
        </div>

        <div className="account-form__field">
          <label htmlFor="account-lastname">Last Name</label>
          <input
            id="account-lastname"
            className="input"
            type="text"
            value={values.lastname}
            onChange={(e) => onChange({ ...values, lastname: e.target.value })}
          />
        </div>

        <div className="account-form__field">
          <label htmlFor="account-username">Username</label>
          <input
            id="account-username"
            className="input"
            type="text"
            value={values.username}
            onChange={(e) => onChange({ ...values, username: e.target.value })}
          />
        </div>

        <div className="account-form__field">
          <label htmlFor="account-email">Email</label>
          <input
            id="account-email"
            className="input"
            type="email"
            value={values.email}
            onChange={(e) => onChange({ ...values, email: e.target.value })}
          />
        </div>

        <div className="account-form__field">
          <label htmlFor="account-tel">Phone Number</label>
          <input
            id="account-tel"
            className="input"
            type="text"
            value={values.tel}
            onChange={(e) => onChange({ ...values, tel: e.target.value })}
          />
        </div>

        <div className="account-form__actions">
          <Button variant="disabled" className="btn-sm" onClick={onCancel}>
            cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="btn-sm"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </section>
  );
}
