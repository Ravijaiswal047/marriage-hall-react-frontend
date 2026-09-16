import type {
  Booking,
  BookingSlot,
  BookingStatus,
  EventType,
  Role,
} from './common';

// Spring Data Page Response Structure
export interface SpringPage<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// Request DTOs
export interface SignupRequestDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface HallRequestDTO {
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
  images?: string[];
  hasAc?: boolean;
  hasParking?: boolean;
  parkingCapacity?: number;
  roomsCount?: number;
  outsideCateringAllowed?: boolean;
  djAllowed?: boolean;
  alcoholAllowed?: boolean;
  powerBackup?: boolean;
}

export interface BookingRequestDTO {
  hallId: string;
  bookingDate: string;
  slot?: BookingSlot;
  eventType?: EventType;
  guestCount?: number;
  customerName?: string;
  customerPhone?: string;
  specialRequests?: string;
}

export interface PaymentRequestDTO {
  bookingId: string;
  amount: number;
}

export interface ReviewRequestDTO {
  hallId: string;
  reviewerName?: string;
  reviewerAvatar?: string;
  rating: number;
  comment?: string;
}

export interface HallSearchParams {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  hasAc?: boolean;
  hasParking?: boolean;
  category?: string;
  bookingDate?: string;
  guestCount?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

// Response DTOs
export interface AuthResponseDTO {
  message: string;
  token: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
}

export interface UserProfileResponseDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface SlotAvailabilityResponseDTO {
  hallId: string;
  date: string;
  available: boolean;
  bookedSlots: BookingSlot[];
  availableSlots: BookingSlot[];
}

export interface BookingDetailResponseDTO {
  booking: Booking;
  hall: {
    id: string;
    name: string;
    location: string;
    price: number;
    capacity: number;
    description?: string;
  };
}

export interface BookingSummaryResponseDTO {
  bookingId: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  fullyPaid: boolean;
  status: BookingStatus;
}

export interface VendorDashboardResponseDTO {
  totalHalls: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  receivedAmount: number;
  dueAmount: number;
}

export interface VendorBookingResponseDTO {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  hallName: string;
  bookingDate: string;
  slot: string;
  eventType: string;
  guestCount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
}

export interface AverageRatingResponseDTO {
  hallId: string;
  averageRating: number;
  totalReviews: number;
}
