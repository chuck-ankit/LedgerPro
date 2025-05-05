import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Dashboard pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Customers = lazy(() => import('./pages/customers/Customers'));
const CustomerDetail = lazy(() => import('./pages/customers/CustomerDetail'));
const NewCustomer = lazy(() => import('./pages/customers/NewCustomer'));
const Suppliers = lazy(() => import('./pages/suppliers/Suppliers'));
const SupplierDetail = lazy(() => import('./pages/suppliers/SupplierDetail'));
const NewSupplier = lazy(() => import('./pages/suppliers/NewSupplier'));
const Products = lazy(() => import('./pages/products/Products'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const NewProduct = lazy(() => import('./pages/products/NewProduct.tsx'));
const Cashbook = lazy(() => import('./pages/cashbook/Cashbook'));
const Reports = lazy(() => import('./pages/reports/Reports'));
const Invoices = lazy(() => import('./pages/invoices/Invoices'));
const InvoiceDetail = lazy(() => import('./pages/invoices/InvoiceDetail').then(module => ({ default: module.InvoiceDetail })));
const NewInvoice = lazy(() => import('./pages/invoices/NewInvoice').then(module => ({ default: module.default })));
const Settings = lazy(() => import('./pages/settings/Settings'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        
        {/* Dashboard routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/new" element={<NewCustomer />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/new" element={<NewSupplier />} />
          <Route path="/suppliers/:id" element={<SupplierDetail />} />
          <Route path="/cashbook" element={<Cashbook />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/new" element={<NewInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<NewProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;