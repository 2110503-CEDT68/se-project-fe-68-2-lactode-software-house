import { Mail, Phone } from "lucide-react";

export default function HotelInfo({ hotel }: { hotel: HotelInfoData }) {
  return (
    <div className="space-y-3">

      {/* Name */}
      <h1 className="text-title">{hotel.name}</h1>

      {/* Address */}
      <p className="text-detail">
        {hotel.address}, {hotel.province}
      </p>

      {/* Description */}
      <p className="text-subdetail">{hotel.description}</p>

      {/* Contact */}
      <div className="space-y-2 pt-1">

        {/* Phone */}
        <div className="flex items-center gap-2 text-subdetail">
          <Phone className="w-4 h-4 flex-shrink-0"/>
          {hotel.phone}
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-subdetail">
          <Mail className="w-4 h-4 flex-shrink-0"/>
          {hotel.email}
        </div>

      </div>
    </div>
  );
}