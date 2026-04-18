import AvailabilitySearch from '@/src/components/common/AvailabilitySearch';
import Button from '@/src/components/common/Button';
import FacilityList from '@/src/components/common/FacilityList';
import PhotoGrid from '@/src/components/common/PhotoGrid';
import HotelInfo from '@/src/components/hotel/HotelInfo';
import RoomCardList from '@/src/components/room/RoomCardList';
import { getHotelById, getRoomsByHotelId } from '@/src/lib/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [hotel, rooms] = await Promise.all([
      getHotelById(id),
      getRoomsByHotelId(id).catch(() => []),
    ]);

    const images = hotel.pictures?.length ? hotel.pictures : [FALLBACK_IMAGE];
    const facilities = hotel.facilities?.length
      ? hotel.facilities
      : ['Facilities information is not available.'];

    return (
      <main className="min-h-screen px-16 py-8">
        <div className="flex items-center justify-between">
          <Button variant="disabled" className="btn-md" href="/hotels">
            Back
          </Button>
          <Button variant="primary" className="btn-md" href={`/owner/hotels/${id}/edit`}>
            Edit
          </Button>
        </div>

        <div className="py-8 space-y-6">
          <PhotoGrid images={images} />

          <HotelInfo hotel={hotel} />

          <section className="space-y-3">
            <h2 className="text-subtitle">Facilities</h2>
            <FacilityList facilities={facilities} />
          </section>

          <section className="space-y-3">
            <h2 className="text-subtitle">Availability</h2>
            <AvailabilitySearch />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-subtitle">Rooms</h2>
              <Button variant="primary" className="btn-sm" href={`/owner/hotels/${id}/rooms/create`}>
                Create Room
              </Button>
            </div>
            <RoomCardList rooms={rooms} detailBasePath="/owner/hotels" />
          </section>
        </div>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen px-16 py-8">
        <div>
          <Button variant="disabled" className="btn-md" href="/hotels">
            Back
          </Button>
        </div>

        <div className="py-8">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            Could not load hotel details.
          </div>
        </div>
      </main>
    );
  }
}
