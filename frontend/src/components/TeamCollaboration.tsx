import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Crown, Eye, Edit, Trash2, Mail } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  status: 'active' | 'pending';
  lastActive: string;
  avatar: string;
}

export default function TeamCollaboration() {
  const [members] = useState<TeamMember[]>([
    { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active', lastActive: '2 min ago', avatar: 'JD' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@company.com', role: 'analyst', status: 'active', lastActive: '1 hour ago', avatar: 'SS' },
    { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'analyst', status: 'active', lastActive: '3 hours ago', avatar: 'MJ' },
    { id: '4', name: 'Emma Wilson', email: 'emma@company.com', role: 'viewer', status: 'pending', lastActive: 'Never', avatar: 'EW' },
  ]);

  const [showInvite, setShowInvite] = useState(false);

  const roleConfig = {
    admin: { icon: Crown, color: 'purple', label: 'Admin', permissions: 'Full access' },
    analyst: { icon: Shield, color: 'blue', label: 'Analyst', permissions: 'View & analyze' },
    viewer: { icon: Eye, color: 'slate', label: 'Viewer', permissions: 'View only' }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Team Collaboration</h2>
            <p className="text-xs sm:text-sm text-slate-400">Manage team members and permissions</p>
          </div>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all text-sm touch-target"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {Object.entries(roleConfig).map(([key, config], index) => {
          const Icon = config.icon;
          const count = members.filter(m => m.role === key).length;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`backdrop-blur-xl bg-gradient-to-br from-${config.color}-500/10 to-${config.color}-600/5 border border-${config.color}-500/20 rounded-2xl p-3 sm:p-4`}
            >
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${config.color}-400 mb-2 sm:mb-3`} />
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{count}</div>
              <div className="text-sm font-medium text-white">{config.label}</div>
              <div className="text-xs text-slate-400 mt-1">{config.permissions}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-700/50">
          <h3 className="text-base sm:text-lg font-bold text-white">Team Members</h3>
        </div>
        <div className="divide-y divide-slate-700/50">
          {members.map((member, index) => {
            const roleInfo = roleConfig[member.role];
            const RoleIcon = roleInfo.icon;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 sm:p-4 hover:bg-slate-700/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {member.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-medium text-white truncate">{member.name}</h4>
                        {member.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Pending</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{member.email}</p>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                        <RoleIcon className={`w-3 h-3 text-${roleInfo.color}-400`} />
                        <span className="text-xs text-slate-500">{roleInfo.label}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">Last active: {member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-all">
                      <Edit className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {showInvite && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white">
                  <option value="viewer">Viewer - View only access</option>
                  <option value="analyst">Analyst - View and analyze</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Send Invite
                </button>
                <button
                  onClick={() => setShowInvite(false)}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
