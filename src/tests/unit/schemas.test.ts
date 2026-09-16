import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema';
import { createBookingSchema, paymentSchema } from '@/features/booking/schemas/booking.schema';
import { reviewFormSchema } from '@/features/reviews/schemas/review.schema';
import { hallFormSchema } from '@/features/vendor/schemas/hall.schema';

describe('auth schemas', () => {
  it('validates login input', () => {
    const valid = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = loginSchema.safeParse({
      email: 'invalid-email',
      password: '123',
    });
    expect(invalidEmail.success).toBe(false);
  });

  it('validates register input', () => {
    const valid = registerSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secretpassword',
      phone: '+919876543210',
      role: 'USER',
    });
    expect(valid.success).toBe(true);

    const invalidRole = registerSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secretpassword',
      role: 'SUPERADMIN',
    });
    expect(invalidRole.success).toBe(false);
  });
});

describe('booking schemas', () => {
  it('validates booking creation data', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateStr = futureDate.toISOString().split('T')[0];

    const valid = createBookingSchema.safeParse({
      hallId: 'hall-123',
      bookingDate: dateStr,
      slot: 'FULL_DAY',
      eventType: 'WEDDING',
      guestCount: 250,
      customerName: 'Rahul Kumar',
      customerPhone: '+919876543210',
    });
    expect(valid.success).toBe(true);

    const pastDate = createBookingSchema.safeParse({
      hallId: 'hall-123',
      bookingDate: '2020-01-01',
      slot: 'FULL_DAY',
      eventType: 'WEDDING',
      guestCount: 50,
      customerName: 'Rahul',
      customerPhone: '9876543210',
    });
    expect(pastDate.success).toBe(false);
  });

  it('validates payment input', () => {
    expect(paymentSchema.safeParse({ bookingId: 'b-1', amount: 5000 }).success).toBe(true);
    expect(paymentSchema.safeParse({ bookingId: 'b-1', amount: -100 }).success).toBe(false);
  });
});

describe('review form schema', () => {
  it('validates review submission', () => {
    const valid = reviewFormSchema.safeParse({
      hallId: 'hall-123',
      rating: 5,
      comment: 'Excellent venue with great facilities and friendly staff!',
    });
    expect(valid.success).toBe(true);

    const zeroRating = reviewFormSchema.safeParse({
      hallId: 'hall-123',
      rating: 0,
      comment: 'Too short',
    });
    expect(zeroRating.success).toBe(false);
  });
});

describe('hall form schema', () => {
  it('validates vendor hall management form', () => {
    const valid = hallFormSchema.safeParse({
      name: 'Grand Royal Palace',
      location: 'MG Road, Bengaluru',
      price: 150000,
      capacity: 500,
      hasAc: true,
      hasParking: true,
      outsideCateringAllowed: false,
      djAllowed: true,
      alcoholAllowed: false,
      powerBackup: true,
    });
    expect(valid.success).toBe(true);

    const lowCapacity = hallFormSchema.safeParse({
      name: 'Tiny Room',
      location: 'City Center',
      price: 1000,
      capacity: 2, // Less than minimum 10
      hasAc: false,
      hasParking: false,
      outsideCateringAllowed: true,
      djAllowed: false,
      alcoholAllowed: false,
      powerBackup: false,
    });
    expect(lowCapacity.success).toBe(false);
  });
});

