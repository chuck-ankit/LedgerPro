import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierTransactions
} from '../controllers/supplier.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Supplier routes
router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

// Get supplier transactions
router.get('/:id/transactions', getSupplierTransactions);

export default router; 