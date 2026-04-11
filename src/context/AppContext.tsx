'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  API_BASE_URL,
  TOKEN_KEY,
  createBooking as createBookingRequest,
  deleteBooking as deleteBookingRequest,
  formatApiMessage,
  getBookingById as getBookingByIdRequest,
  getBookings as getBookingsRequest,
  getHotels as getHotelsRequest,
  getMe,
  loginUser as loginUserRequest,
  logoutUser as logoutUserRequest,
  registerUser as registerUserRequest,
  updateBooking as updateBookingRequest,
  updateUser as updateUserRequest,
  updatePassword as updatePasswordRequest,
} from '@/src/lib/api';
import { Booking, BookingInput, Hotel, LoginInput, RegisterInput, User } from '@/types';

type ActionResult = { ok: boolean; message: string };

type AppContextValue = {
  apiBaseUrl: string;
  user: User | null;
  token: string | null;
  hotels: Hotel[];
  bookings: Booking[];
  ready: boolean;
  loading: boolean;
  refreshHotels: () => Promise<void>;
  refreshBookings: () => Promise<void>;
  fetchBookingById: (bookingId: string) => Promise<Booking | null>;
  registerUser: (input: RegisterInput) => Promise<ActionResult>;
  loginUser: (input: LoginInput) => Promise<ActionResult>;
  logoutUser: () => Promise<void>;
  createBooking: (input: BookingInput) => Promise<ActionResult>;
  updateBooking: (bookingId: string, input: BookingInput) => Promise<ActionResult>;
  deleteBooking: (bookingId: string) => Promise<ActionResult>;
  updateUser: (id: string, data: Partial<Pick<User, 'name' | 'email' | 'tel'>>) => Promise<ActionResult>;
  updatePassword: (
    id: string,
    data: { currentPassword?: string; newPassword: string }
  ) => Promise<ActionResult>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isValidPhone(value: string) {
  return /^\d{3}-\d{3}-\d{4}$/.test(value);
}

function toMidnightDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function validateBookingInput(input: BookingInput) {
  if (!input.hotelId) {
    return 'Please select a hotel';
  }

  if (!input.checkInDate || !input.checkOutDate) {
    return 'Please select booking dates.';
  }

  const checkIn = toMidnightDate(input.checkInDate);
  const checkOut = toMidnightDate(input.checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return 'Invalid booking date format.';
  }

  if (checkOut <= checkIn) {
    return 'Check-out date must be after check-in date.';
  }

  const days = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
  if (days > 3) {
    return 'Booking cannot exceed 3 days.';
  }

  return null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const refreshHotels = useCallback(async () => {
    try {
      const hotelData = await getHotelsRequest();
      setHotels(hotelData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshBookings = useCallback(async () => {
    if (!token) {
      setBookings([]);
      return;
    }

    try {
      const bookingData = await getBookingsRequest(token);
      setBookings(bookingData);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const updateUser = useCallback(
    async (
      id: string,
      data: Partial<Pick<User, 'name' | 'email' | 'tel'>>
    ): Promise<ActionResult> => {
      if (!token) {
        return { ok: false, message: 'Please sign in first.' };
      }

      try {
        const updatedUser = await updateUserRequest(id, data, token);
        setUser(updatedUser);
        return { ok: true, message: 'Profile updated successfully.' };
      } catch (error) {
        return { ok: false, message: formatApiMessage(error, 'Cannot update profile.') };
      }
    },
    [token]
  );

  const updatePassword = useCallback(
    async (
      id: string,
      data: { currentPassword?: string; newPassword: string }
    ): Promise<ActionResult> => {
      if (!token) {
        return { ok: false, message: 'Please sign in first.' };
      }

      try {
        const response = await updatePasswordRequest(id, data, token);
        return {
          ok: true,
          message: response?.msg || 'Password updated successfully.',
        };
      } catch (error) {
        return { ok: false, message: formatApiMessage(error, 'Cannot update password.') };
      }
    },
    [token]
  );

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      await refreshHotels();

      const storedToken =
        typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;

      if (!storedToken) {
        setReady(true);
        setLoading(false);
        return;
      }

      try {
        const profile = await getMe(storedToken);
        setToken(storedToken);
        setUser(profile);
        const bookingData = await getBookingsRequest(storedToken);
        setBookings(bookingData);
      } catch (error) {
        console.error(error);
        window.localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setBookings([]);
      } finally {
        setReady(true);
        setLoading(false);
      }
    };

    bootstrap();
  }, [refreshHotels]);

  const fetchBookingById = useCallback(
    async (bookingId: string) => {
      if (!token) return null;

      try {
        const booking = await getBookingByIdRequest(bookingId, token);
        return booking;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [token]
  );

  const registerUser = useCallback(async (input: RegisterInput): Promise<ActionResult> => {
    const tel = normalizePhone(input.tel);

    if (!input.name.trim() || !input.email.trim() || !input.password.trim() || !tel.trim()) {
      return { ok: false, message: 'Please fill in all fields.' };
    }

    if (!isValidEmail(input.email)) {
      return { ok: false, message: 'Please enter a valid email.' };
    }

    if (!isValidPhone(tel)) {
      return { ok: false, message: 'Telephone number must be in xxx-xxx-xxxx format.' };
    }

    try {
      await registerUserRequest({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        tel,
      });

      return { ok: true, message: 'Account created successfully. Please sign in.' };
    } catch (error) {
      return { ok: false, message: formatApiMessage(error, 'Cannot register right now.') };
    }
  }, []);

  const loginUser = useCallback(async (input: LoginInput): Promise<ActionResult> => {
    if (!input.identifier.trim() || !input.password.trim()) {
      return { ok: false, message: 'Please provide your email/phone and password.' };
    }

    try {
      const { token: nextToken } = await loginUserRequest({
        identifier: input.identifier.trim(),
        password: input.password,
      });

      const profile = await getMe(nextToken);
      const bookingData = await getBookingsRequest(nextToken);

      window.localStorage.setItem(TOKEN_KEY, nextToken);
      setToken(nextToken);
      setUser(profile);
      setBookings(bookingData);

      return { ok: true, message: 'Login successful.' };
    } catch (error) {
      return { ok: false, message: formatApiMessage(error, 'Cannot sign in right now.') };
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      if (token) {
        await logoutUserRequest(token);
      }
    } catch (error) {
      console.error(error);
    } finally {
      window.localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setBookings([]);
    }
  }, [token]);

  const createBooking = useCallback(
    async (input: BookingInput): Promise<ActionResult> => {
      if (!user || !token) {
        return { ok: false, message: 'Please sign in first.' };
      }

      const validationMessage = validateBookingInput(input);
      if (validationMessage) {
        return { ok: false, message: validationMessage };
      }

      try {
        await createBookingRequest(input, token);
        await refreshBookings();
        return { ok: true, message: 'Booking created successfully.' };
      } catch (error) {
        return { ok: false, message: formatApiMessage(error, 'Cannot create booking.') };
      }
    },
    [refreshBookings, token, user]
  );

  const updateBooking = useCallback(
    async (bookingId: string, input: BookingInput): Promise<ActionResult> => {
      if (!user || !token) {
        return { ok: false, message: 'Please sign in first.' };
      }

      const validationMessage = validateBookingInput(input);
      if (validationMessage) {
        return { ok: false, message: validationMessage };
      }

      try {
        await updateBookingRequest(bookingId, input, token);
        await refreshBookings();
        return { ok: true, message: 'Booking updated successfully.' };
      } catch (error) {
        return { ok: false, message: formatApiMessage(error, 'Cannot update booking.') };
      }
    },
    [refreshBookings, token, user]
  );

  const deleteBooking = useCallback(
    async (bookingId: string): Promise<ActionResult> => {
      if (!token) {
        return { ok: false, message: 'Please sign in first.' };
      }

      try {
        await deleteBookingRequest(bookingId, token);
        setBookings((current) => current.filter((item) => item._id !== bookingId));
        return { ok: true, message: 'Booking deleted successfully.' };
      } catch (error) {
        return { ok: false, message: formatApiMessage(error, 'Cannot delete booking.') };
      }
    },
    [token]
  );

  const value = useMemo(
    () => ({
      apiBaseUrl: API_BASE_URL,
      user,
      token,
      hotels,
      bookings,
      ready,
      loading,
      refreshHotels,
      refreshBookings,
      fetchBookingById,
      registerUser,
      loginUser,
      logoutUser,
      createBooking,
      updateBooking,
      deleteBooking,
      updateUser,
      updatePassword,
      setUser,
    }),
    [
      bookings,
      createBooking,
      deleteBooking,
      fetchBookingById,
      hotels,
      loading,
      loginUser,
      logoutUser,
      ready,
      refreshBookings,
      refreshHotels,
      registerUser,
      token,
      updateBooking,
      updatePassword,
      updateUser,
      user,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}