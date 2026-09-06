import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccountPage from './AccountPage';
import { renderWithProviders, mockAuthGuest, mockAuthUser } from '../test-utils';

// Mock axios so /api/orders/mine doesn't throw
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
  }
}));

describe('AccountPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders guest view by default', () => {
    renderWithProviders(<AccountPage />, { authValue: mockAuthGuest });
    expect(screen.getByText('Welcome to Fortune Foodz')).toBeInTheDocument();
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  it('renders logged in view when user is authenticated', async () => {
    const authVal = {
      ...mockAuthUser,
      user: { ...mockAuthUser.user, displayName: 'Priya Sharma' },
    };
    renderWithProviders(<AccountPage />, { authValue: authVal });
    
    await waitFor(() => {
      expect(screen.getByText(/Namaste, Priya Sharma/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText('My Orders').length).toBeGreaterThan(0);
  });
});
