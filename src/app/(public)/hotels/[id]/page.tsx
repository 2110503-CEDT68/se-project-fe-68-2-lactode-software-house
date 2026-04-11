'use client'
import FacilityList, { MOCK_FACILITIES } from "@/src/components/common/FacilityList";
import PhotoGrid, { MOCK_IMAGES } from "@/src/components/common/PhotoGrid";
import AvailabilitySearch from "@/src/components/common/AvailabilitySearch";
import HotelInfo, { MOCK_HOTEL_INFO } from "@/src/components/hotel/HotelInfo";
import RoomCard, { MOCK_ROOMS } from "@/src/components/room/RoomCard";

export default function ViewRoomPage() {
  return (
    <main>
        <PhotoGrid images={MOCK_IMAGES}/>
        <HotelInfo hotel={MOCK_HOTEL_INFO} />
        <h2 className="text-xl font-bold text-gray-900 mb-3">Facilities</h2>
        <FacilityList facilities={MOCK_FACILITIES} />
        <h2 className="text-xl font-bold text-gray-900 mb-3">Availability</h2>
        <AvailabilitySearch
        onSearch={(values) => console.log(values)}
        />
        <RoomCard room={MOCK_ROOMS[0]} />
        <RoomCard room={MOCK_ROOMS[1]} />
        <RoomCard room={MOCK_ROOMS[2]} />
    </main>
  );
}