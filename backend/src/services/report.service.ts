import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import prisma from '../utils/prisma';
import { RiskLevel } from '@prisma/client';

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

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const totalTx = transactions.length || 1;
  const riskStats = {
    LOW: transactions.filter(t => t.riskLevel === RiskLevel.LOW).length,
    MEDIUM: transactions.filter(t => t.riskLevel === RiskLevel.MEDIUM).length,
    HIGH: transactions.filter(t => t.riskLevel === RiskLevel.HIGH).length,
    CRITICAL: transactions.filter(t => t.riskLevel === RiskLevel.CRITICAL).length
  };
  const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const avgRiskScore = transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length : 0;

  const fileName = `report-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, '../../reports', fileName);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(fs.createWriteStream(filePath));

  // Modern Header
  doc.rect(0, 0, doc.page.width, 140).fillAndStroke('#0f766e', '#10b981');
  doc.circle(70, 50, 25).fill('#ffffff');
  doc.fillColor('#10b981').fontSize(20).font('Helvetica-Bold').text('CA', 56, 42);
  doc.fillColor('#ffffff')
     .fontSize(32).font('Helvetica-Bold').text('CryptoAML', 110, 35)
     .fontSize(12).font('Helvetica').text('Anti-Money Laundering Compliance Report', 110, 70)
     .fontSize(9).text(`Generated: ${new Date().toLocaleString()}`, 110, 95);

  // Info Cards
  const cardY = 170;
  doc.roundedRect(50, cardY, 150, 80, 8).fillAndStroke('#f0fdf4', '#10b981');
  doc.fillColor('#10b981').fontSize(10).font('Helvetica-Bold').text('COMPANY', 60, cardY + 15);
  doc.fillColor('#000000').fontSize(9).font('Helvetica').text(user?.company || 'N/A', 60, cardY + 35).text(user?.email || '', 60, cardY + 50);

  doc.roundedRect(220, cardY, 150, 80, 8).fillAndStroke('#eff6ff', '#3b82f6');
  doc.fillColor('#3b82f6').fontSize(10).font('Helvetica-Bold').text('PERIOD', 230, cardY + 15);
  doc.fillColor('#000000').fontSize(9).font('Helvetica').text(new Date(startDate).toLocaleDateString(), 230, cardY + 35).text('to', 230, cardY + 50).text(new Date(endDate).toLocaleDateString(), 230, cardY + 65);

  const highRiskCount = riskStats.HIGH + riskStats.CRITICAL;
  const statusColor = highRiskCount > 0 ? '#ef4444' : '#10b981';
  const statusBg = highRiskCount > 0 ? '#fee2e2' : '#f0fdf4';
  doc.roundedRect(390, cardY, 150, 80, 8).fillAndStroke(statusBg, statusColor);
  doc.fillColor(statusColor).fontSize(10).font('Helvetica-Bold').text('STATUS', 400, cardY + 15);
  doc.fillColor('#000000').fontSize(9).font('Helvetica').text(highRiskCount > 0 ? 'ATTENTION' : 'COMPLIANT', 400, cardY + 40).text(`${highRiskCount} High Risk`, 400, cardY + 60);

  // Key Metrics
  const metricsY = 290;
  doc.fontSize(18).fillColor('#1f2937').font('Helvetica-Bold').text('Key Metrics', 50, metricsY);
  
  const metrics = [
    { label: 'Transactions', value: transactions.length.toString(), color: '#3b82f6', x: 50 },
    { label: 'Total Volume', value: `$${totalVolume.toFixed(2)}`, color: '#10b981', x: 170 },
    { label: 'Avg Risk', value: avgRiskScore.toFixed(1), color: '#f59e0b', x: 290 },
    { label: 'Compliance', value: `${(((totalTx - highRiskCount) / totalTx) * 100).toFixed(1)}%`, color: '#8b5cf6', x: 410 }
  ];

  metrics.forEach(m => {
    doc.roundedRect(m.x, metricsY + 35, 110, 70, 5).fill('#ffffff').stroke('#e5e7eb');
    doc.fillColor(m.color).fontSize(24).font('Helvetica-Bold').text(m.value, m.x + 10, metricsY + 50, { width: 90, align: 'center' });
    doc.fillColor('#6b7280').fontSize(8).font('Helvetica').text(m.label, m.x + 10, metricsY + 85, { width: 90, align: 'center' });
  });

  // Risk Distribution
  const riskY = metricsY + 130;
  doc.fontSize(18).fillColor('#1f2937').font('Helvetica-Bold').text('Risk Distribution', 50, riskY);
  
  const colors = { [RiskLevel.LOW]: '#10b981', [RiskLevel.MEDIUM]: '#f59e0b', [RiskLevel.HIGH]: '#ef4444', [RiskLevel.CRITICAL]: '#991b1b' };
  const barMaxWidth = 370;
  
  Object.entries(riskStats).forEach(([level, count], i) => {
    const y = riskY + 40 + i * 45;
    const percentage = (count / totalTx) * 100;
    const barWidth = (count / totalTx) * barMaxWidth;
    
    doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold').text(level, 50, y);
    doc.roundedRect(120, y - 5, barMaxWidth, 25, 5).fill('#f3f4f6');
    if (barWidth > 0) doc.roundedRect(120, y - 5, barWidth, 25, 5).fill(colors[level as RiskLevel]);
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(`${count} (${percentage.toFixed(1)}%)`, 130, y + 2);
  });

  // Transactions Table
  if (transactions.length > 0) {
    doc.addPage();
    doc.fontSize(18).fillColor('#1f2937').font('Helvetica-Bold').text('Transaction Details', 50, 50);

    let tableY = 90;
    doc.roundedRect(50, tableY, doc.page.width - 100, 30, 5).fill('#1f2937');
    doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
       .text('Hash', 55, tableY + 10, { width: 140 })
       .text('Blockchain', 200, tableY + 10, { width: 70 })
       .text('Amount', 275, tableY + 10, { width: 80 })
       .text('Risk', 360, tableY + 10, { width: 70 })
       .text('Date', 435, tableY + 10, { width: 90 });

    tableY += 35;
    doc.font('Helvetica');

    transactions.forEach((tx, i) => {
      if (tableY > doc.page.height - 100) {
        doc.addPage();
        tableY = 50;
      }

      if (i % 2 === 0) doc.roundedRect(50, tableY, doc.page.width - 100, 35, 3).fill('#f9fafb');
      
      doc.fillColor('#000000').fontSize(8)
         .text(tx.hash.substring(0, 22) + '...', 55, tableY + 10, { width: 140 })
         .text(tx.wallet.blockchain, 200, tableY + 10, { width: 70 })
         .text(`$${tx.amount}`, 275, tableY + 10, { width: 80 });
      
      const riskColor = colors[tx.riskLevel];
      doc.roundedRect(360, tableY + 8, 65, 18, 4).fill(riskColor);
      doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold').text(tx.riskLevel, 365, tableY + 12, { width: 55, align: 'center' });
      
      doc.fillColor('#000000').fontSize(8).font('Helvetica').text(new Date(tx.timestamp).toLocaleDateString(), 435, tableY + 10, { width: 90 });
      
      tableY += 35;
    });
  }

  // Footer
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill('#f9fafb');
    doc.fontSize(8).fillColor('#6b7280')
       .text(`Page ${i + 1} of ${pages.count}`, 50, doc.page.height - 40, { align: 'center' })
       .text('CryptoAML © 2024 - Confidential Report', 50, doc.page.height - 25, { align: 'center' });
  }

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
