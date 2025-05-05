import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSalesReport,
  getExpenseReport,
  getProfitLossReport,
  getBalanceSheet,
  getCashFlowReport
} from '../controllers/report.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Report routes
router.get('/sales', getSalesReport);
router.get('/expenses', getExpenseReport);
router.get('/profit-loss', getProfitLossReport);
router.get('/balance-sheet', getBalanceSheet);
router.get('/cash-flow', getCashFlowReport);

export default router; 