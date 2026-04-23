export type Role = 'guest' | 'user' | 'hotelOwner' | 'admin'

export type User = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  tel: string;
  role: Role;
  favoriteHotels: string[];
  picture?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Hotel = {
  _id: string;
  name: string;
  description: string;
  location: string;
  address?: string;
  district: string;
  province: string;
  postalcode: string;
  region: string;
  ownerID?: string | User;
  tel: string;
  email: string;
  pictures: string[];
  image?: string | null;
  rooms?: Array<string | Room>;
  roomTypes?: string[];
  facilities: string[];
  status: string;
  favoriteBy?: number;
  bookedTimes?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Booking = {
  _id: string;
  bookingID?: string;
  user: string | User;
  hotelID: string | Hotel;
  roomID?: string | Room;
  hotel: string | Hotel;
  room?: string | Room;
  checkInDate: string;
  checkOutDate: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Room = {
  _id: string;
  hotelID: string | Hotel;
  hotel?: string | Hotel;
  picture: string[];
  image?: string | null;
  roomType: string;
  price: number;
  people: number;
  bedType: string;
  bed: number;
  description: string;
  facilities: string[];
  availableNumber: number;
  avaliableNumber?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterInput = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  tel: string;
  password: string;
};

export type LoginInput = {
  identifier: string;
  password: string;
};

export type BookingInput = {
  hotelId: string;
  roomId?: string;
  checkInDate: string;
  checkOutDate: string;
};

export type RoomInput = {
  hotelId: string;
  picture: string[];
  roomType: string;
  price: number;
  people: number;
  bedType: string;
  bed: number;
  description: string;
  facilities: string[];
  availableNumber: number;
  avaliableNumber?: number;
  status: string;
};

export type ApiListResponse<T> = {
  success: boolean;
  count?: number;
  data: T[];
};

export type ApiItemResponse<T> = {
  success: boolean;
  data: T;
  token?: string;
  msg?: string;
  message?: string;
};
