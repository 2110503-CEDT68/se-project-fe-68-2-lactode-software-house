import { Hotel } from "@/types";
import { Mail, Phone } from "lucide-react";

export default function HotelInfo({ hotel }: { hotel: Hotel }) {
  const location = [hotel.location, hotel.district, hotel.province]
    .filter((value) => Boolean(value?.trim()))
    .join(', ');

  return (
    <div className="space-y-3">

      {/* Name */}
      <h1 className="text-title">{hotel.name?.trim() || 'Hotel name unavailable'}</h1>

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
