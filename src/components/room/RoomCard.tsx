// components/RoomCard.tsx

import { User } from "lucide-react";
import Button from "../common/Button";

export interface Room {
  id: string;
  name: string;
  bedType: string;
  available: number;
  maxAdults: number;
  image?: string | null;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "Deluxe King Room",
    bedType: "King bed",
    available: 3,
    maxAdults: 2,
    image: null,
  },
  {
    id: "2",
    name: "Twin Standard Room",
    bedType: "2 Single beds",
    available: 5,
    maxAdults: 2,
    image: null,
  },
  {
    id: "3",
    name: "Family Suite",
    bedType: "King bed + 2 Single beds",
    available: 1,
    maxAdults: 4,
    image: null,
  },
  {
    id: "4",
    name: "Superior Double Room",
    bedType: "Double bed",
    available: 0,
    maxAdults: 2,
    image: null,
  },
];

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