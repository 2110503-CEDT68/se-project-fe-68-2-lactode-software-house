'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { FACILITY_OPTIONS } from '@/src/constants/facilities';
import { createRoom, formatApiMessage } from '@/src/lib/api';
import { useApp } from '@/src/context/AppContext';
import { RoomInput } from '@/types';

type Props = {
  hotelId: string;
};

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
  if (!state.roomType.trim()) return 'Please enter the room type.';
  if (!parsePositiveNumber(state.avaliableNumber)) return 'Please enter a valid available number.';
  if (!parsePositiveNumber(state.price)) return 'Please enter a valid price.';
  if (!parsePositiveNumber(state.people)) return 'Please enter valid people per room.';
  if (!state.bedType.trim()) return 'Please enter the bed type.';
  if (!parsePositiveNumber(state.bed)) return 'Please enter bed count.';
  if (!state.description.trim()) return 'Please enter the room description.';
  return null;
}

export default function RoomCreateForm({ hotelId }: Props) {
  const router = useRouter();
  const { hotels, token } = useApp();
  const [form, setForm] = useState<FormState>(initialState);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hotel = useMemo(() => hotels.find((item) => item._id === hotelId), [hotelId, hotels]);

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((current) => ({ ...current, [field]: value }));
    };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const pictures = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.readAsDataURL(file);
          })
      )
    );

    setForm((current) => ({
      ...current,
      picture: pictures.filter(Boolean),
    }));
  };

  const toggleFacility = (facility: string) => {
    setForm((current) => {
      const exists = current.facilities.includes(facility);
      return {
        ...current,
        facilities: exists
          ? current.facilities.filter((item) => item !== facility)
          : [...current.facilities, facility],
      };
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
      picture: form.picture,
      roomType: form.roomType.trim(),
      avaliableNumber: Number(form.avaliableNumber),
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
      await createRoom(payload, token);
      router.push(`/owner/hotels/${hotelId}`);
    } catch (error) {
      setMessage(formatApiMessage(error, 'Cannot create room.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="owner-room-form">
      <div className="owner-room-form__heading">
        <p className="owner-room-form__eyebrow">Create room</p>
        <h1 className="owner-room-form__title">Add room for your hotel</h1>
        <p className="owner-room-form__subtitle">
          Fill information{hotel ? ` for ${hotel.name}` : ''}.
        </p>
      </div>

      <div className="owner-room-form__actions">
        <button
          type="button"
          className="owner-room-form__button owner-room-form__button--secondary"
          onClick={() => router.back()}
        >
          cancel
        </button>

        <button
          type="submit"
          className="owner-room-form__button owner-room-form__button--primary"
          disabled={submitting}
        >
          {submitting ? <LoaderCircle className="owner-room-form__spinner" /> : null}
          <span>{submitting ? 'creating...' : 'create'}</span>
        </button>
      </div>

      <label className="owner-room-form__upload">
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="owner-room-form__file" />
        {form.picture[0] ? (
          <img src={form.picture[0]} alt="Room preview" className="owner-room-form__preview" />
        ) : (
          <div className="owner-room-form__upload-placeholder">
            <ImagePlus className="owner-room-form__upload-icon" />
            <span>upload picture</span>
          </div>
        )}
      </label>

      <div className="owner-room-form__grid">
        <label className="owner-room-form__field">
          <span>Room Type</span>
          <input
            type="text"
            placeholder="Suite Room"
            value={form.roomType}
            onChange={handleChange('roomType')}
          />
        </label>

        <label className="owner-room-form__field">
          <span>Room Amount</span>
          <input
            type="number"
            min="1"
            placeholder="10"
            value={form.avaliableNumber}
            onChange={handleChange('avaliableNumber')}
          />
        </label>

        <label className="owner-room-form__field">
          <span>Price</span>
          <input
            type="number"
            min="1"
            placeholder="500"
            value={form.price}
            onChange={handleChange('price')}
          />
        </label>

        <label className="owner-room-form__field">
          <span>People</span>
          <input
            type="number"
            min="1"
            placeholder="4"
            value={form.people}
            onChange={handleChange('people')}
          />
        </label>

        <label className="owner-room-form__field">
          <span>Bed Type</span>
          <input
            type="text"
            placeholder="King Size"
            value={form.bedType}
            onChange={handleChange('bedType')}
          />
        </label>

        <label className="owner-room-form__field">
          <span>Bed</span>
          <input
            type="number"
            min="1"
            placeholder="2"
            value={form.bed}
            onChange={handleChange('bed')}
          />
        </label>
      </div>

      <label className="owner-room-form__textarea-field">
        <span>Description</span>
        <textarea
          rows={5}
          placeholder="A beautiful beachfront hotel with stunning sunset views, offering modern rooms, comfortable facilities, and excellent service."
          value={form.description}
          onChange={handleChange('description')}
        />
      </label>

      <div className="owner-room-form__facilities">
        <span className="owner-room-form__section-title">Facilities</span>
        <div className="owner-room-form__chips">
          {FACILITY_OPTIONS.map(({ label, icon: Icon }) => {
            const active = form.facilities.includes(label);
            return (
              <button
                key={label}
                type="button"
                className={`owner-room-form__chip${active ? ' owner-room-form__chip--active' : ''}`}
                onClick={() => toggleFacility(label)}
              >
                <Icon className="owner-room-form__chip-icon" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {message ? (
        <p className="owner-room-form__message owner-room-form__message--error">{message}</p>
      ) : null}
    </form>
  );
}
