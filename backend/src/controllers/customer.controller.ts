import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import Customer from '../models/customer.model';
import Invoice from '../models/invoice.model';
import Payment from '../models/payment.model';

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Creating customer:', {
      body: req.body,
      userId: req.user._id
    });

    const customer = await Customer.create({
      ...req.body,
      createdBy: req.user._id,
    });

    console.log('Customer created successfully:', {
      customerId: customer._id,
      name: customer.name
    });

    res.status(201).json({
      status: 'success',
      data: {
        customer,
      },
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    next(error);
  }
};

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Fetching customers:', {
      userId: req.user._id,
      query: req.query
    });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query: any = { createdBy: req.user._id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    console.log('Customer query:', query);

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Customer.countDocuments(query);

    console.log('Customers fetched successfully:', {
      count: customers.length,
      total,
      page,
      limit
    });

    res.status(200).json({
      status: 'success',
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    next(error);
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // If the ID is "new", return a 404 since this is a frontend route
    if (id === 'new') {
      return res.status(404).json({ message: 'Not found' });
    }

    const customer = await Customer.findById(id)
      .populate('transactions')
      .populate('invoices');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Updating customer:', {
      customerId: req.params.id,
      userId: req.user._id,
      updates: req.body
    });

    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      console.log('Customer not found for update:', {
        customerId: req.params.id,
        userId: req.user._id
      });
      return next(new AppError('Customer not found', 404));
    }

    console.log('Customer updated successfully:', {
      customerId: customer._id,
      name: customer.name
    });

    res.status(200).json({
      status: 'success',
      data: {
        customer,
      },
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    next(error);
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Deleting customer:', {
      customerId: req.params.id,
      userId: req.user._id
    });

    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!customer) {
      console.log('Customer not found for deletion:', {
        customerId: req.params.id,
        userId: req.user._id
      });
      return next(new AppError('Customer not found', 404));
    }

    console.log('Customer deleted successfully:', {
      customerId: customer._id,
      name: customer.name
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    next(error);
  }
};

export const getCustomerTransactions = async (req: Request, res: Response) => {
  try {
    console.log('Fetching customer transactions:', {
      customerId: req.params.id,
      userId: req.user._id
    });

    const { id } = req.params;
    const customer = await Customer.findById(id);
    
    if (!customer) {
      console.log('Customer not found for transactions:', {
        customerId: id
      });
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get all invoices for the customer
    const invoices = await Invoice.find({ customer: id });
    console.log('Found invoices:', { count: invoices.length });
    
    // Get all payments for the customer
    const payments = await Payment.find({ customer: id });
    console.log('Found payments:', { count: payments.length });

    // Combine and sort transactions by date
    const transactions = [
      ...invoices.map(invoice => ({
        id: invoice._id,
        type: 'invoice',
        date: invoice.date,
        amount: invoice.total,
        description: `Invoice #${invoice.invoiceNumber}`,
        status: invoice.status
      })),
      ...payments.map(payment => ({
        id: payment._id,
        type: 'payment',
        date: payment.date,
        amount: payment.amount,
        description: payment.description,
        status: 'paid'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log('Transactions fetched successfully:', {
      customerId: id,
      totalTransactions: transactions.length
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching customer transactions:', error);
    res.status(500).json({ message: 'Error fetching customer transactions' });
  }
}; 