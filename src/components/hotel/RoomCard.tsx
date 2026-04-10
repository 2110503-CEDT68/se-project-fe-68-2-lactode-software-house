import StyledButton from "../common/StyledButton";

type RoomCardProps = {
  image: string;
  roomType: string;
  bedType: string;
  available: number;
  capacity: string;
  onDetail?: () => void;
};

export default function RoomCard({
  image,
  roomType,
  bedType,
  available,
  capacity,
  onDetail,
}: RoomCardProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-[28px] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="h-[120px] w-[150px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <img
            src={image}
            alt={roomType}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {roomType}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {bedType}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            available : {available}
          </p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            max {capacity}
          </p>
        </div>
      </div>

      <StyledButton variant="primary" onClick={onDetail}>
        Detail
      </StyledButton>
    </div>
  );
}