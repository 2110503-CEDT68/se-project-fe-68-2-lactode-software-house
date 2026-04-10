import Link from "next/link";
import StyledButton from "../common/StyledButton";

type HotelCardProps = {
  id?: string;
  image: string;
  province: string;
  name: string;
  district: string;
  region: string;
  address: string;
  tel: string;
  postalCode: string;
  bookingRule: string;
};

export default function HotelCard({
  id,
  image,
  province,
  name,
  district,
  region,
  address,
  tel,
  postalCode,
  bookingRule,
}: HotelCardProps) {
  return (
    <div className="w-full max-w-[320px] overflow-hidden rounded-[28px] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-[220px] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-3 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-text-link)]">
          {province}
        </p>

        <div>
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {name}
          </h3>
          <p className="text-base text-[var(--color-text-secondary)]">
            {district}, {region}
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--color-bg-card-2)] p-4 text-sm text-[var(--color-text-secondary)]">
          <p>{address}</p>
          <p>{tel}</p>
          <p>Postal code: {postalCode}</p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Booking rule
            </p>
            <p className="font-medium text-[var(--color-text-primary)]">
              {bookingRule}
            </p>
          </div>

          <Link href={id ? `/hotels/${id}` : "#"}>
            <StyledButton variant="primary">Detail</StyledButton>
          </Link>
        </div>
      </div>
    </div>
  );
}