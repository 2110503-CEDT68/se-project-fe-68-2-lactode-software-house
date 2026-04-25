'use client';

import { Heart } from 'lucide-react';
import { Hotel } from '@/types';
import ProgressiveImage from '@/src/components/common/ProgressiveImage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

type FavoriteRankingCardProps = {
  hotel: Hotel;
  favoriteCount: number;
  rank?: number;
  onClick?: () => void;
};

export default function FavoriteRankingCard({
  hotel,
  favoriteCount,
  rank,
  onClick,
}: FavoriteRankingCardProps) {
  const imageSrc = hotel.pictures?.[0] || FALLBACK_IMAGE;
  const realCount = typeof hotel.favoriteBy === 'number'
    ? hotel.favoriteBy
    : typeof favoriteCount === 'number'
      ? favoriteCount
      : 0;
  const displayCount = String(Math.max(0, realCount));

  return (
    <article
      onClick={onClick}
      className="group relative mb-8 flex min-h-[142px] cursor-pointer overflow-visible rounded-[30px] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.14)] ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.18)]"
    >

        <div
          className="absolute -left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-sm font-extrabold text-[#4758eb] shadow-[0_8px_18px_rgba(15,23,42,0.22)] ring-4 ring-white"
          style={{
            backgroundColor:
              //rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32',
              '#FFFFFF'
          }}
        >
          #{rank}
        </div>
 

      <div className="relative z-0 h-[142px] w-[500px] shrink-0 overflow-hidden rounded-l-[30px] bg-white">
        <ProgressiveImage src={imageSrc} alt={hotel.name} />
        <div className="pointer-events-none absolute inset-y-0 left-[-20%] right-0 z-[1] w-[120%] bg-gradient-to-r from-transparent via-white/70 via-60% to-white" />
      </div>

      <div className="relative z-[2] -ml-[170px] flex min-w-0 flex-1 flex-col justify-center px-10 pr-48">
        <h3 className="truncate text-detail font-bold leading-tight">
          {hotel.name}
        </h3>
        <p className="mt-2 text-subdetail uppercase tracking-[0.08em]">
          {hotel.province}
        </p>
        <p className="mt-1 text-subdetail">
          {hotel.district}, {hotel.region}
        </p>
      </div>

      <div className="absolute right-4 top-4 z-10">
        <div className="flex h-[40px] items-center justify-center gap-2 rounded-md bg-[#2B3FCB] px-4 text-white shadow-md transition group-hover:bg-[#1E2C8F]">
          <Heart size={18} strokeWidth={2.5} className="fill-white text-white" />
          <span className="text-[16px] font-semibold leading-none">
            {displayCount}
          </span>
        </div>
      </div>
    </article>
  );
}