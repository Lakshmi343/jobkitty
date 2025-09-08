import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Settings,
  Plus
} from 'lucide-react';
import PieChart from '../PieChart';
import LineChart from '../LineChart';

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
            onClick={() => navigate('/admin/users')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Manage Users
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

        {/* Analytics Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Job Creation Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-1">
            <LineChart 
              data={graphData?.monthlyJobs || []}
              title="Monthly Job Creation Trends"
              height={320}
              width={550}
            />
          </div>

          {/* Applications Status Pie Chart */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-1">
            <PieChart 
              data={graphData?.applications || []}
              title="Applications by Status"
              size={280}
            />
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default AdminDashboard; 