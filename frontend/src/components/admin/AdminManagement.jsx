import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  Eye,
  EyeOff,
  Calendar,
  Mail,
  UserCheck,
  UserX,
  Settings,
  Crown,
  AlertTriangle
} from 'lucide-react';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'moderator',
    permissions: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const adminRoles = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-red-100 text-red-800', icon: Crown },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800', icon: ShieldCheck },
    { value: 'moderator', label: 'Moderator', color: 'bg-blue-100 text-blue-800', icon: Shield },
    { value: 'support', label: 'Support', color: 'bg-green-100 text-green-800', icon: UserCheck }
  ];

  const permissionsList = [
    { id: 'user_management', label: 'User Management', description: 'Create, edit, delete users' },
    { id: 'job_management', label: 'Job Management', description: 'Approve, reject, edit jobs' },
    { id: 'company_management', label: 'Company Management', description: 'Manage company profiles' },
    { id: 'application_management', label: 'Application Management', description: 'View and manage applications' },
    { id: 'category_management', label: 'Category Management', description: 'Create and manage job categories' },
    { id: 'report_management', label: 'Report Management', description: 'Handle user reports and violations' },
    { id: 'analytics_access', label: 'Analytics Access', description: 'View dashboard analytics and reports' },
    { id: 'system_settings', label: 'System Settings', description: 'Modify system configurations' },
    { id: 'admin_management', label: 'Admin Management', description: 'Create and manage other admins' }
  ];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${ADMIN_API_END_POINT}/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAdmins(response.data.admins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!editingAdmin) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = editingAdmin 
        ? `${ADMIN_API_END_POINT}/admins/${editingAdmin._id}`
        : `${ADMIN_API_END_POINT}/create-admin`;
      
      const method = editingAdmin ? 'put' : 'post';
      const payload = editingAdmin 
        ? { name: formData.name, email: formData.email, role: formData.role, permissions: formData.permissions }
        : formData;

      const response = await axios[method](endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchAdmins();
        resetForm();
        setShowCreateForm(false);
        setEditingAdmin(null);
      }
    } catch (error) {
      console.error('Error saving admin:', error);
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      }
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this admin? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${ADMIN_API_END_POINT}/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (error) {
      toast.error('Could not remove admin. Please try again.');
      console.error('Error deleting admin:', error);
    }
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${ADMIN_API_END_POINT}/admins/${adminId}/status`, {
        isActive: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'moderator',
      permissions: []
    });
    setErrors({});
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      confirmPassword: '',
      role: admin.role,
      permissions: admin.permissions || []
    });
    setShowCreateForm(true);
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getRoleInfo = (role) => {
    return adminRoles.find(r => r.value === role) || adminRoles[2];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600 mt-2">Manage system administrators and their permissions</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingAdmin(null);
              setShowCreateForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add New Admin
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter admin's full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="admin@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {!editingAdmin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Minimum 8 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password *
                          </label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Confirm password"
                          />
                          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.role ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {adminRoles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {permissionsList.map(permission => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor={permission.id} className="block text-sm font-medium text-gray-900 cursor-pointer">
                              {permission.label}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.permissions && <p className="text-red-500 text-sm mt-1">{errors.permissions}</p>}
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingAdmin(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Admins List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              System Administrators ({admins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => {
                const roleInfo = getRoleInfo(admin.role);
                const RoleIcon = roleInfo.icon;
                
                return (
                  <div key={admin._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{admin.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {admin.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={roleInfo.color}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleInfo.label}
                          </Badge>
                          <Badge className={admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {admin.lastLogin && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {admins.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No administrators found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first admin user.</p>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Admin
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminManagement;
