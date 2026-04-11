'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthCard from '@/src/components/common/AuthCard';
import { useApp } from '@/src/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <AuthCard title="Sign in" subtitle="Use your email or phone number to access the booking system.">
        <form
          className="space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            const result = await loginUser({ identifier, password });
            setMessage(result.message);
            setSubmitting(false);
            if (result.ok) {
              router.push('/hotel');
            }
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email / Phone</span>
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="example@gmail.com or 012-345-6789"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          {message ? (
            <p className={`rounded-2xl px-4 py-3 text-sm ${message.toLowerCase().includes('successful') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {message}
            </p>
          ) : null}

          <button disabled={submitting} className="w-full rounded-2xl bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-600">
            No account yet?{' '}
            <Link href="/register" className="font-semibold text-brand-600 underline underline-offset-4">
              Register
            </Link>
          </p>
        </form>
      </AuthCard>
    </main>
  );
}
