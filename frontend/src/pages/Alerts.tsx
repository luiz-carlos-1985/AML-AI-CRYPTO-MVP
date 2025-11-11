import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import toast from 'react-hot-toast';

const Alerts = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState('unread');

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    try {
      const params: any = {};
      if (filter === 'unread') params.isRead = 'false';
      if (filter === 'unresolved') params.isResolved = 'false';
      
      const { data } = await api.get('/alerts', { params });
      console.log('Loaded alerts:', data);
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to load alerts:', error);
      setAlerts([]);
      toast.error(error.response?.data?.error || 'Failed to load alerts');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      toast.success('Alert marked as read');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to update alert');
    }
  };

  const markAsResolved = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/resolve`);
      toast.success('Alert resolved');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{t('alerts.title')}</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        >
          <option value="all">{t('alerts.all')}</option>
          <option value="unread">{t('alerts.unread')}</option>
          <option value="unresolved">{t('alerts.unresolved')}</option>
        </select>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
            <p className="text-slate-400 text-lg">No alerts found.</p>
            <p className="text-slate-500 text-sm mt-2">
              {filter === 'unread' && 'You have no unread alerts.'}
              {filter === 'unresolved' && 'You have no unresolved alerts.'}
              {filter === 'all' && 'No alerts have been generated yet.'}
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
          <div
            key={alert.id}
            className={`backdrop-blur-xl bg-slate-800/50 border-l-4 rounded-2xl p-6 shadow-2xl transition-all duration-200 hover:scale-[1.01] ${
              alert.severity === 'LOW' ? 'border-emerald-500 hover:shadow-emerald-500/20' :
              alert.severity === 'MEDIUM' ? 'border-amber-500 hover:shadow-amber-500/20' :
              alert.severity === 'HIGH' ? 'border-red-500 hover:shadow-red-500/20' :
              'border-red-600 hover:shadow-red-600/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                  <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                  <span className={`px-3 py-1 text-xs rounded-lg font-medium ${
                    alert.severity === 'LOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    alert.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    alert.severity === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-red-600/30 text-red-300 border border-red-600/50'
                  }`}>
                    {alert.severity}
                  </span>
                  {!alert.isRead && (
                    <span className="px-3 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{alert.description}</p>
                <div className="mt-3 text-xs text-slate-400">
                  {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
                {alert.wallet && (
                  <div className="mt-2 text-xs text-slate-400 font-mono bg-slate-900/50 px-3 py-1 rounded-lg inline-block">
                    Wallet: {alert.wallet.address}
                  </div>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="p-2 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-200"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {!alert.isResolved && (
                  <button
                    onClick={() => markAsResolved(alert.id)}
                    className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-200"
                    title="Resolve"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
