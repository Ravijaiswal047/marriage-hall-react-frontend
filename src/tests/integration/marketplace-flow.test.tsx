import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HallsPage } from '@/features/halls/components/HallsPage';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('Integration: Marketplace & Search', () => {
  it('renders halls marketplace listing page with filter caps', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HallsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('button', { name: /filters/i })).toBeDefined();
  });
});

