import { usePWA } from '../hooks/usePWA';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-yellow-500/90 rounded-lg shadow-lg border border-yellow-400/50 p-3">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="w-5 h-5 text-white" />
            <p className="text-white font-medium text-sm">
              You're offline. Some features may be limited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
