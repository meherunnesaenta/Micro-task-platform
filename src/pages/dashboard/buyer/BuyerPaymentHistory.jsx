import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../../utils/endpoints';
import { Download, Eye, X, DollarSign, CreditCard, Calendar, Hash, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const BuyerPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAmount: 0,
  });
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, [pagination.currentPage]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getHistory(pagination.currentPage, 10);
      setPayments(response.payments || []);
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalAmount: response.totalAmount || 0,
      });
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { icon: <CheckCircle size={14} />, label: 'Completed', className: 'bg-green-500/20 text-green-600' },
      pending: { icon: <Clock size={14} />, label: 'Pending', className: 'bg-yellow-500/20 text-yellow-600' },
      failed: { icon: <AlertCircle size={14} />, label: 'Failed', className: 'bg-red-500/20 text-red-600' },
      refunded: { icon: <CheckCircle size={14} />, label: 'Refunded', className: 'bg-blue-500/20 text-blue-600' },
    };
    const c = config[status?.toLowerCase()] || config.pending;
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${c.className}`}>{c.icon}{c.label}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base-content/60">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <CreditCard size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Payment History</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Payment History</h1>
        <p className="text-base-content/60 mt-1">View all your coin purchase transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-base-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign size={24} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total Spent</p>
              <p className="text-2xl font-bold text-base-content">${pagination.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-base-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total Transactions</p>
              <p className="text-2xl font-bold text-base-content">{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <CreditCard size={48} className="mx-auto text-base-content/20 mb-3" />
          <h2 className="text-xl font-bold text-base-content mb-2">No payment history</h2>
          <p className="text-base-content/60">You haven't made any purchases yet</p>
        </div>
      ) : (
        <>
          <div className="bg-base-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Coins</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Bonus</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-base-100 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-base-content/40" />
                          <span className="text-sm">{formatShortDate(payment.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-green-500" />
                          <span className="font-semibold">${payment.amount.toFixed(2)}</span>
                        </div>
                       </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary">{payment.coins} coins</span>
                       </td>
                      <td className="px-4 py-3">
                        {payment.bonus_coins > 0 ? (
                          <span className="text-green-600">+{payment.bonus_coins}</span>
                        ) : (
                          <span className="text-base-content/40">-</span>
                        )}
                       </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-base-content/60">{payment.transaction_id?.substring(0, 12)}...</span>
                       </td>
                      <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            onClick={() => setSelectedPayment(payment)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Download Receipt"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-base-content/60">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedPayment(null)}>
          <div className="bg-base-200 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-base-300">
              <h2 className="text-xl font-bold text-base-content">Payment Receipt</h2>
              <button onClick={() => setSelectedPayment(null)} className="p-1 rounded-lg hover:bg-base-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-base-300">
                <span className="text-base-content/60">Date:</span>
                <span className="font-medium text-base-content">{formatDate(selectedPayment.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-base-300">
                <span className="text-base-content/60">Amount:</span>
                <span className="font-bold text-green-600 text-lg">${selectedPayment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-base-300">
                <span className="text-base-content/60">Coins Purchased:</span>
                <span className="font-medium text-primary">{selectedPayment.coins} coins</span>
              </div>
              {selectedPayment.bonus_coins > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-base-300">
                  <span className="text-base-content/60">Bonus Coins:</span>
                  <span className="font-medium text-green-600">+{selectedPayment.bonus_coins} coins</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-3 border-b border-base-300">
                <span className="text-base-content/60">Total Coins:</span>
                <span className="font-bold text-primary text-lg">{selectedPayment.coins + (selectedPayment.bonus_coins || 0)} coins</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-base-300">
                <span className="text-base-content/60">Transaction ID:</span>
                <span className="text-xs font-mono text-base-content/70">{selectedPayment.transaction_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Status:</span>
                {getStatusBadge(selectedPayment.status)}
              </div>
            </div>
            <div className="p-5 border-t border-base-300">
              <button className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Download size={16} /> Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPaymentHistory;