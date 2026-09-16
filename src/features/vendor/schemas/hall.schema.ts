import { z } from 'zod';

export const hallFormSchema = z.object({
  name: z.string().min(1, 'Venue name is required').min(3, 'Name must be at least 3 characters'),
  location: z.string().min(1, 'Location string is required').min(3, 'Location must be at least 3 characters'),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().optional(),
  price: z
    .number({ message: 'Price must be a valid number' })
    .min(1, 'Daily price must be at least ₹1'),
  vegPricePerPlate: z.number().optional(),
  nonVegPricePerPlate: z.number().optional(),
  capacity: z
    .number({ message: 'Seated capacity must be a valid number' })
    .min(10, 'Minimum seated capacity must be at least 10 guests'),
  floatingCapacity: z.number().optional(),
  description: z.string().optional(),
  coverImageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      'Cover image URL must start with http:// or https://'
    ),
  images: z.array(z.string()).optional(),
  hasAc: z.boolean(),
  hasParking: z.boolean(),
  parkingCapacity: z.number().optional(),
  roomsCount: z.number().optional(),
  outsideCateringAllowed: z.boolean(),
  djAllowed: z.boolean(),
  alcoholAllowed: z.boolean(),
  powerBackup: z.boolean(),
});

export type HallFormValues = z.infer<typeof hallFormSchema>;

