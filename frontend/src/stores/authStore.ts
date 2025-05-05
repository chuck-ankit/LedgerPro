import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authAPI } from '../utils/api';

export type UserRole = 'admin' | 'staff';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Mock user data for demo purposes
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  businessId: 'business-1',
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: !!localStorage.getItem('token'),
        isLoading: false,
        error: null,
        
        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to login',
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null
            });
            localStorage.removeItem('token');
          }
        },
        
        register: async (userData) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authAPI.register(userData);
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to register',
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null
            });
            localStorage.removeItem('token');
          }
        },
        
        logout: () => {
          localStorage.removeItem('token');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        },
        
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);