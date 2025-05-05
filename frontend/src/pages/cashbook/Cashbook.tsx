import React from 'react';
import { Card } from '../../components/ui/Card';

export default function Cashbook() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cashbook</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Cash Transactions</h2>
          <p className="text-gray-600">Your cash transactions will appear here.</p>
        </div>
      </Card>
    </div>
  );
}