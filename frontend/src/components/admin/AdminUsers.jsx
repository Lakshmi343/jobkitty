import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Users, Search, MoreHorizontal, UserCheck, UserX, Trash2, FileDown, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // single array for both roles
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Jobseeker');

  // Fetch all users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${ADMIN_API_END_POINT}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setUsers(res.data.users || []);
      } catch (err) {
        toast.error('Could not fetch users. Please try again.'); // Use toast for error message
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on activeTab and searchTerm
  const filteredUsers = users.filter(user =>
    user.role === activeTab &&
    (user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.patch(
        `${ADMIN_API_END_POINT}/users/${userId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, status } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.delete(`${ADMIN_API_END_POINT}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Jobseeker': return 'bg-blue-100 text-blue-800';
      case 'Employer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewCV = (user) => {
    if (!user.profile?.resume) return;
    window.open(user.profile.resume, '_blank');
  };

  const downloadCV = (user) => {
    if (!user.profile?.resume) return;
    const link = document.createElement('a');
    link.href = user.profile.resume;
    link.download = user.profile.resumeOriginalName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all registered users</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">{users.length} users</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 justify-start md:justify-end">
              <Button variant={activeTab === 'Jobseeker' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('Jobseeker')}>
                Jobseekers ({users.filter(u => u.role === 'Jobseeker').length})
              </Button>
              <Button variant={activeTab === 'Employer' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('Employer')}>
                Employers ({users.filter(u => u.role === 'Employer').length})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{user.fullname}</td>
                      <td className="p-3 text-sm text-gray-600">{user.email}</td>
                      <td className="p-3">
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(user.status)}>{user.status || 'active'}</Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 flex items-center gap-2">
                        {user.role === 'Jobseeker' && user.profile?.resume && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => viewCV(user)}>
                              <FileText className="mr-2 h-4 w-4" /> View CV
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadCV(user)}>
                              <FileDown className="mr-2 h-4 w-4" /> Download CV
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateUserStatus(user._id, 'active')}><UserCheck className="mr-2 h-4 w-4" /> Activate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserStatus(user._id, 'inactive')}><UserX className="mr-2 h-4 w-4" /> Deactivate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteUser(user._id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
