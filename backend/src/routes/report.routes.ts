import { Router } from 'express';
import { generateReport, getReports } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/generate', generateReport);
router.get('/', getReports);
router.get('/download/:filename', (req, res) => {
  const path = require('path');
  const filePath = path.join(__dirname, '../../reports', req.params.filename);
  res.download(filePath);
});

export default router;
