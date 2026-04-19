import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { withdrawalAPI } from '../../../utils/endpoints';
import { useRefreshUser } from '../../../hooks/useRefreshUser';
import { AlertCircle, CheckCircle, Clock, DollarSign, Coins, CreditCard, History, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const WorkerWithdrawals = () => {
  const { user } = useAuth();
  const refreshUser = useRefreshUser();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const coinsToWithdraw = watch('coins_to_withdraw', 0);
  const withdrawAmount = Math.floor(coinsToWithdraw / 20);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await withdrawalAPI.getMyWithdrawals(page, 10);
        const withdrawalsData = response.withdrawals || response.data?.withdrawals || response.data || [];
        setWithdrawals(withdrawalsData);
      } catch (error) {
        console.error('Error fetching withdrawals:', error);
        toast.error('Failed to load withdrawal history');
        setWithdrawals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [page]);

  const onSubmit = async (data) => {
    const coinsToWithdrawNum = parseInt(data.coins_to_withdraw);
    
    if (isNaN(coinsToWithdrawNum)) {
      toast.error('Please enter a valid coin amount');
      return;
    }

    if (user?.coins < coinsToWithdrawNum) {
      toast.error(`Insufficient coins. You have ${user?.coins} coins`);
      return;
    }

    if (coinsToWithdrawNum < 200) {
      toast.error(`Minimum withdrawal is 200 coins ($10). You requested ${coinsToWithdrawNum} coins`);
      return;
    }

    try {
      const withdrawalData = {
        withdrawal_coin: coinsToWithdrawNum,
        payment_system: data.payment_system,
        account_number: data.account_number,
      };

      await withdrawalAPI.createWithdrawal(withdrawalData);
      toast.success('Withdrawal request submitted successfully!');
      
      // Refresh user data to update coin balance
      await refreshUser();
      
      // Reset form
      setValue('coins_to_withdraw', '');
      setValue('payment_system', '');
      setValue('account_number', '');
      
      // Refresh withdrawal list
      const response = await withdrawalAPI.getMyWithdrawals(1, 10);
      setWithdrawals(response.withdrawals || []);
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Withdrawal request failed';
      toast.error(errorMsg);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { icon: <Clock size={14} />, label: 'Pending', className: 'bg-yellow-500/20 text-yellow-600' },
      approved: { icon: <CheckCircle size={14} />, label: 'Approved', className: 'bg-green-500/20 text-green-600' },
      rejected: { icon: <AlertCircle size={14} />, label: 'Rejected', className: 'bg-red-500/20 text-red-600' },
    };
    const c = config[status?.toLowerCase()] || config.pending;
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${c.className}`}>{c.icon}{c.label}</span>;
  };

  const totalEarningUSD = Math.floor((user?.coins || 0) / 20);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <DollarSign size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Withdrawals</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Withdrawals</h1>
        <p className="text-base-content/60 mt-1">Convert your coins to real money</p>
      </div>

      {/* Available Balance Card */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Available Balance</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Coins size={24} />
                <span className="text-3xl font-bold">{user?.coins?.toLocaleString() || 0}</span>
                <span className="text-white/80">coins</span>
              </div>
              <span className="text-white/50">|</span>
              <div className="flex items-center gap-1">
                <DollarSign size={24} />
                <span className="text-3xl font-bold">{totalEarningUSD}</span>
                <span className="text-white/80">USD</span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-white/80">Min. Withdrawal</p>
            <p className="font-bold">200 coins ($10)</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Withdrawal Form */}
        <div className="bg-base-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-base-content mb-5 flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            Make a Withdrawal Request
          </h2>

          {user?.coins < 200 ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-600">Insufficient coins for withdrawal</p>
                <p className="text-sm text-yellow-600/70">Minimum: 200 coins ($10). You have: {user?.coins || 0} coins</p>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Coins to Withdraw */}
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Coins to Withdraw</label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input
                      {...register('coins_to_withdraw', {
                        required: 'Please enter amount',
                        min: { value: 200, message: 'Minimum 200 coins' },
                        max: { value: user?.coins, message: `Maximum ${user?.coins} coins` },
                      })}
                      type="number"
                      placeholder="Enter coins amount"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-base-content/40 mt-1">Available: {user?.coins} coins</p>
                  {errors.coins_to_withdraw && (
                    <p className="text-red-500 text-xs mt-1">{errors.coins_to_withdraw.message}</p>
                  )}
                </div>

                {/* Withdrawal Amount */}
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Withdrawal Amount (USD)</label>
                  <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                    <DollarSign size={20} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">{withdrawAmount}</span>
                    <span className="text-sm text-base-content/50 ml-auto">Conversion: 20 coins = $1</span>
                  </div>
                </div>

                {/* Payment System */}
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Payment System</label>
                  <select
                    {...register('payment_system', { required: 'Please select payment system' })}
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
                  >
                    <option value="">Select payment system</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                  </select>
                  {errors.payment_system && (
                    <p className="text-red-500 text-xs mt-1">{errors.payment_system.message}</p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Account Number / Email</label>
                  <input
                    {...register('account_number', { required: 'Please enter account information' })}
                    type="text"
                    placeholder="Enter your account details"
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
                  />
                  {errors.account_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.account_number.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || user?.coins < 200}
                  className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : `Withdraw $${withdrawAmount}`}
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-xs text-base-content/70 flex items-start gap-2">
                  <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Your withdrawal request will be processed within 24-48 hours. Admin approval is required.</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right: Withdrawal History */}
        <div className="bg-base-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-base-content mb-5 flex items-center gap-2">
            <History size={20} className="text-primary" />
            Withdrawal History
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <History size={48} className="mx-auto text-base-content/20 mb-3" />
              <p className="text-base-content/50">No withdrawal requests yet</p>
              <p className="text-xs text-base-content/30 mt-1">Your withdrawal history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal._id} className="bg-base-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-lg font-bold text-primary">${withdrawal.withdrawal_amount}</p>
                      <p className="text-xs text-base-content/40">{new Date(withdrawal.withdraw_date).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(withdrawal.status)}
                  </div>
                  <p className="text-sm text-base-content/60 mt-2">
                    <span className="font-medium">{withdrawal.payment_system}</span> • {withdrawal.withdrawal_coin} coins
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-base-200 rounded-2xl p-5">
        <h3 className="font-bold text-base-content mb-3 flex items-center gap-2">
          <Info size={18} className="text-primary" />
          Withdrawal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>Minimum withdrawal: 200 coins ($10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>Maximum withdrawal: Your available balance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>Conversion rate: 20 coins = $1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>Processing time: 24-48 hours after admin approval</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerWithdrawals;