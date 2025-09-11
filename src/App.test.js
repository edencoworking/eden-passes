import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to prevent API calls during testing
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

test('renders Eden Passes heading', () => {
  render(<App />);
  const headingElements = screen.getAllByText(/Eden Passes/i);
  expect(headingElements.length).toBeGreaterThan(0);
});

test('renders Create New Pass section', () => {
  render(<App />);
  const createPassElement = screen.getByText(/Create New Pass/i);
  expect(createPassElement).toBeInTheDocument();
});