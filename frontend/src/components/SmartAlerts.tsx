import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Zap, Mail, MessageSquare, Smartphone, Settings, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  channels: string[];
  isActive: boolean;
}

export default function SmartAlerts() {
  const [rules, setRules] = useState<AlertRule[]>([
    { id: '1', name: 'High Risk Transaction', condition: 'risk_score', threshold: 80, channels: ['email', 'sms'], isActive: true },
    { id: '2', name: 'Large Amount', condition: 'amount', threshold: 50000, channels: ['email', 'slack'], isActive: true },
    { id: '3', name: 'Suspicious Pattern', condition: 'pattern_match', threshold: 90, channels: ['email', 'sms', 'slack'], isActive: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    condition: 'risk_score',
    threshold: 50,
    channels: [] as string[]
  });

  const addRule = () => {
    if (!newRule.name.trim()) {
      toast.error('Please enter a rule name');
      return;
    }
    if (newRule.channels.length === 0) {
      toast.error('Please select at least one notification channel');
      return;
    }
    
    const rule: AlertRule = {
      id: Date.now().toString(),
      name: newRule.name,
      condition: newRule.condition,
      threshold: newRule.threshold,
      channels: newRule.channels,
      isActive: true
    };
    
    setRules([...rules, rule]);
    setNewRule({ name: '', condition: 'risk_score', threshold: 50, channels: [] });
    setShowModal(false);
    toast.success('Alert rule created successfully');
  };

  const toggleChannel = (channelId: string) => {
    setNewRule(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(c => c !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const channels = [
    { id: 'email', name: 'Email', icon: Mail, color: 'blue' },
    { id: 'sms', name: 'SMS', icon: Smartphone, color: 'emerald' },
    { id: 'slack', name: 'Slack', icon: MessageSquare, color: 'purple' },
    { id: 'webhook', name: 'Webhook', icon: Zap, color: 'amber' },
  ];

  const conditions = [
    { value: 'risk_score', label: 'Risk Score Above' },
    { value: 'amount', label: 'Transaction Amount Above' },
    { value: 'pattern_match', label: 'Pattern Match Score Above' },
    { value: 'velocity', label: 'Transaction Velocity Above' },
  ];

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    toast.success('Alert rule updated');
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success('Alert rule deleted');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Smart Alerts</h2>
            <p className="text-xs sm:text-sm text-slate-400">Automated multi-channel notifications</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all text-sm touch-target"
        >
          <Plus className="w-4 h-4" />
          New Alert Rule
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {channels.map((channel, index) => {
          const Icon = channel.icon;
          const activeCount = rules.filter(r => r.isActive && r.channels.includes(channel.id)).length;
          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`backdrop-blur-xl bg-slate-800/30 border rounded-2xl p-3 sm:p-4 ${
                channel.color === 'blue' ? 'border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5' :
                channel.color === 'emerald' ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5' :
                channel.color === 'purple' ? 'border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5' :
                'border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-600/5'
              }`}
            >
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 ${
                channel.color === 'blue' ? 'text-blue-400' :
                channel.color === 'emerald' ? 'text-emerald-400' :
                channel.color === 'purple' ? 'text-purple-400' :
                'text-amber-400'
              }`} />
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{activeCount}</div>
              <div className="text-xs sm:text-sm text-slate-400">{channel.name}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-700/50">
          <h3 className="text-base sm:text-lg font-bold text-white">Alert Rules</h3>
        </div>
        <div className="divide-y divide-slate-700/50">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 sm:p-4 hover:bg-slate-700/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm sm:text-base font-medium text-white truncate">{rule.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      rule.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {conditions.find(c => c.value === rule.condition)?.label}: {rule.threshold}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {rule.channels.map(ch => {
                      const channel = channels.find(c => c.id === ch);
                      const Icon = channel?.icon || Bell;
                      return (
                        <span key={ch} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          channel?.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          channel?.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                          channel?.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          <Icon className="w-3 h-3" />
                          {channel?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all touch-target"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-all touch-target"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Create Alert Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter rule name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Condition</label>
                <select
                  value={newRule.condition}
                  onChange={(e) => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>{condition.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Threshold</label>
                <input
                  type="number"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Notification Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {channels.map(channel => {
                    const Icon = channel.icon;
                    const isSelected = newRule.channels.includes(channel.id);
                    return (
                      <button
                        key={channel.id}
                        onClick={() => toggleChannel(channel.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{channel.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addRule}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
