import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ExportDataProps {
  type: 'transactions' | 'wallets' | 'alerts' | 'reports';
  filters?: any;
}

export default function ExportData({ type, filters }: ExportDataProps) {
  const [exporting, setExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const exportFormats = [
    { value: 'pdf', label: 'PDF Report', icon: FileText, color: 'text-red-400' },
    { value: 'csv', label: 'CSV File', icon: Table, color: 'text-green-400' },
    { value: 'excel', label: 'Excel File', icon: FileSpreadsheet, color: 'text-emerald-400' },
  ];

  const handleExport = async (format: string) => {
    setExporting(true);
    setShowMenu(false);

    try {
      const response = await api.post(`/export/${type}`, {
        format,
        filters,
      }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const extension = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `${type}_export_${Date.now()}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`${format.toUpperCase()} exported successfully!`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export
          </>
        )}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden"
          >
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.value}
                  onClick={() => handleExport(format.value)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-all text-left"
                >
                  <Icon className={`w-5 h-5 ${format.color}`} />
                  <span className="text-sm text-white font-medium">{format.label}</span>
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}
