'use client'
import FacilityList, { MOCK_FACILITIES } from "@/src/components/common/FacilityList";
import PhotoGrid, { MOCK_IMAGES } from "@/src/components/common/PhotoGrid";
import AvailabilitySearch from "@/src/components/common/AvailabilitySearch";
import HotelInfo, { MOCK_HOTEL_INFO } from "@/src/components/hotel/HotelInfo";
import RoomCard, { MOCK_ROOMS } from "@/src/components/room/RoomCard";
import Button from "@/src/components/common/Button";

export default function ViewRoomPage() {
  return (
    <main className="min-h-screen px-16 py-8">
        <div>
            <Button variant="disabled" className="btn-md" onClick={() => history.back()}>
                Back
            </Button>
        </div>

        <div className="max-w-4xl py-8 space-y-6">
            <PhotoGrid images={MOCK_IMAGES}/>

            <HotelInfo hotel={MOCK_HOTEL_INFO} />

            <section className="space-y-3">
                <h2 className="text-subtitle">Facilities</h2>
                <FacilityList facilities={MOCK_FACILITIES} />
            </section>

            <section className="space-y-3">
                <h2 className="text-subtitle">Availability</h2>
                <AvailabilitySearch
                onSearch={(values) => console.log(values)}
                />
            </section>

            <section className="space-y-4">
                <RoomCard room={MOCK_ROOMS[0]} />
                <RoomCard room={MOCK_ROOMS[1]} />
                <RoomCard room={MOCK_ROOMS[2]} />
            </section>
        </div>
    </main>
  );
}