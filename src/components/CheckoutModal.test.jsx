import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';
import { renderWithProviders } from '../test-utils';

describe('CheckoutModal', () => {
  it('renders checkout form correctly', () => {
    renderWithProviders(
      <CheckoutModal 
        isOpen={true} 
        onClose={vi.fn()} 
        cartItems={[]} 
        cartTotal={0} 
        onOrderSuccess={vi.fn()} 
      />
    );
    
    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
  });
});
