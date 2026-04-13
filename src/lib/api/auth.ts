import { LoginInput, RegisterInput, Role, User } from '@/types';
import { request } from './client';

function normalizeRole(rawRole: unknown): Role {
  if (typeof rawRole !== 'string') return 'guest';
  const value = rawRole.trim().toLowerCase();
  if (value === 'admin') return 'admin';
  if (value === 'user') return 'user';
  if (value === 'hotelowner' || value === 'hotel owner' || value === 'owner' || value === 'hotel_owner' || value === 'hotel-owner') {
    return 'hotelOwner';
  }
  if (value === 'guest') return 'guest';
  return 'guest';
}

function normalizeUserRole(user: User): User {
  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

function normalizeUserProfile(user: User): User {
  const rawFirstname = (user as unknown as Record<string, unknown>).firstname;
  const rawLastname = (user as unknown as Record<string, unknown>).lastname;
  const rawUsername = (user as unknown as Record<string, unknown>).username;
  const rawName = (user as unknown as Record<string, unknown>).name;

  const fromName =
    typeof rawName === 'string' && rawName.trim().length > 0
      ? rawName.trim()
      : '';
  const fromUsername =
    typeof rawUsername === 'string' && rawUsername.trim().length > 0
      ? rawUsername.trim()
      : '';

  const nameParts = fromName ? fromName.split(/\s+/) : [];
  const fallbackFirstname = nameParts[0] ?? '';
  const fallbackLastname = nameParts.slice(1).join(' ');

  const firstname = typeof rawFirstname === 'string' && rawFirstname.trim().length > 0
    ? rawFirstname.trim()
    : fallbackFirstname;
  const lastname = typeof rawLastname === 'string' && rawLastname.trim().length > 0
    ? rawLastname.trim()
    : fallbackLastname;
  const username = fromUsername || fromName || `${firstname} ${lastname}`.trim();

  return {
    ...user,
    firstname,
    lastname,
    username,
  };
}

function normalizeUser(user: User): User {
  return normalizeUserProfile(normalizeUserRole(user));
}

export async function registerUser(input: RegisterInput): Promise<{ token: string }> {
  const firstname = input.firstname.trim();
  const lastname = input.lastname.trim();
  const username = input.username.trim();

  const payload = {
    ...input,
    firstname,
    lastname,
    username,
    name: username,
  };

  return request<{ success: boolean; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(input: LoginInput): Promise<{ token: string }> {
  const identifier = input.identifier.trim();
  const password = input.password;

  const attempts: Array<Record<string, string>> = [
    { identifier, password },
  ];

  if (identifier.includes('@')) {
    attempts.push({ email: identifier.toLowerCase(), password });
  } else {
    attempts.push({ tel: identifier, password });
  }

  let lastError: unknown;

  for (const payload of attempts) {
    try {
      return await request<{ success: boolean; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function getMe(token: string): Promise<User> {
  const response = await request<{ success: boolean; data: User }>('/auth/me', { method: 'GET' }, token);
  return normalizeUser(response.data);
}

export async function logoutUser(token: string): Promise<void> {
  await request<{ success: boolean; data: Record<string, never> }>('/auth/logout', { method: 'GET' }, token);
}

export async function updateUser(
  id: string,
  data: Partial<{ firstname: string; lastname: string; username: string; email: string; tel: string }>,
  token: string
): Promise<User> {
  const composedName = data.username
    ? data.username.trim()
    : data.firstname || data.lastname
      ? `${data.firstname ?? ''} ${data.lastname ?? ''}`.trim()
      : undefined;

  const payload = {
    ...data,
    name: composedName,
  };

  const response = await request<{ success: boolean; data: User }>(
    `/auth/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token
  );

  return normalizeUser(response.data);
}

export async function updatePassword(
  userId: string,
  payload: { currentPassword?: string; newPassword: string },
  token: string
): Promise<{ success: boolean; msg: string }> {
  return request(`/auth/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token);
}
