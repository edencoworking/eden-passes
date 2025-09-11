import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

const mockedAxios = axios;

describe('PassesPage Error Handling', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays backend error details when pass creation fails', async () => {
    // Mock error response from backend
    const errorResponse = {
      response: {
        data: {
          error: "Cannot specify both 'date' and 'startDate'. Use 'date' for single-day passes or 'startDate'/'endDate' for range passes."
        }
      }
    };
    mockedAxios.post.mockRejectedValue(errorResponse);

    render(<PassesPage />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/Pass Type/i), { target: { value: 'weekly' } });
    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'Test Customer' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Create Pass/i }));
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Cannot specify both 'date' and 'startDate'/i)).toBeInTheDocument();
    });
  });

  test('displays generic error when backend error has no details', async () => {
    // Mock generic error
    const errorResponse = new Error('Network Error');
    mockedAxios.post.mockRejectedValue(errorResponse);

    render(<PassesPage />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/Pass Type/i), { target: { value: 'weekly' } });
    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'Test Customer' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Create Pass/i }));
    
    // Wait for generic error message
    await waitFor(() => {
      expect(screen.getByText(/Error creating pass/i)).toBeInTheDocument();
    });
  });
});