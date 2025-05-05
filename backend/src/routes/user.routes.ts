import express from 'express';
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/user.controller';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/users - Get all users
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

// Change password
router.put('/change-password', changePassword);

// Delete account
router.delete('/account', deleteAccount);

export default router; 