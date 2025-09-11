import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API functions
jest.mock('./api/mock', () => ({
  listPasses: jest.fn(() => []),
  searchCustomers: jest.fn(() => []),
  createPass: jest.fn()
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