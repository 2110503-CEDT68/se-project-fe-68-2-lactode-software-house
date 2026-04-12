import FacilityList from "@/src/components/common/FacilityList";
import PhotoGrid from "@/src/components/common/PhotoGrid";
import AvailabilitySearch from "@/src/components/common/AvailabilitySearch";
import HotelInfo from "@/src/components/hotel/HotelInfo";
import Button from "@/src/components/common/Button";
import { getHotelById } from "@/src/lib/hotels";
import DeletePopup from "@/src/components/common/DeletePopup";
import { MOCK_FACILITIES } from "@/src/lib/mockHotelDetail";
import RoomCardList from "@/src/components/room/RoomCardList";

export default async function ViewHotelProfilePage({params} : {params:Promise<{id:string}>}) {

  const {id} = await params;
  const hotelDetail = await getHotelById(id)

  return (
    <main className="min-h-screen px-16 py-8">
        <div className="flex flex-row justify-between">
            <div className="flex gap-4">
              <Button variant="disabled" className="btn-md" href="/admin/hotels">
                Back
              </Button>
              <Button variant="primary" className="btn-md" href={`/admin/hotels/${id}/edit`}>
                Edit
              </Button>
            </div>
              <DeletePopup hotelId={id} />
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
                <RoomCardList/>
            </section>
        </div>
    </main>
  );
}