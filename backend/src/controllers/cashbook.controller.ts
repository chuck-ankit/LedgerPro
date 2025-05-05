import { Request, Response } from 'express';
import Cashbook from '../models/cashbook.model';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Cashbook.find({ businessId: req.user.businessId })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await Cashbook.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transactionData = {
      ...req.body,
      businessId: req.user.businessId
    };

    const transaction = new Cashbook(transactionData);
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Cashbook.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Cashbook.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBalance = async (req: Request, res: Response) => {
  try {
    const transactions = await Cashbook.find({ businessId: req.user.businessId });
    const balance = transactions.reduce((acc, curr) => {
      return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
    }, 0);

    res.json({ balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 