/**
 * src/test-utils.jsx
 * Shared test utilities providing all app providers.
 * Import renderWithProviders instead of render for component tests.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DataContext } from './context/DataContext';
import { vi } from 'vitest';

/** Default mock auth value — logged-out guest */
export const mockAuthGuest = {
  user: null,
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: false,
  isAdmin: false,
};

/** Default mock auth value — logged-in user */
export const mockAuthUser = {
  user: {
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
    getIdToken: vi.fn().mockResolvedValue('mock-token'),
  },
  loginWithGoogle: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
  isAdmin: false,
};

/** Default mock data context */
export const mockDataCtx = {
  slides: [],
  banners: [],
  categories: [
    { id: 1, label: 'Dry Fruits', emoji: '🌰', img: '', bg: '#fff8f0' },
  ],
  deals: [],
  products: [
    { id: 1, name: 'Almonds', price: 299, mrp: 349, img: 'https://loremflickr.com/400/400/almond?lock=1', category: 'Dry Fruits', brand: 'Fortune Foodz', rating: 4.5, reviews: 100, petType: 'all' },
    { id: 2, name: 'Cashews', price: 399, mrp: 499, img: 'https://loremflickr.com/400/400/cashew?lock=2', category: 'Dry Fruits', brand: 'Fortune Foodz', rating: 4.7, reviews: 200, petType: 'all' },
  ],
  frontendSettings: {
    storeName: 'Fortune Foodz',
    tagline: 'Promise of Purity',
    logoChar: 'F',
    footerDescription: 'Test',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    whatsappNumber: '9999999999',
    whatsappOrderNumber: '9999999999',
    razorpayKeyId: 'rzp_test_123',
    contactEmail: 'test@fortunefoodz.com',
    contactPhone: '9999999999',
  },
  loading: false,
  activityLog: [],
  logActivity: vi.fn(),
  refreshData: vi.fn(),
  setProducts: vi.fn(),
  setCategories: vi.fn(),
  setDeals: vi.fn(),
  setSlides: vi.fn(),
  setBanners: vi.fn(),
  setFrontendSettings: vi.fn(),
};

/**
 * Render a component with all app providers.
 * @param {React.ReactElement} ui
 * @param {{ authValue?: object, dataValue?: object }} options
 */
export function renderWithProviders(ui, { authValue = mockAuthGuest, dataValue = mockDataCtx } = {}) {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <DataContext.Provider value={dataValue}>
          <CartProvider>
            {ui}
          </CartProvider>
        </DataContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export * from '@testing-library/react';
