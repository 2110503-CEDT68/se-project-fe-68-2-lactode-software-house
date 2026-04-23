'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '@/src/context/AppContext';
import { addFavorite, formatApiMessage, removeFavorite } from '@/src/lib/api';
import { Hotel } from '@/types';

type FavoriteButtonProps = {
  hotel: Hotel;
};

function extractUserId(value: unknown) {
  if (!value || typeof value !== 'object') return '';
  const source = value as Record<string, unknown>;
  const candidate = source._id ?? source.id ?? source.userID ?? source.userId;
  return typeof candidate === 'string' ? candidate : '';
}

function containsUserId(value: unknown, userId: string) {
  if (!Array.isArray(value) || !userId) return false;
  return value.some((item) => {
    if (typeof item === 'string') return item === userId;
    return extractUserId(item) === userId;
  });
}

function getIsFavorited(hotel: Hotel, userId?: string) {
  const source = hotel as unknown as Record<string, unknown>;
  const direct = source.isFavorite ?? source.isFavorited ?? source.favorite ?? source.favorited;
  if (typeof direct === 'boolean') {
    return direct;
  }
  if (userId) {
    if (containsUserId(source.favorites, userId)) return true;
    if (containsUserId(source.favoriteBy, userId)) return true;
  }
  return false;
}

function getFavoriteCount(hotel: Hotel) {
  const source = hotel as unknown as Record<string, unknown>;
  const count = source.favoriteBy;
  if (typeof count === 'number' && Number.isFinite(count)) {
    return Math.max(0, Math.round(count));
  }
  if (Array.isArray(count)) {
    return count.length;
  }
  return 0;
}

export default function FavoriteButton({ hotel }: FavoriteButtonProps) {
  const { user, token } = useApp();
  const canFavorite = Boolean(user && user.role === 'user' && token);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');

  useEffect(() => {
    setIsFavorite(getIsFavorited(hotel, user?._id));
    setFavoriteCount(getFavoriteCount(hotel));
    setFavoriteError('');
  }, [hotel, user?._id]);

  const handleFavoriteClick = async () => {
    if (!canFavorite || isTogglingFavorite || !token) return;

    const nextFavorite = !isFavorite;
    const previousFavorite = isFavorite;
    const previousCount = favoriteCount;

    setFavoriteError('');
    setIsFavorite(nextFavorite);
    setFavoriteCount((current) => Math.max(0, current + (nextFavorite ? 1 : -1)));
    setIsTogglingFavorite(true);

    try {
      if (nextFavorite) {
        await addFavorite(hotel._id, token);
      } else {
        await removeFavorite(hotel._id, token);
      }
    } catch (error) {
      setIsFavorite(previousFavorite);
      setFavoriteCount(previousCount);
      setFavoriteError(
        formatApiMessage(
          error,
          nextFavorite
            ? 'Cannot add this hotel to favorites right now.'
            : 'Cannot remove this hotel from favorites right now.'
        )
      );
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (!canFavorite) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleFavoriteClick}
        disabled={isTogglingFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'Unfavorite hotel' : 'Favorite hotel'}
        title={isFavorite ? 'Unfavorite' : 'Favorite'}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
          isFavorite
            ? 'text-red-500 hover:scale-105 hover:text-red-600'
            : 'text-[#2f4cd6] hover:scale-105 hover:text-[#365cf5]'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <Heart
          size={38}
          strokeWidth={2.25}
          className={
            isFavorite
              ? 'fill-red-500 text-red-500'
              : 'fill-transparent text-[#2f4cd6]'
          }
        />
      </button>
      <p className="text-center text-xs text-slate-500">{favoriteCount}</p>
      {favoriteError ? <p className="text-center text-xs text-rose-600">{favoriteError}</p> : null}
    </div>
  );
}
