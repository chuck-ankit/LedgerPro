import React from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const CreateInvoice = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
      
      <Card className="max-w-3xl">
        <form className="space-y-6 p-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Customer Name"
                label="Customer Name"
              />
              <Input
                type="email"
                placeholder="Customer Email"
                label="Customer Email"
              />
              <Input
                type="text"
                placeholder="Billing Address"
                label="Billing Address"
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Invoice Number"
                label="Invoice Number"
              />
              <Input
                type="date"
                label="Invoice Date"
              />
              <Input
                type="date"
                label="Due Date"
              />
              <Input
                type="text"
                placeholder="Payment Terms"
                label="Payment Terms"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">
              Create Invoice
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateInvoice;