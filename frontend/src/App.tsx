import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallets from './pages/Wallets';
import WalletMonitoring from './pages/WalletMonitoring';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Account from './pages/Account';
import PaymentSettings from './pages/PaymentSettings';
import ApiSettings from './pages/ApiSettings';
import Integrations from './pages/Integrations';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import Tools from './pages/Tools';
import Compliance from './pages/Compliance';
import RevolutionaryDashboard from './pages/RevolutionaryDashboard';
import Layout from './components/Layout';
import InstallPWA from './components/InstallPWA';
import OfflineIndicator from './components/OfflineIndicator';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'backdrop-blur-xl bg-slate-900/90 text-white border border-slate-700',
            duration: 3000,
          }}
        />
        <OfflineIndicator />
        <InstallPWA />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="monitoring" element={<WalletMonitoring />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="account" element={<Account />} />
            <Route path="payment-settings" element={<PaymentSettings />} />
            <Route path="api-settings" element={<ApiSettings />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="team" element={<Team />} />
            <Route path="tools" element={<Tools />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="revolutionary" element={<RevolutionaryDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
