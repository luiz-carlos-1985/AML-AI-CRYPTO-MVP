import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TimelineEvent {
  date: string;
  riskScore: number;
  riskLevel: string;
  event: string;
  change: 'up' | 'down' | 'stable';
}

interface RiskTimelineProps {
  events: TimelineEvent[];
}

const RiskTimeline = ({ events }: RiskTimelineProps) => {
  const getTrendIcon = (change: string) => {
    switch (change) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-emerald-400" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-emerald-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'HIGH': return 'bg-red-500';
      case 'CRITICAL': return 'bg-red-600';
      default: return 'bg-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Risk History Timeline</h3>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700/50" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-2 w-5 h-5 rounded-full ${getRiskColor(event.riskLevel)} border-4 border-slate-800`} />

              {/* Event Card */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{event.event}</p>
                    <p className="text-xs text-slate-400 mt-1">{event.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(event.change)}
                    <span className="text-lg font-bold text-white">{event.riskScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  event.riskLevel === 'LOW' ? 'bg-emerald-500/20 text-emerald-400' :
                  event.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                  event.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                  'bg-red-600/30 text-red-300'
                }`}>
                  {event.riskLevel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-blue-400">Track Changes:</strong> Monitor how risk levels evolve over time. 
          Sudden increases may indicate suspicious activity, while gradual decreases show improved compliance.
        </p>
      </div>
    </motion.div>
  );
};

export default RiskTimeline;
