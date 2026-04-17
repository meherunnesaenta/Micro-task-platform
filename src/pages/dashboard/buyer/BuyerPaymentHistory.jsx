import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../../utils/endpoints';
import { Download, Eye } from 'lucide-react';
import '../../../styles/buyer-dashboard.css';
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
      const response = await paymentAPI.getPaymentHistory(pagination.currentPage, 10);
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

  const getStatusColor = (status) => {
    const colors = {
      completed: 'completed',
      pending: 'pending',
      failed: 'failed',
      refunded: 'refunded',
    };
    return colors[status] || 'pending';
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

  if (loading) {
    return <div className="loading">Loading payment history...</div>;
  }

  return (
    <div className="buyer-payment-history">
      <div className="page-header">
        <h1>Payment History</h1>
        <p>View all your coin purchase transactions</p>
      </div>

      <div className="payment-stats">
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="amount">${pagination.totalAmount.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="amount">{payments.length}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <h2>No payment history</h2>
          <p>You haven't made any purchases yet</p>
        </div>
      ) : (
        <>
          <div className="payment-table-container">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Coins Purchased</th>
                  <th>Bonus Coins</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td className="amount">${payment.amount.toFixed(2)}</td>
                    <td>{payment.coins}</td>
                    <td>{payment.bonus_coins || 0}</td>
                    <td className="transaction-id">
                      <span>{payment.transaction_id?.substring(0, 12)}...</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn view"
                        onClick={() => setSelectedPayment(payment)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={`#download-${payment._id}`}
                        className="action-btn download"
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span>{pagination.currentPage} of {pagination.totalPages}</span>
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Receipt</h2>
              <button className="close-btn" onClick={() => setSelectedPayment(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="receipt-item">
                <span>Date:</span>
                <span>{formatDate(selectedPayment.createdAt)}</span>
              </div>
              <div className="receipt-item">
                <span>Amount:</span>
                <span>${selectedPayment.amount.toFixed(2)}</span>
              </div>
              <div className="receipt-item">
                <span>Coins:</span>
                <span>{selectedPayment.coins}</span>
              </div>
              <div className="receipt-item">
                <span>Bonus Coins:</span>
                <span>{selectedPayment.bonus_coins || 0}</span>
              </div>
              <div className="receipt-item">
                <span>Total Coins:</span>
                <span>{selectedPayment.coins + (selectedPayment.bonus_coins || 0)}</span>
              </div>
              <div className="receipt-item">
                <span>Transaction ID:</span>
                <span>{selectedPayment.transaction_id}</span>
              </div>
              <div className="receipt-item">
                <span>Status:</span>
                <span className={`status-badge ${getStatusColor(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPaymentHistory;
