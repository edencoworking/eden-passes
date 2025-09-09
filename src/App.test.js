import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello component', () => {
  render(<App />);
  const helloElement = screen.getByText(/Hello, Eden Passes!/i);
  expect(helloElement).toBeInTheDocument();
});