import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to your minimal React app!/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders create new pass form', () => {
  render(<App />);
  expect(screen.getByText('Create New Pass')).toBeInTheDocument();
  expect(screen.getByLabelText('Pass Type *')).toBeInTheDocument();
  expect(screen.getByLabelText('Date')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Create Pass' })).toBeInTheDocument();
});

test('shows validation error when pass type is not selected', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  const submitButton = screen.getByRole('button', { name: 'Create Pass' });
  await user.click(submitButton);
  
  expect(screen.getByText('Pass Type is required')).toBeInTheDocument();
});

test('clears validation error when pass type is selected', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // First trigger the error
  const submitButton = screen.getByRole('button', { name: 'Create Pass' });
  await user.click(submitButton);
  expect(screen.getByText('Pass Type is required')).toBeInTheDocument();
  
  // Then select a pass type
  const passTypeSelect = screen.getByLabelText('Pass Type *');
  await user.selectOptions(passTypeSelect, 'hourly');
  
  expect(screen.queryByText('Pass Type is required')).not.toBeInTheDocument();
});

test('date input defaults to today', () => {
  render(<App />);
  const dateInput = screen.getByLabelText('Date');
  const today = new Date().toISOString().split('T')[0];
  expect(dateInput.value).toBe(today);
});

test('submits form with valid data', async () => {
  // Mock alert
  window.alert = jest.fn();
  
  const user = userEvent.setup();
  render(<App />);
  
  // Select pass type
  const passTypeSelect = screen.getByLabelText('Pass Type *');
  await user.selectOptions(passTypeSelect, 'weekly');
  
  // Change date
  const dateInput = screen.getByLabelText('Date');
  await user.clear(dateInput);
  await user.type(dateInput, '2024-01-15');
  
  // Submit form
  const submitButton = screen.getByRole('button', { name: 'Create Pass' });
  await user.click(submitButton);
  
  expect(window.alert).toHaveBeenCalledWith('Pass created!\nType: Weekly\nDate: 2024-01-15');
});