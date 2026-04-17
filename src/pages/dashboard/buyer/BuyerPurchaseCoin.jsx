import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

  import { useAuth } from '../../../context/AuthContext';

import { paymentAPI } from '../../../utils/endpoints';
import { Coins, CreditCard } from 'lucide-react';
import '../../../styles/buyer-dashboard.css';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CoinPackage = ({ amount, coins, bonus, discountPercent, onSelect, isSelected }) => {
  return (
    <div className={`coin-package ${isSelected ? 'selected' : ''}`}>
      {discountPercent > 0 && <span className="discount-badge">-{discountPercent}%</span>}
      <div className="package-content">
        <h3>${amount}</h3>
        <div className="coins-display">
          <Coins size={24} />
          <span className="coins-amount">{coins} Coins</span>
        </div>
        {bonus > 0 && <p className="bonus">+ {bonus} Bonus Coins</p>}
        <button
          className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onSelect({ amount, coins: coins + bonus })}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
};

const PaymentForm = ({ selectedPackage, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!stripe || !elements) {
        toast.error('Payment system not ready');
        return;
      }


      // Dummy direct payment - no card needed
      const response = await paymentAPI.purchaseCoins({
        amount: selectedPackage.amount,
        coins: selectedPackage.coins
      });

      toast.success(`Successfully purchased ${selectedPackage.coins} coins!`);
      refreshUser();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      console.log('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <div className="form-group">
        <label>Card Details</label>
        <div className="card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <p className="payment-summary">
          Total Amount: <strong>${selectedPackage.amount}</strong>
        </p>
        <p className="coins-summary">
          You'll receive: <strong>{selectedPackage.coins} Coins</strong>
        </p>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : `Pay $${selectedPackage.amount}`}
        </button>
      </div>
    </form>
  );
};

const BuyerPurchaseCoin = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user, refreshUser } = useAuth();

  const coinPackages = [
    { amount: 5, coins: 50, bonus: 0, discountPercent: 0 },
    { amount: 10, coins: 110, bonus: 10, discountPercent: 10 },
    { amount: 25, coins: 285, bonus: 35, discountPercent: 12 },
    { amount: 50, coins: 600, bonus: 100, discountPercent: 20 },
  ];

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  return (
    <div className="buyer-purchase-coin">
      <div className="page-header">
        <h1>Purchase Coins</h1>
        <p>Get more coins to post tasks</p>
      </div>

      <div className="current-balance">
        <div className="balance-card">
          <Coins size={40} />
          <div>
            <p>Current Balance</p>
            <h2>{user?.coins || 0} Coins</h2>
          </div>
        </div>
      </div>

      <div className="coin-packages-section">
        <h2>Choose Your Package</h2>
        <p>More coins for less with larger packages</p>
        <div className="packages-grid">
          {coinPackages.map((pkg, idx) => (
            <CoinPackage
              key={idx}
              {...pkg}
              onSelect={handleSelectPackage}
              isSelected={selectedPackage?.amount === pkg.amount}
            />
          ))}
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do coins work?</h3>
            <p>Each task requires coins equal to (workers × amount per worker). Coins are deducted when the task is created.</p>
          </div>
          <div className="faq-item">
            <h3>Can I refund coins?</h3>
            <p>Coins purchased are non-refundable, but unused coins remain in your account indefinitely.</p>
          </div>
          <div className="faq-item">
            <h3>Are there payment plans?</h3>
            <p>We accept all major credit cards and offer secure payment processing via Stripe.</p>
          </div>
          <div className="faq-item">
            <h3>What if I need more?</h3>
            <p>You can purchase coins anytime. Bonus coins are instantly added to your account.</p>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedPackage && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Complete Payment</h2>
            <Elements stripe={stripePromise}>
              <PaymentForm
                selectedPackage={selectedPackage}
                onClose={() => setShowPaymentModal(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPurchaseCoin;
