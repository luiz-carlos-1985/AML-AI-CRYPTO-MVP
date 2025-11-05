import { useState } from 'react';
import { Info, HelpCircle, Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  description: string;
  type?: 'info' | 'security' | 'privacy' | 'warning';
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoTooltip = ({ title, description, type = 'info', position = 'top' }: InfoTooltipProps) => {
  const [show, setShow] = useState(false);

  const icons = {
    info: <Info className="w-4 h-4" />,
    security: <Shield className="w-4 h-4" />,
    privacy: <Lock className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />
  };

  const colors = {
    info: 'text-blue-400 hover:text-blue-300',
    security: 'text-emerald-400 hover:text-emerald-300',
    privacy: 'text-purple-400 hover:text-purple-300',
    warning: 'text-amber-400 hover:text-amber-300'
  };

  const bgColors = {
    info: 'bg-blue-500/10 border-blue-500/30',
    security: 'bg-emerald-500/10 border-emerald-500/30',
    privacy: 'bg-purple-500/10 border-purple-500/30',
    warning: 'bg-amber-500/10 border-amber-500/30'
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className={`${colors[type]} transition-colors cursor-help touch-target`}
        type="button"
      >
        {icons[type]}
      </button>
      
      {show && (
        <div className={`absolute ${positions[position]} z-50 w-72 sm:w-80`}>
          <div className={`backdrop-blur-xl bg-slate-800/95 border ${bgColors[type]} rounded-xl p-4 shadow-xl`}>
            <div className="flex items-start gap-2 mb-2">
              <div className={colors[type]}>{icons[type]}</div>
              <h4 className="text-sm font-bold text-white">{title}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
