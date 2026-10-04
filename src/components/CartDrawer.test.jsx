import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';
import { renderWithProviders } from '../test-utils';

// Mock navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

// Helper: opens cart via context
function TestWrapper() {
  const { setCartOpen, addToCart } = useCart();
  return (
    <>
      <button data-testid="open-cart" onClick={() => setCartOpen(true)}>Open Cart</button>
      <button data-testid="add-item" onClick={() => addToCart({ id: 1, name: 'Premium Almonds', price: 999, img: '' })}>
        Add Item
      </button>
      <CartDrawer />
    </>
  );
}

describe('CartDrawer Component', () => {
  it('renders empty cart message when no items are present', async () => {
    renderWithProviders(<TestWrapper />);
    fireEvent.click(screen.getByTestId('open-cart'));
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty!')).toBeInTheDocument();
    });
  });

  it('renders cart items when added', async () => {
    renderWithProviders(<TestWrapper />);
    
    // Add item first, then open cart
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('open-cart'));
    
    await waitFor(() => {
      expect(screen.getByText('Premium Almonds')).toBeInTheDocument();
    });
  });
});
