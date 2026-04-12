'use client';

import { useRouter } from 'next/navigation';
import HotelForm, { HotelFormData } from '@/src/components/hotel/HotelForm';

export default function CreateHotelPage() {
  const router = useRouter();

  const handleCreate = async (data: HotelFormData) => {
    try {
      console.log('create hotel:', data);

      // TODO: call create hotel API here
      // await createHotel(data);

      router.push('/admin/hotels');
    } catch (error) {
      console.error('Create hotel error:', error);
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/admin/hotels');
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HotelForm
        mode="create"
        onSubmit={handleCreate}
        onCancel={handleCancel}
      />
    </main>
  );
}