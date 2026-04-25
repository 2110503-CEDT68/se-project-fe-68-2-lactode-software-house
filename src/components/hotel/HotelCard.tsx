'use client'
import { Hotel } from '@/types';
import Button from '@/src/components/common/Button';
import ProgressiveImage from '@/src/components/common/ProgressiveImage';
import FavoriteButton from '@/src/components/hotel/FavoriteButton';
import { Heart, LogIn } from 'lucide-react';
import { useApp } from '@/src/context/AppContext';
import { usePathname } from 'next/navigation';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

type HotelCardProps = {
  hotel: Hotel;
  detailHref?: string;
};

export default function HotelCard({ hotel, detailHref }: HotelCardProps) {
  const { user } = useApp();
  const pathname = usePathname();
  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'hotelOwner';
  const imageSrc = hotel.pictures?.[0] || FALLBACK_IMAGE;

  const resolvedHref = detailHref 
  ? `${detailHref}?from=${pathname}` 
  : `/hotels/${hotel._id}?from=${pathname}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
      <div className="h-64 w-full bg-slate-100">
        <ProgressiveImage src={imageSrc} alt={hotel.name} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">{hotel.province}</p>
          <div className="mb-2 overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_64px]">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{hotel.name}</h2>
                <p className="text-sm leading-7 text-slate-600 break-words">
                  {hotel.district}, {hotel.region}
                </p>
              </div>
              <div className="flex items-top justify-center">
                <FavoriteButton hotel={hotel} />
              </div>
            </div>
          </div>
        

        <div className="mt-auto w-full space-y-4">
          <div className="mx-auto w-full rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p>{hotel.location}</p>
            <p className="mt-1">{hotel.tel}</p>
            <p className="mt-1">Postal code: {hotel.postalcode}</p>
          </div>

          <div className="mx-auto flex w-full items-center justify-between gap-3">
            {isAdminOrOwner ? (
              <div className='flex items-center gap-2'>
                <Heart size={32} className="fill-[var(--color-error)] text-[var(--color-error)]" />
                <p className="text-subdetail">{hotel.favoriteBy}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-500">Booking rule</p>
                <p className="text-xl font-bold text-slate-900">Up to 3 Nights</p>
              </div>
            )}
            <div className="flex items-center gap-2" onClick={() => sessionStorage.setItem('backHref', pathname)}>
              <Button
                href={resolvedHref}
                variant="primary-icon"
                icon={<LogIn size={20} strokeWidth={2} />}
                className="btn-md hotel-card-detail-btn"
              >
                Detail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
