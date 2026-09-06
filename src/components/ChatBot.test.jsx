import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ChatBot from './ChatBot';
import { renderWithProviders } from '../test-utils';
import { vi } from 'vitest';

describe('ChatBot Component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
  });

  const getDesktopToggle = () => screen.getByRole('button', { name: /Toggle chat assistant/i });

  test('renders the chatbot toggle button', () => {
    renderWithProviders(<ChatBot />);
    expect(getDesktopToggle()).toBeInTheDocument();
  });

  test('opens chat window when desktop toggle is clicked', async () => {
    renderWithProviders(<ChatBot />);
    
    // Initially no greeting visible
    expect(screen.queryAllByText(/Fortune Foodz Purity Assistant/i)).toHaveLength(0);
    
    fireEvent.click(getDesktopToggle());
    
    await waitFor(() => {
      // It renders in both mobile and desktop panels simultaneously
      expect(screen.getAllByText(/Fortune Foodz Purity Assistant/i).length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('shows message input after opening chat', async () => {
    renderWithProviders(<ChatBot />);
    fireEvent.click(getDesktopToggle());
    
    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText(/Type your message.../i);
      expect(inputs.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});
