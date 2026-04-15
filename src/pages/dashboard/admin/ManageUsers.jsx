import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../utils/endpoints';
import { Trash2, Edit2, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import '../../../styles/admin-dashboard.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, limit, filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers(page, limit, filterRole);
      setUsers(response.users || []);
      setTotalUsers(response.total || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleUpdateRole = async (userId) => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }
    try {
      await adminAPI.updateUserRole(userId, { role: newRole });
      toast.success('User role updated successfully');
      setEditingUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="manage-container">
      <div className="page-title">
        <h1>Manage Users</h1>
        <p>View and manage all platform users</p>
      </div>

      <div className="management-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Roles</option>
            <option value="worker">Worker</option>
            <option value="buyer">Buyer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-data">No users found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="name-cell">
                    <div className="user-avatar">{user.name?.charAt(0)}</div>
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingUser(user._id);
                        setNewRole(user.role);
                      }}
                      title="Edit role"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change User Role</h3>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="modal-select"
            >
              <option value="">Select a role</option>
              <option value="worker">Worker</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setEditingUser(null);
                  setNewRole('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={() => handleUpdateRole(editingUser)}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ManageUsers;
