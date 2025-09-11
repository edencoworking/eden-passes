import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the mock API module since App.js includes PassesPage
jest.mock('./api/mock', () => ({
  searchCustomers: jest.fn(() => []),
  listPasses: jest.fn(() => []),
  createPass: jest.fn()
}));

test('renders Eden Passes heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Eden Passes/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders Create New Pass section', () => {
  render(<App />);
  const createPassElement = screen.getByText(/Create New Pass/i);
  expect(createPassElement).toBeInTheDocument();
});