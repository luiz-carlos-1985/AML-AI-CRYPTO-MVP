import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { generatePDFReport, generateCSVReport } from '../services/report.service';

export const generateReport = async (req: AuthRequest, res: Response) => {
  try {
    const { type, format, startDate, endDate } = req.body;

    const report = await prisma.report.create({
      data: {
        userId: req.userId!,
        type,
        format,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'PROCESSING'
      }
    });

    // Generate report asynchronously
    (async () => {
      try {
        let fileUrl;
        
        if (format === 'PDF') {
          fileUrl = await generatePDFReport(req.userId!, startDate, endDate);
        } else if (format === 'CSV') {
          fileUrl = await generateCSVReport(req.userId!, startDate, endDate);
        }

        await prisma.report.update({
          where: { id: report.id },
          data: { status: 'COMPLETED', fileUrl }
        });
      } catch (error) {
        await prisma.report.update({
          where: { id: report.id },
          data: { status: 'FAILED' }
        });
      }
    })();

    res.status(202).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};
