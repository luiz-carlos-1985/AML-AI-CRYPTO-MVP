import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAlerts,
  getAlert,
  createAlert,
  markAsRead,
  markAsResolved,
  markAllAsRead,
  deleteAlert,
  getAlertStats,
  bulkUpdateAlerts
} from '../controllers/alert.controller';

const router = Router();

router.use(authenticate);

// Get alert statistics
router.get('/stats', getAlertStats);

// Get all alerts with filters and pagination
router.get('/', getAlerts);

// Create new alert
router.post('/', createAlert);

// Mark all alerts as read
router.patch('/read-all', markAllAsRead);

// Bulk update alerts
router.patch('/bulk', bulkUpdateAlerts);

// Get specific alert
router.get('/:id', getAlert);

// Mark alert as read
router.patch('/:id/read', markAsRead);

// Mark alert as resolved
router.patch('/:id/resolve', markAsResolved);

// Delete alert
router.delete('/:id', deleteAlert);

export default router;