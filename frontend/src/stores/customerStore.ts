import { create } from 'zustand';
import { customerAPI } from '../services/customerAPI';

export interface Customer {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  gstin?: string;
  balance: number;
  balanceType: 'receivable' | 'payable';
  transactions?: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
    reference: string;
  }>;
  invoices?: Array<{
    id: string;
    date: string;
    dueDate: string;
    amount: number;
    status: string;
    balance: number;
  }>;
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  getCustomer: (id: string) => Promise<void>;
  createCustomer: (data: { name: string; address: string; phone: string }) => Promise<Customer>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerAPI.getAll();
      let customersData: Customer[] = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          customersData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          customersData = response.data.data;
        } else if (response.data.customers && Array.isArray(response.data.customers)) {
          customersData = response.data.customers;
        }
      }
      set({ customers: customersData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch customers', isLoading: false });
    }
  },

  getCustomer: async (id: string) => {
    if (id === 'new') {
      set({ selectedCustomer: null, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await customerAPI.getById(id);
      set({ selectedCustomer: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch customer', isLoading: false });
    }
  },

  createCustomer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerAPI.create(data);
      const newCustomer = response.data;
      set(state => ({
        customers: [...state.customers, newCustomer],
        isLoading: false
      }));
      return newCustomer;
    } catch (error) {
      set({ error: 'Failed to create customer', isLoading: false });
      throw error;
    }
  },

  updateCustomer: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await customerAPI.update(id, data);
      set(state => ({
        customers: state.customers.map(customer =>
          customer._id === id ? { ...customer, ...data } : customer
        ),
        selectedCustomer: state.selectedCustomer?._id === id
          ? { ...state.selectedCustomer, ...data }
          : state.selectedCustomer,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update customer', isLoading: false });
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await customerAPI.delete(id);
      set(state => ({
        customers: state.customers.filter(customer => customer._id !== id),
        selectedCustomer: state.selectedCustomer?._id === id ? null : state.selectedCustomer,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete customer', isLoading: false });
      throw error;
    }
  },
})); 