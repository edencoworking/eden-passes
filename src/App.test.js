import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders welcome message and form', () => {
  render(<App />);
  
  // Check for the welcome message
  const welcomeElement = screen.getByText(/Welcome to your minimal React app!/i);
  expect(welcomeElement).toBeInTheDocument();
  
  // Check for the form heading
  const formHeading = screen.getByText(/Create New Pass/i);
  expect(formHeading).toBeInTheDocument();
  
  // Check for the Pass Type dropdown by label
  const passTypeLabel = screen.getByLabelText(/Pass Type/i);
  expect(passTypeLabel).toBeInTheDocument();
  
  // Check for the Date input by label
  const dateInput = screen.getByLabelText(/Date/i);
  expect(dateInput).toBeInTheDocument();
  
  // Check for the submit button
  const submitButton = screen.getByRole('button', { name: /Create Pass/i });
  expect(submitButton).toBeInTheDocument();
});

test('shows validation error when submitting without pass type', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  const submitButton = screen.getByRole('button', { name: /Create Pass/i });
  await user.click(submitButton);
  
  // Check that error message appears
  const errorMessage = screen.getByText(/Pass Type is required/i);
  expect(errorMessage).toBeInTheDocument();
});

test('clears validation error when pass type is selected', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  const submitButton = screen.getByRole('button', { name: /Create Pass/i });
  const passTypeSelect = screen.getByLabelText(/Pass Type/i);
  
  // Submit without selection to trigger error
  await user.click(submitButton);
  expect(screen.getByText(/Pass Type is required/i)).toBeInTheDocument();
  
  // Select a pass type
  await user.selectOptions(passTypeSelect, 'hourly');
  
  // Error should disappear
  expect(screen.queryByText(/Pass Type is required/i)).not.toBeInTheDocument();
});