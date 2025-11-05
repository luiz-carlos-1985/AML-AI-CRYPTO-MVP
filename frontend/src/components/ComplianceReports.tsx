import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Shield, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  type: 'SAR' | 'CTR' | 'COMPLIANCE' | 'AUDIT';
  period: string;
  status: 'completed' | 'pending' | 'processing';
  generatedAt: string;
}

export default function ComplianceReports() {
  const [reports] = useState<Report[]>([
    { id: '1', type: 'SAR', period: 'Q1 2024', status: 'completed', generatedAt: '2024-03-31' },
    { id: '2', type: 'CTR', period: 'March 2024', status: 'completed', generatedAt: '2024-03-31' },
    { id: '3', type: 'COMPLIANCE', period: 'Q1 2024', status: 'processing', generatedAt: '2024-03-30' },
    { id: '4', type: 'AUDIT', period: 'Annual 2023', status: 'completed', generatedAt: '2024-01-15' },
  ]);

  const reportTypes = {
    SAR: { name: 'Suspicious Activity Report', color: 'red', icon: Shield },
    CTR: { name: 'Currency Transaction Report', color: 'blue', icon: FileText },
    COMPLIANCE: { name: 'Compliance Report', color: 'emerald', icon: CheckCircle },
    AUDIT: { name: 'Audit Report', color: 'purple', icon: Clock },
  };

  const generateReport = (type: string) => {
    toast.success(`Generating ${type} report...`);
  };

  const downloadReport = (report: Report) => {
    toast.success(`Downloading ${report.type} report...`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Compliance Reports</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Regulatory and compliance documentation</p>
        </div>
        <button
          onClick={() => generateReport('Custom')}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm touch-target"
        >
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(reportTypes).map(([key, value], index) => {
          const Icon = value.icon;
          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => generateReport(key)}
              className={`p-3 sm:p-4 bg-gradient-to-br from-${value.color}-500/10 to-${value.color}-600/5 border border-${value.color}-500/20 rounded-xl hover:border-${value.color}-500/40 transition-all text-left touch-target`}
            >
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${value.color}-400 mb-2 sm:mb-3`} />
              <h3 className="text-xs sm:text-sm font-bold text-white mb-1">{key}</h3>
              <p className="text-xs text-slate-400 hidden sm:block">{value.name}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-700/50">
          <h3 className="text-base sm:text-lg font-bold text-white">Recent Reports</h3>
        </div>
        <div className="divide-y divide-slate-700/50">
          {reports.map((report, index) => {
            const type = reportTypes[report.type];
            const Icon = type.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 sm:p-4 hover:bg-slate-700/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-${type.color}-500 to-${type.color}-600 flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-medium text-white truncate">{report.type} - {report.period}</h4>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="text-xs text-slate-400">{new Date(report.generatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      report.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {report.status}
                    </span>
                    {report.status === 'completed' && (
                      <button
                        onClick={() => downloadReport(report)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
