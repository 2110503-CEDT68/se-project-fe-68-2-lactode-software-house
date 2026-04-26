'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthCard from '@/src/components/common/AuthCard';
import { useApp } from '@/src/context/AppContext';

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useApp();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function sanitizeMessage(message: string): string {
    let errorMessage = message.toLowerCase();
  if (errorMessage.includes('password')) {
    return 'Password must be at least 6 characters.';
  }
  if (errorMessage.includes('email') && message.toLowerCase().includes('dup key')) {
    return 'This email is already taken.';
  }
  // if (message.toLowerCase().includes('username')) {
  //   return 'This username is already taken.';
  // }
  return message;
}

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8" data-testid="register-page">
      <AuthCard title="Create account" subtitle="Register with your first name, last name, username, email, telephone number, and password.">
        <form
          className="space-y-5"
          data-testid="register-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            const result = await registerUser({ firstname, lastname, username, email, tel, password });
            setMessage(sanitizeMessage(result.message));
            setSubmitting(false);
            if (result.ok) {
              setTimeout(() => router.push('/signin'), 700);
            }
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">First Name</span>
            <input value={firstname} onChange={(event) => setFirstname(event.target.value)} placeholder="First name" data-testid="register-firstname" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Last Name</span>
            <input value={lastname} onChange={(event) => setLastname(event.target.value)} placeholder="Last name" data-testid="register-lastname" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Display name" data-testid="register-username" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="example@gmail.com" data-testid="register-email" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Telephone Number</span>
            <input value={tel} onChange={(event) => setTel(formatPhoneInput(event.target.value))} placeholder="012-345-6789" data-testid="register-tel" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" data-testid="register-password" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500" />
          </label>

          {/* Terms & Privacy checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              data-testid="register-agree-privacy"
              className="mt-1 h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
            />
            <span className="text-sm text-slate-600">
              I agree to the {' '}
              <a href="/privacy" className="rounded-sm font-semibold underline underline-offset-4 transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
              Privacy Policy
              </a>
            </span>
          </label>

          {message ? (
            <p className={`rounded-2xl px-4 py-3 text-sm ${message.toLowerCase().includes('account created') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`} data-testid="register-message">
              {message}
            </p>
          ) : null}

          <button
            disabled={submitting || !agreed}
            data-testid="register-submit"
            style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
            className="w-full rounded-2xl bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
