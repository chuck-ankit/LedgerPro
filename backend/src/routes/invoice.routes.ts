import express from 'express';
import { body } from 'express-validator';
import {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceStats,
} from '../controllers/invoice.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get invoice statistics
router.get('/stats', getInvoiceStats);

// Create invoice
router.post(
  '/',
  [
    body('customer').notEmpty().withMessage('Customer is required'),
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.description')
      .notEmpty()
      .withMessage('Item description is required'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('items.*.unitPrice')
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
    body('tax')
      .isFloat({ min: 0 })
      .withMessage('Tax must be a positive number'),
    body('dueDate').isISO8601().withMessage('Invalid due date'),
    body('notes').optional().trim(),
  ],
  validateRequest,
  createInvoice
);

// Get all invoices
router.get('/', getInvoices);

// Get single invoice
router.get('/:id', getInvoice);

// Update invoice
router.patch(
  '/:id',
  [
    body('items').optional().isArray(),
    body('items.*.description')
      .optional()
      .notEmpty()
      .withMessage('Item description is required'),
    body('items.*.quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('items.*.unitPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
    body('tax')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Tax must be a positive number'),
    body('status')
      .optional()
      .isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
      .withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
    body('notes').optional().trim(),
  ],
  validateRequest,
  updateInvoice
);

// Delete invoice
router.delete('/:id', deleteInvoice);

export default router; 