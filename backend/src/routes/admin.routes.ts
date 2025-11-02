import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

// Get payment settings
router.get('/payment-settings', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const defaultSettings = {
      pix: { enabled: true, key: '', name: '', bank: '' },
      bitcoin: { enabled: true, address: '', network: 'BTC' },
      ethereum: { enabled: true, address: '', network: 'ERC20' },
      usdt: { enabled: true, address: '', network: 'ERC20' },
      stripe: { enabled: false, publicKey: '', secretKey: '' },
      paypal: { enabled: false, clientId: '', clientSecret: '' }
    };

    try {
      const settings = await prisma.paymentSettings.findUnique({
        where: { userId }
      });

      if (!settings) {
        return res.json(defaultSettings);
      }

      res.json(JSON.parse(settings.config));
    } catch (dbError) {
      res.json(defaultSettings);
    }
  } catch (error) {
    console.error('Failed to get payment settings:', error);
    res.status(500).json({ error: 'Failed to get payment settings' });
  }
});

// Update payment settings
router.put('/payment-settings', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const config = req.body;

    await prisma.paymentSettings.upsert({
      where: { userId },
      update: { config: JSON.stringify(config) },
      create: {
        userId,
        config: JSON.stringify(config)
      }
    });

    res.json({ success: true, message: 'Payment settings updated' });
  } catch (error) {
    console.error('Failed to update payment settings:', error);
    res.status(500).json({ error: 'Failed to update payment settings' });
  }
});

// Get payment settings for checkout
router.get('/payment-config/:method', async (req, res) => {
  try {
    const { method } = req.params;
    
    const settings = await prisma.paymentSettings.findFirst();
    
    if (!settings) {
      return res.status(404).json({ error: 'Payment settings not configured' });
    }

    const config = JSON.parse(settings.config);
    const methodConfig = config[method];
    
    if (!methodConfig || !methodConfig.enabled) {
      return res.status(404).json({ error: 'Payment method not available' });
    }

    if (method === 'stripe' || method === 'paypal') {
      delete methodConfig.secretKey;
      delete methodConfig.clientSecret;
    }

    res.json(methodConfig);
  } catch (error) {
    console.error('Failed to get payment config:', error);
    res.status(500).json({ error: 'Failed to get payment config' });
  }
});

export default router;
