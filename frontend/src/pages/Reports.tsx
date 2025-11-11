import { useEffect, useState } from 'react';
import { Download, FileText, Shield, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import toast from 'react-hot-toast';

const Reports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CUSTOM',
    format: 'PDF',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reports/generate', formData);
      toast.success('Report generation started');
      setShowModal(false);
      setFormData({ type: 'CUSTOM', format: 'PDF', startDate: '', endDate: '' });
      setTimeout(loadReports, 2000);
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* COMPLIANCE PREMIUM HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-400/50 rounded-xl p-4 sm:p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-emerald-400" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{t('reports.title')}</h1>
              <p className="text-emerald-400 text-xs sm:text-sm font-medium">🏆 Certificado BACEN, COAF, CVM - Auditoria Big Four</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-xs sm:text-sm">100% Conforme</span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">Relatórios Regulatórios</h2>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:scale-105"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white">{report.type}</p>
                <p className="text-xs text-slate-400 mt-1">{report.format}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-lg font-medium whitespace-nowrap ${
                report.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                report.status === 'PROCESSING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                report.status === 'FAILED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-slate-700/50 text-slate-300 border border-slate-600/50'
              }`}>
                {report.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {format(new Date(report.startDate), 'MMM dd')} - {format(new Date(report.endDate), 'MMM dd, yyyy')}
            </p>
            {report.status === 'COMPLETED' && report.fileUrl && (
              <button
                onClick={async () => {
                  try {
                    const filename = report.fileUrl.split('/').pop();
                    const response = await api.get(`/reports/download/${filename}`, { responseType: 'blob' });
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    toast.success('Download started');
                  } catch (error) {
                    toast.error('Download failed');
                  }
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-emerald-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 shadow-2xl overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-700/30 transition-all duration-200">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    {report.type}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {report.format}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {format(new Date(report.startDate), 'MMM dd')} - {format(new Date(report.endDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-lg font-medium ${
                      report.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      report.status === 'PROCESSING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      report.status === 'FAILED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                    {report.status === 'COMPLETED' && report.fileUrl && (
                      <button
                        onClick={async () => {
                          try {
                            const filename = report.fileUrl.split('/').pop();
                            const response = await api.get(`/reports/download/${filename}`, { responseType: 'blob' });
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', filename);
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);
                            toast.success('Download started');
                          } catch (error) {
                            toast.error('Download failed');
                          }
                        }}
                        className="text-emerald-400 hover:text-emerald-300 inline-flex items-center font-medium transition-all duration-200 cursor-pointer"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-4 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">Generate Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="PDF">PDF</option>
                  <option value="CSV">CSV</option>
                  <option value="JSON">JSON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 font-medium shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:scale-105"
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700/50 text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-700 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
