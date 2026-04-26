import { User } from 'lucide-react';
import { Room } from '@/types';
import { RoomCardData } from '@/src/lib/mockHotelDetail';
import Button from '../common/Button';

const ROOM_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80';

type RoomCardInput = RoomCardData | Room;

interface RoomCardProps {
  room: RoomCardInput;
  onDetail?: (room: RoomCardInput) => void;
  detailBasePath?: string;
}

function isApiRoom(room: RoomCardInput): room is Room {
  return 'roomType' in room;
}

export default function RoomCard({ room, onDetail, detailBasePath = '/hotels' }: RoomCardProps) {
  const hotelRef = isApiRoom(room) ? room.hotelID ?? room.hotel : null;
  const hotelId =
    typeof hotelRef === 'string'
      ? hotelRef
      : hotelRef && typeof hotelRef === 'object' && '_id' in hotelRef
        ? String(hotelRef._id)
        : null;
  const detailHref = hotelId
    ? `${detailBasePath}/${encodeURIComponent(hotelId)}/rooms/${encodeURIComponent(room._id)}`
    : null;

  const name = isApiRoom(room) ? room.roomType : room.name;
  const available = isApiRoom(room) ? room.available ?? room.availableNumber ?? room.avaliableNumber ?? 0 : room.available;
  const maxAdults = isApiRoom(room) ? room.people : room.maxAdults;
  const image = isApiRoom(room)
    ? room.image ?? room.picture?.[0] ?? ROOM_FALLBACK_IMAGE
    : room.image ?? ROOM_FALLBACK_IMAGE;

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" data-testid={`room-card-${room._id}`}>
      <div className="flex h-28 w-36 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          onError={(event) => {
            const target = event.currentTarget;
            if (target.src === ROOM_FALLBACK_IMAGE) return;
            target.src = ROOM_FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="mt-0.5 text-sm text-gray-500">{room.bedType}</p>
        <p className="text-sm text-gray-500">available : {available}</p>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
          <User className="h-4 w-4" />
          max {maxAdults} adults
        </div>
      </div>

      <div className="self-end">
        {detailHref ? (
          <Button variant="primary" className="btn-sm" href={detailHref} testId={`room-card-${room._id}-detail`}>
            Detail
          </Button>
        ) : (
          <Button variant="primary" className="btn-sm" onClick={() => onDetail?.(room)} disabled={!onDetail} testId={`room-card-${room._id}-detail`}>
            Detail
          </Button>
        )}
      </div>
    </div>
  );
}
