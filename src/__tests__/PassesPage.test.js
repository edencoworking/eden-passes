import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PassesPage from '../pages/PassesPage';

// Mock the API functions
jest.mock('../api/mock', () => ({
  listPasses: jest.fn(),
  searchCustomers: jest.fn(),
  createPass: jest.fn()
}));

import { listPasses, searchCustomers, createPass } from '../api/mock';

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
    listPasses.mockReturnValue(mockPasses);
    searchCustomers.mockReturnValue(mockCustomers);
    createPass.mockReturnValue(mockPasses[0]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders pass creation form with customer field', async () => {
    render(<PassesPage />);
    
    expect(screen.getByLabelText(/Pass Type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Pass' })).toBeInTheDocument();
  });

  test('displays existing passes with customer names', async () => {
    render(<PassesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('weekly')).toBeInTheDocument();
    });
  });

  test('loads passes on mount', () => {
    render(<PassesPage />);
    
    expect(listPasses).toHaveBeenCalled();
  });
});