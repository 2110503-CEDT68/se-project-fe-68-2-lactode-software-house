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

  const [mode, setMode] = useState<Mode>('view');

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
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
      firstname: user.name || '',
      lastname: user.name || '',
      email: user.email || '',
      tel: user.tel || '',
    });
  }, [user]);

  const fullName = useMemo(() => {
    if (!user) return '';
    return `${user.name || ''} ${user.name || ''}`.trim();
  }, [user]);

  const initial = useMemo(() => {
    if (!user) return 'U';
    return user.name?.charAt(0).toUpperCase() || 'U';
  }, [user]);

  const roleLabel = useMemo(() => {
    if (!user) return 'User';
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'hotel owner') return 'Hotel';
    return 'User';
  }, [user]);

  const welcomeName = useMemo(() => {
    if (!user) return 'User';
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'hotel owner') return 'Owner';
    return fullName;
  }, [user, fullName]);

  const quickActions = useMemo(() => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'view booking', href: '/admin/bookings' },
      ];
    }

    if (user.role === 'hotel owner') {
      return [
        { label: 'Hotel Profile', href: '/owner/hotels' },
        { label: 'Booking', href: '/owner/bookings' },
      ];
    }

    return [
      { label: 'Book a Room', href: '/hotels' },
      { label: 'My booking', href: '/user/bookings' },
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
      firstname: user.name || '',
      lastname: user.name || '',
      email: user.email || '',
      tel: user.tel || '',
    });
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
                onSubmit={() => {}}
              />
            )}

            {mode === 'change-password' && (
              <ChangePasswordForm
                values={passwordForm}
                error={passwordError}
                loading={passwordLoading}
                onChange={setPasswordForm}
                onCancel={openViewMode}
                onSubmit={() => {}}
              />
            )}

            <QuickActionsCard actions={quickActions} />
          </div>
        </section>
      </div>
    </main>
  );
}