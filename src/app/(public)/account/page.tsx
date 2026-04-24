'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/src/components/common/Button';
import AccountHeader from '@/src/components/account/AccountHeader';
import AccountSidebar from '@/src/components/account/AccountSidebar';
import AccountInfoCard from '@/src/components/account/AccountInfoCard';
import EditProfileForm, {
  ProfileFormState,
} from '@/src/components/account/EditProfileForm';
import ChangePasswordForm, {
  PasswordFormState,
} from '@/src/components/account/ChangePasswordForm';
import QuickActionsCard from '@/src/components/account/QuickActionsCard';
import { useApp } from '@/src/context/AppContext';

type Mode = 'view' | 'edit-profile' | 'change-password';

export default function AccountPage() {
  const { user, updateUser, updatePassword, logoutUser } = useApp();
  const getFullName = (target: typeof user) =>
    `${target?.firstname ?? ''} ${target?.lastname ?? ''}`.trim() || target?.username || '';

  const [mode, setMode] = useState<Mode>('view');

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    tel: '',
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      username: user.username || '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      tel: user.tel || '',
    });
  }, [user]);

  const fullName = useMemo(() => {
    if (!user) return '';
    return getFullName(user);
  }, [user]);

  const initial = useMemo(() => {
    if (!user) return 'U';
    return (user.firstname?.charAt(0) || user.lastname?.charAt(0) || user.username?.charAt(0) || 'U').toUpperCase();
  }, [user]);

  const roleLabel = useMemo(() => {
    if (!user) return 'User';
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'hotelOwner') return 'Hotel';
    return 'User';
  }, [user]);

  const welcomeName = useMemo(() => {
    if (!user) return 'User';
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'hotelOwner') return 'Owner';
    return fullName;
  }, [user, fullName]);

  const quickActions = useMemo(() => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Hotels', href: '/admin/hotels' },
        { label: 'Bookings', href: '/admin/bookings' },
      ];
    }

    if (user.role === 'hotelOwner') {
      return [
        { label: 'Dashboard', href: '/owner/dashboard' },
        { label: 'Hotels', href: '/owner/hotels' },
        { label: 'Bookings', href: '/owner/bookings' },
      ];
    }

    return [
      { label: 'Hotels', href: '/hotels' },
      { label: 'Bookings', href: '/user/bookings' },
    ];
  }, [user]);

  const openViewMode = () => {
    setMode('view');
    setProfileError('');
    setPasswordError('');
  };

  const openEditProfileMode = () => {
    if (!user) return;

    setMode('edit-profile');
    setProfileError('');
    setPasswordError('');

    setProfileForm({
      username: user.username || '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      tel: user.tel || '',
    });
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setProfileError('');
    setProfileMessage('');

    const username = profileForm.username.trim();
    const firstname = profileForm.firstname.trim();
    const lastname = profileForm.lastname.trim();
    const email = profileForm.email.trim().toLowerCase();
    const tel = profileForm.tel.trim();

    if (!username || !firstname || !lastname || !email || !tel) {
      setProfileError('Please fill in all fields.');
      return;
    }

    setProfileLoading(true);
    const result = await updateUser({
      username,
      firstname,
      lastname,
      email,
      tel,
    });
    setProfileLoading(false);

    if (!result.ok) {
      setProfileError(result.message);
      return;
    }

    setProfileMessage(result.message);
    setMode('view');
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setPasswordError('');
    setPasswordMessage('');

    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const rePassword = passwordForm.confirmPassword.trim();

    if (!currentPassword || !newPassword || !rePassword) {
      setPasswordError('Please fill in all fields.');
      return;
    }

    if (newPassword !== rePassword) {
      setPasswordError('New password confirmation mismatch.');
      return;
    }

    setPasswordLoading(true);
    const result = await updatePassword({
      currentPassword,
      newPassword,
      rePassword,
    });
    setPasswordLoading(false);

    if (!result.ok) {
      setPasswordError(result.message);
      return;
    }

    setPasswordMessage(result.message);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setMode('view');
  };

  const openChangePasswordMode = () => {
    setMode('change-password');
    setProfileError('');
    setPasswordError('');

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // ================= FIX อยู่ตรงนี้ =================
  if (!user) {
    return (
      <main className="account-page px-4 py-10">
        <div className="mx-auto max-w-[1088px]">
          <div className="card text-center p-10">
            <h1 className="text-subtitle m-0">Profile</h1>
            <p className="text-subdetail mt-3">
              You need to sign in before viewing your profile.
            </p>

            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Button href="/signin" variant="primary" className="btn-md">
                Go to Login
              </Button>

              <Button href="/" variant="disabled" className="btn-md">
                Back Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page px-4 py-10">
      {/* ✅ FIX: center container */}
      <div className="mx-auto max-w-[1088px] w-full">
        <AccountHeader name={welcomeName} />

        {(profileMessage || passwordMessage) && (
          <div className="account-success-message">
            {profileMessage || passwordMessage}
          </div>
        )}

        <section className="account-layout">
          <AccountSidebar
            fullName={fullName}
            email={user.email}
            roleLabel={roleLabel}
            initial={initial}
          />

          <div className="account-right-column">
            {mode === 'view' && (
              <AccountInfoCard
                fullName={fullName}
                username={user.username || ''}
                email={user.email}
                tel={user.tel}
                onLogout={logoutUser}
                onEditProfile={openEditProfileMode}
                onChangePassword={openChangePasswordMode}
              />
            )}

            {mode === 'edit-profile' && (
              <EditProfileForm
                values={profileForm}
                error={profileError}
                loading={profileLoading}
                onChange={setProfileForm}
                onCancel={openViewMode}
                onSubmit={handleProfileSubmit}
              />
            )}

            {mode === 'change-password' && (
              <ChangePasswordForm
                values={passwordForm}
                error={passwordError}
                loading={passwordLoading}
                onChange={setPasswordForm}
                onCancel={openViewMode}
                onSubmit={handlePasswordSubmit}
              />
            )}

            <QuickActionsCard actions={quickActions} />
          </div>
        </section>
      </div>
    </main>
  );
}
