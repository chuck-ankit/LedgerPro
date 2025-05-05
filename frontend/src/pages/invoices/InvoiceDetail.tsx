import React from 'react';
import { useParams } from 'react-router-dom';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Invoice Details</h1>
      <p>Invoice ID: {id}</p>
    </div>
  );
};

export default InvoiceDetail; 