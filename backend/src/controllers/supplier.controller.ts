import { Request, Response } from 'express';
import Supplier from '../models/supplier.model';
import Purchase from '../models/purchase.model';
import Payment from '../models/payment.model';

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find({ businessId: req.user.businessId });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplierData = {
      ...req.body,
      businessId: req.user.businessId
    };

    const supplier = new Supplier(supplierData);
    await supplier.save();

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      req.body,
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSupplierTransactions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Get all purchases for the supplier
    const purchases = await Purchase.find({
      supplier: id,
      date: {
        $gte: startDate ? new Date(startDate as string) : new Date(0),
        $lte: endDate ? new Date(endDate as string) : new Date()
      }
    });
    
    // Get all payments for the supplier
    const payments = await Payment.find({
      supplier: id,
      date: {
        $gte: startDate ? new Date(startDate as string) : new Date(0),
        $lte: endDate ? new Date(endDate as string) : new Date()
      }
    });

    // Combine and sort transactions by date
    const transactions = [
      ...purchases.map(purchase => ({
        id: purchase._id,
        type: 'purchase',
        date: purchase.date,
        amount: purchase.total,
        description: `Purchase #${purchase.purchaseNumber}`,
        status: purchase.status
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

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching supplier transactions:', error);
    res.status(500).json({ message: 'Error fetching supplier transactions' });
  }
}; 