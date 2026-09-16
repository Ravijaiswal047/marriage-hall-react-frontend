import { z } from 'zod';

export const reviewFormSchema = z.object({
  hallId: z.string().min(1, 'Hall ID is required'),
  rating: z
    .number({ message: 'Rating selection is required' })
    .min(1, 'Please select a rating between 1 and 5 stars')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: z
    .string()
    .min(3, 'Review comment must be at least 3 characters')
    .max(2000, 'Review comment cannot exceed 2000 characters'),
  reviewerName: z.string().optional(),
  reviewerAvatar: z.string().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

