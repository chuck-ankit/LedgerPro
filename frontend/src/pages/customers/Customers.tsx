import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerStore } from '../../stores/customerStore';
import { format } from 'date-fns';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical,
  FileText,
  Send,
  Trash2,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { customerAPI } from '../../services/customerAPI';

export default function Customers() {
  const { customers, isLoading, error, fetchCustomers, deleteCustomer } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = (customerId: string) => {
    setActiveDropdown(activeDropdown === customerId ? null : customerId);
  };

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete) {
      await deleteCustomer(customerToDelete);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const generateReport = async () => {
    try {
      const response = await customerAPI.getTransactions('all', {
        startDate: reportDateRange.startDate.toISOString(),
        endDate: reportDateRange.endDate.toISOString()
      });
      const data = response.data.data.transactions;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      // Generate the report HTML
      const reportHtml = `
        <html>
          <head>
            <title>Customer Transaction Report</title>
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
            </div>
            <div class="date-range">
              <p>Period: ${format(reportDateRange.startDate, 'MMM d, yyyy')} - ${format(reportDateRange.endDate, 'MMM d, yyyy')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
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
                    <td>${transaction.customer.name}</td>
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
      const response = await customerAPI.getTransactions('all', {
        startDate: reportDateRange.startDate.toISOString(),
        endDate: reportDateRange.endDate.toISOString()
      });
      const data = response.data.data.transactions;
      
      // Convert data to CSV
      const headers = ['Customer', 'Date', 'Type', 'Description', 'Amount', 'Status'];
      const csvRows = [
        headers.join(','),
        ...data.map((transaction: any) => [
          `"${transaction.customer.name}"`,
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
      link.setAttribute('download', `customer_transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
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
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer accounts and balances</p>
        </div>
        
        <Link to="/customers/new">
          <Button 
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Customer
          </Button>
        </Link>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={format(reportDateRange.startDate, 'yyyy-MM-dd')}
                onChange={(e) => setReportDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <span>to</span>
              <input
                type="date"
                value={format(reportDateRange.endDate, 'yyyy-MM-dd')}
                onChange={(e) => setReportDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <Button 
              variant="outline"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={generateReport}
            >
              Print Report
            </Button>
            <Button 
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={exportReport}
            >
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GSTIN
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Link to={`/customers/${customer.id}`} className="block">
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{customer.contact}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{customer.gstin}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                      {customer.balance > 0 ? (
                        <div className="flex items-center justify-end">
                          {customer.balanceType === 'receivable' ? (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-success-500 mr-1" />
                              <span className="text-success-700">
                                {formatCurrency(customer.balance)}
                              </span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="h-4 w-4 text-error-500 mr-1" />
                              <span className="text-error-700">
                                {formatCurrency(customer.balance)}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No Balance</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<FileText className="h-4 w-4" />}
                          onClick={() => {}}
                        >
                          Invoice
                        </Button>
                        
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDropdown(customer.id)}
                            aria-label="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          
                          {activeDropdown === customer.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 ring-1 ring-black ring-opacity-5">
                              <button
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {}}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Statement
                              </button>
                              <button
                                className="flex w-full items-center px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                                onClick={() => handleDeleteClick(customer.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Customer</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this customer? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}