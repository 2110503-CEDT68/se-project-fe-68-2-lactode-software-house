'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BedDouble,
  BookUser,
  Building2,
  LogIn,
  LogOut,
  ShieldUser,
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
    <header className="navbar">
      <div className="navbar-container">
        <Link href={homePath} className="navbar-logo">
          <div className="navbar-logo-icon">
            <Building2 className="navbar-logo-building" />
          </div>

          <div className="navbar-title-group">
            <div className="navbar-title-line">LACTODE</div>
            <div className="navbar-title-line">SOFEWARE HOUSE</div>
          </div>
        </Link>

        <nav className="navbar-menu">
          {role === 'guest' && (
            <>
              <Link href="/hotels" className="navbar-menu-item">
                <BedDouble className="navbar-menu-icon" />
                <span>Hotel</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/signin" className="navbar-menu-item">
                <LogIn className="navbar-menu-icon" />
                <span>Login</span>
              </Link>
            </>
          )}

          {role === 'user' && (
            <>
              <Link href="/hotels" className="navbar-menu-item">
                <BedDouble className="navbar-menu-icon" />
                <span>Hotel</span>
              </Link>

              <Link href="/user/bookings" className="navbar-menu-item">
                <BookUser className="navbar-menu-icon" />
                <span>My Bookings</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/account" className="navbar-menu-item navbar-menu-item-account">
                <UserIcon className="navbar-menu-icon navbar-menu-icon-account" />
                <span>{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  router.push('/');
                }}
                className="navbar-menu-button"
              >
                <LogOut className="navbar-menu-icon" />
                <span>Logout</span>
              </button>
            </>
          )}

          {role === 'hotelOwner' && (
            <>
              <Link href="/owner/hotels" className="navbar-menu-item">
                <BedDouble className="navbar-menu-icon" />
                <span>Hotel Management</span>
              </Link>

              <Link href="/owner/bookings" className="navbar-menu-item">
                <BookUser className="navbar-menu-icon" />
                <span>Bookings</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/account" className="navbar-menu-item navbar-menu-item-account">
                <UserIcon className="navbar-menu-icon navbar-menu-icon-account" />
                <span>{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  router.push('/');
                }}
                className="navbar-menu-button"
              >
                <LogOut className="navbar-menu-icon" />
                <span>Logout</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <Link href="/admin" className="navbar-menu-item">
                <ShieldUser className="navbar-menu-icon" />
                <span>Admin dashboard</span>
              </Link>

              <Link href="/admin/hotels" className="navbar-menu-item">
                <BedDouble className="navbar-menu-icon" />
                <span>Hotel</span>
              </Link>

              <div className="navbar-divider" />

              <Link href="/account" className="navbar-menu-item navbar-menu-item-account">
                <UserIcon className="navbar-menu-icon navbar-menu-icon-account" />
                <span>{displayName}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  router.push('/');
                }}
                className="navbar-menu-button"
              >
                <LogOut className="navbar-menu-icon" />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
