import api from '../utils/api';

export interface CustomerTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  reference: string;
}

export interface TransactionResponse {
  transactions: CustomerTransaction[];
}

export interface CreateCustomerData {
  name: string;
  address: string;
  phone: string;
}

export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: CreateCustomerData) => api.post('/customers', data),
  update: (id: string, data: Partial<CreateCustomerData>) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  getTransactions: (customerId: string, params?: { startDate?: string; endDate?: string }) => 
    api.get(`/customers/${customerId}/transactions`, { params }),
}; 