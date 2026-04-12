import FacilityList from "@/src/components/common/FacilityList";
import PhotoGrid from "@/src/components/common/PhotoGrid";
import AvailabilitySearch from "@/src/components/common/AvailabilitySearch";
import HotelInfo from "@/src/components/hotel/HotelInfo";
import RoomCard from "@/src/components/room/RoomCard";
import Button from "@/src/components/common/Button";
import { getHotelById } from "@/src/lib/hotels";

// Mock Data

//Facility
export const MOCK_FACILITIES: string[] = [
  "Non-Smoking",
  "Free Wi-Fi",
  "Swimming Pool",
  "Fitness Center",
  "Parking",
  "Restaurant",
  "Bar/Lounge",
  "Spa",
  "Room Service",
  "Laundry",
  "Airport Shuttle",
  "Pet Friendly",
  "Air Conditioning",
  "24-Hour Front Desk",
];

//Room
export interface Room {
  id: string;
  name: string;
  bedType: string;
  available: number;
  maxAdults: number;
  image?: string | null;
}

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

export default async function ViewHotelProfilePage({params} : {params:Promise<{id:string}>}) {

  const {id} = await params;
  const hotelDetail = await getHotelById(id)

  return (
    <main className="min-h-screen px-16 py-8">
        <div>
            <Button variant="disabled" className="btn-md" href="/hotels">
              Back
            </Button>
        </div>

        <div className="py-8 space-y-6">
            <PhotoGrid images={hotelDetail.pictures}/>

            <HotelInfo hotel={hotelDetail} />

            <section className="space-y-3">
                <h2 className="text-subtitle">Facilities</h2>
                <FacilityList facilities={MOCK_FACILITIES} />
            </section>

            <section className="space-y-3">
                <h2 className="text-subtitle">Availability</h2>
                <AvailabilitySearch/>
            </section>

            <section className="space-y-4">
                {/* <RoomCard room={MOCK_ROOMS[0]} />
                <RoomCard room={MOCK_ROOMS[1]} />
                <RoomCard room={MOCK_ROOMS[2]} /> */}
            </section>
        </div>
    </main>
  );
}