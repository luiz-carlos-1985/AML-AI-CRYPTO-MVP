import { motion } from 'framer-motion';
import { Shield, FileCheck, Globe, Award, Lock, CheckCircle } from 'lucide-react';

const ComplianceInfo = () => {
  const certifications = [
    { icon: Shield, name: 'ISO 27001', description: 'Information Security' },
    { icon: FileCheck, name: 'SOC 2 Type II', description: 'Security & Availability' },
    { icon: Globe, name: 'GDPR Compliant', description: 'Data Protection' },
    { icon: Award, name: 'FATF Guidelines', description: 'AML Standards' }
  ];

  const regulations = [
    { name: 'BACEN', country: 'Brazil', status: 'Compliant' },
    { name: 'FinCEN', country: 'USA', status: 'Compliant' },
    { name: 'FCA', country: 'UK', status: 'Compliant' },
    { name: 'MAS', country: 'Singapore', status: 'Compliant' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-4 md:p-8 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance & Security</h2>
          <p className="text-sm text-slate-400">Certified and audited by industry leaders</p>
        </div>
      </div>

      {/* Certifications */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Our Certifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 hover:border-emerald-500/30 transition-all text-center group"
              >
                <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-white mb-1">{cert.name}</p>
                <p className="text-xs text-slate-400">{cert.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Regulatory Compliance */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Regulatory Compliance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {regulations.map((reg, index) => (
            <motion.div
              key={reg.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30"
            >
              <div>
                <p className="text-sm font-bold text-white">{reg.name}</p>
                <p className="text-xs text-slate-400">{reg.country}</p>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">{reg.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-400 mb-2">Enterprise-Grade Security</p>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>• End-to-end encryption for all data</li>
              <li>• Multi-factor authentication (MFA)</li>
              <li>• Regular third-party security audits</li>
              <li>• 99.9% uptime SLA guarantee</li>
              <li>• Real-time threat monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComplianceInfo;
