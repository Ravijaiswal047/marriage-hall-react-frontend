import { apiClient } from '@/lib/api/client';
import type { AverageRatingResponseDTO, ReviewRequestDTO } from '@/types/api';
import type { Review } from '@/types/common';

export const reviewsApi = {
  addReview: async (data: ReviewRequestDTO): Promise<Review> => {
    const res = await apiClient.post<Review>('/reviews/add', data);
    return res.data;
  },

  getHallReviews: async (hallId: string): Promise<Review[]> => {
    const res = await apiClient.get<Review[]>(`/reviews/${hallId}`);
    return res.data;
  },

  getAverageRating: async (
    hallId: string
  ): Promise<AverageRatingResponseDTO> => {
    const res = await apiClient.get<AverageRatingResponseDTO>(
      `/reviews/${hallId}/average`
    );
    return res.data;
  },
};

