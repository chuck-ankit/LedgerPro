import React from 'react';
import { Card } from '../../components/ui/Card';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

const Reports = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="flex gap-4">
          <select className="px-4 py-2 border rounded-lg bg-white text-gray-700">
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold">$24,500</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth</p>
              <p className="text-2xl font-semibold">15.2%</p>
              <p className="text-sm text-green-600">+2.3% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-2xl font-semibold">$12,800</p>
              <p className="text-sm text-red-600">+5% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
          <p className="text-gray-500">Chart will be implemented here</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Product {item}</p>
                  <p className="text-sm text-gray-600">Category</p>
                </div>
                <p className="font-semibold">${(Math.random() * 1000).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sales by Region</h2>
          <div className="space-y-4">
            {['North', 'South', 'East', 'West'].map((region) => (
              <div key={region} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{region} Region</p>
                  <p className="text-sm text-gray-600">Sales Performance</p>
                </div>
                <p className="font-semibold">${(Math.random() * 10000).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;