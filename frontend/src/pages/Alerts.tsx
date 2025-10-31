import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import toast from 'react-hot-toast';

const Alerts = () => {
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
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts');
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
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="all">All Alerts</option>
          <option value="unread">Unread</option>
          <option value="unresolved">Unresolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white shadow rounded-lg p-6 border-l-4 ${
              alert.severity === 'LOW' ? 'border-green-500' :
              alert.severity === 'MEDIUM' ? 'border-yellow-500' :
              alert.severity === 'HIGH' ? 'border-red-500' :
              'border-red-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    alert.severity === 'LOW' ? 'bg-green-100 text-green-800' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                    'bg-red-900 text-white'
                  }`}>
                    {alert.severity}
                  </span>
                  {!alert.isRead && (
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{alert.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
                {alert.wallet && (
                  <div className="mt-2 text-xs text-gray-500 font-mono">
                    Wallet: {alert.wallet.address}
                  </div>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {!alert.isResolved && (
                  <button
                    onClick={() => markAsResolved(alert.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Resolve"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
