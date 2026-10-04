import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminCategories from './AdminCategories';
import { renderWithProviders } from '../../test-utils';

describe('AdminCategories', () => {
  it('renders manage categories header', () => {
    renderWithProviders(<AdminCategories />);
    expect(screen.getByText('Categories', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('can open add category modal', () => {
    renderWithProviders(<AdminCategories />);
    fireEvent.click(screen.getByText('Add Category'));
    expect(screen.getByText('Add New Category')).toBeInTheDocument();
  });
});

