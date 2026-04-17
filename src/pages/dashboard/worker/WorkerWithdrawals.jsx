import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { withdrawalAPI } from '../../../utils/endpoints';
import { AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import '../../../styles/withdrawals.css';

const WorkerWithdrawals = () => {
  const { user, refreshUser } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const coinsToWithdraw = watch('coins_to_withdraw', 0);
  const withdrawAmount = Math.floor(coinsToWithdraw / 20);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await withdrawalAPI.getMyWithdrawals(page, 10);
        setWithdrawals(response.withdrawals || []);
      } catch (error) {
        console.error('Error fetching withdrawals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [page]);

  const onSubmit = async (data) => {
    if (user.coins < parseInt(data.coins_to_withdraw)) {
      toast.error('Insufficient coins');
      return;
    }

    if (parseInt(data.coins_to_withdraw) < 200) {
      toast.error('Minimum withdrawal is 200 coins ($10)');
      return;
    }

    try {
      const withdrawalData = {
        withdrawal_coin: parseInt(data.coins_to_withdraw),
        payment_system: data.payment_system,
        account_number: data.account_number,
      };

      await withdrawalAPI.createWithdrawal(withdrawalData);
      toast.success('Withdrawal request submitted successfully!');
      await refreshUser();
      // Reset form and refresh list
    } catch (error) {
      toast.error(error.message || 'Withdrawal request failed');
    }
  };

  return (
    <div className="withdrawals-page">
      <div className="page-header">
        <h1>Withdrawals</h1>
        <p>Convert your coins to real money</p>
      </div>

      <div className="withdrawals-grid">
        {/* Left: Withdrawal Form */}
        <div className="withdrawal-form-card">
          <h2>Make a Withdrawal Request</h2>

          {user.coins < 200 ? (
            <div className="insufficient-banner">
              <AlertCircle size={20} />
              <div>
                <p>Insufficient coins for withdrawal</p>
                <small>Minimum: 200 coins ($10). You have: {user.coins} coins</small>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="withdrawal-form">
                {/* Coins to Withdraw */}
                <div className="form-group">
                  <label>Coins to Withdraw</label>
                  <div className="input-with-info">
                    <input
                      {...register('coins_to_withdraw', {
                        required: 'Please enter amount',
                        min: { value: 200, message: 'Minimum 200 coins' },
                        max: {
                          value: user.coins,
                          message: `Maximum ${user.coins} coins`,
                        },
                      })}
                      type="number"
                      placeholder="Enter coins amount"
                      className="form-input"
                    />
                    <p className="info-text">Available: {user.coins} coins</p>
                  </div>
                  {errors.coins_to_withdraw && (
                    <p className="error-text">
                      {errors.coins_to_withdraw.message}
                    </p>
                  )}
                </div>

                {/* Withdrawal Amount (Read-only) */}
                <div className="form-group">
                  <label>Withdrawal Amount (USD)</label>
                  <div className="amount-display">
                    <DollarSign size={20} />
                    <span className="amount-value">{withdrawAmount}</span>
                  </div>
                  <p className="conversion-info">Conversion: 20 coins = $1</p>
                </div>

                {/* Payment System */}
                <div className="form-group">
                  <label>Payment System</label>
                  <select
                    {...register('payment_system', {
                      required: 'Please select payment system',
                    })}
                    className="form-select"
                  >
                    <option value="">Select payment system</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                  {errors.payment_system && (
                    <p className="error-text">{errors.payment_system.message}</p>
                  )}
                </div>

                {/* Account Number */}
                <div className="form-group">
                  <label>Account Number / Email</label>
                  <input
                    {...register('account_number', {
                      required: 'Please enter account information',
                    })}
                    type="text"
                    placeholder="Enter your account details"
                    className="form-input"
                  />
                  {errors.account_number && (
                    <p className="error-text">{errors.account_number.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || user.coins < 200}
                  className="withdraw-btn"
                >
                  {isSubmitting ? 'Processing...' : `Withdraw $${withdrawAmount}`}
                </button>
              </form>

              <div className="withdrawal-note">
                <p>
                  <strong>Note:</strong> Your withdrawal request will be processed
                  within 24-48 hours. Admin approval is required.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right: Withdrawal History */}
        <div className="withdrawal-history-card">
          <h2>Withdrawal History</h2>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : withdrawals.length === 0 ? (
            <p className="empty-text">No withdrawal requests yet</p>
          ) : (
            <div className="withdrawal-list">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className={`withdrawal-item status-${withdrawal.status}`}
                >
                  <div className="withdrawal-header">
                    <div>
                      <p className="withdrawal-amount">
                        ${withdrawal.withdrawal_amount}
                      </p>
                      <p className="withdrawal-date">
                        {new Date(withdrawal.withdraw_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="withdrawal-status">
                      {withdrawal.status === 'pending' && (
                        <>
                          <Clock size={16} />
                          <span>Pending</span>
                        </>
                      )}
                      {withdrawal.status === 'approved' && (
                        <>
                          <CheckCircle size={16} />
                          <span>Approved</span>
                        </>
                      )}
                      {withdrawal.status === 'rejected' && (
                        <>
                          <AlertCircle size={16} />
                          <span>Rejected</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="withdrawal-system">
                    {withdrawal.payment_system}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="withdrawal-info">
        <h3>Withdrawal Information</h3>
        <ul>
          <li>Minimum withdrawal: 200 coins ($10)</li>
          <li>Maximum withdrawal: Your available balance</li>
          <li>Conversion rate: 20 coins = $1</li>
          <li>Processing time: 24-48 hours after admin approval</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkerWithdrawals;
