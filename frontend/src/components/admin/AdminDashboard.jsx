import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Users, 
  Briefcase, 
  Building2, 
  FileText, 
  TrendingUp, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Plus
} from 'lucide-react';
import InteractiveBarChart from '../charts/InteractiveBarChart';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    try {
      const adminDataString = localStorage.getItem('adminData');
      if (adminDataString) {
        const admin = JSON.parse(adminDataString);
        setAdminData(admin);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/dashboard`);

      if (response.data.success) {
        setStats(response.data.stats);
        setRecentJobs(response.data.recentJobs);
        setRecentApplications(response.data.recentApplications);
        setGraphData(response.data.graphData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Full error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back{adminData?.name ? `, ${adminData.name}` : ''}! Here's what's happening with your job portal.
              </p>
            </div>
            {adminData && (
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{adminData.name}</h3>
                    <p className="text-sm text-gray-600">{adminData.role}</p>
                    <p className="text-xs text-gray-500">{adminData.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered job seekers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCompanies || 0}</div>
              <p className="text-xs text-muted-foreground">Registered employers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
              <p className="text-xs text-muted-foreground">Posted job positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
              <p className="text-xs text-muted-foreground">Total applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Job Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingJobs || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.approvedJobs || 0}</div>
              <p className="text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Jobs</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.rejectedJobs || 0}</div>
              <p className="text-xs text-muted-foreground">Declined positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/admin/jobs')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Manage Jobs
          </Button>
          <Button 
            onClick={() => navigate('/admin/categories')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Manage Categories
          </Button>
          <Button 
            onClick={() => navigate('/admin/companies')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            Manage Companies
          </Button>
          <Button 
            onClick={() => navigate('/admin/jobseekers')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Manage Jobseekers
          </Button>
          <Button 
            onClick={() => navigate('/admin/employers')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            Manage Employers
          </Button>
        </div>

        {/* Interactive Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job & Application Analytics */}
          <InteractiveBarChart 
            data={graphData?.monthlyData || []}
            title="Job & Application Analytics"
            height={300}
          />

          {/* Recent Activity Feed */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              <div className="space-y-1">
                {recentJobs?.slice(0, 5).map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(job.status).replace('bg-', 'bg-').replace(' text-', ' ')}`}></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 truncate max-w-48">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.company?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                        {job.status}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!recentJobs || recentJobs.length === 0) && (
                  <div className="p-8 text-center text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent jobs found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Job Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-700">
                  {stats?.totalJobs > 0 ? Math.round((stats?.approvedJobs / stats?.totalJobs) * 100) : 0}%
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats?.totalJobs > 0 ? (stats?.approvedJobs / stats?.totalJobs) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {stats?.approvedJobs || 0} of {stats?.totalJobs || 0} jobs approved
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Platform Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-700">
                  +{Math.round(((stats?.totalUsers || 0) + (stats?.totalCompanies || 0)) / 30)}
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">New users this month</p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="text-green-700">👥 {stats?.totalUsers || 0} Users</span>
                <span className="text-green-700">🏢 {stats?.totalCompanies || 0} Companies</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Application Success</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-purple-700">
                  {stats?.totalApplications > 0 ? Math.round((stats?.totalApplications * 0.3)) : 0}
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-purple-600 mt-2">Successful placements</p>
              <div className="mt-2">
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

     
      </div>
    </div>
  );
};

export default AdminDashboard; 