export type Role = 'USER' | 'ADMIN' | 'VENDOR';

export type BookingSlot = 'MORNING' | 'EVENING' | 'FULL_DAY';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type EventType =
  | 'WEDDING'
  | 'RECEPTION'
  | 'ENGAGEMENT'
  | 'BIRTHDAY'
  | 'ANNIVERSARY'
  | 'CORPORATE'
  | 'OTHER';

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export type PaymentType = 'ADVANCE' | 'FINAL' | 'REFUND';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Hall {
  id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  vegPricePerPlate?: number;
  nonVegPricePerPlate?: number;
  capacity: number;
  floatingCapacity?: number;
  description?: string;
  coverImageUrl?: string;
  images: string[];
  hasAc: boolean;
  hasParking: boolean;
  parkingCapacity?: number;
  roomsCount?: number;
  outsideCateringAllowed?: boolean;
  djAllowed?: boolean;
  alcoholAllowed?: boolean;
  powerBackup?: boolean;
  vendorId: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  hallId: string;
  bookingDate: string;
  slot: BookingSlot;
  eventType: EventType;
  guestCount?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  specialRequests?: string;
  totalAmount: number;
  paidAmount?: number;
  dueAmount?: number;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentEntity {
  id: string;
  bookingId: string;
  amount: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  idempotencyKey?: string;
  paymentDate?: string;
}

export interface Review {
  id: string;
  userId: string;
  hallId: string;
  reviewerName?: string;
  reviewerAvatar?: string;
  rating: number;
  comment?: string;
  isVerifiedBooking?: boolean;
  createdAt?: string;
}
