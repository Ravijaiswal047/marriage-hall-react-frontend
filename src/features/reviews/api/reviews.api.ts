import { apiClient } from '@/lib/api/client';
import type { AverageRatingResponseDTO, ReviewRequestDTO } from '@/types/api';
import type { Review } from '@/types/common';

const DEFAULT_MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    hallId: 'hall-1',
    userId: 'u-1',
    reviewerName: 'Priya Sharma',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'Exquisite ambiance, top-tier stage lighting, and super helpful management staff! Made our wedding reception unforgettable.',
    createdAt: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 'rev-2',
    hallId: 'hall-1',
    userId: 'u-2',
    reviewerName: 'Amit Shah',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 4.5,
    comment: 'Spacious AC halls with great parking capacity. Highly recommended for big family weddings.',
    createdAt: '2026-02-22T10:00:00.000Z',
  },
  {
    id: 'rev-3',
    hallId: 'hall-2',
    userId: 'u-3',
    reviewerName: 'Neha Gupta',
    reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'Lush green lawns and seamless catering setup. All guests loved the venue.',
    createdAt: '2026-02-25T10:00:00.000Z',
  },
];

const FALLBACK_REVIEWS_KEY = 'marriagehall_fallback_reviews';

const getStoredReviews = (): Review[] => {
  try {
    const raw = localStorage.getItem(FALLBACK_REVIEWS_KEY);
    if (!raw) {
      localStorage.setItem(FALLBACK_REVIEWS_KEY, JSON.stringify(DEFAULT_MOCK_REVIEWS));
      return DEFAULT_MOCK_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MOCK_REVIEWS;
  } catch {
    return DEFAULT_MOCK_REVIEWS;
  }
};

const saveReview = (r: Review) => {
  try {
    const existing = getStoredReviews();
    const updated = [r, ...existing.filter((item) => item.id !== r.id)];
    localStorage.setItem(FALLBACK_REVIEWS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage limits
  }
};

export const reviewsApi = {
  addReview: async (data: ReviewRequestDTO): Promise<Review> => {
    try {
      const res = await apiClient.post<Review>('/reviews/add', data, { timeout: 4000 });
      if (res.data) {
        saveReview(res.data);
        return res.data;
      }
    } catch {
      // Fall through
    }

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      hallId: data.hallId,
      userId: 'user-1',
      reviewerName: data.reviewerName || 'Verified Guest',
      reviewerAvatar: data.reviewerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      rating: data.rating,
      comment: data.comment || 'Great venue and service!',
      createdAt: new Date().toISOString(),
    };

    saveReview(newReview);
    return newReview;
  },

  getHallReviews: async (hallId: string): Promise<Review[]> => {
    try {
      const res = await apiClient.get<Review[]>(`/reviews/${hallId}`, { timeout: 4000 });
      if (res.data) return res.data;
    } catch {
      // Fall through
    }

    const reviews = getStoredReviews();
    const hallReviews = reviews.filter((r) => r.hallId === hallId);
    return hallReviews.length > 0 ? hallReviews : DEFAULT_MOCK_REVIEWS.filter((r) => r.hallId === 'hall-1');
  },

  getAverageRating: async (
    hallId: string
  ): Promise<AverageRatingResponseDTO> => {
    try {
      const res = await apiClient.get<AverageRatingResponseDTO>(
        `/reviews/${hallId}/average`,
        { timeout: 4000 }
      );
      if (res.data) return res.data;
    } catch {
      // Fall through
    }

    const reviews = getStoredReviews().filter((r) => r.hallId === hallId);
    if (reviews.length === 0) {
      return { hallId, averageRating: 4.8, totalReviews: 12 };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      hallId,
      averageRating: Number((sum / reviews.length).toFixed(1)),
      totalReviews: reviews.length,
    };
  },
};
