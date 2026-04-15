import React, { useEffect, useState } from 'react';
import { withdrawalAPI } from '../../../utils/endpoints';
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import '../../../styles/admin-dashboard.css';

const ManageWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

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
    try {
      await withdrawalAPI.approveWithdrawal(withdrawalId);
      toast.success('Withdrawal approved successfully');
      fetchPendingWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast.error('Failed to approve withdrawal');
    }
  };

  const handleReject = async (withdrawalId) => {
    if (window.confirm('Are you sure you want to reject this withdrawal?')) {
      try {
        await withdrawalAPI.rejectWithdrawal(withdrawalId);
        toast.success('Withdrawal rejected successfully');
        fetchPendingWithdrawals();
      } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        toast.error('Failed to reject withdrawal');
      }
    }
  };

  const totalPages = Math.ceil(totalWithdrawals / limit);

  // Calculate statistics
  const totalAmount = withdrawals.reduce(
    (sum, w) => sum + (w.amount || 0),
    0
  );

  return (
    <div className="manage-container">
      <div className="page-title">
        <h1>Manage Withdrawals</h1>
        <p>Review and process worker withdrawal requests</p>
      </div>

      <div className="withdrawal-stats">
        <div className="stat-box">
          <Clock size={24} className="icon" />
          <div>
            <p>Pending Requests</p>
            <h3>{totalWithdrawals}</h3>
          </div>
        </div>
        <div className="stat-box">
          <DollarSign size={24} className="icon" />
          <div>
            <p>Total Amount</p>
            <h3>${totalAmount.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="no-data">No pending withdrawal requests</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Bank Account</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id}>
                  <td className="name-cell">
                    <div className="user-avatar">
                      {withdrawal.workerName?.charAt(0)}
                    </div>
                    {withdrawal.workerName}
                  </td>
                  <td>{withdrawal.workerEmail}</td>
                  <td className="amount-cell">
                    <strong>${withdrawal.amount}</strong>
                  </td>
                  <td className="account-cell">
                    {withdrawal.bankAccount || 'N/A'}
                  </td>
                  <td>
                    {new Date(withdrawal.requestedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge ${withdrawal.status}`}>
                      {withdrawal.status || 'Pending'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {withdrawal.status === 'pending' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(withdrawal._id)}
                          title="Approve withdrawal"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(withdrawal._id)}
                          title="Reject withdrawal"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="btn-pagination"
        >
          Previous
        </button>
        <span className="page-info">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="btn-pagination"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageWithdrawals;
