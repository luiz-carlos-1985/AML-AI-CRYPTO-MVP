import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Webhook, Plus, Trash2, TestTube, Copy, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
}

export default function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', events: [] as string[] });
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());

  const availableEvents = [
    'transaction.created',
    'transaction.high_risk',
    'wallet.added',
    'alert.triggered',
    'report.generated'
  ];

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const { data } = await api.get('/webhooks');
      setWebhooks(data);
    } catch (error) {
      setWebhooks([]);
    }
  };

  const createWebhook = async () => {
    try {
      await api.post('/webhooks', newWebhook);
      toast.success('Webhook created!');
      loadWebhooks();
      setShowModal(false);
      setNewWebhook({ url: '', events: [] });
    } catch (error) {
      toast.error('Failed to create webhook');
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('Delete this webhook?')) return;
    try {
      await api.delete(`/webhooks/${id}`);
      toast.success('Webhook deleted');
      loadWebhooks();
    } catch (error) {
      toast.error('Failed to delete webhook');
    }
  };

  const testWebhook = async (id: string) => {
    try {
      await api.post(`/webhooks/${id}/test`);
      toast.success('Test payload sent!');
    } catch (error) {
      toast.error('Test failed');
    }
  };

  const toggleSecret = (id: string) => {
    const newVisible = new Set(visibleSecrets);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleSecrets(newVisible);
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast.success('Secret copied!');
  };

  return (
    <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Webhooks</h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-1">{webhook.url}</p>
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map(event => (
                    <span key={event} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                webhook.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
              }`}>
                {webhook.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type={visibleSecrets.has(webhook.id) ? 'text' : 'password'}
                value={webhook.secret}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400 font-mono"
              />
              <button onClick={() => toggleSecret(webhook.id)} className="p-2 hover:bg-slate-700 rounded">
                {visibleSecrets.has(webhook.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => copySecret(webhook.secret)} className="p-2 hover:bg-slate-700 rounded">
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => testWebhook(webhook.id)}
                className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
              >
                <TestTube className="w-4 h-4 inline mr-1" />
                Test
              </button>
              <button
                onClick={() => deleteWebhook(webhook.id)}
                className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[99999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">Add Webhook</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://your-domain.com/webhook"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Events</label>
                <div className="space-y-2">
                  {availableEvents.map(event => (
                    <label key={event} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event] });
                          } else {
                            setNewWebhook({ ...newWebhook, events: newWebhook.events.filter(e => e !== event) });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-300">{event}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={createWebhook}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
