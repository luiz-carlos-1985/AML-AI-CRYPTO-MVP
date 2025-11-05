import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Shield, Key, Settings } from 'lucide-react';
import api from '../services/api';

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'security' | 'data' | 'config' | 'auth';
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data } = await api.get('/audit-logs');
      setLogs(data);
    } catch (error) {
      // Mock data for demo
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4 text-red-400" />;
      case 'auth': return <Key className="w-4 h-4 text-blue-400" />;
      case 'config': return <Settings className="w-4 h-4 text-purple-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Audit Log</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50"
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(log.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-white">{log.action}</p>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{log.details}</p>
              <div className="flex items-center gap-1 mt-2">
                <User className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-500">{log.user}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
