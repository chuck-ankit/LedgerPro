import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getBalance
} from '../controllers/cashbook.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all transactions
router.get('/', getAllTransactions);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Get current balance
router.get('/balance', getBalance);

// Create new transaction
router.post('/', createTransaction);

// Update transaction
router.put('/:id', updateTransaction);

// Delete transaction
router.delete('/:id', deleteTransaction);

export default router; 