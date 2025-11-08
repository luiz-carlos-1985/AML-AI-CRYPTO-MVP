import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

const router = Router();

router.post('/:type', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type } = req.params;
    const { format = 'json', startDate, endDate } = req.body;

    let data: any[] = [];
    let filename = '';

    // Fetch data based on type
    switch (type) {
      case 'transactions':
        data = await prisma.transaction.findMany({
          where: {
            wallet: { userId: req.userId },
            ...(startDate && endDate ? {
              timestamp: { gte: new Date(startDate), lte: new Date(endDate) }
            } : {})
          },
          include: { wallet: { select: { address: true, blockchain: true } } }
        });
        filename = `transactions-${Date.now()}`;
        break;

      case 'wallets':
        data = await prisma.wallet.findMany({
          where: { userId: req.userId },
          include: { _count: { select: { transactions: true, alerts: true } } }
        });
        filename = `wallets-${Date.now()}`;
        break;

      case 'alerts':
        data = await prisma.alert.findMany({
          where: {
            userId: req.userId,
            ...(startDate && endDate ? {
              createdAt: { gte: new Date(startDate), lte: new Date(endDate) }
            } : {})
          },
          include: { wallet: { select: { address: true } } }
        });
        filename = `alerts-${Date.now()}`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      return res.json(data);
    }

    if (format === 'csv') {
      const csvPath = path.join(__dirname, '../../reports', `${filename}.csv`);
      
      if (!fs.existsSync(path.dirname(csvPath))) {
        fs.mkdirSync(path.dirname(csvPath), { recursive: true });
      }

      // Flatten data for CSV
      const flatData = data.map(item => {
        const flat: any = {};
        Object.keys(item).forEach(key => {
          if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
            Object.keys(item[key]).forEach(subKey => {
              flat[`${key}_${subKey}`] = item[key][subKey];
            });
          } else if (Array.isArray(item[key])) {
            flat[key] = item[key].join(', ');
          } else {
            flat[key] = item[key];
          }
        });
        return flat;
      });

      if (flatData.length === 0) {
        return res.status(404).json({ error: 'No data to export' });
      }

      const headers = Object.keys(flatData[0]).map(key => ({ id: key, title: key }));
      const csvWriter = createObjectCsvWriter({ path: csvPath, header: headers });
      await csvWriter.writeRecords(flatData);

      res.download(csvPath, `${filename}.csv`, (err) => {
        if (!err) fs.unlinkSync(csvPath);
      });
    } else {
      res.status(400).json({ error: 'Invalid format. Use json or csv' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

export default router;
