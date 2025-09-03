import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register, updateProfile } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length is 6'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', auth, me);
router.patch(
  '/me',
  auth,
  [
    body('name').optional().isLength({ min: 1 }).withMessage('Name must not be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password min length is 6'),
  ],
  updateProfile
);

export default router;
