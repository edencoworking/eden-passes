import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import PassesPage from '../pages/PassesPage';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock data
const mockCustomers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' }
];

const mockPasses = [
  { 
    id: '1', 
    type: 'weekly', 
    date: '2024-01-15', 
    customerId: '1',
    customer: { id: '1', name: 'John Doe' },
    createdAt: new Date().toISOString()
  }
];

describe('PassesPage', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockPasses });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders pass creation form with customer field', async () => {
    render(<PassesPage />);
    
    expect(screen.getByPlaceholderText('Pass Type')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Customer Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Pass' })).toBeInTheDocument();
  });

  test('displays existing passes with customer names', async () => {
    render(<PassesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('weekly')).toBeInTheDocument();
    });
  });

  test('shows customer suggestions when typing', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockPasses })
                   .mockResolvedValueOnce({ data: mockCustomers });

    render(<PassesPage />);
    
    const customerInput = screen.getByPlaceholderText('Customer Name');
    fireEvent.change(customerInput, { target: { value: 'Jo' } });
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/customers?name_like=Jo');
    });
  });

  test('creates pass with new customer', async () => {
    const newCustomer = { id: '3', name: 'New Customer' };
    const newPass = { 
      id: '2', 
      type: 'daily', 
      date: '2024-12-09', 
      customerId: '3',
      customer: newCustomer,
      createdAt: new Date().toISOString()
    };

    mockedAxios.get.mockResolvedValue({ data: mockPasses });
    mockedAxios.post.mockResolvedValueOnce({ data: newCustomer })
                    .mockResolvedValueOnce({ data: newPass });

    render(<PassesPage />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Pass Type'), { target: { value: 'daily' } });
    fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2024-12-09' } });
    fireEvent.change(screen.getByPlaceholderText('Customer Name'), { target: { value: 'New Customer' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Create Pass' }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/customers', {
        name: 'New Customer',
        createdAt: expect.any(String)
      });
      expect(mockedAxios.post).toHaveBeenCalledWith('/passes', {
        type: 'daily',
        date: '2024-12-09',
        customerId: '3',
        createdAt: expect.any(String),
        customer: { id: '3', name: 'New Customer' }
      });
    });
  });
});