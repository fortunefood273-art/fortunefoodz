import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDeals from './AdminDeals';
import { renderWithProviders } from '../../test-utils';

describe('AdminDeals', () => {
  it('renders manage deals header', () => {
    renderWithProviders(<AdminDeals />);
    expect(screen.getByText('Deals & Offers')).toBeInTheDocument();
    expect(screen.getByText('Add Deal')).toBeInTheDocument();
  });

  it('can open add deal modal', () => {
    renderWithProviders(<AdminDeals />);
    fireEvent.click(screen.getByText('Add Deal'));
    expect(screen.getByText('Add New Deal')).toBeInTheDocument();
  });
});

