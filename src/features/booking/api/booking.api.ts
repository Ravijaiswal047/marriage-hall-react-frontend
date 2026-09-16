import { apiClient } from '@/lib/api/client';
import type {
  BookingDetailResponseDTO,
  BookingRequestDTO,
  BookingSummaryResponseDTO,
  SlotAvailabilityResponseDTO,
} from '@/types/api';
import type { Booking } from '@/types/common';

export const bookingApi = {
  createBooking: async (data: BookingRequestDTO): Promise<Booking> => {
    const res = await apiClient.post<Booking>('/bookings/create', data);
    return res.data;
  },

  checkSlotAvailability: async (
    hallId: string,
    date: string
  ): Promise<SlotAvailabilityResponseDTO> => {
    const res = await apiClient.get<SlotAvailabilityResponseDTO>(
      `/bookings/availability/${hallId}`,
      { params: { date } }
    );
    return res.data;
  },

  getBookedDates: async (
    hallId: string,
    startDate: string,
    endDate: string
  ): Promise<SlotAvailabilityResponseDTO[]> => {
    const res = await apiClient.get<SlotAvailabilityResponseDTO[]>(
      `/bookings/booked-dates/${hallId}`,
      { params: { startDate, endDate } }
    );
    return res.data;
  },

  getBookingDetails: async (
    bookingId: string
  ): Promise<BookingDetailResponseDTO> => {
    const res = await apiClient.get<BookingDetailResponseDTO>(
      `/bookings/${bookingId}`
    );
    return res.data;
  },

  cancelBooking: async (bookingId: string): Promise<Booking> => {
    const res = await apiClient.put<Booking>(`/bookings/${bookingId}/cancel`);
    return res.data;
  },

  updateBookingStatus: async (
    bookingId: string,
    status: string
  ): Promise<Booking> => {
    const res = await apiClient.put<Booking>(
      `/bookings/${bookingId}/status`,
      null,
      { params: { status } }
    );
    return res.data;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const res = await apiClient.get<Booking[]>(`/bookings/user/${userId}`);
    return res.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const res = await apiClient.get<Booking[]>('/bookings/my-bookings');
    return res.data;
  },

  getBookingSummary: async (
    bookingId: string
  ): Promise<BookingSummaryResponseDTO> => {
    const res = await apiClient.get<BookingSummaryResponseDTO>(
      `/bookings/${bookingId}/summary`
    );
    return res.data;
  },
};

