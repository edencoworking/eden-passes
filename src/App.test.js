import { render, screen } from '@testing-library/react';
import App from './App';

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