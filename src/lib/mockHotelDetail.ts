export type HotelInfoData = {
  name: string;
  address: string;
  province: string;
  description: string;
  phone: string;
  email: string;
};

export type RoomCardData = {
  _id: string;
  name: string;
  bedType: string;
  available: number;
  maxAdults: number;
  image?: string | null;
};

export const MOCK_HOTEL_INFO: HotelInfoData = {
  name: 'Resort Villa brabra',
  address: 'Huai Kwang, Central, 342 Rama IV Road',
  province: 'Bangkok',
  description:
    'A beautiful beachfront hotel with stunning sunset views, offering modern rooms, comfortable facilities, and excellent service. Perfect for both relaxation and family vacations.',
  phone: '+66 76 123 456',
  email: 'contact@sunsetparadise.com',
};

export const MOCK_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=400',
];

export const MOCK_FACILITIES: string[] = [
  'Non-Smoking',
  'Free Wi-Fi',
  'Swimming Pool',
  'Fitness Center',
  'Parking',
  'Restaurant',
  'Bar/Lounge',
  'Spa',
  'Room Service',
  'Laundry',
  'Airport Shuttle',
  'Pet Friendly',
  'Air Conditioning',
  '24-Hour Front Desk',
];

export const MOCK_ROOMS: RoomCardData[] = [
  {
    _id: '1',
    name: 'Deluxe King Room',
    bedType: 'King bed',
    available: 3,
    maxAdults: 2,
    image: null,
  },
  {
    _id: '2',
    name: 'Twin Standard Room',
    bedType: '2 Single beds',
    available: 5,
    maxAdults: 2,
    image: null,
  },
  {
    _id: '3',
    name: 'Family Suite',
    bedType: 'King bed + 2 Single beds',
    available: 1,
    maxAdults: 4,
    image: null,
  },
  {
    _id: '4',
    name: 'Superior Double Room',
    bedType: 'Double bed',
    available: 0,
    maxAdults: 2,
    image: null,
  },
];
