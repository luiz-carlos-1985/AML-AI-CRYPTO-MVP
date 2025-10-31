import { usePWA } from '../hooks/usePWA';
import { Download, X } from 'lucide-react';
import { useState } from 'react';

const InstallPWA = () => {
  const { canInstall, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setDismissed(true);
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-sm z-50 animate-slide-up">
      <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/90 to-blue-600/90 rounded-2xl shadow-2xl border border-white/20 p-4">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Install CryptoAML
            </h3>
            <p className="text-white/90 text-xs mb-3">
              Install our app for a better experience on all your devices
            </p>
            
            <button
              onClick={handleInstall}
              className="w-full py-2 px-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-white/90 transition-all duration-200 text-sm"
            >
              Install Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
