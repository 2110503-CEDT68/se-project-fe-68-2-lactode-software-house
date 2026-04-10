import StyledButton from "../common/StyledButton";

type BookingCardProps = {
  hotelName: string;
  location: string;
  contact: string;
  email: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  onDelete?: () => void;
  onEdit?: () => void;
};

export default function BookingCard({
  hotelName,
  location,
  contact,
  email,
  checkIn,
  checkOut,
  rooms,
  onDelete,
  onEdit,
}: BookingCardProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm">
      <div className="min-w-[220px]">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {hotelName}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">{location}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">{contact}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">{email}</p>
      </div>

      <div className="text-sm text-[var(--color-text-secondary)]">
        <p>{checkIn}</p>
        <p>{checkOut}</p>
      </div>

      <div className="text-sm text-[var(--color-text-secondary)]">{rooms}</div>

      <div className="flex items-center gap-3">
        <StyledButton variant="outlineDanger" onClick={onDelete}>
          Delete
        </StyledButton>
        <StyledButton variant="primary" onClick={onEdit}>
          Edit
        </StyledButton>
      </div>
    </div>
  );
}