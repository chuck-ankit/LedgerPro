import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import User from '../models/user.model';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Authentication check:', {
      path: req.path,
      method: req.method,
      hasAuthHeader: !!req.headers.authorization
    });

    // 1) Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found in header');
      return next(new AppError('Not authorized to access this route', 401));
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted from header');

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    ) as JwtPayload;

    console.log('Token verified:', {
      userId: decoded.id
    });

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for token:', {
        userId: decoded.id
      });
      return next(new AppError('User no longer exists', 401));
    }

    console.log('User authenticated successfully:', {
      userId: user._id,
      email: user.email
    });

    // 4) Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(new AppError('Not authorized to access this route', 401));
  }
}; 