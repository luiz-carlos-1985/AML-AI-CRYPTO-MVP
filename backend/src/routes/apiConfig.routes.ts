import { Router } from 'express';
import { getApiConfigurations, saveApiConfiguration, toggleApiConfiguration, deleteApiConfiguration } from '../controllers/apiConfig.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getApiConfigurations);
router.post('/', saveApiConfiguration);
router.patch('/:id/toggle', toggleApiConfiguration);
router.delete('/:id', deleteApiConfiguration);
router.get('/:id/test', async (req, res) => {
  res.json({ success: true, message: 'API key test endpoint' });
});

export default router;