import { z } from 'zod';

export const createBookingSchema = z.object({
  hallId: z.string().min(1, 'Hall ID is required'),
  bookingDate: z
    .string()
    .min(1, 'Please select a booking date')
    .refine((dateStr) => {
      const selected = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Booking date cannot be in the past'),
  slot: z.enum(['FULL_DAY', 'MORNING', 'EVENING'], {
    message: 'Please select a valid time slot',
  }),
  eventType: z.enum(
    ['WEDDING', 'RECEPTION', 'ENGAGEMENT', 'SANGEET', 'BIRTHDAY', 'CORPORATE', 'OTHER'],
    { message: 'Please select an event type' }
  ),
  guestCount: z
    .number({ message: 'Guest count must be a number' })
    .min(1, 'Expected guest count must be at least 1'),
  customerName: z
    .string()
    .min(1, 'Contact name is required')
    .min(2, 'Name must be at least 2 characters'),
  customerPhone: z
    .string()
    .min(1, 'Contact phone number is required')
    .min(5, 'Please enter a valid phone number'),
  specialRequests: z.string().optional(),
});

export const paymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  amount: z.number().min(1, 'Payment amount must be greater than zero'),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;

