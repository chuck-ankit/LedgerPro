import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Send,
  Edit,
  Plus,
  Download,
  Printer,
  Edit2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCustomerStore, type Invoice, type Transaction } from '../../stores/customerStore';
import { format } from 'date-fns';
import { customerAPI } from '../../utils/api';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCustomer, isLoading, error, getCustomer, updateCustomer } = useCustomerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    phone: '',
  });
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  useEffect(() => {
    if (id) {
      getCustomer(id);
    }
  }, [id, getCustomer]);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        name: selectedCustomer.name,
        place: selectedCustomer.address,
        phone: selectedCustomer.phone,
      });
    }
  }, [selectedCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateCustomer(id, {
        name: formData.name,
        address: formData.place,
        phone: formData.phone,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update customer:', err);
    }
  };

  const generateReport = async () => {
    try {
      const response = await customerAPI.getTransactions(id!, {
        startDate: reportDateRange.startDate.toISOString(),
        endDate: reportDateRange.endDate.toISOString()
      });
      const data = response.data;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      // Generate the report HTML
      const reportHtml = `
        <html>
          <head>
            <title>Customer Transaction Report - ${selectedCustomer?.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .date-range { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .total { font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Customer Transaction Report</h1>
              <h2>${selectedCustomer?.name}</h2>
            </div>
            <div class="date-range">
              <p>Period: ${format(reportDateRange.startDate, 'MMM d, yyyy')} - ${format(reportDateRange.endDate, 'MMM d, yyyy')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${data.map((transaction: any) => `
                  <tr>
                    <td>${format(new Date(transaction.date), 'MMM d, yyyy')}</td>
                    <td>${transaction.type}</td>
                    <td>${transaction.description}</td>
                    <td>${formatCurrency(transaction.amount)}</td>
                    <td>${transaction.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              <p>Total Transactions: ${data.length}</p>
              <p>Total Amount: ${formatCurrency(data.reduce((sum: number, t: any) => sum + t.amount, 0))}</p>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const exportReport = async () => {
    try {
      const response = await customerAPI.getTransactions(id!, {
        startDate: reportDateRange.startDate.toISOString(),
        endDate: reportDateRange.endDate.toISOString()
      });
      const data = response.data;
      
      // Convert data to CSV
      const headers = ['Date', 'Type', 'Description', 'Amount', 'Status'];
      const csvRows = [
        headers.join(','),
        ...data.map((transaction: any) => [
          format(new Date(transaction.date), 'yyyy-MM-dd'),
          transaction.type,
          `"${transaction.description}"`,
          transaction.amount,
          transaction.status
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `customer_transactions_${selectedCustomer?.name}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedCustomer) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error || 'Customer not found'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/customers')}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
          <p className="text-gray-600">View and manage customer information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Customer Profile</h2>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit2 className="h-4 w-4" />}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="place" className="block text-sm font-medium text-gray-700">
                    Place
                  </label>
                  <input
                    type="text"
                    name="place"
                    id="place"
                    required
                    value={formData.place}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Place</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Transaction History */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedCustomer.transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.type}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'paid' ? 'bg-success-100 text-success-800' :
                          transaction.status === 'unpaid' ? 'bg-error-100 text-error-800' :
                          'bg-warning-100 text-warning-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Account Balance */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Balance</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                <div className="mt-1 flex items-center">
                  {selectedCustomer.balance > 0 ? (
                    selectedCustomer.balanceType === 'receivable' ? (
                      <>
                        <ArrowUpRight className="h-5 w-5 text-success-500 mr-1" />
                        <span className="text-lg font-semibold text-success-700">
                          {formatCurrency(selectedCustomer.balance)}
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="h-5 w-5 text-error-500 mr-1" />
                        <span className="text-lg font-semibold text-error-700">
                          {formatCurrency(selectedCustomer.balance)}
                        </span>
                      </>
                    )
                  ) : (
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(0)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => {}}
                >
                  Add Transaction
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  leftIcon={<FileText className="h-4 w-4" />}
                  onClick={() => {}}
                >
                  Create Invoice
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  leftIcon={<Send className="h-4 w-4" />}
                  onClick={() => {}}
                >
                  Send Statement
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}