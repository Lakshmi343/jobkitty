import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  FileDown,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const AdminUsers = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayUsers, setDisplayUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('Jobseeker');

  useEffect(() => {
    fetchBoth();
  }, []);

  useEffect(() => {
    const source = activeTab === 'Jobseeker' ? jobseekers : employers;
    const filtered = source.filter(user =>
      (user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setDisplayUsers(filtered);
  }, [searchTerm, activeTab, jobseekers, employers]);

  const fetchBoth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [jsRes, emRes] = await Promise.all([
        axios.get(`${ADMIN_API_END_POINT}/users`, { headers: { Authorization: `Bearer ${token}` }, params: { role: 'Jobseeker' } }),
        axios.get(`${ADMIN_API_END_POINT}/users`, { headers: { Authorization: `Bearer ${token}` }, params: { role: 'Employer' } })
      ]);
      if (jsRes.data.success) setJobseekers(jsRes.data.users);
      if (emRes.data.success) setEmployers(emRes.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(
        `${ADMIN_API_END_POINT}/users/${userId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobseekers(prev => prev.map(u => u._id === userId ? { ...u, status } : u));
        setEmployers(prev => prev.map(u => u._id === userId ? { ...u, status } : u));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${ADMIN_API_END_POINT}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setJobseekers(prev => prev.filter(u => u._id !== userId));
        setEmployers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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

  const getInlineResumeUrl = (url) => {
    if (!url) return url;
    let out = url.replace('/upload/', '/upload/fl_inline/');
    if (out.includes('/raw/')) {
      const u = new URL(out);
      const segments = u.pathname.split('/');
      const last = segments[segments.length - 1];
      if (!last.includes('.')) {
        segments[segments.length - 1] = `${last}.pdf`;
        u.pathname = segments.join('/');
        out = u.toString();
      }
    }
    return out;
  };

  const downloadDirect = (url, filenameHint) => {
    const link = document.createElement('a');
    link.href = url;
    if (filenameHint) link.download = filenameHint;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const viewCV = async (user) => {
    if (!user.profile?.resume) return;
    const inlineUrl = getInlineResumeUrl(user.profile.resume);
    try {
      await axios.head(inlineUrl);
      window.open(inlineUrl, '_blank');
    } catch {
      downloadDirect(user.profile.resume, user.profile?.resumeOriginalName || `${user.fullname || 'resume'}.pdf`);
    }
  };

  const downloadCV = async (user) => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = `${ADMIN_API_END_POINT}/users/${user._id}/resume`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const filename = user.profile?.resumeOriginalName || `${user.fullname || 'resume'}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download CV', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalUsers = jobseekers.length + employers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all registered users</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">{totalUsers} users</span>
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
              <Button
                variant={activeTab === 'Jobseeker' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('Jobseeker')}
              >
                Jobseekers ({jobseekers.length})
              </Button>
              <Button
                variant={activeTab === 'Employer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('Employer')}
              >
                Employers ({employers.length})
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
                {displayUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{user.fullname}</div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                    <td className="p-3">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status || 'active'}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
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
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateUserStatus(user._id, 'active')}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserStatus(user._id, 'inactive')}>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteUser(user._id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {displayUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers; 