'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HotelForm, { HotelFormData } from '@/src/components/hotel/HotelForm';
import { formatApiMessage, getHotelById, updateHotel } from '@/src/lib/api';
import { useApp } from '@/src/context/AppContext';
import { Hotel } from '@/types';

export default function EditHotelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { token, user, ready } = useApp();

  const [data, setData] = useState<HotelFormData | null>(null);
  const [snapshot, setSnapshot] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!ready) return;

      if (!token || !user || (user.role !== 'hotelOwner' && user.role !== 'admin')) {
        setMessage('Hotel owner/admin access only. Please sign in first.');
        setData(null);
        setLoading(false);
        return;
      }

      try {
        setMessage(null);
        const hotel = await getHotelById(id);
        setSnapshot(hotel);
        setData({
          name: hotel.name ?? '',
          address: hotel.location ?? '',
          province: hotel.province ?? '',
          postalCode: hotel.postalcode ?? '',
          description: hotel.description ?? '',
          phone: hotel.tel ?? '',
          email: hotel.email ?? '',
          facilities: hotel.facilities ?? [],
          image: hotel.pictures ?? [],
        });
      } catch (error) {
        console.error(error);
        setData(null);
        setMessage(formatApiMessage(error, 'Cannot load hotel data.'));
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, ready, token, user]);

  const handleUpdate = async (formData: HotelFormData) => {
    if (!token) {
      setMessage('Please sign in first.');
      return;
    }

    try {
      setMessage(null);
      await updateHotel(
        id,
        {
          name: formData.name,
          description: formData.description,
          location: formData.address,
          district: snapshot?.district ?? '',
          province: formData.province,
          postalcode: formData.postalCode,
          region: snapshot?.region ?? '',
          tel: formData.phone,
          email: formData.email,
          facilities: formData.facilities,
          pictures: formData.image,
          status: snapshot?.status,
        },
        token
      );

      router.push(`/owner/hotels/${id}`);
    } catch (error) {
      console.error(error);
      setMessage(formatApiMessage(error, 'Cannot update hotel.'));
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/owner/hotels/${id}`);
    }
  };

  if (loading) {
    return <main className="p-10">Loading...</main>;
  }

  if (!data) {
    return <main className="p-10">{message ?? 'Hotel not found'}</main>;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {message ? (
        <div className="mx-auto w-full max-w-[1180px] px-6 pt-8">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {message}
          </div>
        </div>
      ) : null}
      <HotelForm
        mode="edit"
        initialData={data}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </main>
  );
}
