import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { CartProvider, useCart } from './CartContext';
import { AuthContext } from './AuthContext';

function TestComponent() {
  const { 
    cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, isInCart,
    wishlistItems, toggleWishlist, isWishlisted, removeFromWishlist, toastMsg 
  } = useCart();

  return (
    <div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="cart-total">{cartTotal}</div>
      <div data-testid="wishlist-count">{wishlistItems.length}</div>
      <div data-testid="toast-msg">{toastMsg}</div>
      
      <button data-testid="add-item-1" onClick={() => addToCart({ id: 1, name: 'Product 1', price: 100 })}>Add 1</button>
      <button data-testid="add-item-2" onClick={() => addToCart({ id: 2, name: 'Product 2', price: 200 })}>Add 2</button>
      <button data-testid="remove-item-1" onClick={() => removeFromCart(1)}>Remove 1</button>
      <button data-testid="inc-item-1" onClick={() => updateQty(1, 1)}>Inc 1</button>
      <button data-testid="dec-item-1" onClick={() => updateQty(1, -1)}>Dec 1</button>
      <button data-testid="clear-cart" onClick={() => clearCart()}>Clear</button>
      <button data-testid="toggle-wishlist-1" onClick={() => toggleWishlist({ id: 1, name: 'Product 1', price: 100 })}>Toggle WL 1</button>
      <button data-testid="remove-wishlist-1" onClick={() => removeFromWishlist(1)}>Remove WL 1</button>
      <div data-testid="in-cart-1">{isInCart(1) ? 'yes' : 'no'}</div>
      <div data-testid="wishlisted-1">{isWishlisted(1) ? 'yes' : 'no'}</div>
      {cartItems.map(i => <div key={i.id} data-testid={`item-${i.id}`}>{i.name} x{i.qty}</div>)}
    </div>
  );
}

const mockAuth = {
  user: null,
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: false,
  isAdmin: false,
};

function renderTest() {
  return renderWithProviders(<TestComponent />, { authValue: mockAuth });
}

describe('CartContext', () => {
  it('provides initial cart state', () => {
    renderTest();
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
    expect(screen.getByTestId('wishlist-count').textContent).toBe('0');
  });

  it('adds items to cart and calculates count and total correctly', () => {
    renderTest();
    fireEvent.click(screen.getByTestId('add-item-1'));
    fireEvent.click(screen.getByTestId('add-item-2'));
    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByTestId('cart-total').textContent).toBe('300');
    expect(screen.getByTestId('in-cart-1').textContent).toBe('yes');
  });

  it('removes items from cart', () => {
    renderTest();
    fireEvent.click(screen.getByTestId('add-item-1'));
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    fireEvent.click(screen.getByTestId('remove-item-1'));
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('updates item quantity', () => {
    renderTest();
    fireEvent.click(screen.getByTestId('add-item-1'));
    fireEvent.click(screen.getByTestId('inc-item-1'));
    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    fireEvent.click(screen.getByTestId('dec-item-1'));
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
  });

  it('clears cart', () => {
    renderTest();
    fireEvent.click(screen.getByTestId('add-item-1'));
    fireEvent.click(screen.getByTestId('add-item-2'));
    fireEvent.click(screen.getByTestId('clear-cart'));
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('toggles wishlist items', () => {
    renderTest();
    expect(screen.getByTestId('wishlist-count').textContent).toBe('0');
    fireEvent.click(screen.getByTestId('toggle-wishlist-1'));
    expect(screen.getByTestId('wishlist-count').textContent).toBe('1');
    expect(screen.getByTestId('wishlisted-1').textContent).toBe('yes');
    fireEvent.click(screen.getByTestId('toggle-wishlist-1'));
    expect(screen.getByTestId('wishlist-count').textContent).toBe('0');
  });

  it('removes from wishlist directly', () => {
    renderTest();
    fireEvent.click(screen.getByTestId('toggle-wishlist-1'));
    expect(screen.getByTestId('wishlist-count').textContent).toBe('1');
    fireEvent.click(screen.getByTestId('remove-wishlist-1'));
    expect(screen.getByTestId('wishlist-count').textContent).toBe('0');
  });

  it('shows toast message and clears it after timeout', async () => {
    vi.useFakeTimers();
    renderTest();
    fireEvent.click(screen.getByTestId('add-item-1'));
    expect(screen.getByTestId('toast-msg').textContent).toContain('Product 1');
    act(() => { vi.advanceTimersByTime(2300); });
    expect(screen.getByTestId('toast-msg').textContent).toBe('');
    vi.useRealTimers();
  });

});

