import { DocumentData, Timestamp } from "firebase/firestore";

export type TimeSlot = {
  startTime: { hour: string, minute: string };
  endTime: { hour: string, minute: string };
};

export type AvailableDate = {
  date: string;
  timeSlots: TimeSlot[];
};

export type NewAvailableDatesTime = {
  dates: string[];
  timeSlot: TimeSlot;
};

export type WorkingPlace = {
  id: string;
  seats: number;
  position: string;
  pricePerHour: number;
  createdAt?: Timestamp;
  availableDates: { [date: string]: TimeSlot[] };
};

export type Booking = {
  id: string;
  createdAt?: Timestamp;
  userId: string;
  workingPlaceId: string;
  coworkingId: string;
  status?: 'active' | 'completed' | 'canceled';
  date?: string;
  timeSlot: TimeSlot;
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type CreateBookingData = Omit<Booking, 'id' | 'createdAt' | 'status'>;

export type User = {
  id: string;
  email: string;
  userSkills?: string[];
  admin?: boolean;
};

export type CoworkingItemType = {
  id: string;
  name: string;
  location: string;
  imageUrls: string[];
  description: string;
  networking?: boolean;
};

export type RangeValue = {
  lower: number;
  upper: number;
};

export type newSettings = {
  location: string;
  skills: string[];
  priceRange: RangeValue;
};

export type CustomizedState = { coworkingId: string };

export interface DocumentDataInterface {
  user: DocumentData;
}