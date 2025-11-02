import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/upgrade', authenticate, async (req, res) => {
  try {
    const { plan, paymentMethod, amount } = req.body;
    const userId = req.user!.id;

    // Validate plan
    if (!['STARTER', 'GROWTH', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Simulate payment processing
    // In production, integrate with real payment gateways:
    // - PIX: Mercado Pago, PagSeguro, Stripe
    // - Bitcoin: BTCPay Server, Coinbase Commerce
    // - Ethereum: Web3 payment gateway
    // - Credit Card: Stripe, PayPal

    // Update user plan
    const user = await prisma.user.update({
      where: { id: userId },
      data: { plan }
    });

    // Log payment (in production, store in payments table)
    console.log(`Payment processed: User ${userId}, Plan ${plan}, Method ${paymentMethod}, Amount ${amount}`);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

router.get('/methods', authenticate, async (req, res) => {
  res.json({
    methods: [
      { id: 'pix', name: 'PIX', enabled: true, fee: 0 },
      { id: 'bitcoin', name: 'Bitcoin', enabled: true, fee: 0 },
      { id: 'ethereum', name: 'Ethereum', enabled: true, fee: 0 },
      { id: 'usdt', name: 'USDT', enabled: true, fee: 0 },
      { id: 'card', name: 'Credit Card', enabled: true, fee: 2.9 },
      { id: 'paypal', name: 'PayPal', enabled: true, fee: 3.5 },
      { id: 'stripe', name: 'Stripe', enabled: true, fee: 2.5 },
      { id: 'wire', name: 'Wire Transfer', enabled: true, fee: 1 }
    ]
  });
});

export default router;
