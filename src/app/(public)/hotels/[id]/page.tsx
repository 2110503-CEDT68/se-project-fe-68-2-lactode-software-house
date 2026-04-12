'use client'
import FacilityList from "@/src/components/common/FacilityList";
import PhotoGrid from "@/src/components/common/PhotoGrid";
import AvailabilitySearch from "@/src/components/common/AvailabilitySearch";
import HotelInfo from "@/src/components/hotel/HotelInfo";
import RoomCard from "@/src/components/room/RoomCard";
import Button from "@/src/components/common/Button";

// Mock Data

//Hotel
export interface HotelInfoData {
  name: string;
  address: string;
  province: string;
  description: string;
  phone: string;
  email: string;
}

export const MOCK_HOTEL_INFO: HotelInfoData = {
  name: "Resort Villa brabra",
  address: "Huai Kwang, Central, 342 Rama IV Road",
  province: "Bangkok",
  description:
    "A beautiful beachfront hotel with stunning sunset views, offering modern rooms, comfortable facilities, and excellent service. Perfect for both relaxation and family vacations.",
  phone: "+66 76 123 456",
  email: "contact@sunsetparadise.com",
};

//Image
interface PhotoGridProps {
  images: string[];
}

export const MOCK_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
  "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=400",
];

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

export default function ViewRoomPage() {
  return (
    <main className="min-h-screen px-16 py-8">
        <div>
            <Button variant="disabled" className="btn-md" onClick={() => history.back()}>
                Back
            </Button>
        </div>

        <div className="py-8 space-y-6">
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