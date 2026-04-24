'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button';
import TextInput from '../common/TextInput';
import FacilitySelector from '../common/FacilitySelector';
import PhotoGrid from '../common/PhotoGrid';
import { HOTEL_FACILITY_OPTIONS } from '@/src/constants/facilities';

export interface HotelFormData {
  name: string;
  address: string;
  province: string;
  district: string;
  postalCode: string;
  description: string;
  phone: string;
  email: string;
  ownerEmail: string;
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
}: Props) {
  const normalizedInitialData: HotelFormData = useMemo(() => {
    const initialImages = Array.isArray(initialData?.image)
      ? initialData.image
      : initialData?.image
      ? [initialData.image as unknown as string]
      : [];

    return {
      name: initialData?.name ?? '',
      address: initialData?.address ?? '',
      province: initialData?.province ?? '',
      district: initialData?.district ?? '',
      postalCode: initialData?.postalCode ?? '',
      description: initialData?.description ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      ownerEmail: initialData?.ownerEmail ?? '',
      facilities: initialData?.facilities ?? [],
      image: initialImages.length > 0 ? initialImages : [''],
    };
  }, [initialData]);

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

  const mainPicture = form.image[0] ?? '';
  const anotherPictures = form.image.slice(1);

  const previewImages = form.image.filter((img) => img.trim() !== '');

  const setMainPicture = (value: string) => {
    setForm((prev) => {
      const nextImages = [...prev.image];
      nextImages[0] = value;

      return {
        ...prev,
        image: nextImages,
      };
    });
  };

  const setAnotherPicture = (index: number, value: string) => {
    setForm((prev) => {
      const nextImages = [...prev.image];
      nextImages[index + 1] = value;

      return {
        ...prev,
        image: nextImages,
      };
    });
  };

  const addAnotherPicture = () => {
    setForm((prev) => ({
      ...prev,
      image: [...prev.image, ''],
    }));
  };

  const removeAnotherPicture = (index: number) => {
    setForm((prev) => {
      const nextImages = [...prev.image];
      nextImages.splice(index + 1, 1);

      return {
        ...prev,
        image: nextImages.length > 0 ? nextImages : [''],
      };
    });
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

    onSubmit({
      ...form,
      image: form.image.filter((img) => img.trim() !== ''),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[1180px] px-8 py-8"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="mt-[6px]">
          <Button variant="disabled" onClick={handleCancel}>
            cancel
          </Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="rounded-full px-8 py-3"
        >
          {mode === 'edit' ? 'edit' : 'create'}
        </Button>
      </div>

      <div className="space-y-8">
        {mode === 'create' ? (
          <section>
            <TextInput
              label="Owner Email"
              type="email"
              placeholder="owner@gmail.com"
              value={form.ownerEmail}
              onChange={(value) => setField('ownerEmail', value)}
            />
          </section>
        ) : null}

        <section>
          <PhotoGrid images={previewImages} />

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
            <TextInput
              label="Main picture"
              placeholder="picture url"
              value={mainPicture}
              onChange={setMainPicture}
            />

            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextInput
                    label="Another picture"
                    placeholder="picture url"
                    value={anotherPictures[0] ?? ''}
                    onChange={(value) => setAnotherPicture(0, value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={addAnotherPicture}
                  className="mb-[2px] flex h-8 w-8 items-center justify-center rounded-full bg-[#2B3FCB] text-white"
                >
                  +
                </button>
              </div>

              {anotherPictures.slice(1).map((img, index) => {
                const actualIndex = index + 1;

                return (
                  <div key={actualIndex} className="flex items-center gap-2">
                    <div className="flex-1">
                      <TextInput
                        placeholder="picture url"
                        value={img}
                        onChange={(value) =>
                          setAnotherPicture(actualIndex, value)
                        }
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeAnotherPicture(actualIndex)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF9FA8] bg-white text-[#FF6B77]"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-3">
          <TextInput
            label="Hotel Name"
            placeholder="Resort Villa brabra"
            value={form.name}
            onChange={(value) => setField('name', value)}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="contact@sunsetparadise.com"
            value={form.email}
            onChange={(value) => setField('email', value)}
          />

          <TextInput
            label="Phone"
            placeholder="+66 76 123 456"
            value={form.phone}
            onChange={(value) => setField('phone', value)}
          />

          <div className="md:col-span-3">
            <TextInput
              label="Address"
              placeholder="Huai Kwang, Central, 342 Rama IV Road"
              value={form.address}
              onChange={(value) => setField('address', value)}
            />
          </div>

          <TextInput
            label="Province"
            placeholder="Bangkok"
            value={form.province}
            onChange={(value) => setField('province', value)}
          />

          <TextInput
            label="District"
            placeholder="Huai Kwang"
            value={form.district}
            onChange={(value) => setField('district', value)}
          />

          <TextInput
            label="Postal Code"
            placeholder="12345"
            value={form.postalCode}
            onChange={(value) => setField('postalCode', value)}
          />

          <div className="md:col-span-3">
            <label className="text-subdetail font-medium text-[var(--color-text-primary)]">
              Description
            </label>
            <div className="mt-2">
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="A beautiful beachfront hotel with stunning sunset views, offering modern rooms, comfortable facilities, and excellent service. Perfect for both relaxation and family vacations."
                className="min-h-[140px] w-full rounded-[16px] border border-[#D6D6D6] bg-white px-4 py-3 text-[15px] leading-7 text-[var(--color-text-primary)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-[32px] font-bold leading-none text-black">
            Facilities
          </h2>

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