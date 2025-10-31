import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import prisma from '../utils/prisma';

export const generatePDFReport = async (userId: string, startDate: string, endDate: string): Promise<string> => {
  const transactions = await prisma.transaction.findMany({
    where: {
      wallet: { userId },
      timestamp: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    },
    include: { wallet: true }
  });

  const fileName = `report-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, '../../reports', fileName);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('CryptoAML Compliance Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`);
  doc.moveDown();

  doc.fontSize(14).text('Transaction Summary');
  doc.fontSize(10);
  
  transactions.forEach(tx => {
    doc.text(`Hash: ${tx.hash}`);
    doc.text(`Amount: ${tx.amount} | Risk: ${tx.riskLevel}`);
    doc.text(`From: ${tx.fromAddress} -> To: ${tx.toAddress}`);
    doc.moveDown(0.5);
  });

  doc.end();

  return `/reports/${fileName}`;
};

export const generateCSVReport = async (userId: string, startDate: string, endDate: string): Promise<string> => {
  const transactions = await prisma.transaction.findMany({
    where: {
      wallet: { userId },
      timestamp: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    },
    include: { wallet: true }
  });

  const fileName = `report-${Date.now()}.csv`;
  const filePath = path.join(__dirname, '../../reports', fileName);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'hash', title: 'Transaction Hash' },
      { id: 'blockchain', title: 'Blockchain' },
      { id: 'fromAddress', title: 'From Address' },
      { id: 'toAddress', title: 'To Address' },
      { id: 'amount', title: 'Amount' },
      { id: 'riskScore', title: 'Risk Score' },
      { id: 'riskLevel', title: 'Risk Level' },
      { id: 'timestamp', title: 'Timestamp' }
    ]
  });

  await csvWriter.writeRecords(transactions);

  return `/reports/${fileName}`;
};
