import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: req.userId! },
      select: { id: true, name: true, key: true, isActive: true, lastUsed: true, createdAt: true }
    });
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const key = `sk_${crypto.randomBytes(32).toString('hex')}`;
    
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: req.userId!,
        name: name || 'API Key',
        key,
        isActive: true
      }
    });
    
    res.json(apiKey);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await prisma.apiKey.deleteMany({
      where: { id: req.params.id, userId: req.userId! }
    });
    res.json({ message: 'API key deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

router.patch('/:id/toggle', async (req: AuthRequest, res) => {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: { id: req.params.id, userId: req.userId! }
    });
    
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }
    
    const updated = await prisma.apiKey.update({
      where: { id: req.params.id },
      data: { isActive: !apiKey.isActive }
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle API key' });
  }
});

export default router;
