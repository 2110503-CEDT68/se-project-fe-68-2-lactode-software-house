'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HotelForm, { HotelFormData } from '@/src/components/hotel/HotelForm';
import { createHotel, formatApiMessage } from '@/src/lib/api';
import { useApp } from '@/src/context/AppContext';

export default function CreateHotelPage() {
  const router = useRouter();
  const { token, user, ready, refreshHotels } = useApp();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (data: HotelFormData) => {
    if (submitting) return;

    if (!ready) {
      setMessage('Checking your session, please try again.');
      return;
    }

    if (!token || !user || user.role !== 'admin') {
      setMessage('Admin access only. Please sign in first.');
      return;
    }

    const name = data.name.trim();
    const address = data.address.trim();
    const province = data.province.trim();
    const postalCode = data.postalCode.trim();
    const phone = data.phone.trim();
    const email = data.email.trim();

    if (!name || !address || !province || !postalCode || !phone || !email) {
      setMessage('Please complete all required fields before creating the hotel.');
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      await createHotel(
        {
          name,
          description: data.description.trim(),
          location: address,
          address,
          district: address.split(',')[0]?.trim() || province,
          province,
          postalcode: postalCode,
          region: province,
          tel: phone,
          email,
          facilities: data.facilities,
          pictures: data.image,
        },
        token
      );

      await refreshHotels();

      router.push('/admin/hotels');
    } catch (error) {
      setMessage(formatApiMessage(error, 'Cannot create hotel.'));
    } finally {
      setSubmitting(false);
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
      {message ? (
        <div className="mx-auto w-full max-w-[1180px] px-6 pt-8">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {message}
          </div>
        </div>
      ) : null}
      <HotelForm
        mode="create"
        onSubmit={handleCreate}
        onCancel={handleCancel}
      />
    </main>
  );
}
