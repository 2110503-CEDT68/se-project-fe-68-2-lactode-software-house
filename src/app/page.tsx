'use client';

import Link from 'next/link';
import { BedDouble, Search, ShieldUser } from 'lucide-react';
import { useApp } from '@/src/context/AppContext';
import { normalizeRoleForPath } from '@/src/lib/rolePath';

type LandingRole = 'guest' | 'user' | 'hotelOwner' | 'admin';

type LandingAction = {
  href: string;
  label: string;
  icon: React.ReactNode | null;
};

const LANDING_ACTIONS: Record<LandingRole, LandingAction> = {
  guest: {
    href: '/hotels',
    label: 'Browse Hotels',
    icon: <Search className="h-5 w-5" />,
  },
  user: {
    href: '/hotels',
    label: 'Browse Hotels',
    icon: <Search className="h-5 w-5" />,
  },
  hotelOwner: {
    href: '/owner/dashboard',
    label: 'Hotel Management',
    icon: <BedDouble className="h-5 w-5" />,
  },
  admin: {
    href: '/admin',
    label: 'Admin Dashboard',
    icon: <ShieldUser className="h-5 w-5" />,
  },
};

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80';

export default function HomePage() {
  const { user } = useApp();
  const role = normalizeRoleForPath(user?.role) as LandingRole;
  const action = LANDING_ACTIONS[role] ?? LANDING_ACTIONS.guest;

  return (
    <main className="relative min-h-[calc(100vh-120px)] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div className="absolute inset-0 bg-slate-900/55" />

      <section className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold sm:text-5xl">Find Your Perfect Stay</h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.35em] text-slate-100 sm:text-2xl sm:tracking-[0.3em]">
            Discover luxury hotels around the world
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href={action.href}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#3248ce] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#2b3fb4]"
            >
              {action.icon}
              <span>{action.label}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
