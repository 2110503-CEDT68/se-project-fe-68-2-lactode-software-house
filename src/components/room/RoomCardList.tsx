'use client'
import { MOCK_ROOMS } from "@/src/lib/mockHotelDetail";
import RoomCard from "./RoomCard";

export default async function RoomCardList() {
    return (
        <div className="space-y-4">
            {MOCK_ROOMS.map((room) => (
                <RoomCard key={room._id} room={room} />
            ))}
        </div>
    )
}