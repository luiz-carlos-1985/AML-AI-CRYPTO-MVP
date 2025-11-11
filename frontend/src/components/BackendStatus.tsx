import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import api from '../services/api';

export default function BackendStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [checking, setChecking] = useState(false);

  const checkBackend = async () => {
    if (checking) return;
    
    try {
      setChecking(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      await fetch('/api/health', { 
        signal: controller.signal,
        method: 'GET'
      });
      
      clearTimeout(timeoutId);
      setIsOnline(true);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setIsOnline(false);
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="backdrop-blur-xl bg-red-500/90 border border-red-400/50 rounded-xl px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-white animate-pulse" />
          <div>
            <p className="text-white font-semibold text-sm">Backend Offline</p>
            <p className="text-red-100 text-xs">Algumas funcionalidades podem não estar disponíveis</p>
          </div>
          <button
            onClick={checkBackend}
            disabled={checking}
            className="ml-2 p-2 hover:bg-red-600/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Wifi className={`w-4 h-4 text-white ${checking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
