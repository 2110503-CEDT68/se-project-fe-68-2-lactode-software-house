import { redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminHotelRoomsPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/admin/hotels/${id}`);
}
