import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../../../context/AuthContext';
import { paymentAPI } from '../../../utils/endpoints';
import { Coins, CreditCard, Zap, Shield, Award, X, Lock, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy');

const CoinPackage = ({ amount, coins, bonus, discountPercent, onSelect, isSelected }) => {
  const totalCoins = coins + bonus;
  const pricePerCoin = (amount / totalCoins).toFixed(2);
  
  return (
    <div className={`relative bg-base-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
      isSelected ? 'ring-2 ring-primary shadow-lg' : ''
    }`} onClick={() => onSelect({ amount, coins: totalCoins, bonus })}>
      {discountPercent > 0 && (
        <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Save {discountPercent}%
        </div>
      )}
      <div className="text-center">
        <div className="text-3xl font-bold text-base-content mb-2">${amount}</div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins size={20} className="text-primary" />
          <span className="text-2xl font-bold text-primary">{totalCoins}</span>
          <span className="text-sm text-base-content/50">coins</span>
        </div>
        {bonus > 0 && (
          <p className="text-xs text-green-600 mb-2">+{bonus} bonus coins</p>
        )}
        <p className="text-xs text-base-content/40 mb-4">${pricePerCoin}/coin</p>
        <button className={`w-full py-2 rounded-lg font-medium transition-colors ${
          isSelected 
            ? 'bg-primary text-white' 
            : 'bg-base-100 text-base-content hover:bg-primary/10'
        }`}>
          {isSelected ? 'Selected' : 'Select Package'}
        </button>
      </div>
    </div>
  );
};

// ✅ Fixed PaymentForm
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

      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        toast.error('Card element not found');
        return;
      }

      // Create payment method from card element
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }


      // Send to backend for coin purchase
      const response = await paymentAPI.purchaseCoins({
        amount: selectedPackage.amount,
        coins: selectedPackage.coins,
        paymentMethodId: paymentMethod.id
      });



      toast.success(`Successfully purchased ${selectedPackage.coins} coins!`);
      
      // Refresh user data to update coin balance
      await refreshUser();
      
      // Close modal
      onClose();
      
      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-base-content/80 mb-2">Card Details</label>
        <div className="p-3 rounded-lg bg-base-100 border border-base-300">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1a1f2e',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>
        <p className="text-xs text-base-content/40 mt-2">Test card: 4242 4242 4242 4242</p>
      </div>

      <div className="bg-primary/10 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-base-content/60">Total Amount:</span>
          <span className="font-bold text-primary">${selectedPackage.amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-base-content/60">You'll receive:</span>
          <span className="font-bold text-primary">{selectedPackage.coins} Coins</span>
        </div>
        {selectedPackage.bonus > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/60">Bonus Coins:</span>
            <span className="font-bold text-green-600">+{selectedPackage.bonus}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button 
          type="button" 
          className="flex-1 px-4 py-2 rounded-lg border border-base-300 hover:bg-base-300 transition-colors" 
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" 
          disabled={loading || !stripe}
        >
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
    { amount: 5, coins: 50, bonus: 0, discountPercent: 0, popular: false },
    { amount: 10, coins: 110, bonus: 10, discountPercent: 10, popular: true },
    { amount: 25, coins: 285, bonus: 35, discountPercent: 12, popular: false },
    { amount: 50, coins: 600, bonus: 100, discountPercent: 20, popular: false },
  ];

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <CreditCard size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Purchase Coins</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Purchase Coins</h1>
        <p className="text-base-content/60 mt-1">Get more coins to post tasks</p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full p-3">
            <Coins size={32} className="text-white" />
          </div>
          <div>
            <p className="text-white/80 text-sm">Current Balance</p>
            <p className="text-3xl font-bold">{user?.coins?.toLocaleString() || 0} Coins</p>
          </div>
        </div>
      </div>

      {/* Coin Packages */}
      <div>
        <h2 className="text-xl font-bold text-base-content mb-2 flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          Choose Your Package
        </h2>
        <p className="text-base-content/60 mb-5">More coins for less with larger packages</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coinPackages.map((pkg, idx) => (
            <div key={idx} className="relative">
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} /> Most Popular
                  </span>
                </div>
              )}
              <CoinPackage
                {...pkg}
                onSelect={handleSelectPackage}
                isSelected={selectedPackage?.amount === pkg.amount}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-base-200 rounded-xl p-4 text-center">
          <Shield size={24} className="mx-auto text-primary mb-2" />
          <h3 className="font-semibold text-base-content">Secure Payment</h3>
          <p className="text-xs text-base-content/50">256-bit SSL encryption</p>
        </div>
        <div className="bg-base-200 rounded-xl p-4 text-center">
          <Zap size={24} className="mx-auto text-primary mb-2" />
          <h3 className="font-semibold text-base-content">Instant Delivery</h3>
          <p className="text-xs text-base-content/50">Coins added instantly</p>
        </div>
        <div className="bg-base-200 rounded-xl p-4 text-center">
          <Award size={24} className="mx-auto text-primary mb-2" />
          <h3 className="font-semibold text-base-content">Bonus Coins</h3>
          <p className="text-xs text-base-content/50">Extra coins on larger packs</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-base-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-base-content mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-base-content mb-1">How do coins work?</h3>
            <p className="text-sm text-base-content/60">Each task requires coins equal to (workers × amount per worker). Coins are deducted when the task is created.</p>
          </div>
          <div>
            <h3 className="font-semibold text-base-content mb-1">Can I refund coins?</h3>
            <p className="text-sm text-base-content/60">Coins purchased are non-refundable, but unused coins remain in your account indefinitely.</p>
          </div>
          <div>
            <h3 className="font-semibold text-base-content mb-1">Are there payment plans?</h3>
            <p className="text-sm text-base-content/60">We accept all major credit cards and offer secure payment processing via Stripe.</p>
          </div>
          <div>
            <h3 className="font-semibold text-base-content mb-1">What if I need more?</h3>
            <p className="text-sm text-base-content/60">You can purchase coins anytime. Bonus coins are instantly added to your account.</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-base-200 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-base-300">
              <h2 className="text-xl font-bold text-base-content">Complete Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-lg hover:bg-base-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <div className="bg-primary/10 rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-sm text-base-content/60">Package:</span>
                <span className="font-bold text-primary">{selectedPackage.coins} Coins</span>
              </div>
              <Elements stripe={stripePromise}>
                <PaymentForm selectedPackage={selectedPackage} onClose={() => setShowPaymentModal(false)} />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPurchaseCoin;