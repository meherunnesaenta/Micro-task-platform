import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../utils/endpoints';
import { Trash2, Edit2, Search, Filter, User, Mail, Calendar, Shield, X, Check, Users } from 'lucide-react';
import { toast } from 'react-toastify';

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
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers(page, limit, filterRole);
      
      
      
      const usersData = response.users || response.data?.users || response.data || [];
      const totalData = response.total || response.data?.total || 0;
      
      setUsers(usersData);
      setTotalUsers(totalData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
        setSelectedUser(null);
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
      toast.success(`User role updated to ${newRole}`);
      setEditingUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      worker: { label: 'Worker', className: 'bg-blue-500/20 text-blue-600' },
      buyer: { label: 'Buyer', className: 'bg-green-500/20 text-green-600' },
      admin: { label: 'Admin', className: 'bg-purple-500/20 text-purple-600' },
    };
    const config = roleConfig[role?.toLowerCase()] || roleConfig.worker;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}>{config.label}</span>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-500/20 text-green-600' },
      inactive: { label: 'Inactive', className: 'bg-gray-500/20 text-gray-600' },
      suspended: { label: 'Suspended', className: 'bg-red-500/20 text-red-600' },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}>{config.label}</span>;
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Users size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">User Management</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Manage Users</h1>
        <p className="text-base-content/60 mt-1">View and manage all platform users</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-4 py-2.5 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none appearance-none"
            >
              <option value="">All Roles</option>
              <option value="worker">Worker</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="px-4 py-2.5 rounded-lg bg-primary/10 flex items-center gap-2">
            <span className="text-sm font-medium text-primary">Total: {totalUsers}</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-base-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-base-content/20 mb-3" />
            <p className="text-base-content/50">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Coins</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-base-100 transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-base-content">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Mail size={12} className="text-base-content/40" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                    <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary">{user.coins?.toLocaleString() || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-base-content/40" />
                        <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          onClick={() => {
                            setEditingUser(user._id);
                            setNewRole(user.role);
                          }}
                          title="Edit role"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
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

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-base-200 rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-5 border-b border-base-300">
              <h3 className="text-xl font-bold text-base-content">Change User Role</h3>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setNewRole('');
                }}
                className="p-1 rounded-lg hover:bg-base-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-base-content/80 mb-2">Select New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
              >
                <option value="">Select a role</option>
                <option value="worker">Worker</option>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 p-5 border-t border-base-300">
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-base-300 hover:bg-base-300 transition-colors"
                onClick={() => {
                  setEditingUser(null);
                  setNewRole('');
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                onClick={() => handleUpdateRole(editingUser)}
              >
                <Check size={16} /> Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-base-200 rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-5 border-b border-base-300">
              <h3 className="text-xl font-bold text-base-content">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg hover:bg-base-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">{selectedUser.name}</h4>
                  <p className="text-sm text-base-content/60">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Role</label>
                  <p className="mt-1">{getRoleBadge(selectedUser.role)}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Status</label>
                  <p className="mt-1">{getStatusBadge(selectedUser.status)}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Coins</label>
                  <p className="mt-1 font-semibold text-primary">{selectedUser.coins?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Joined</label>
                  <p className="mt-1 text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-base-300">
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-base-300 hover:bg-base-300 transition-colors"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  handleDeleteUser(selectedUser._id);
                  setSelectedUser(null);
                }}
              >
                <Trash2 size={16} /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;