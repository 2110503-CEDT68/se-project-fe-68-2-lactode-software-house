import { User } from "lucide-react";
import Button from "../common/Button";

// ── Props ────────────────────────────────────────────────────────────────────

interface RoomCardProps {
  room: Room;
  onDetail?: (room: Room) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function RoomCard({ room, onDetail }: RoomCardProps) {
  return (
    <div className="flex items-center gap-5 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

      {/* Room image */}
      <div className="w-36 h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-50 overflow-hidden">
        {room.image ? (
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 font-semibold text-sm">pic</span>
        )}
      </div>

      {/* Room info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{room.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{room.bedType}</p>
        <p className="text-sm text-gray-500">available : {room.available}</p>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
          <User className="w-4 h-4"/>
          max {room.maxAdults} adults
        </div>
      </div>

      {/* Detail button */}
      <div className="self-end">
        <Button
          variant="primary"
          className="btn-sm"
          onClick={() => onDetail?.(room)}
        >
          Detail
        </Button>
      </div>
    </div>
  );
}