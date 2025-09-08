import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { tokenManager } from '../../utils/tokenManager';
import { toast } from 'sonner';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Settings,
  UserCheck,
  Shield,
  Plus,
  LogOut,
  BarChart3,
  Eye,
  PieChart,
  Activity,
  Calendar,
  Download
} from 'lucide-react';

const EnhancedAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Setup token interceptors
    tokenManager.setupInterceptors();
    
    // Get admin info from localStorage
    const admin = localStorage.getItem('admin');
    if (admin) {
      setAdminInfo(JSON.parse(admin));
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Ensure we have a token before making the request
      const token = tokenManager.getAccessToken() || localStorage.getItem('adminAccessToken');
      if (!token) {
        toast.error('Please log in again to continue.');
        handleLogout();
        return;
      }

      const response = await axios.get(`${ADMIN_API_END_POINT}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setStats(response.data.stats);
        setRecentJobs(response.data.recentJobs || []);
        setRecentApplications(response.data.recentApplications || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        handleLogout();
      } else {
        // Don't logout for other errors, just show a message
        toast.error('Failed to load dashboard data');
        setStats({
          totalUsers: 0,
          totalCompanies: 0,
          totalJobs: 0,
          totalApplications: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenManager.clearTokens();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {adminInfo?.name || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/admin/add-section')}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add New
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-gray-500">Registered job seekers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCompanies || 0}</div>
              <p className="text-xs text-gray-500">Registered employers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
              <p className="text-xs text-gray-500">Posted job positions</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
              <p className="text-xs text-gray-500">Total applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Job Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingJobs || 0}</div>
              <p className="text-xs text-gray-500">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.approvedJobs || 0}</div>
              <p className="text-xs text-gray-500">Active positions</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Jobs</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.rejectedJobs || 0}</div>
              <p className="text-xs text-gray-500">Declined positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button 
                onClick={() => navigate('/admin/jobs')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <Briefcase className="h-5 w-5" />
                <span className="text-xs">Manage Jobs</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/users')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Manage Users</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/companies')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Companies</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/categories')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs">Categories</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/analytics')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">Analytics</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/add-section')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">Add New</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Job Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray={`${((stats?.approvedJobs || 0) / (stats?.totalJobs || 1)) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">
                        {Math.round(((stats?.approvedJobs || 0) / (stats?.totalJobs || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Approved</span>
                    </div>
                    <span className="text-sm font-medium">{stats?.approvedJobs || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <span className="text-sm font-medium">{stats?.pendingJobs || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <span className="text-sm font-medium">{stats?.rejectedJobs || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Application Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end justify-between h-32">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div key={day} className="flex flex-col items-center space-y-1">
                      <div 
                        className="w-6 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                        style={{ height: `${Math.random() * 80 + 20}px` }}
                      ></div>
                      <span className="text-xs text-gray-500">
                        {new Date(Date.now() - (7 - day) * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats?.totalApplications || 0}</div>
                    <div className="text-xs text-gray-500">Total Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(((stats?.totalApplications || 0) / 7))}
                    </div>
                    <div className="text-xs text-gray-500">Daily Average</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Recent Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.length > 0 ? recentJobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{job.title}</h4>
                      <p className="text-xs text-gray-500">{job.company?.name || 'Unknown Company'}</p>
                      <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Eye size={14} />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm text-center py-4">No recent jobs</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length > 0 ? recentApplications.map((application) => (
                  <div key={application._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{application.job?.title || 'Unknown Job'}</h4>
                      <p className="text-xs text-gray-500">{application.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-400">{new Date(application.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Eye size={14} />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm text-center py-4">No recent applications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;
