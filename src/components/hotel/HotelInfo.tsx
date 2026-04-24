'use client'

import { useApp } from "@/src/context/AppContext";
import { Hotel } from "@/types";
import { Heart, Mail, Phone } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

export default function HotelInfo({ hotel }: { hotel: Hotel }) {
  const { user } = useApp();
  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'hotelOwner';
  const location = [hotel.location, hotel.district, hotel.province]
    .filter((value) => Boolean(value?.trim()))
    .join(', ');

  return (
    <div className="space-y-3">

      {/* Name and fav icon*/}
      <div className="flex justify-between">
        <h1 className="text-title">{hotel.name?.trim() || 'Hotel name unavailable'}</h1>
        {isAdminOrOwner ? (
          <div className='flex items-center gap-2'>
            <Heart size={32} className="fill-[var(--color-error)] text-[var(--color-error)]" />
            <p className="text-subdetail">{hotel.favoriteBy}</p>
          </div>
        ) : (
          <div>
            <FavoriteButton hotel={hotel} />
          </div>
        )}
      </div>

      {/* Address */}
      <p className="text-detail">
        {location || 'Location unavailable'}
      </p>

      {/* Description */}
      <p className="text-subdetail">{hotel.description?.trim() || 'No description available.'}</p>

      {/* Contact */}
      <div className="space-y-2 pt-1">

        {/* Phone */}
        <div className="flex items-center gap-2 text-subdetail">
          <Phone className="w-4 h-4 flex-shrink-0"/>
          {hotel.tel?.trim() || 'Phone unavailable'}
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-subdetail">
          <Mail className="w-4 h-4 flex-shrink-0"/>
          {hotel.email?.trim() || 'Email unavailable'}
        </div>

      </div>
    </div>
  );
}
