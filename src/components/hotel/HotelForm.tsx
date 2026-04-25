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
  location: string;
  province: string;
  district: string;
  postalcode: string;
  description: string;
  tel: string;
  email: string;
  ownerEmail: string;
  facilities: string[];
  pictures: string[];
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
    const initialImages = Array.isArray(initialData?.pictures)
      ? initialData.pictures
      : initialData?.pictures
      ? [initialData.pictures as unknown as string]
      : [];

    return {
      name: initialData?.name ?? '',
      address: initialData?.address ?? '',
      location: initialData?.location ?? '',
      province: initialData?.province ?? '',
      district: initialData?.district ?? '',
      postalcode: initialData?.postalcode ?? '',
      description: initialData?.description ?? '',
      tel: initialData?.tel ?? '',
      email: initialData?.email ?? '',
      ownerEmail: initialData?.ownerEmail ?? '',
      facilities: initialData?.facilities ?? [],
      pictures: initialImages.length > 0 ? initialImages : [''],
    };
  }, [initialData]);

  const [form, setForm] = useState<HotelFormData>(normalizedInitialData);

  useEffect(() => {
    setForm(normalizedInitialData);
  }, [normalizedInitialData]);

  const setField = (
    field: keyof Omit<HotelFormData, 'facilities' | 'pictures'>,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const mainPicture = form.pictures[0] ?? '';
  const anotherPictures = form.pictures.slice(1);
  const canAddAnotherPicture = anotherPictures.length < 19;

  const previewImages = form.pictures.filter((img) => img.trim() !== '');

  const setMainPicture = (value: string) => {
    setForm((prev) => {
      const nextPictures = [...prev.pictures];
      nextPictures[0] = value;

      return {
        ...prev,
        pictures: nextPictures,
      };
    });
  };

  const setAnotherPicture = (index: number, value: string) => {
    setForm((prev) => {
      const nextPictures = [...prev.pictures];
      nextPictures[index + 1] = value;

      return {
        ...prev,
        pictures: nextPictures,
      };
    });
  };

  const addAnotherPicture = () => {
    if (!canAddAnotherPicture) return;

    setForm((prev) => ({
      ...prev,
      pictures: [...prev.pictures, ''],
    }));
  };

  const removeAnotherPicture = (index: number) => {
    setForm((prev) => {
      const nextPictures = [...prev.pictures];
      nextPictures.splice(index + 1, 1);

      return {
        ...prev,
        pictures: nextPictures.length > 0 ? nextPictures : [''],
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
      pictures: form.pictures.filter((img) => img.trim() !== ''),
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

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-subdetail font-semibold text-[var(--color-text-primary)]">
                    Main picture
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    This image will be used as the hotel cover photo.
                  </p>
                </div>
              </div>

              <TextInput
                placeholder="picture url"
                value={mainPicture}
                onChange={setMainPicture}
              />
            </div>

            <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-subdetail font-semibold text-[var(--color-text-primary)]">
                    Additional pictures
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add up to 19 more image URLs.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#2B3FCB]">
                  {anotherPictures.length}/19
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <TextInput
                      placeholder="picture url"
                      value={anotherPictures[0] ?? ''}
                      onChange={(value) => setAnotherPicture(0, value)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addAnotherPicture}
                    disabled={!canAddAnotherPicture}
                    title={canAddAnotherPicture ? 'Add another picture' : 'Maximum 19 additional pictures'}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2B3FCB] text-lg font-semibold leading-none text-white shadow-sm transition hover:bg-[#1E2C8F] disabled:cursor-not-allowed disabled:bg-slate-300"
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
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FF9FA8] bg-white text-lg font-semibold leading-none text-[#FF6B77] transition hover:bg-[#FFF1F2]"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-3">
          <TextInput
            label="Hotel Name"
            placeholder="Resort Villa brabra"
            value={form.name}
            required
            onChange={(value) => setField('name', value)}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="contact@sunsetparadise.com"
            value={form.email}
            required
            onChange={(value) => setField('email', value)}
          />

          <TextInput
            label="Phone"
            placeholder="+66 76 123 456"
            value={form.tel}
            onChange={(value) => setField('tel', value)}
          />

          <div className="md:col-span-3">
            <TextInput
              label="Address"
              placeholder="Huai Kwang, Central, 342 Rama IV Road"
              value={form.address}
              required
              onChange={(value) => setField('address', value)}
            />
          </div>

          <TextInput
            label="District"
            placeholder="Huai Kwang"
            value={form.district}
            required
            onChange={(value) => setField('district', value)}
          />

          <TextInput
            label="Province"
            placeholder="Bangkok"
            value={form.province}
            required
            onChange={(value) => setField('province', value)}
          />

          <TextInput
            label="Postal Code"
            placeholder="12345"
            value={form.postalcode}
            onChange={(value) => setField('postalcode', value)}
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