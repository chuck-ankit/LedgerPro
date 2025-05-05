import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Users, 
  TruckIcon, 
  FileText, 
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import DashboardStats from './components/DashboardStats';
import RecentTransactions from './components/RecentTransactions';
import DoughnutChart from './components/DoughnutChart';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back to your business overview</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {}}
          >
            Add Customer
          </Button>
          <Button 
            leftIcon={<FileText className="h-4 w-4" />}
            size="sm"
            onClick={() => {}}
          >
            New Invoice
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStats 
          title="Total Receivables" 
          value={formatCurrency(128500)}
          trend={+12.5}
          trendDirection="up"
          icon={<ArrowUpRight className="h-5 w-5" />}
          iconBg="bg-primary-100"
          iconColor="text-primary-700"
        />
        <DashboardStats 
          title="Total Payables" 
          value={formatCurrency(76000)}
          trend={-4.2}
          trendDirection="down"
          icon={<ArrowDownRight className="h-5 w-5" />}
          iconBg="bg-error-100"
          iconColor="text-error-700"
        />
        <DashboardStats 
          title="Customers" 
          value="48"
          trend={+3}
          trendDirection="up"
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-secondary-100"
          iconColor="text-secondary-700"
        />
        <DashboardStats 
          title="Suppliers" 
          value="16"
          trend={+1}
          trendDirection="up"
          icon={<TruckIcon className="h-5 w-5" />}
          iconBg="bg-warning-100"
          iconColor="text-warning-700"
        />
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link to="/customers" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-900">Customers</span>
              </Link>
              <Link to="/suppliers" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 rounded-full bg-warning-100 text-warning-700 flex items-center justify-center mb-2">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-900">Suppliers</span>
              </Link>
              <Link to="/invoices/create" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-900">New Invoice</span>
              </Link>
              <Link to="/cashbook" className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="h-10 w-10 rounded-full bg-success-100 text-success-700 flex items-center justify-center mb-2">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-900">Cashbook</span>
              </Link>
            </div>
          </Card>
          
          {/* Recent Transactions */}
          <RecentTransactions />
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Receivables by Category */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Receivables</h2>
              <Link to="/reports" className="text-sm text-primary-600 hover:text-primary-700">
                View Report
              </Link>
            </div>
            <div className="h-60">
              <DoughnutChart 
                data={[65000, 45000, 18500]}
                labels={['Retail', 'Wholesale', 'Online']}
                colors={['#3B82F6', '#0D9488', '#F59E0B']}
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-primary-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Retail</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{formatCurrency(65000)}</span>
                  <TrendingUp className="h-4 w-4 text-success-500 ml-1" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-secondary-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Wholesale</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{formatCurrency(45000)}</span>
                  <TrendingDown className="h-4 w-4 text-error-500 ml-1" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-warning-500 mr-2"></span>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{formatCurrency(18500)}</span>
                  <TrendingUp className="h-4 w-4 text-success-500 ml-1" />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Pending Invoices */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Invoices</h2>
              <Link to="/invoices" className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { id: 'INV-2023-001', customer: 'Acme Corp', amount: 12500, dueDate: '2023-06-30' },
                { id: 'INV-2023-002', customer: 'Tech Solutions', amount: 8750, dueDate: '2023-07-05' },
                { id: 'INV-2023-003', customer: 'Global Traders', amount: 15000, dueDate: '2023-07-10' },
              ].map((invoice) => (
                <div key={invoice.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                    <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                leftIcon={<FileText className="h-4 w-4" />}
                onClick={() => {}}
              >
                Create New Invoice
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;