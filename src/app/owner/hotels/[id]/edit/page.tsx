'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HotelForm, { HotelFormData } from '@/src/components/hotel/HotelForm';

export default function EditHotelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<HotelFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        // TODO: call get hotel by id API here
        // const res = await getHotelById(id);

        const res: HotelFormData = {
          name: 'Sunset Paradise',
          address: 'Bangkok Center',
          province: 'Bangkok',
          postalCode: '10110',
          description: 'Beautiful hotel in Bangkok',
          phone: '0123456789',
          email: 'hotel@mail.com',
          facilities: ['Free Wi-Fi', 'Swimming Pool'],
          image: [],
        };

        setData(res);
      } catch (error) {
        console.error('Fetch hotel error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleUpdate = async (formData: HotelFormData) => {
    try {
      console.log('update hotel:', id, formData);

      // TODO: call update hotel API here
      // await updateHotel(id, formData);

      router.push('/owner/hotels/[id]');
    } catch (error) {
      console.error('Update hotel error:', error);
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/owner/hotels/[id]');
    }
  };

  if (loading) {
    return <main className="p-10">Loading...</main>;
  }

  if (!data) {
    return <main className="p-10">Hotel not found</main>;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HotelForm
        mode="edit"
        initialData={data}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </main>
  );
}