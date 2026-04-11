import Link from 'next/link';
import { Hotel } from '@/types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const imageSrc = hotel.image || FALLBACK_IMAGE;

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
      <div className="h-64 w-full bg-slate-100">
        <img src={imageSrc} alt={hotel.name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">{hotel.province}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{hotel.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {hotel.district}, {hotel.region}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p>{hotel.address}</p>
          <p className="mt-1">{hotel.tel}</p>
          <p className="mt-1">Postal code: {hotel.postalcode}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Booking rule</p>
            <p className="text-xl font-bold text-slate-900">Up to 3 Nights</p>
          </div>
          <Link
            href={`/booking?hotelId=${hotel._id}`}
            className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}
