import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function Products() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button onClick={() => navigate('/products/new')} leftIcon={<Plus className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>

      <Card>
        <p>Product list will be displayed here</p>
      </Card>
    </div>
  );
} 