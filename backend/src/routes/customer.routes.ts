import express from 'express';
import { body } from 'express-validator';
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerTransactions,
} from '../controllers/customer.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Protect all routes
router.use(protect);

// Create customer
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('company').optional().trim(),
    body('taxId').optional().trim(),
    body('notes').optional().trim(),
  ],
  validateRequest,
  createCustomer
);

// Get all customers
router.get('/', getCustomers);

// Get single customer
router.get('/:id', getCustomer);

// Update customer
router.patch(
  '/:id',
  [
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('company').optional().trim(),
    body('taxId').optional().trim(),
    body('notes').optional().trim(),
  ],
  validateRequest,
  updateCustomer
);

// Delete customer
router.delete('/:id', deleteCustomer);

// Get customer transactions
router.get('/:id/transactions', getCustomerTransactions);

export default router; 