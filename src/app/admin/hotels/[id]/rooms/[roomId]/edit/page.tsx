import RoomCreateForm from '@/src/components/room/RoomCreateForm';

type PageProps = {
  params: Promise<{ id: string; roomId: string }>;
};

export default async function AdminHotelRoomEditPage({ params }: PageProps) {
  const { id, roomId } = await params;

  return (
    <section className="section">
      <div className="page-container">
        <RoomCreateForm hotelId={id} roomId={roomId} mode="edit" basePath="/admin/hotels" />
      </div>
    </section>
  );
}
