import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxNumber: string;
  pan: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  taxNumber?: string;
  pan?: string;
  notes?: string;
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      headers: config.headers
    });
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 401) {
      console.log('Authentication failed, logging out user');
      // Get the auth store and call logout
      const authStore = useAuthStore.getState();
      authStore.logout();
      // Use window.location.href for a full page reload
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  getTransactions: (id: string, params?: { startDate?: string; endDate?: string }) => 
    api.get(`/customers/${id}/transactions`, { params }),
};

export const supplierAPI = {
  getAll: () => api.get<Supplier[]>('/suppliers'),
  getById: (id: string) => api.get<Supplier>(`/suppliers/${id}`),
  create: (data: CreateSupplierData) => api.post<Supplier>('/suppliers', data),
  update: (id: string, data: UpdateSupplierData) => api.put<Supplier>(`/suppliers/${id}`, data),
  delete: (id: string) => api.delete(`/suppliers/${id}`),
  getTransactions: (id: string, params?: { startDate?: string; endDate?: string }) => 
    api.get(`/suppliers/${id}/transactions`, { params }),
};

export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  getById: (id: string) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices', data),
  update: (id: string, data: any) => api.put(`/invoices/${id}`, data),
  delete: (id: string) => api.delete(`/invoices/${id}`),
  getByCustomer: (customerId: string) => api.get(`/invoices/customer/${customerId}`),
};

export const cashbookAPI = {
  getAll: () => api.get('/cashbook'),
  getById: (id: string) => api.get(`/cashbook/${id}`),
  create: (data: any) => api.post('/cashbook', data),
  update: (id: string, data: any) => api.put(`/cashbook/${id}`, data),
  delete: (id: string) => api.delete(`/cashbook/${id}`),
};

export const reportAPI = {
  getSalesReport: (params: any) => api.get('/reports/sales', { params }),
  getExpenseReport: (params: any) => api.get('/reports/expenses', { params }),
  getProfitLossReport: (params: any) => api.get('/reports/profit-loss', { params }),
};

export default api; 