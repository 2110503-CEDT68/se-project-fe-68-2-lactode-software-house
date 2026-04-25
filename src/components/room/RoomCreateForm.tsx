'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import Button from '@/src/components/common/Button';
import FacilitySelector from '@/src/components/common/FacilitySelector';
import TextInput from '@/src/components/common/TextInput';
import PhotoGrid from '@/src/components/common/PhotoGrid';
import { ROOM_FACILITY_OPTIONS } from '@/src/constants/facilities';
import { createRoom, formatApiMessage, getRoomById, updateRoom } from '@/src/lib/api';
import { useApp } from '@/src/context/AppContext';
import { RoomInput } from '@/types';

type Props = {
  hotelId: string;
  mode?: 'create' | 'edit';
  roomId?: string;
  basePath?: string;
};

const ROOM_TYPE_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'twin', label: 'Twin' },
  { value: 'suite', label: 'Suite' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'family', label: 'Family' },
  { value: 'studio', label: 'Studio' },
] as const;

const BED_TYPE_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'queen', label: 'Queen' },
  { value: 'king', label: 'King' },
  { value: 'twin', label: 'Twin' },
] as const;

const MAX_ROOM_PICTURES = 10;
const MAX_ANOTHER_ROOM_PICTURES = 9;

function normalizePictures(pictures: string[]) {
  const seen = new Set<string>();

  return pictures
    .map((picture) => picture.trim())
    .filter((picture) => {
      if (!picture || seen.has(picture)) return false;
      seen.add(picture);
      return true;
    })
    .slice(0, MAX_ROOM_PICTURES);
}

type FormState = {
  roomType: string;
  avaliableNumber: string;
  price: string;
  people: string;
  bedType: string;
  bed: string;
  description: string;
  facilities: string[];
  picture: string[];
};

const initialState: FormState = {
  roomType: '',
  avaliableNumber: '',
  price: '',
  people: '',
  bedType: '',
  bed: '',
  description: '',
  facilities: ['Free Wi-Fi'],
  picture: [],
};

function parsePositiveNumber(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}


function validateForm(state: FormState) {
  if (!state.roomType.trim()) return 'Please select room type.';
  if (!parsePositiveNumber(state.avaliableNumber)) return 'Please enter a valid available number.';
  if (!parsePositiveNumber(state.price)) return 'Please enter a valid price.';
  if (!parsePositiveNumber(state.people)) return 'Please enter valid people per room.';
  if (!state.bedType.trim()) return 'Please select bed type.';
  if (!parsePositiveNumber(state.bed)) return 'Please enter bed count.';
  if (!state.description.trim()) return 'Please enter the room description.';
  return null;
}

function buildPictureList(mainPicture: string, anotherPictures: string[]) {
  return normalizePictures([mainPicture, ...anotherPictures]);
}

export default function RoomCreateForm({ hotelId, mode = 'create', roomId, basePath = '/owner/hotels' }: Props) {
  const router = useRouter();
  const { hotels, token } = useApp();
  const [form, setForm] = useState<FormState>(initialState);
  const [mainPicture, setMainPicture] = useState('');
  const [anotherPictures, setAnotherPictures] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(mode === 'edit');
  const isEditMode = mode === 'edit';

  const hotel = useMemo(() => hotels.find((item) => item._id === hotelId), [hotelId, hotels]);

  useEffect(() => {
    if (!isEditMode) {
      setLoadingRoom(false);
      return;
    }

    if (!roomId) {
      setMessage('Missing room ID.');
      setLoadingRoom(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoadingRoom(true);
        setMessage('');
        const room = await getRoomById(hotelId, roomId);
        if (cancelled) return;

        const availableNumber = room.availableNumber ?? room.avaliableNumber ?? 0;
        const normalizedPictures = normalizePictures(room.picture ?? []);
        setMainPicture(normalizedPictures[0] ?? '');
        setAnotherPictures(normalizedPictures.slice(1, MAX_ROOM_PICTURES));

        setForm({
          roomType: room.roomType ?? '',
          avaliableNumber: availableNumber > 0 ? String(availableNumber) : '',
          price: typeof room.price === 'number' ? String(room.price) : '',
          people: typeof room.people === 'number' ? String(room.people) : '',
          bedType: room.bedType ?? '',
          bed: typeof room.bed === 'number' ? String(room.bed) : '',
          description: room.description ?? '',
          facilities: room.facilities?.length ? room.facilities : ['Free Wi-Fi'],
          picture: normalizedPictures,
        });
      } catch (error) {
        if (!cancelled) {
          setMessage(formatApiMessage(error, 'Cannot load room data.'));
        }
      } finally {
        if (!cancelled) {
          setLoadingRoom(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hotelId, isEditMode, roomId]);

  const previewImages = buildPictureList(mainPicture, anotherPictures);
  const canAddAnotherPicture = anotherPictures.length < MAX_ANOTHER_ROOM_PICTURES;

  const syncPictures = (nextMainPicture: string, nextAnotherPictures: string[]) => {
    setForm((current) => ({
      ...current,
      picture: buildPictureList(nextMainPicture, nextAnotherPictures),
    }));
  };

  const handleMainPictureChange = (value: string) => {
    setMainPicture(value);
    syncPictures(value, anotherPictures);
  };

  const setAnotherPicture = (index: number, value: string) => {
    setAnotherPictures((current) => {
      const nextAnotherPictures = [...current];
      nextAnotherPictures[index] = value;
      syncPictures(mainPicture, nextAnotherPictures);
      return nextAnotherPictures;
    });
  };

  const addAnotherPicture = () => {
    if (!canAddAnotherPicture) return;

    setAnotherPictures((current) => {
      const nextAnotherPictures = [...current, ''];
      syncPictures(mainPicture, nextAnotherPictures);
      return nextAnotherPictures;
    });
  };

  const removeAnotherPicture = (index: number) => {
    setAnotherPictures((current) => {
      const nextAnotherPictures = current.filter((_, pictureIndex) => pictureIndex !== index);
      setForm((currentForm) => ({
        ...currentForm,
        picture: buildPictureList(mainPicture, nextAnotherPictures),
      }));
      return nextAnotherPictures;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Please sign in first.');
      return;
    }

    const validationMessage = validateForm(form);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    const payload: RoomInput = {
      hotelId,
      picture: buildPictureList(mainPicture, anotherPictures),
      roomType: form.roomType.trim(),
      availableNumber: Number(form.avaliableNumber),
      price: Number(form.price),
      people: Number(form.people),
      bedType: form.bedType.trim(),
      bed: Number(form.bed),
      description: form.description.trim(),
      facilities: form.facilities,
      status: 'available',
    };

    try {
      setSubmitting(true);
      if (isEditMode) {
        if (!roomId) {
          setMessage('Missing room ID.');
          return;
        }

        await updateRoom(
          hotelId,
          roomId,
          {
            picture: payload.picture,
            roomType: payload.roomType,
            availableNumber: payload.availableNumber,
            avaliableNumber: payload.availableNumber,
            price: payload.price,
            people: payload.people,
            bedType: payload.bedType,
            bed: payload.bed,
            description: payload.description,
            facilities: payload.facilities,
            status: payload.status,
          },
          token
        );

        router.push(`${basePath}/${hotelId}/rooms/${roomId}`);
      } else {
        await createRoom(
          {
            ...payload,
            avaliableNumber: payload.availableNumber,
          },
          token
        );
        router.push(`${basePath}/${hotelId}`);
      }
    } catch (error) {
      setMessage(formatApiMessage(error, isEditMode ? 'Cannot update room.' : 'Cannot create room.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRoom) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading room data...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="owner-room-form">
      <div className="owner-room-form__heading">
        <p className="owner-room-form__eyebrow">{isEditMode ? 'Edit room' : 'Create room'}</p>
        <h1 className="owner-room-form__title">
          {isEditMode ? 'Update room information' : 'Add room for your hotel'}
        </h1>
        <p className="owner-room-form__subtitle">
          Fill information{hotel ? ` for ${hotel.name}` : ''}.
        </p>
      </div>

      <div className="owner-room-form__actions">
        <Button
          type="button"
          variant="disabled"
          className="owner-room-form__action-button owner-room-form__action-button--secondary"
          onClick={() => router.back()}
        >
          cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          className="owner-room-form__action-button"
          disabled={submitting}
          icon={submitting ? <LoaderCircle className="owner-room-form__spinner" /> : undefined}
        >
          {submitting ? (isEditMode ? 'saving...' : 'creating...') : isEditMode ? 'save change' : 'create'}
        </Button>
      </div>

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
                  This image will be used as the room cover photo.
                </p>
              </div>
            </div>

            <TextInput
              placeholder="picture url"
              value={mainPicture}
              onChange={handleMainPictureChange}
            />
          </div>

          <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-subdetail font-semibold text-[var(--color-text-primary)]">
                  Additional pictures
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Add up to 9 more image URLs.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#2B3FCB]">
                {anotherPictures.length}/{MAX_ANOTHER_ROOM_PICTURES}
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
                  title={canAddAnotherPicture ? 'Add another picture' : 'Maximum 9 additional pictures'}
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
                        onChange={(value) => setAnotherPicture(actualIndex, value)}
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

      <div className="owner-room-form__grid">
        <label className="owner-room-form__field">
          <p className="text-subdetail font-medium text-[var(--color-text-primary)]">Room Type</p>
          <select
            value={form.roomType}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                roomType: event.target.value,
              }))
            }
            className={[
              'w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none',
              'focus:border-[var(--color-primary)]',
            ].join(' ')}
            style={{ color: form.roomType ? 'var(--color-text-primary)' : '#9ca3af' }}
          >
            <option value="">Select room type</option>
            {ROOM_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <TextInput
          label="Room Amount"
          type="number"
          min="1"
          placeholder="10"
          value={form.avaliableNumber}
          onChange={(value) => setForm((current) => ({ ...current, avaliableNumber: value }))}
          className="owner-room-form__field"
        />

        <TextInput
          label="Price"
          type="number"
          min="1"
          placeholder="500"
          value={form.price}
          onChange={(value) => setForm((current) => ({ ...current, price: value }))}
          className="owner-room-form__field"
        />

        <TextInput
          label="People"
          type="number"
          min="1"
          placeholder="4"
          value={form.people}
          onChange={(value) => setForm((current) => ({ ...current, people: value }))}
          className="owner-room-form__field"
        />

        <label className="owner-room-form__field">
          <p className="text-subdetail font-medium text-[var(--color-text-primary)]">Bed Type</p>
          <select
            value={form.bedType}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                bedType: event.target.value,
              }))
            }
            className={[
              'w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none',
              'focus:border-[var(--color-primary)]',
            ].join(' ')}
            style={{ color: form.bedType ? 'var(--color-text-primary)' : '#9ca3af' }}
          >
            <option value="">Select bed type</option>
            {BED_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <TextInput
          label="Bed"
          type="number"
          min="1"
          placeholder="2"
          value={form.bed}
          onChange={(value) => setForm((current) => ({ ...current, bed: value }))}
          className="owner-room-form__field"
        />
      </div>

      <label className="owner-room-form__textarea-field">
        <p className="text-subdetail font-medium text-[var(--color-text-primary)]">Description</p>
        <textarea
          className="text-sm text-[var(--color-text-primary)] placeholder:text-gray-400"
          rows={5}
          placeholder="A beautiful beachfront hotel with stunning sunset views, offering modern rooms, comfortable facilities, and excellent service."
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />
      </label>

      <div className="owner-room-form__facilities">
        <p className="text-subdetail font-medium text-[var(--color-text-primary)]">Facilities</p>
        <FacilitySelector
          scope="room"
          options={ROOM_FACILITY_OPTIONS.map((item) => item.label)}
          value={form.facilities}
          onChange={(facilities) =>
            setForm((current) => ({
              ...current,
              facilities,
            }))
          }
        />
      </div>

      {message ? (
        <p className="owner-room-form__message owner-room-form__message--error">{message}</p>
      ) : null}
    </form>
  );
}
