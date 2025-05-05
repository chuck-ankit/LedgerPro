import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import Invoice from '../models/invoice.model';
import Customer from '../models/customer.model';

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if customer exists
    const customer = await Customer.findOne({
      _id: req.body.customer,
      createdBy: req.user._id,
    });

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    // Generate invoice number
    const lastInvoice = await Invoice.findOne({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('invoiceNumber');

    const invoiceNumber = lastInvoice
      ? `INV-${parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1}`
      : 'INV-1001';

    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber,
      createdBy: req.user._id,
    });

    // Update customer balance
    customer.balance += invoice.total;
    await customer.save();

    res.status(201).json({
      status: 'success',
      data: {
        invoice,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const query: any = { createdBy: req.user._id };
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
      ];
    }

    const invoices = await Invoice.find(query)
      .populate('customer', 'name email company')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Invoice.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate('customer', 'name email phone address company taxId');

    if (!invoice) {
      return next(new AppError('Invoice not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        invoice,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!invoice) {
      return next(new AppError('Invoice not found', 404));
    }

    // If status is being updated to paid
    if (req.body.status === 'paid' && invoice.status !== 'paid') {
      const customer = await Customer.findById(invoice.customer);
      if (customer) {
        customer.balance -= invoice.total;
        await customer.save();
      }
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('customer', 'name email phone address company taxId');

    res.status(200).json({
      status: 'success',
      data: {
        invoice: updatedInvoice,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!invoice) {
      return next(new AppError('Invoice not found', 404));
    }

    // Update customer balance if invoice was not paid
    if (invoice.status !== 'paid') {
      const customer = await Customer.findById(invoice.customer);
      if (customer) {
        customer.balance -= invoice.total;
        await customer.save();
      }
    }

    await invoice.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

interface InvoiceStats {
  total: number;
  paid: number;
  overdue: number;
  draft: number;
  sent: number;
}

interface AggregationResult {
  _id: keyof InvoiceStats;
  count: number;
  total: number;
}

export const getInvoiceStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await Invoice.aggregate<AggregationResult>([
      {
        $match: {
          createdBy: req.user._id,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
    ]);

    const totalStats: InvoiceStats = {
      total: 0,
      paid: 0,
      overdue: 0,
      draft: 0,
      sent: 0,
    };

    stats.forEach((stat) => {
      if (stat._id in totalStats) {
        totalStats[stat._id] = stat.total;
        totalStats.total += stat.total;
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats: totalStats,
      },
    });
  } catch (error) {
    next(error);
  }
}; 