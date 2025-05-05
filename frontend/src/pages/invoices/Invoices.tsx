import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const Invoices = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <Link to="/invoices/create">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-6">
          <div className="text-center text-gray-500">
            No invoices found. Create your first invoice to get started.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Invoices;