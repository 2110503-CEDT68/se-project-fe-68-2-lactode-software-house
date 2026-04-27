'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BedDouble,
  BookUser,
  Building2,
  Heart,
  LogIn,
  LogOut,
  ShieldUser,
  Trophy,
  User as UserIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getRoleLandingPath, normalizeRoleForPath } from '@/src/lib/rolePath';

type NavRole = 'guest' | 'user' | 'hotelOwner' | 'admin';

export default function Navbar() {
  const router = useRouter();
  const { user, logoutUser } = useApp();

  const role = normalizeRoleForPath(user?.role) as NavRole;
  const homePath = '/';
  const fullName = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim();
  const displayName = user?.username || fullName || 'Account';

  return (
    <header className="navbar" data-testid="navbar">
      <div className="navbar-container" data-testid="navbar-container">
        <Link href={homePath} className="navbar-logo" data-testid="navbar-home">
          <div className="navbar-logo-icon">
            <Building2 className="navbar-logo-building" />
          </div>

          <div className="navbar-title-group">
            <div className="navbar-title-line">LACTODE</div>
            <div className="navbar-title-line">SOFEWARE HOUSE</div>
          </div>
        </Link>

        <nav className="navbar-menu" data-testid={`navbar-menu-${role}`}>
          {role === 'guest' && (
            <>
              <Link href="/hotels" className="navbar-menu-item" data-testid="navbar-hotels">
                <BedDouble className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel</span>
              </Link>
              <Link href="/ranking" className="navbar-menu-item" data-testid="navbar-ranking">
                <Trophy className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel Ranking</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/signin" className="navbar-menu-item" data-testid="navbar-signin">
                <LogIn className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Login</span>
              </Link>
            </>
          )}

          {role === 'user' && (
            <>
              <Link href="/hotels" className="navbar-menu-item" data-testid="navbar-hotels">
                <BedDouble className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel</span>
              </Link>
              <Link href="/ranking" className="navbar-menu-item" data-testid="navbar-ranking">
                <Trophy className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel Ranking</span>
              </Link>

              <Link href="/user/bookings" className="navbar-menu-item" data-testid="navbar-user-bookings">
                <BookUser className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>My Bookings</span>
              </Link>
              <Link href="/user/favorites" className="navbar-menu-item" data-testid="navbar-user-favorites">
                <Heart className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Favorites</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/account" className="navbar-menu-item navbar-menu-item-account" data-testid="navbar-account">
                <UserIcon className="navbar-menu-icon navbar-menu-icon-account inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  router.push('/');
                }}
                className="navbar-menu-button"
                data-testid="navbar-logout"
              >
                <LogOut className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Logout</span>
              </button>
            </>
          )}

          {role === 'hotelOwner' && (
            <>
              <Link href="/owner/dashboard" className="navbar-menu-item" data-testid="navbar-owner-dashboard">
                <BedDouble className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel Management</span>
              </Link>
              <Link href="/ranking" className="navbar-menu-item" data-testid="navbar-ranking">
                <Trophy className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel Ranking</span>
              </Link>

              <Link href="/owner/bookings" className="navbar-menu-item" data-testid="navbar-owner-bookings">
                <BookUser className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Bookings</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/account" className="navbar-menu-item navbar-menu-item-account" data-testid="navbar-account">
                <UserIcon className="navbar-menu-icon navbar-menu-icon-account inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  router.push('/');
                }}
                className="navbar-menu-button"
                data-testid="navbar-logout"
              >
                <LogOut className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Logout</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <Link href="/admin/hotels" className="navbar-menu-item" data-testid="navbar-admin-hotels">
                <BedDouble className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel</span>
              </Link>
              <Link href="/ranking" className="navbar-menu-item" data-testid="navbar-ranking">
                <Trophy className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Hotel Ranking</span>
              </Link>

              <Link href="/admin" className="navbar-menu-item" data-testid="navbar-admin-dashboard">
                <ShieldUser className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Admin dashboard</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/account" className="navbar-menu-item navbar-menu-item-account" data-testid="navbar-account">
                <UserIcon className="navbar-menu-icon navbar-menu-icon-account inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  router.push('/');
                }}
                className="navbar-menu-button"
                data-testid="navbar-logout"
              >
                <LogOut className="navbar-menu-icon inline-flex items-center justify-center w-[18px] h-[18px]" />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
