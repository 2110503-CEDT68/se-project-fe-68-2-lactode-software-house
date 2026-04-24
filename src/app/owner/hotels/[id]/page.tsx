import Button from '@/src/components/common/Button';
import FacilityList from '@/src/components/common/FacilityList';
import PhotoGrid from '@/src/components/common/PhotoGrid';
import HotelAvailabilityRoomsSection from '@/src/components/hotel/HotelAvailabilityRoomsSection';
import HotelInfo from '@/src/components/hotel/HotelInfo';
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
      <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
        <div className="flex items-center justify-between">
          <Button variant="disabled" className="btn-md" href="/owner/hotels">
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

          <HotelAvailabilityRoomsSection
            hotelId={id}
            initialRooms={rooms}
            detailBasePath="/owner/hotels"
            createRoomHref={`/owner/hotels/${id}/rooms/create`}
          />
        </div>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen mx-auto max-w-7xl px-8 py-8 lg:px-16">
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
