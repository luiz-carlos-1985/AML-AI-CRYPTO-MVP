import { Router } from 'express';
import { getApiConfigurations, saveApiConfiguration, toggleApiConfiguration, deleteApiConfiguration } from '../controllers/apiConfig.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getApiConfigurations);
router.post('/', saveApiConfiguration);
router.patch('/:id/toggle', toggleApiConfiguration);
router.delete('/:id', deleteApiConfiguration);

export default router;