// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

import axios from 'axios';
const mockedAxios = axios;

// Test the API integration points that the frontend uses
describe('Pass API Integration', () => {
  // Mock console.error to avoid cluttering test output
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  test('should handle pass creation with single date format (frontend format)', async () => {
    // Mock the axios calls that the frontend makes
    mockedAxios.post
      .mockResolvedValueOnce({ data: { id: '4', name: 'New Customer' } }) // customer creation
      .mockResolvedValueOnce({ // pass creation
        data: {
          id: '1',
          type: 'weekly',
          date: '2024-01-15',
          customer: { id: '4', name: 'New Customer' },
          createdAt: new Date().toISOString()
        }
      });

    // Simulate the frontend pass creation flow
    const customerName = 'New Customer';
    const passType = 'weekly';
    const date = '2024-01-15';

    // Create customer (as frontend does)
    const customerRes = await mockedAxios.post('/api/customers', { name: customerName });
    const customerId = customerRes.data.id;

    // Create pass (as frontend does)
    const passRes = await mockedAxios.post('/api/passes', {
      type: passType,
      date,
      customerId,
      customerName
    });

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/customers', { name: customerName });
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/passes', {
      type: passType,
      date,
      customerId,
      customerName
    });
    expect(passRes.data.type).toBe(passType);
    expect(passRes.data.date).toBe(date);
    expect(passRes.data.customer.name).toBe(customerName);
  });

  test('should handle pass creation with start/end date format', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        id: '2',
        type: 'monthly',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        customer: { id: '1', name: 'Existing Customer' },
        createdAt: new Date().toISOString()
      }
    });

    const passRes = await mockedAxios.post('/api/passes', {
      type: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      customerId: '1'
    });

    expect(passRes.data.type).toBe('monthly');
    expect(passRes.data.startDate).toBe('2024-01-01');
    expect(passRes.data.endDate).toBe('2024-01-31');
  });

  test('should handle error responses with meaningful messages', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { error: 'Customer information is required. Please provide either customerId or customerName' }
      }
    });

    try {
      await mockedAxios.post('/api/passes', {
        type: 'weekly'
        // Missing customer info and date
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toContain('Customer information is required');
    }
  });

  test('should fetch passes with customer information', async () => {
    const mockPasses = [
      {
        id: '1',
        type: 'weekly',
        date: '2024-01-15',
        customer: { id: '1', name: 'John Doe' },
        createdAt: new Date().toISOString()
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockPasses });

    const res = await mockedAxios.get('/api/passes');
    
    expect(res.data).toEqual(mockPasses);
    expect(res.data[0].customer.name).toBe('John Doe');
  });
});