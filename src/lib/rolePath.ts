import { Role } from '@/types';

export function normalizeRoleForPath(rawRole: unknown): Role {
  if (typeof rawRole !== 'string') return 'guest';

  const role = rawRole.trim().toLowerCase();
  if (role === 'admin') return 'admin';
  if (role === 'user') return 'user';
  if (['hotel owner', 'owner', 'hotelowner', 'hotel_owner', 'hotel-owner'].includes(role)) {
    return 'hotelOwner';
  }

  return 'guest';
}

export function getRoleLandingPath(rawRole: unknown) {
  const role = normalizeRoleForPath(rawRole);

  if (role === 'admin') return '/admin/dashboard';
  if (role === 'hotelOwner') return '/owner/dashboard';
  if (role === 'user') return '/hotels';
  return '/hotels';
}
