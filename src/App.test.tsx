import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders passes management heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /Eden Passes Management/i });
  expect(headingElement).toBeInTheDocument();
});
