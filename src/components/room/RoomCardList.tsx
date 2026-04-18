'use client';

import { Room } from '@/types';
import { MOCK_ROOMS } from '@/src/lib/mockHotelDetail';
import RoomCard from './RoomCard';

type RoomCardListProps = {
  rooms?: Room[];
  emptyMessage?: string;
  detailBasePath?: string;
};

export default function RoomCardList({
  rooms,
  emptyMessage = 'No rooms available for this hotel yet.',
  detailBasePath = '/hotels',
}: RoomCardListProps) {
  const hasApiRooms = Array.isArray(rooms);
  const roomItems = hasApiRooms ? rooms : MOCK_ROOMS;

  if (hasApiRooms && roomItems.length === 0) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-500">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-4">
      {roomItems.map((room) => (
        <RoomCard key={room._id} room={room} detailBasePath={detailBasePath} />
      ))}
    </div>
  );
}
