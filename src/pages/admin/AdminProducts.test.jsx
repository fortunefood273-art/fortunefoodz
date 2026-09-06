import React, { useState } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import { DataContext } from '../../context/DataContext';
import AdminProducts from './AdminProducts';
import { renderWithProviders, mockAuthUser } from '../../test-utils';

const initialProducts = [
  { id: 1, name: 'Premium Jumbo California Almonds', brand: 'Fortune Foodz', price: 649, mrp: 849, badge: '⭐ Customer Choice', category: 'Dry Fruits', img: '' },
  { id: 2, name: 'Royal Whole King Cashews (W240)', brand: 'Fortune Foodz', price: 799, mrp: 999, badge: '🔥 Hot Selling', category: 'Dry Fruits', img: '' }
];

function MockDataProvider({ children }) {
  const [products, setProducts] = useState(initialProducts.map(p => ({ ...p })));
  const refreshData = vi.fn();
  return (
    <DataContext.Provider value={{ products, setProducts, categories: [], loading: false, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

const renderAdminProducts = () => {
  return renderWithProviders(
    <MockDataProvider>
      <AdminProducts />
    </MockDataProvider>,
    { authValue: { ...mockAuthUser, isAdmin: true, isAuthenticated: true } }
  );
};

describe('AdminProducts', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    global.confirm = vi.fn(() => true);
  });

  it('renders existing products from context', () => {
    renderAdminProducts();
    expect(screen.getByText('Products', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('Premium Jumbo California Almonds')).toBeInTheDocument();
  });

  it('can open modal to add a new product', async () => {
    renderAdminProducts();
    
    await act(async () => {
      fireEvent.click(screen.getByText('Add Product'));
    });
    
    expect(screen.getByText('Add New Product', { selector: 'h3' })).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText(/Product Name/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test Product 123' } });
    });
    
    expect(nameInput.value).toBe('Test Product 123');
  });

  it('can edit an existing product', async () => {
    renderAdminProducts();
    
    const editButton = screen.getByTestId('edit-btn-1');
    await act(async () => {
      fireEvent.click(editButton);
    });
    
    expect(screen.getByText('Edit Product', { selector: 'h3' })).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText(/Product Name/i);
    expect(nameInput.value).toBe('Premium Jumbo California Almonds');
  });

  it('renders delete button for each product', () => {
    renderAdminProducts();
    expect(screen.getByTestId('del-btn-1')).toBeInTheDocument();
    expect(screen.getByTestId('del-btn-2')).toBeInTheDocument();
  });
});
