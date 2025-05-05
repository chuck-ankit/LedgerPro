declare module '../middleware/auth' {
  import { Request, Response, NextFunction } from 'express';
  export const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
}

declare module '../controllers/user.controller' {
  import { Request, Response } from 'express';
  export const getProfile: (req: Request, res: Response) => Promise<void>;
  export const updateProfile: (req: Request, res: Response) => Promise<void>;
  export const changePassword: (req: Request, res: Response) => Promise<void>;
  export const deleteAccount: (req: Request, res: Response) => Promise<void>;
}

declare module '../controllers/supplier.controller' {
  import { Request, Response } from 'express';
  export const getAllSuppliers: (req: Request, res: Response) => Promise<void>;
  export const getSupplierById: (req: Request, res: Response) => Promise<void>;
  export const createSupplier: (req: Request, res: Response) => Promise<void>;
  export const updateSupplier: (req: Request, res: Response) => Promise<void>;
  export const deleteSupplier: (req: Request, res: Response) => Promise<void>;
}

declare module '../controllers/cashbook.controller' {
  import { Request, Response } from 'express';
  export const getAllTransactions: (req: Request, res: Response) => Promise<void>;
  export const getTransactionById: (req: Request, res: Response) => Promise<void>;
  export const createTransaction: (req: Request, res: Response) => Promise<void>;
  export const updateTransaction: (req: Request, res: Response) => Promise<void>;
  export const deleteTransaction: (req: Request, res: Response) => Promise<void>;
  export const getBalance: (req: Request, res: Response) => Promise<void>;
}

declare module '../controllers/report.controller' {
  import { Request, Response } from 'express';
  export const getSalesReport: (req: Request, res: Response) => Promise<void>;
  export const getExpenseReport: (req: Request, res: Response) => Promise<void>;
  export const getProfitLossReport: (req: Request, res: Response) => Promise<void>;
  export const getBalanceSheet: (req: Request, res: Response) => Promise<void>;
  export const getCashFlowReport: (req: Request, res: Response) => Promise<void>;
} 