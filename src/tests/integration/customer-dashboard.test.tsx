import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerDashboardPage } from '@/features/customer/pages/CustomerDashboardPage';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('Integration: Customer Dashboard', () => {
  it('renders customer dashboard with activity overview', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { name: /upcoming reservations/i })).toBeDefined();
    expect(screen.getByRole('heading', { name: /profile summary/i })).toBeDefined();
  });
});

