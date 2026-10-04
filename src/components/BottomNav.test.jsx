import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BottomNav from './BottomNav';
import { renderWithProviders } from '../test-utils';

describe('BottomNav Component', () => {
  it('renders all navigation items', () => {
    renderWithProviders(<BottomNav />);
    
    // BottomNav labels as actually rendered in DOM
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument(); // Catalogue displays as Browse
    expect(screen.getByText('Offers')).toBeInTheDocument();
    expect(screen.getByText('Wellness')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });
});
