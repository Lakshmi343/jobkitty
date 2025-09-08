import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {  FileText,  Download,  Eye,  Search,  Filter, Users, Calendar, Briefcase, Mail} from 'lucide-react';
import { ADMIN_API_END_POINT } from '../../utils/constant';

const AdminCVManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Jobseeker');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [stats, setStats] = useState({
    totalCVs: 0,
    jobseekerCVs: 0,
    employerProfiles: 0,
    recentUploads: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/users?role=Jobseeker`);
      if (response.data.success) {
        const jobseekers = response.data.users.filter(user => user.role === 'Jobseeker');
        setUsers(jobseekers);
        calculateStats(jobseekers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Could not load user information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const cvCount = userData.filter(user => user.profile?.resume).length;
    const recentUploads = userData.filter(user => {
      if (!user.profile?.resume) return false;
      const uploadDate = new Date(user.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length;

    setStats({
      totalCVs: cvCount,
      jobseekerCVs: cvCount,
      totalJobseekers: userData.length,
      recentUploads
    });
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    filtered = filtered.filter(user => user.profile?.resume);

    setFilteredUsers(filtered);
  };

  const downloadResume = async (userId, userName) => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/users/${userId}/resume`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${userName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const viewResume = (resumeUrl) => {
    if (resumeUrl) {
      setPreviewUrl(resumeUrl);
      setShowPreview(true);
    } else {
      toast.error('Resume not available');
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewUrl('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CV Management</h1>
          <p className="text-gray-600 mt-1">Manage user resumes and profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCVs}</div>
            <p className="text-xs text-gray-500">Uploaded resumes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobseeker CVs</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobseekerCVs}</div>
            <p className="text-xs text-gray-500">Job seeker resumes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobseekers</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobseekers}</div>
            <p className="text-xs text-gray-500">Registered candidates</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value="with-cv"
                disabled
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
              >
                <option value="with-cv">Candidates with CV</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Profiles & CVs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found matching your criteria
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">

                  <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
  {user.profile?.profilePhoto ? (
    <img 
      src={user.profile.profilePhoto} 
      alt="Profile" 
      className="w-full h-full object-cover" 
    />
  ) : (
    <span className="text-gray-600 font-semibold">
      {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
    </span>
  )}
</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.fullname || 'No Name'}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="default">
                          Job Seeker
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          CV Available
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewResume(user.profile.resume)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResume(user._id, user.fullname)}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

    
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-4xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">CV Preview</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>Open in New Tab</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4 h-full">
              <iframe
                src={previewUrl}
                className="w-full h-full border rounded"
                title="CV Preview"
                style={{ height: 'calc(100% - 2rem)' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCVManagement;
