import React, { useEffect, useState } from 'react';
import { withdrawalAPI } from '../../../utils/endpoints';
import { CheckCircle, XCircle, Clock, DollarSign, User, Mail, Calendar, Search, AlertCircle, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  useEffect(() => {
    fetchPendingWithdrawals();
  }, [page, limit]);

  const fetchPendingWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await withdrawalAPI.getPendingWithdrawals(page, limit);
      setWithdrawals(response.withdrawals || []);
      setTotalWithdrawals(response.total || 0);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId) => {
    if (window.confirm('Approve this withdrawal request? This will deduct coins from the worker\'s account.')) {
      try {
        await withdrawalAPI.approveWithdrawal(withdrawalId);
        toast.success('Withdrawal approved successfully!');
        fetchPendingWithdrawals();
        setSelectedWithdrawal(null);
      } catch (error) {
        console.error('Error approving withdrawal:', error);
        toast.error('Failed to approve withdrawal');
      }
    }
  };

  const handleReject = async (withdrawalId) => {
    if (window.confirm('Are you sure you want to reject this withdrawal request?')) {
      try {
        await withdrawalAPI.rejectWithdrawal(withdrawalId);
        toast.success('Withdrawal rejected');
        fetchPendingWithdrawals();
        setSelectedWithdrawal(null);
      } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        toast.error('Failed to reject withdrawal');
      }
    }
  };

  const getPaymentSystemIcon = (system) => {
    const icons = {
      Stripe: '💳',
      PayPal: '💰',
      Bkash: '📱',
      Rocket: '🚀',
      Nagad: '⭐',
    };
    return icons[system] || '💵';
  };

  const filteredWithdrawals = withdrawals.filter(
    (w) =>
      w.workerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.workerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
  const totalPages = Math.ceil(totalWithdrawals / limit);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Clock size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Withdrawal Management</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Manage Withdrawals</h1>
        <p className="text-base-content/60 mt-1">Review and process worker withdrawal requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-base-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Pending Requests</p>
              <p className="text-2xl font-bold text-base-content">{totalWithdrawals}</p>
            </div>
          </div>
        </div>
        <div className="bg-base-200 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total Pending Amount</p>
              <p className="text-2xl font-bold text-base-content">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
        <input
          type="text"
          placeholder="Search by worker name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Withdrawals Table */}
      <div className="bg-base-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-base-content/20 mb-3" />
            <p className="text-base-content/50">No pending withdrawal requests</p>
            <p className="text-xs text-base-content/30 mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Worker</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Coins</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Payment Method</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Requested</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {filteredWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-base-100 transition-colors cursor-pointer" onClick={() => setSelectedWithdrawal(withdrawal)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {withdrawal.workerName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-base-content">{withdrawal.workerName}</p>
                          <p className="text-xs text-base-content/40">{withdrawal.workerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-green-600 text-lg">${withdrawal.amount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-primary font-semibold">{withdrawal.withdrawalCoin?.toLocaleString()} coins</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{getPaymentSystemIcon(withdrawal.paymentSystem)}</span>
                        <span className="text-sm">{withdrawal.paymentSystem}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-base-content/40" />
                        <span className="text-sm">{new Date(withdrawal.requestedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-600">
                        Pending
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-600 transition-colors"
                          onClick={() => handleApprove(withdrawal._id)}
                          title="Approve withdrawal"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                          onClick={() => handleReject(withdrawal._id)}
                          title="Reject withdrawal"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-base-content/60">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-base-200 rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-5 border-b border-base-300">
              <h3 className="text-xl font-bold text-base-content">Withdrawal Details</h3>
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="p-1 rounded-lg hover:bg-base-300 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                  {selectedWithdrawal.workerName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">{selectedWithdrawal.workerName}</h4>
                  <p className="text-sm text-base-content/60">{selectedWithdrawal.workerEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Amount</label>
                  <p className="mt-1 font-bold text-green-600 text-xl">${selectedWithdrawal.amount}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Coins Deducted</label>
                  <p className="mt-1 font-semibold text-primary">{selectedWithdrawal.withdrawalCoin?.toLocaleString()} coins</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Payment System</label>
                  <p className="mt-1 flex items-center gap-1">
                    <span className="text-lg">{getPaymentSystemIcon(selectedWithdrawal.paymentSystem)}</span>
                    {selectedWithdrawal.paymentSystem}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Account Number</label>
                  <p className="mt-1 text-sm">{selectedWithdrawal.bankAccount}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Requested Date</label>
                  <p className="mt-1 text-sm">{new Date(selectedWithdrawal.requestedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-base-300">
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-base-300 hover:bg-base-300 transition-colors"
                onClick={() => setSelectedWithdrawal(null)}
              >
                Close
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => handleApprove(selectedWithdrawal._id)}
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => handleReject(selectedWithdrawal._id)}
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWithdrawals;