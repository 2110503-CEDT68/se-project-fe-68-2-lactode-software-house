import RoomCreateForm from '@/src/components/room/RoomCreateForm';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OwnerHotelRoomCreatePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <section className="section">
      <div className="page-container">
        <RoomCreateForm hotelId={id} />
      </div>
    </section>
  );
}
