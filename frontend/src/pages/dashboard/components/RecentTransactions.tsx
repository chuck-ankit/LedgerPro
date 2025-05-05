import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatCurrency, formatDate } from '../../../utils/formatters';

// Mock data for recent transactions
const recentTransactions = [
  {
    id: 'txn-001',
    date: new Date('2023-06-25'),
    description: 'Payment received from Acme Corp',
    amount: 15000,
    type: 'credit',
    party: { id: 'cust-001', name: 'Acme Corp', type: 'customer' },
  },
  {
    id: 'txn-002',
    date: new Date('2023-06-24'),
    description: 'Purchase from Global Suppliers Ltd',
    amount: 8500,
    type: 'debit',
    party: { id: 'sup-001', name: 'Global Suppliers Ltd', type: 'supplier' },
  },
  {
    id: 'txn-003',
    date: new Date('2023-06-23'),
    description: 'Payment received from TechSolutions Inc',
    amount: 22000,
    type: 'credit',
    party: { id: 'cust-002', name: 'TechSolutions Inc', type: 'customer' },
  },
  {
    id: 'txn-004',
    date: new Date('2023-06-22'),
    description: 'Office rent payment',
    amount: 12000,
    type: 'debit',
    party: null,
  },
  {
    id: 'txn-005',
    date: new Date('2023-06-20'),
    description: 'Payment received from Metro Retail',
    amount: 18500,
    type: 'credit',
    party: { id: 'cust-003', name: 'Metro Retail', type: 'customer' },
  },
];

const RecentTransactions: React.FC = () => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <Link to="/cashbook" className="text-sm text-primary-600 hover:text-primary-700">
          View All
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  {transaction.party ? (
                    <Link 
                      to={`/${transaction.party.type}s/${transaction.party.id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {transaction.party.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-right">
                  <div className="flex items-center justify-end">
                    {transaction.type === 'credit' ? (
                      <ArrowUpRight className="h-4 w-4 text-success-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-error-500 mr-1" />
                    )}
                    <span
                      className={
                        transaction.type === 'credit'
                          ? 'text-success-700'
                          : 'text-error-700'
                      }
                    >
                      {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>Showing last 5 transactions</span>
        </div>
      </div>
    </Card>
  );
};

export default RecentTransactions;