import { Hotel } from '@/types';
import Button from '@/src/components/common/Button';
import { LogIn } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

type HotelCardProps = {
  hotel: Hotel;
  detailHref?: string;
};

export default function HotelCard({ hotel, detailHref }: HotelCardProps) {
  const imageSrc = hotel.pictures?.[0] || FALLBACK_IMAGE;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
      <div className="h-64 w-full bg-slate-100">
        <img src={imageSrc} alt={hotel.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">{hotel.province}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{hotel.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {hotel.district}, {hotel.region}
          </p>
        </div>

        <div className="mt-auto w-full space-y-4">
          <div className="mx-auto w-full rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p>{hotel.location}</p>
            <p className="mt-1">{hotel.tel}</p>
            <p className="mt-1">Postal code: {hotel.postalcode}</p>
          </div>

          <div className="mx-auto flex w-full items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Booking rule</p>
              <p className="text-xl font-bold text-slate-900">Up to 3 Nights</p>
            </div>
            <Button
              href={detailHref ?? `/hotels/${hotel._id}`}
              variant="primary-icon"
              icon={<LogIn size={20} strokeWidth={2}/>}
              className="btn-md hotel-card-detail-btn"
            >
              Detail
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
