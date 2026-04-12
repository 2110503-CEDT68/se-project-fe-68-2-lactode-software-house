type Role = 'user' | 'admin' | 'hotel owner'

export type User = {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: Role;
};

export type Hotel = {
  _id: string;
  name: string;
  description: string;
  location: string;
  district: string;
  province: string;
  postalcode: string;
  region: string;
  tel: string;
  email: string;
  pictures: string[];
  facilities: string[];
  status: string;
};

export type Booking = {
  _id: string;
  user: string | User;
  hotel: string | Hotel;
  checkInDate: string;
  checkOutDate: string;
  createdAt?: string;
};

export type Room = {
  _id: string;
  hotel?: string | Hotel;
  picture: string[];
  roomType: string;
  price: number;
  people: number;
  bedType: string;
  bed: number;
  description: string;
  facilities: string[];
  avaliableNumber: number;
  status: string;
};

export type RegisterInput = {
  name: string;
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
  avaliableNumber: number;
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
