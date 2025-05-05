import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical,
  FileText,
  Send,
  Trash2,
  Package,
  Truck,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { format } from 'date-fns';
import { supplierAPI } from '../../utils/api';

// Mock supplier data
const suppliers = [
  {
    id: '1',
    name: 'Global Suppliers Ltd',
    contact: 'Michael Brown',
    phone: '+91 98765 43210',
    email: 'michael@globalsuppliers.com',
    balance: 15000,
    balanceType: 'payable',
    gstin: '27AADCB2230M1Z3',
  },
  {
    id: '2',
    name: 'Tech Components Inc',
    contact: 'Sarah Wilson',
    phone: '+91 87654 32109',
    email: 'sarah@techcomponents.com',
    balance: 25000,
    balanceType: 'payable',
    gstin: '27AADCB2230M1Z4',
  },
  {
    id: '3',
    name: 'Raw Materials Co',
    contact: 'Rajesh Patel',
    phone: '+91 76543 21098',
    email: 'rajesh@rawmaterials.com',
    balance: 0,
    balanceType: 'none',
    gstin: '27AADCB2230M1Z5',
  },
  {
    id: '4',
    name: 'Logistics Solutions',
    contact: 'Priya Sharma',
    phone: '+91 65432 10987',
    email: 'priya@logistics.com',
    balance: 12000,
    balanceType: 'payable',
    gstin: '27AADCB2230M1Z6',
  },
  {
    id: '5',
    name: 'Packaging World',
    contact: 'David Lee',
    phone: '+91 54321 09876',
    email: 'david@packaging.com',
    balance: 8000,
    balanceType: 'payable',
    gstin: '27AADCB2230M1Z7',
  },
];

const Suppliers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  
  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleDropdown = (supplierId: string) => {
    setActiveDropdown(activeDropdown === supplierId ? null : supplierId);
  };
  
  const generateReport = async () => {
    try {
      const response = await supplierAPI.getTransactions('all', {
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
            <title>Supplier Transaction Report</title>
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
              <h1>Supplier Transaction Report</h1>
            </div>
            <div class="date-range">
              <p>Period: ${format(reportDateRange.startDate, 'MMM d, yyyy')} - ${format(reportDateRange.endDate, 'MMM d, yyyy')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Supplier</th>
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
                    <td>${transaction.supplier.name}</td>
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
      const response = await supplierAPI.getTransactions('all', {
        startDate: reportDateRange.startDate.toISOString(),
        endDate: reportDateRange.endDate.toISOString()
      });
      const data = response.data;
      
      // Convert data to CSV
      const headers = ['Supplier', 'Date', 'Type', 'Description', 'Amount', 'Status'];
      const csvRows = [
        headers.join(','),
        ...data.map((transaction: any) => [
          `"${transaction.supplier.name}"`,
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
      link.setAttribute('download', `supplier_transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier accounts and balances</p>
        </div>
        
        <Button 
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {}}
        >
          Add Supplier
        </Button>
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
              placeholder="Search suppliers..."
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
                  Supplier
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
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Link to={`/suppliers/${supplier.id}`} className="block">
                        <p className="font-medium text-gray-900">{supplier.name}</p>
                        <p className="text-sm text-gray-500">{supplier.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{supplier.contact}</p>
                      <p className="text-sm text-gray-500">{supplier.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{supplier.gstin}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                      {supplier.balance > 0 ? (
                        <div className="flex items-center justify-end">
                          {supplier.balanceType === 'payable' ? (
                            <>
                              <ArrowDownRight className="h-4 w-4 text-error-500 mr-1" />
                              <span className="text-error-700">
                                {formatCurrency(supplier.balance)}
                              </span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="h-4 w-4 text-success-500 mr-1" />
                              <span className="text-success-700">
                                {formatCurrency(supplier.balance)}
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
                          leftIcon={<Package className="h-4 w-4" />}
                          onClick={() => {}}
                        >
                          Purchase
                        </Button>
                        
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDropdown(supplier.id)}
                            aria-label="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          
                          {activeDropdown === supplier.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 ring-1 ring-black ring-opacity-5">
                              <button
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {}}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Track Orders
                              </button>
                              <button
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {}}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Statement
                              </button>
                              <button
                                className="flex w-full items-center px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                                onClick={() => {}}
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
                    No suppliers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
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
    </div>
  );
};

export default Suppliers;