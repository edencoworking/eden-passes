import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the localStorage data layer
jest.mock('./services/api', () => ({
  getPasses: jest.fn(() => []),
  searchCustomers: jest.fn(() => []),
  createPass: jest.fn(() => ({ id: 'test-id', type: 'test', date: '2024-01-01' }))
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