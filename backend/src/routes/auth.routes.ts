import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

console.log('Setting up auth routes...');
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
