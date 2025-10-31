import { Router } from 'express';
import { getTransactions, getTransaction } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getTransactions);
router.get('/:id', getTransaction);

export default router;
