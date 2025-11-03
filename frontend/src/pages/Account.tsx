import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Shield, Bell, Key, LogOut, Crown, Zap, Check, X, Bitcoin, Smartphone, Wallet as WalletIcon, Globe, Camera, Activity, Award, Clock, Edit2, Save, Mail, Building, MapPin, Phone, Copy } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    country: '',
    city: ''
  });
  const [stats, setStats] = useState({
    totalWallets: 0,
    totalTransactions: 0,
    totalAlerts: 0,
    accountAge: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        company: data.company || '',
        phone: data.phone || '',
        country: data.country || '',
        city: data.city || ''
      });
      setProfileImage(data.avatar || '');
      loadStats();
      loadActivities();
    } catch (error) {
      console.error('Failed to load user');
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats({
        totalWallets: data.totalWallets || 0,
        totalTransactions: data.totalTransactions || 0,
        totalAlerts: data.totalAlerts || 0,
        accountAge: data.accountAge || 0
      });
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const loadActivities = async () => {
    try {
      const { data } = await api.get('/alerts?limit=5');
      setActivities(data || []);
    } catch (error) {
      console.error('Failed to load activities');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        
        // Save immediately
        try {
          await api.put('/auth/profile', { ...profileData, avatar: imageData });
          toast.success('Profile image saved!');
          loadUser();
        } catch (error) {
          toast.error('Failed to save image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.put('/auth/profile', { ...profileData, avatar: profileImage });
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
      loadUser();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      price: 0,
      currency: 'FREE',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-slate-500 to-slate-600',
      features: [
        '5 Wallets',
        '100 Transactions/month',
        'Basic Risk Analysis',
        'Email Alerts',
        'Community Support'
      ],
      limits: '5 wallets, 100 tx/mo'
    },
    {
      id: 'GROWTH',
      name: 'Growth',
      price: 99,
      currency: 'USD',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-emerald-500 to-emerald-600',
      popular: true,
      features: [
        '50 Wallets',
        '10,000 Transactions/month',
        'Advanced AI Analysis',
        'Real-time Alerts',
        'Priority Support',
        'Custom Reports',
        'API Access',
        'Compliance Tools'
      ],
      limits: '50 wallets, 10K tx/mo'
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 499,
      currency: 'USD',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Unlimited Wallets',
        'Unlimited Transactions',
        'Custom AI Models',
        'Instant Alerts',
        'Dedicated Support',
        'White-label Reports',
        'Full API Access',
        'Compliance Suite',
        'Multi-user Access',
        'SLA Guarantee'
      ],
      limits: 'Unlimited everything'
    }
  ];

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: '🇧🇷', description: 'Instant payment (Brazil)', fee: '0%' },
    { id: 'bitcoin', name: 'Bitcoin', icon: '₿', description: 'BTC payment', fee: '0%' },
    { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', description: 'ETH payment', fee: '0%' },
    { id: 'usdt', name: 'USDT', icon: '₮', description: 'Tether stablecoin', fee: '0%' },
    { id: 'card', name: 'Credit Card', icon: '💳', description: 'Visa, Mastercard, Amex', fee: '2.9%' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'PayPal account', fee: '3.5%' },
    { id: 'stripe', name: 'Stripe', icon: '💵', description: 'Bank transfer', fee: '2.5%' },
    { id: 'wire', name: 'Wire Transfer', icon: '🏦', description: 'International wire', fee: '1%' }
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    
    // Generate payment data based on method
    let data: any = {
      amount: plan?.price,
      currency: plan?.currency,
      plan: selectedPlan,
      method: paymentMethod
    };

    if (paymentMethod === 'pix') {
      // Generate PIX payment data
      data.pixKey = 'cryptoaml@payment.com';
      data.pixCode = `00020126580014br.gov.bcb.pix0136cryptoaml@payment.com520400005303986540${plan?.price}.005802BR5913CryptoAML Inc6009Sao Paulo62070503***6304`;
    } else if (paymentMethod === 'bitcoin') {
      data.address = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
      data.amount_btc = (plan?.price! / 45000).toFixed(8); // Approximate BTC conversion
    } else if (paymentMethod === 'ethereum') {
      data.address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      data.amount_eth = (plan?.price! / 2500).toFixed(6); // Approximate ETH conversion
    } else if (paymentMethod === 'usdt') {
      data.address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      data.amount_usdt = plan?.price;
      data.network = 'ERC20';
    }

    setPaymentData(data);
    setShowUpgradeModal(false);
    setShowPaymentModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const processPayment = async () => {
    try {
      const plan = plans.find(p => p.id === selectedPlan);
      toast.loading('Processing payment...');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await api.post('/payments/upgrade', {
        plan: selectedPlan,
        paymentMethod,
        amount: plan?.price
      });

      toast.dismiss();
      toast.success('Payment successful! Plan upgraded.');
      setShowPaymentModal(false);
      loadUser();
    } catch (error) {
      toast.dismiss();
      toast.error('Payment failed. Please try again.');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'api', name: 'API Keys', icon: Key }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-2 bg-emerald-500 rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-200 group-hover:scale-110"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{user?.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  user?.plan === 'ENTERPRISE' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  user?.plan === 'GROWTH' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}>
                  {user?.plan}
                </span>
                {user?.plan !== 'STARTER' && (
                  <Award className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            </div>
            <p className="text-slate-400 mb-4">{user?.email}</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-1">
                  <WalletIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Wallets</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.totalWallets}</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-400">Transactions</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.totalTransactions}</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Alerts</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.totalAlerts}</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-400">Member</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.accountAge}d</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Current Plan Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Crown className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Current Plan: {user?.plan || 'STARTER'}</h3>
              <p className="text-emerald-400 text-sm mt-1">
                {plans.find(p => p.id === user?.plan)?.limits || 'Free tier'}
              </p>
            </div>
          </div>
          {user?.plan !== 'ENTERPRISE' && (
            <button
              onClick={() => handleUpgrade(user?.plan === 'STARTER' ? 'GROWTH' : 'ENTERPRISE')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-slate-400 bg-slate-700/50 hover:bg-slate-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <Building className="w-4 h-4 mr-2" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditingProfile}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <Globe className="w-4 h-4 mr-2" />
                    Country
                  </label>
                  <select
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="BR">Brazil</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="JP">Japan</option>
                    <option value="CN">China</option>
                    <option value="IN">India</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="FR">France</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    City
                  </label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="pt-6 border-t border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-emerald-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {activities.length > 0 ? (
                    activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            activity.severity === 'CRITICAL' ? 'bg-red-500/20' :
                            activity.severity === 'HIGH' ? 'bg-orange-500/20' :
                            activity.severity === 'MEDIUM' ? 'bg-amber-500/20' :
                            'bg-emerald-500/20'
                          }`}>
                            <Bell className={`w-4 h-4 ${
                              activity.severity === 'CRITICAL' ? 'text-red-400' :
                              activity.severity === 'HIGH' ? 'text-orange-400' :
                              activity.severity === 'MEDIUM' ? 'text-amber-400' :
                              'text-emerald-400'
                            }`} />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{activity.title}</p>
                            <p className="text-slate-400 text-xs">{activity.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">
                          {format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-8">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative backdrop-blur-xl bg-slate-800/50 border ${
                      plan.popular ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/20' : 'border-slate-700/50'
                    } rounded-2xl p-6 ${user?.plan === plan.id ? 'ring-2 ring-emerald-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full">
                          POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className={`inline-flex p-3 bg-gradient-to-r ${plan.color} rounded-xl mb-4`}>
                      {plan.icon}
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                    <div className="mb-4">
                      {plan.price === 0 ? (
                        <span className="text-3xl font-bold text-white">FREE</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-white">${plan.price}</span>
                          <span className="text-slate-400 ml-2">/month</span>
                        </>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={user?.plan === plan.id}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                        user?.plan === plan.id
                          ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg`
                      }`}
                    >
                      {user?.plan === plan.id ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200">
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">2FA Status</p>
                    <p className="text-sm text-slate-400">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {[
                { title: 'High Risk Alerts', description: 'Get notified of critical transactions' },
                { title: 'Daily Summary', description: 'Receive daily activity reports' },
                { title: 'New Features', description: 'Updates about new platform features' },
                { title: 'Security Alerts', description: 'Important security notifications' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">API Keys</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200">
                  Generate New Key
                </button>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-amber-400 text-sm">
                  <strong>Note:</strong> API access is available for Growth and Enterprise plans only.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Select Payment Method</h2>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white font-bold">{plans.find(p => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-400">Amount:</span>
                <span className="text-2xl font-bold text-emerald-400">
                  ${plans.find(p => p.id === selectedPlan)?.price}/mo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    paymentMethod === method.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-700/50 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-white font-medium">{method.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{method.description}</p>
                  <p className="text-xs text-emerald-400 mt-1">Fee: {method.fee}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handlePayment}
              disabled={!paymentMethod}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
            >
              Continue to Payment
            </button>
          </motion.div>
        </div>
      )}

      {/* Payment Processing Modal */}
      {showPaymentModal && paymentData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center">
              <div className="inline-flex p-4 bg-emerald-500/20 rounded-full mb-4">
                {paymentMethod === 'pix' && <Smartphone className="w-12 h-12 text-emerald-400" />}
                {paymentMethod === 'bitcoin' && <Bitcoin className="w-12 h-12 text-emerald-400" />}
                {(paymentMethod === 'ethereum' || paymentMethod === 'usdt') && <WalletIcon className="w-12 h-12 text-emerald-400" />}
                {!['pix', 'bitcoin', 'ethereum', 'usdt'].includes(paymentMethod) && <CreditCard className="w-12 h-12 text-emerald-400" />}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Complete Payment</h3>
              <div className="inline-flex items-center space-x-2 mb-4">
                <span className="text-3xl font-bold text-emerald-400">${paymentData.amount}</span>
                <span className="text-slate-400">USD</span>
              </div>

              {/* PIX Payment */}
              {paymentMethod === 'pix' && (
                <div className="space-y-4">
                  <p className="text-slate-400 mb-4">Scan the QR code with your banking app</p>
                  <div className="flex justify-center p-6 bg-white rounded-xl">
                    <QRCodeSVG
                      value={paymentData.pixCode}
                      size={Math.min(256, window.innerWidth - 120)}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">PIX Key</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white font-mono">{paymentData.pixKey}</p>
                      <button
                        onClick={() => copyToClipboard(paymentData.pixKey)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">PIX Code (Copy & Paste)</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white font-mono break-all text-left">{paymentData.pixCode.substring(0, 50)}...</p>
                      <button
                        onClick={() => copyToClipboard(paymentData.pixCode)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-all flex-shrink-0 ml-2"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bitcoin Payment */}
              {paymentMethod === 'bitcoin' && (
                <div className="space-y-4">
                  <p className="text-slate-400 mb-4">Send exactly {paymentData.amount_btc} BTC to the address below</p>
                  <div className="flex justify-center p-6 bg-white rounded-xl">
                    <QRCodeSVG
                      value={`bitcoin:${paymentData.address}?amount=${paymentData.amount_btc}`}
                      size={Math.min(256, window.innerWidth - 120)}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">Bitcoin Address</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white font-mono break-all text-left">{paymentData.address}</p>
                      <button
                        onClick={() => copyToClipboard(paymentData.address)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-all flex-shrink-0 ml-2"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-400 text-xs">
                      <strong>Important:</strong> Send exactly {paymentData.amount_btc} BTC. Network: Bitcoin (BTC)
                    </p>
                  </div>
                </div>
              )}

              {/* Ethereum Payment */}
              {paymentMethod === 'ethereum' && (
                <div className="space-y-4">
                  <p className="text-slate-400 mb-4">Send exactly {paymentData.amount_eth} ETH to the address below</p>
                  <div className="flex justify-center p-6 bg-white rounded-xl">
                    <QRCodeSVG
                      value={`ethereum:${paymentData.address}?value=${paymentData.amount_eth}`}
                      size={Math.min(256, window.innerWidth - 120)}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">Ethereum Address</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white font-mono break-all text-left">{paymentData.address}</p>
                      <button
                        onClick={() => copyToClipboard(paymentData.address)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-all flex-shrink-0 ml-2"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-400 text-xs">
                      <strong>Important:</strong> Send exactly {paymentData.amount_eth} ETH. Network: Ethereum (ERC20)
                    </p>
                  </div>
                </div>
              )}

              {/* USDT Payment */}
              {paymentMethod === 'usdt' && (
                <div className="space-y-4">
                  <p className="text-slate-400 mb-4">Send exactly {paymentData.amount_usdt} USDT to the address below</p>
                  <div className="flex justify-center p-6 bg-white rounded-xl">
                    <QRCodeSVG
                      value={paymentData.address}
                      size={Math.min(256, window.innerWidth - 120)}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2">USDT Address (ERC20)</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white font-mono break-all text-left">{paymentData.address}</p>
                      <button
                        onClick={() => copyToClipboard(paymentData.address)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-all flex-shrink-0 ml-2"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-400 text-xs">
                      <strong>Important:</strong> Send exactly {paymentData.amount_usdt} USDT. Network: {paymentData.network}
                    </p>
                  </div>
                </div>
              )}

              {/* Credit Card / Other Methods */}
              {!['pix', 'bitcoin', 'ethereum', 'usdt'].includes(paymentMethod) && (
                <div className="space-y-4">
                  <p className="text-slate-400 mb-4">Redirecting to payment processor...</p>
                  <div className="animate-pulse bg-slate-900/50 rounded-xl p-8">
                    <CreditCard className="w-16 h-16 text-slate-600 mx-auto" />
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-6">
                <button
                  onClick={processPayment}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30"
                >
                  I've Made the Payment
                </button>
                <button
                  onClick={() => { setShowPaymentModal(false); setPaymentData(null); }}
                  className="w-full py-3 bg-slate-700/50 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-all duration-200"
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
};

export default Account;
