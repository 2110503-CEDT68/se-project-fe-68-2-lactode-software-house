import { Booking, User } from '@/types';

export const USERS_KEY = 'tum-dai-d-users';
export const BOOKINGS_KEY = 'tum-dai-d-bookings';
export const CURRENT_USER_KEY = 'tum-dai-d-current-user';

export const adminSeed: User = {
  _id: 'admin-1',
  firstname: 'Jame',
  lastname: 'Admin',
  username: 'Jame Admin',
  email: 'admin@tumdaid.com',
  tel: '099-999-9999',
  role: 'admin',
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [adminSeed];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify([adminSeed]));
    return [adminSeed];
  }

  const parsed = JSON.parse(raw) as User[];
  if (!parsed.find((user) => user.email === adminSeed.email)) {
    const merged = [adminSeed, ...parsed];
    window.localStorage.setItem(USERS_KEY, JSON.stringify(merged));
    return merged;
  }
  return parsed;
}

export function saveUsers(users: User[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(BOOKINGS_KEY);
  return raw ? (JSON.parse(raw) as Booking[]) : [];
}

export function saveBookings(bookings: Booking[]) {
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}
