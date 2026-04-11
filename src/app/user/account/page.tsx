'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/src/context/AppContext';

type ProfileFormState = {
  name: string;
  email: string;
  tel: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfilePage() {
  const { user, updateUser, updatePassword } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: '',
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
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        tel: user.tel,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-10 text-center">
        <div className="w-full rounded-[28px] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <span className="text-3xl font-bold text-slate-500">?</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="mt-3 text-slate-500">
            You need to sign in before viewing your profile.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const initial = user.name?.charAt(0).toUpperCase() || 'U';

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (!profileForm.name.trim() || !profileForm.email.trim() || !profileForm.tel.trim()) {
      setProfileError('Please complete all profile fields.');
      return;
    }

    if (!emailRegex.test(profileForm.email)) {
      setProfileError('Please enter a valid email address.');
      return;
    }

    if (!telRegex.test(profileForm.tel)) {
      setProfileError('Telephone number must be in xxx-xxx-xxxx format.');
      return;
    }

    try {
      setProfileLoading(true);

      const result = await updateUser(user._id, {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        tel: profileForm.tel.trim(),
      });

      if (!result.ok) {
        setProfileError(result.message);
        return;
      }

      setProfileMessage(result.message);
      setIsEditingProfile(false);
    } catch {
      setProfileError('Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!passwordForm.currentPassword.trim()) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!passwordForm.newPassword.trim() || !passwordForm.confirmPassword.trim()) {
      setPasswordError('Please complete all password fields.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    try {
      setPasswordLoading(true);

      const result = await updatePassword(user._id, {
        currentPassword: passwordForm.currentPassword.trim(),
        newPassword: passwordForm.newPassword.trim(),
      });

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
      setIsChangingPassword(false);
    } catch {
      setPasswordError('Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          My Profile
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Welcome back, {user.name}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Manage your account details and keep your password secure.
        </p>
      </section>

      {(profileMessage || passwordMessage) && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {profileMessage || passwordMessage}
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
              <span className="text-4xl font-bold text-slate-600">{initial}</span>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>

            <span className="mt-4 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold capitalize text-brand-600">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold text-slate-900">Account Information</h3>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProfileError('');
                    setProfileMessage('');
                    setIsEditingProfile((prev) => !prev);
                    setIsChangingPassword(false);
                    setProfileForm({
                      name: user.name,
                      email: user.email,
                      tel: user.tel,
                    });
                  }}
                  className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  Change Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPasswordError('');
                    setPasswordMessage('');
                    setIsChangingPassword((prev) => !prev);
                    setIsEditingProfile(false);
                  }}
                  className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  Change Password
                </button>
              </div>
            </div>

            {!isEditingProfile && !isChangingPassword && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Full Name</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{user.name}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{user.email}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Telephone</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{user.tel}</p>
                </div>
              </div>
            )}

            {isEditingProfile && (
              <form onSubmit={handleProfileSave} className="mt-6 space-y-5">
                {profileError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {profileError}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Telephone
                  </label>
                  <input
                    type="text"
                    value={profileForm.tel}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, tel: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="081-234-5678"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    {profileLoading ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {isChangingPassword && (
              <form onSubmit={handlePasswordSave} className="mt-6 space-y-5">
                {passwordError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
            <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/hotel"
                className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Book a Hotel
              </Link>

              {user.role === 'user' && (
                <Link
                href="/my-booking"
                className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  My Bookings
                </Link>
              )}

              {user.role === 'admin' && (
                <Link
                  href="/admin/bookings"
                  className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}