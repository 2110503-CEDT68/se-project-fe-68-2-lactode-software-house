'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button';
import TextInput from '../common/TextInput';
import FacilitySelector from '../common/FacilitySelector';
import { HOTEL_FACILITY_OPTIONS } from '@/src/constants/facilities';

export interface HotelFormData {
  name: string;
  address: string;
  province: string;
  postalCode: string;
  description: string;
  phone: string;
  email: string;
  facilities: string[];
  image: string[];
}

interface Props {
  mode?: 'create' | 'edit';
  initialData?: Partial<HotelFormData>;
  onSubmit: (data: HotelFormData) => void;
  onCancel?: () => void;
  cancelHref?: string;
}

export default function HotelForm({
  mode = 'create',
  initialData,
  onSubmit,
  onCancel,
  cancelHref = '/admin/hotels',
}: Props) {
  const normalizedInitialData: HotelFormData = useMemo(
    () => ({
      name: initialData?.name ?? '',
      address: initialData?.address ?? '',
      province: initialData?.province ?? '',
      postalCode: initialData?.postalCode ?? '',
      description: initialData?.description ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      facilities: initialData?.facilities ?? [],
      image: initialData?.image
        ? Array.isArray(initialData.image)
          ? initialData.image
          : [initialData.image]
        : [],
    }),
    [initialData]
  );

  const [form, setForm] = useState<HotelFormData>(normalizedInitialData);

  useEffect(() => {
    setForm(normalizedInitialData);
  }, [normalizedInitialData]);

  const setField = (
    field: keyof Omit<HotelFormData, 'facilities' | 'image'>,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = async (files: File[]) => {
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read image'));
            }
          };

          reader.onerror = () => reject(new Error('Failed to read image'));
          reader.readAsDataURL(file);
        })
    );

    try {
      const images = await Promise.all(readers);

      setForm((prev) => ({
        ...prev,
        image: [...prev.image, ...images],
      }));
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(normalizedInitialData);
  }, [form, normalizedInitialData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleCancel = () => {
    if (!isDirty) {
      onCancel?.();
      return;
    }

    const confirmLeave = window.confirm(
      'You have unsaved changes. Are you sure you want to leave this page?'
    );

    if (confirmLeave) {
      onCancel?.();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[1180px] px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button variant='disabled' onClick={handleCancel}>
          cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          className="rounded-full px-8 py-3"
        >
          {mode === 'edit' ? 'edit' : 'create'}
        </Button>
      </div>

      <div className="space-y-8">
        <section>
          <label
            htmlFor="hotel-image"
            className="flex min-h-[460px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[32px] border border-[#CFCFCF] bg-white"
          >
            {form.image.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {form.image.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Hotel preview ${index + 1}`}
                      className="h-40 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveImage(index);
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center leading-none">
                <p className="text-[28px] font-bold text-black">upload</p>
                <p className="text-[28px] font-bold text-black">picture</p>
              </div>
            )}
          </label>

          <input
            id="hotel-image"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) handleImageChange(files);
              e.currentTarget.value = '';
            }}
          />
        </section>

        <section className="grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-3">
          <TextInput
            label="Hotel Name"
            placeholder="Resort Villa brabra"
            value={form.name}
            onChange={(value) => setField('name', value)}
          />

          <TextInput
            label="Phone"
            placeholder="+66 76 123 456"
            value={form.phone}
            onChange={(value) => setField('phone', value)}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="contact@sunsetparadise.com"
            value={form.email}
            onChange={(value) => setField('email', value)}
          />

          <TextInput
            label="Address"
            placeholder="Huai Kwang, Central, 342 Rama IV Road"
            value={form.address}
            onChange={(value) => setField('address', value)}
          />

          <TextInput
            label="Province"
            placeholder="Bangkok"
            value={form.province}
            onChange={(value) => setField('province', value)}
          />

          <TextInput
            label="Postal Code"
            placeholder="12345"
            value={form.postalCode}
            onChange={(value) => setField('postalCode', value)}
          />

          <div className="md:col-span-3">
            <label className="mb-2 block text-sub detail text-[var(--color-text-primary)]">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="A beautiful beachfront hotel with stunning sunset views, offering modern rooms, comfortable facilities, and excellent service. Perfect for both relaxation and family vacations."
              className="min-h-[180px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
            />
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-subtitle">Facilities</h2>

          <FacilitySelector
            scope="hotel"
            options={HOTEL_FACILITY_OPTIONS.map((item) => item.label)}
            value={form.facilities}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                facilities: value,
              }))
            }
          />
        </section>

        <section>
          <h2 className="text-subtitle">Room</h2>

          <div className="mt-5 rounded-[24px] border border-[#CFCFCF] bg-white px-6 py-5">
            <span className="inline-flex rounded-full bg-[#EEF2FF] px-4 py-1 text-[14px] font-semibold text-[#2B3FCB]">
              Managed by owner
            </span>

            <p className="mt-3 text-[16px] leading-7 text-[#555555]">
              Room information can be added and edited separately by the hotel owner.
            </p>
          </div>
        </section>
      </div>
    </form>
  );
}
