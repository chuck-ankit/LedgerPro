import { Request, Response } from 'express';
import Invoice from '../models/invoice.model';
import Cashbook from '../models/cashbook.model';

export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { businessId: req.user.businessId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const invoices = await Invoice.find(query);
    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalPaid = invoices.reduce((sum, invoice) => sum + (invoice.status === 'paid' ? invoice.total : 0), 0);

    res.json({
      totalSales,
      totalPaid,
      totalOutstanding: totalSales - totalPaid,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getExpenseReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = {
      businessId: req.user.businessId,
      type: 'expense'
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const expenses = await Cashbook.find(query);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.json({
      totalExpenses,
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfitLossReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { businessId: req.user.businessId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const [invoices, expenses] = await Promise.all([
      Invoice.find(query),
      Cashbook.find({ ...query, type: 'expense' })
    ]);

    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = totalSales - totalExpenses;

    res.json({
      totalSales,
      totalExpenses,
      profit,
      profitMargin: (profit / totalSales) * 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBalanceSheet = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const query: any = { businessId: req.user.businessId };

    if (date) {
      query.date = { $lte: new Date(date as string) };
    }

    const [invoices, transactions] = await Promise.all([
      Invoice.find(query),
      Cashbook.find(query)
    ]);

    const accountsReceivable = invoices.reduce((sum, invoice) => 
      sum + (invoice.status === 'paid' ? 0 : invoice.total), 0);
    
    const cashBalance = transactions.reduce((sum, transaction) => 
      sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 0);

    res.json({
      assets: {
        cash: cashBalance,
        accountsReceivable
      },
      liabilities: {
        accountsPayable: 0 // To be implemented when supplier invoices are added
      },
      equity: cashBalance + accountsReceivable
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCashFlowReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const query: any = { businessId: req.user.businessId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const transactions = await Cashbook.find(query).sort({ date: 1 });
    const cashFlow = transactions.map(transaction => ({
      date: transaction.date,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description
    }));

    const openingBalance = 0; // To be calculated based on previous period
    const closingBalance = transactions.reduce((sum, transaction) => 
      sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 0);

    res.json({
      openingBalance,
      closingBalance,
      cashFlow
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 