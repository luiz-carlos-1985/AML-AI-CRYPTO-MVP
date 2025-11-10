import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, Bell, FileText, User, Settings, LogOut, Menu, X, BarChart3, Users, Wrench } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationCenter from './NotificationCenter';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('nav.wallets'), href: '/wallets', icon: Wallet },
    { name: t('nav.transactions'), href: '/transactions', icon: ArrowLeftRight },
    { name: t('nav.alerts'), href: '/alerts', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Tools', href: '/tools', icon: Wrench },
    { name: t('nav.reports'), href: '/reports', icon: FileText },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'API Keys', href: '/api-settings', icon: Settings },
    { name: 'Account', href: '/account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Desktop/Tablet Navigation */}
      <nav className="backdrop-blur-xl bg-slate-900/50 border-b border-slate-800/50 shadow-2xl sticky top-0 z-50">
        <div className="max-w-[2000px] 3xl:max-w-[2400px] tv:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 tv:px-16">
          <div className="flex justify-between h-16 md:h-20 tv:h-32">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 tv:w-20 tv:h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <svg className="w-6 h-6 md:w-7 md:h-7 tv:w-12 tv:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-xl md:text-2xl tv:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">CryptoAML</h1>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-2 xl:space-x-3 tv:space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 xl:px-4 tv:px-8 py-2 tv:py-4 rounded-lg text-sm xl:text-base tv:text-2xl font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 xl:w-5 xl:h-5 tv:w-8 tv:h-8 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* User Info & Logout */}
            <div className="hidden md:flex items-center space-x-3 xl:space-x-4 tv:space-x-8">
              <NotificationCenter />
              <LanguageSwitcher />
              <div className="text-sm xl:text-base tv:text-2xl text-right">
                <p className="font-medium text-slate-200">{user?.name}</p>
                <p className="text-emerald-400 text-xs xl:text-sm tv:text-xl">{user?.plan}</p>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 xl:px-4 tv:px-8 py-2 tv:py-4 text-sm xl:text-base tv:text-2xl font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut className="w-4 h-4 tv:w-7 tv:h-7 mr-2" />
                <span className="hidden xl:inline">{t('nav.logout')}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/50 backdrop-blur-xl bg-slate-900/95">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navigation.filter(item => item.href !== '/').map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-slate-800/50">
                <div className="px-4 py-2">
                  <p className="font-medium text-slate-200">{user?.name}</p>
                  <p className="text-emerald-400 text-sm">{user?.plan}</p>
                </div>
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center px-4 py-3 mt-2 rounded-lg text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-[2000px] 3xl:max-w-[2400px] tv:max-w-[3200px] mx-auto py-4 md:py-8 tv:py-16 px-4 sm:px-6 lg:px-8 tv:px-16">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile/Tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-slate-900/95 border-t border-slate-800/50 shadow-2xl z-50 pb-safe-bottom">
        <div className="flex justify-around items-center h-16">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="lg:hidden h-16"></div>
    </div>
  );
};

export default Layout;
