import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Eden Coworking Passes Management heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Eden Coworking Passes Management/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to the Eden Coworking space passes management system/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders features section', () => {
  render(<App />);
  const featuresElement = screen.getByText(/Features/i);
  expect(featuresElement).toBeInTheDocument();
});

test('renders deployment status', () => {
  render(<App />);
  const statusElement = screen.getByText(/System is running and ready for deployment to Vercel/i);
  expect(statusElement).toBeInTheDocument();
});
