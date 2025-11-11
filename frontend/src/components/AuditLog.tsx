import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User, Shield, Key, Settings, Search, Filter, Calendar, Download, Eye, AlertTriangle } from 'lucide-react';
import api from '../services/api';

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'security' | 'data' | 'config' | 'auth' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [timeRange]);

  const loadLogs = async () => {
    try {
      const { data } = await api.get(`/audit-logs?timeRange=${timeRange}`);
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    const iconMap = {
      security: <Shield className="w-4 h-4 text-red-400" />,
      auth: <Key className="w-4 h-4 text-blue-400" />,
      config: <Settings className="w-4 h-4 text-purple-400" />,
      compliance: <FileText className="w-4 h-4 text-green-400" />,
      data: <Eye className="w-4 h-4 text-amber-400" />
    };
    return iconMap[type as keyof typeof iconMap] || <FileText className="w-4 h-4 text-slate-400" />;
  };

  const getSeverityColor = (severity: string) => {
    const colorMap = {
      low: 'text-green-400 bg-green-500/20 border-green-500/30',
      medium: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      high: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      critical: 'text-red-400 bg-red-500/20 border-red-500/30'
    };
    return colorMap[severity as keyof typeof colorMap] || colorMap.low;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || (log.severity || 'low') === filterSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Audit Trail</h2>
          <p className="text-sm text-slate-400">Complete system activity log for compliance and security</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 text-white rounded-lg text-sm border border-slate-600/50 focus:border-blue-500 focus:outline-none"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 text-white rounded-lg text-sm border border-slate-600/50 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 text-white rounded-lg text-sm border border-slate-600/50 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="security">Security</option>
            <option value="auth">Authentication</option>
            <option value="config">Configuration</option>
            <option value="compliance">Compliance</option>
            <option value="data">Data Access</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 text-white rounded-lg text-sm border border-slate-600/50 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center px-3 py-2 bg-slate-700/30 rounded-lg">
            <span className="text-sm text-slate-300">{filteredLogs.length} entries</span>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sm:p-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No audit logs found</p>
            <p className="text-sm">Try adjusting your filters or time range</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={`audit-${log.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-colors"
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(log.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-white">{log.action}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getSeverityColor(log.severity || 'low')}`}>
                              {(log.severity || 'low').toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-2">{log.details}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{log.user}</span>
                          </div>
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                          {log.resource && (
                            <span>Resource: {log.resource}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedLog === log.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-700/50 bg-slate-800/30"
                      >
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Event ID:</span>
                              <span className="text-white ml-2 font-mono">{log.id}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Type:</span>
                              <span className="text-white ml-2 capitalize">{log.type}</span>
                            </div>
                            {log.ipAddress && (
                              <div>
                                <span className="text-slate-400">IP Address:</span>
                                <span className="text-white ml-2 font-mono">{log.ipAddress}</span>
                              </div>
                            )}
                            {log.userAgent && (
                              <div className="sm:col-span-2">
                                <span className="text-slate-400">User Agent:</span>
                                <span className="text-white ml-2 text-xs break-all">{log.userAgent}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: logs.length, color: 'blue' },
          { label: 'Security Events', value: logs.filter(l => l.type === 'security').length, color: 'red' },
          { label: 'Auth Events', value: logs.filter(l => l.type === 'auth').length, color: 'green' },
          { label: 'Critical Events', value: logs.filter(l => (l.severity || 'low') === 'critical').length, color: 'orange' }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 border border-${stat.color}-500/20`}
          >
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}