import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getApiConfigurations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      console.error('No userId in request');
      // Return empty array instead of error for better UX
      return res.json([]);
    }

    console.log('Fetching configs for user:', req.userId);

    const configs = await prisma.apiConfiguration.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        provider: true,
        isActive: true,
        createdAt: true,
        apiKey: false
      }
    }).catch(err => {
      console.error('Prisma error:', err);
      // Return empty array on database error
      return [];
    });

    console.log('Found configs:', configs.length);
    res.json(configs);
  } catch (error: any) {
    console.error('API Config error:', error);
    console.error('Stack:', error.stack);
    // Return empty array instead of 500 error
    res.json([]);
  }
};

export const saveApiConfiguration = async (req: AuthRequest, res: Response) => {
  try {
    const { provider, apiKey } = req.body;
    const userId = req.userId!;

    if (!provider || !apiKey) {
      return res.status(400).json({ error: 'Provider and API key are required' });
    }

    const config = await prisma.apiConfiguration.upsert({
      where: {
        userId_provider: { userId, provider }
      },
      create: {
        userId,
        provider,
        apiKey,
        isActive: true
      },
      update: {
        apiKey,
        isActive: true
      }
    });

    res.json({ 
      message: 'API configuration saved successfully',
      id: config.id,
      provider: config.provider
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save API configuration' });
  }
};

export const toggleApiConfiguration = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const config = await prisma.apiConfiguration.findFirst({
      where: { id, userId: req.userId }
    });

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    await prisma.apiConfiguration.update({
      where: { id },
      data: { isActive: !config.isActive }
    });

    res.json({ message: 'API configuration updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update API configuration' });
  }
};

export const deleteApiConfiguration = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.apiConfiguration.deleteMany({
      where: { id, userId: req.userId }
    });

    res.json({ message: 'API configuration deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete API configuration' });
  }
};