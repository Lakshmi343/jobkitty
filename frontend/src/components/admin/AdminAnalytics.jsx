import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Target,
  Eye,
  Download,
  RefreshCw,
  Flag,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  MoreHorizontal,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('jobs');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch analytics data
      const analyticsResponse = await axios.get(`${ADMIN_API_END_POINT}/analytics`, { headers });
      
      // Fetch dashboard stats for additional metrics
      const dashboardResponse = await axios.get(`${ADMIN_API_END_POINT}/dashboard`, { headers });

      if (analyticsResponse.data.success) {
        setAnalytics(analyticsResponse.data.analytics);
      }

      if (dashboardResponse.data.success) {
        setDashboardStats(dashboardResponse.data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'Jobseeker': return 'bg-blue-100 text-blue-800';
      case 'Employer': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Real-time insights into platform performance and user engagement</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Data
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                  <TabsTrigger value="quarter" className="text-xs">Quarter</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={fetchAnalyticsData} variant="outline" className="shadow-sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="shadow-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Users</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{dashboardStats?.totalUsers || 0}</div>
              <div className="flex items-center text-xs mt-2">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600 font-medium">+{analytics?.recentActivity?.users || 0}</span>
                <span className="text-blue-600 ml-1">this week</span>
              </div>
              <div className="mt-2 bg-blue-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{width: '75%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Total Jobs</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{dashboardStats?.totalJobs || 0}</div>
              <div className="flex items-center text-xs mt-2">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600 font-medium">+{analytics?.recentActivity?.jobs || 0}</span>
                <span className="text-green-600 ml-1">this week</span>
              </div>
              <div className="mt-2 bg-green-200 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full" style={{width: '85%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Applications</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{dashboardStats?.totalApplications || 0}</div>
              <div className="flex items-center text-xs mt-2">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600 font-medium">+{analytics?.recentActivity?.applications || 0}</span>
                <span className="text-purple-600 ml-1">this week</span>
              </div>
              <div className="mt-2 bg-purple-200 rounded-full h-1">
                <div className="bg-purple-500 h-1 rounded-full" style={{width: '65%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Active Reports</CardTitle>
              <div className="p-2 bg-red-500 rounded-lg">
                <Flag className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">{analytics?.recentActivity?.reports || 0}</div>
              <div className="flex items-center text-xs mt-2">
                <Shield className="h-3 w-3 mr-1 text-blue-600" />
                <span className="text-blue-600 font-medium">Monitoring</span>
                <span className="text-red-600 ml-1">security</span>
              </div>
              <div className="mt-2 bg-red-200 rounded-full h-1">
                <div className="bg-red-500 h-1 rounded-full" style={{width: '25%'}}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Job Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.jobStatusStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(stat._id)}>
                        {stat._id || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stat.count}</span>
                      <span className="text-xs text-gray-500">
                        ({((stat.count / (dashboardStats?.totalJobs || 1)) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                User Role Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.userStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(stat._id)}>
                        {stat._id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stat.count}</span>
                      <span className="text-xs text-gray-500">
                        ({((stat.count / (dashboardStats?.totalUsers || 1)) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Report Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Report Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.reportStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(stat._id)}>
                        {stat._id || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Report Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.reportTypeStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800">
                        {stat._id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Analytics Tabs */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-xl font-bold text-gray-800">Platform Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="jobs" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Enhanced Job Status Chart */}
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-blue-500" />
                        Job Status Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.jobStatusDistribution?.map((status, index) => {
                          const percentage = analytics?.jobStatusDistribution ? 
                            Math.round((status.count / analytics.jobStatusDistribution.reduce((sum, s) => sum + s.count, 0)) * 100) : 0;
                          return (
                            <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full shadow-sm ${
                                    status.status === 'approved' ? 'bg-green-500' :
                                    status.status === 'pending' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}></div>
                                  <span className="capitalize font-medium">{status.status}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg">{status.count}</span>
                                  <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    status.status === 'approved' ? 'bg-green-500' :
                                    status.status === 'pending' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced User Role Chart */}
                  <Card className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-purple-500" />
                        User Role Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.userRoleDistribution?.map((role, index) => {
                          const percentage = analytics?.userRoleDistribution ? 
                            Math.round((role.count / analytics.userRoleDistribution.reduce((sum, r) => sum + r.count, 0)) * 100) : 0;
                          return (
                            <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full shadow-sm ${
                                    role.role === 'job_seeker' ? 'bg-blue-500' :
                                    role.role === 'employer' ? 'bg-purple-500' :
                                    'bg-gray-500'
                                  }`}></div>
                                  <span className="capitalize font-medium">{role.role.replace('_', ' ')}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg">{role.count}</span>
                                  <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    role.role === 'job_seeker' ? 'bg-blue-500' :
                                    role.role === 'employer' ? 'bg-purple-500' :
                                    'bg-gray-500'
                                  }`}
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Monthly Job Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics?.monthlyTrends?.jobs?.map((month, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="font-medium">{month.month}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{width: `${Math.min(month.count / 50 * 100, 100)}%`}}
                                ></div>
                              </div>
                              <span className="font-bold text-green-600">{month.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        Top Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics?.topCategories?.map((category, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="font-medium">{category.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{width: `${Math.min(category.count / 30 * 100, 100)}%`}}
                                ></div>
                              </div>
                              <span className="font-bold text-blue-600">{category.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5 text-purple-500" />
                        User Growth Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics?.monthlyTrends?.users?.map((month, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="font-medium">{month.month}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{width: `${Math.min(month.count / 100 * 100, 100)}%`}}
                                ></div>
                              </div>
                              <span className="font-bold text-purple-600">{month.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        Top Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics?.topLocations?.map((location, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <span className="font-medium">{location.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                  style={{width: `${Math.min(location.count / 50 * 100, 100)}%`}}
                                ></div>
                              </div>
                              <span className="font-bold text-orange-600">{location.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Report Status Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.reportStatusDistribution?.map((status, index) => {
                          const percentage = analytics?.reportStatusDistribution ? 
                            Math.round((status.count / analytics.reportStatusDistribution.reduce((sum, s) => sum + s.count, 0)) * 100) : 0;
                          return (
                            <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full shadow-sm ${
                                    status.status === 'resolved' ? 'bg-green-500' :
                                    status.status === 'pending' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}></div>
                                  <span className="capitalize font-medium">{status.status}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg">{status.count}</span>
                                  <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    status.status === 'resolved' ? 'bg-green-500' :
                                    status.status === 'pending' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-purple-500" />
                        Report Type Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.reportTypeDistribution?.map((type, index) => {
                          const percentage = analytics?.reportTypeDistribution ? 
                            Math.round((type.count / analytics.reportTypeDistribution.reduce((sum, t) => sum + t.count, 0)) * 100) : 0;
                          return (
                            <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 rounded-full bg-purple-500 shadow-sm"></div>
                                  <span className="capitalize font-medium">{type.type.replace('_', ' ')}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg">{type.count}</span>
                                  <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Job Posting Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics?.monthlyStats?.map((stat, index) => (
                <div key={stat._id} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8"
                    style={{ 
                      height: `${Math.max((stat.count / Math.max(...analytics.monthlyStats.map(s => s.count))) * 200, 20)}px` 
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {formatDate(stat._id)}
                  </span>
                  <span className="text-xs font-medium">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Platform Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Job Approval Rate</span>
                  <span className="text-sm font-medium">
                    {dashboardStats?.approvedJobs && dashboardStats?.totalJobs 
                      ? ((dashboardStats.approvedJobs / dashboardStats.totalJobs) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Quality Score (Avg)</span>
                  <span className="text-sm font-medium">
                    {analytics?.qualityStats?.avgScore ? analytics.qualityStats.avgScore.toFixed(1) : 'N/A'}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Jobs Quality Checked</span>
                  <span className="text-sm font-medium">
                    {analytics?.qualityStats?.totalChecked || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Platform Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top Job Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.topCategories?.map((category, index) => (
                  <div key={category._id} className="flex justify-between items-center">
                    <span className="text-sm">{category.categoryName || 'Unknown'}</span>
                    <Badge variant="secondary">{category.count} jobs</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Job Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.locationStats?.map((location, index) => (
                  <div key={location._id} className="flex justify-between items-center">
                    <span className="text-sm">{location._id}</span>
                    <Badge variant="secondary">{location.count} jobs</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Export Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 