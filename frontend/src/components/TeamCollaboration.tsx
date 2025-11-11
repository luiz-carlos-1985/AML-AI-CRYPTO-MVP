import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Crown, Eye, Edit, Trash2, Mail, Activity, Clock, CheckCircle, XCircle, Settings, Search, Filter, MoreVertical, Copy, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

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
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active', lastActive: '2 min ago', avatar: 'JD' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@company.com', role: 'analyst', status: 'active', lastActive: '1 hour ago', avatar: 'SS' },
    { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'analyst', status: 'active', lastActive: '3 hours ago', avatar: 'MJ' },
    { id: '4', name: 'Emma Wilson', email: 'emma@company.com', role: 'viewer', status: 'pending', lastActive: 'Never', avatar: 'EW' },
  ]);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'viewer' as TeamMember['role'] });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setActivities([
        { id: 1, user: 'Sarah Smith', action: 'analyzed wallet', target: '0x742d...', time: '5 min ago', type: 'analysis' },
        { id: 2, user: 'Mike Johnson', action: 'created alert rule', target: 'High Risk Transactions', time: '1 hour ago', type: 'alert' },
        { id: 3, user: 'John Doe', action: 'invited new member', target: 'emma@company.com', time: '2 hours ago', type: 'invite' },
        { id: 4, user: 'Sarah Smith', action: 'generated report', target: 'Monthly AML Report', time: '3 hours ago', type: 'report' }
      ]);
    } catch (error) {
      console.error('Failed to load team data');
    }
  };

  const sendInvite = async () => {
    if (!inviteData.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteData.email.split('@')[0],
        email: inviteData.email,
        role: inviteData.role,
        status: 'pending',
        lastActive: 'Never',
        avatar: inviteData.email.substring(0, 2).toUpperCase()
      };
      
      setMembers([...members, newMember]);
      setInviteData({ email: '', role: 'viewer' });
      setShowInvite(false);
      toast.success('Invitation sent successfully!');
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemberRole = async (memberId: string, newRole: TeamMember['role']) => {
    try {
      setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      toast.success('Member role updated');
    } catch (error) {
      toast.error('Failed to update member role');
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      setMembers(members.filter(m => m.id !== memberId));
      toast.success('Member removed from team');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const resendInvite = async (memberId: string) => {
    try {
      toast.success('Invitation resent!');
    } catch (error) {
      toast.error('Failed to resend invitation');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
              className={`backdrop-blur-xl bg-slate-800/30 border rounded-2xl p-3 sm:p-4 ${
                config.color === 'purple' ? 'border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5' :
                config.color === 'blue' ? 'border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5' :
                'border-slate-500/20 bg-gradient-to-br from-slate-500/10 to-slate-600/5'
              }`}
            >
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 ${
                config.color === 'purple' ? 'text-purple-400' :
                config.color === 'blue' ? 'text-blue-400' :
                'text-slate-400'
              }`} />
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{count}</div>
              <div className="text-sm font-medium text-white">{config.label}</div>
              <div className="text-xs text-slate-400 mt-1">{config.permissions}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="analyst">Analyst</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white">Team Members ({filteredMembers.length})</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{members.filter(m => m.status === 'active').length} active</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{members.filter(m => m.status === 'pending').length} pending</span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-700/50">
          {filteredMembers.map((member, index) => {
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
                        <RoleIcon className={`w-3 h-3 ${
                          roleInfo.color === 'purple' ? 'text-purple-400' :
                          roleInfo.color === 'blue' ? 'text-blue-400' :
                          'text-slate-400'
                        }`} />
                        <span className="text-xs text-slate-500">{roleInfo.label}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">Last active: {member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.status === 'pending' && (
                      <button
                        onClick={() => resendInvite(member.id)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-all touch-target"
                        title="Resend invitation"
                      >
                        <Send className="w-4 h-4 text-blue-400" />
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectedMember(member); setShowMemberModal(true); }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-all touch-target"
                      title="Edit member"
                    >
                      <Edit className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all touch-target"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filteredMembers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">
                {searchTerm || roleFilter !== 'all' ? 'No members match your filters' : 'No team members found'}
              </p>
              {searchTerm || roleFilter !== 'all' ? (
                <button
                  onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-all"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Team Activity */}
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activity.type === 'analysis' ? 'bg-blue-500/20' :
                activity.type === 'alert' ? 'bg-amber-500/20' :
                activity.type === 'invite' ? 'bg-emerald-500/20' :
                'bg-purple-500/20'
              }`}>
                {activity.type === 'analysis' && <Eye className="w-4 h-4 text-blue-400" />}
                {activity.type === 'alert' && <Shield className="w-4 h-4 text-amber-400" />}
                {activity.type === 'invite' && <UserPlus className="w-4 h-4 text-emerald-400" />}
                {activity.type === 'report' && <Settings className="w-4 h-4 text-purple-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
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
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as TeamMember['role'] })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer - View only access</option>
                  <option value="analyst">Analyst - View and analyze</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                <p className="text-xs text-blue-300">
                  <strong>Note:</strong> The invited member will receive an email with instructions to join your team.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={sendInvite}
                  disabled={isLoading || !inviteData.email.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 inline mr-2" />
                      Send Invite
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setShowInvite(false); setInviteData({ email: '', role: 'viewer' }); }}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Member Edit Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Edit Member</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedMember.avatar}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedMember.name}</p>
                  <p className="text-sm text-slate-400">{selectedMember.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={selectedMember.role}
                  onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value as TeamMember['role'] })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer - View only access</option>
                  <option value="analyst">Analyst - View and analyze</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateMemberRole(selectedMember.id, selectedMember.role);
                    setShowMemberModal(false);
                    setSelectedMember(null);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setShowMemberModal(false); setSelectedMember(null); }}
                  className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-all"
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