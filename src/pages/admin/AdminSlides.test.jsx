import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminSlides from './AdminSlides';
import { renderWithProviders } from '../../test-utils';

describe('AdminSlides', () => {
  it('renders manage slides header', () => {
    renderWithProviders(<AdminSlides />);
    expect(screen.getByText('Hero Slides')).toBeInTheDocument();
    expect(screen.getByText('Add Slide')).toBeInTheDocument();
  });

  it('can open add slide modal', () => {
    renderWithProviders(<AdminSlides />);
    fireEvent.click(screen.getByText('Add Slide'));
    expect(screen.getByText('Add New Slide')).toBeInTheDocument();
  });
});

