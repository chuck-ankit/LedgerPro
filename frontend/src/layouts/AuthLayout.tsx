import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left section - Brand and info */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-700 flex-col justify-center items-center text-white p-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-10 w-10" />
            <h1 className="text-3xl font-bold">LedgerPro</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Simplify Your Business Finances</h2>
          <p className="text-primary-100 mb-8">
            LedgerPro helps small to medium businesses manage cashflow, track customers, and generate professional invoices all in one place.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary-600 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Easy Ledger Management</h3>
                <p className="text-primary-200 text-sm">Track receivables and payables with minimal effort</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-600 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Professional Invoicing</h3>
                <p className="text-primary-200 text-sm">Create and share invoices that reflect your brand</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-600 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Insightful Reports</h3>
                <p className="text-primary-200 text-sm">Get valuable business insights with detailed reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right section - Auth forms */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">LedgerPro</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;