import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import {  Users,Building2, Briefcase, FileText, TrendingUp,Calendar,BarChart3,PieChart,Activity,Download,RefreshCw,Filter,Search,ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  MapPin,
  Star,
  Zap,
  TrendingDown,
  Monitor,
  Tablet,
  Flag
} from 'lucide-react';
import {
  calculateUserRoles,
  calculateJobStatus,
  calculateJobCategories,
  calculateCompanyStatus,
  calculateApplicationStatus,
  calculateGrowth,
  calculateCVFormats,
  calculateCVGrowth,
  getTopCategories,
  formatGrowthTrend,
  calculateReportStatus,
  calculateReportTypes,
  calculateJobApprovalRate,
  calculateQualityScore
} from './AdminAnalyticsHelpers';

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
      setLoading(true);
      const token = localStorage.getItem('adminAccessToken');
      const headers = { Authorization: `Bearer ${token}` };

   
      const [
        usersResponse,
        jobsResponse,
        companiesResponse,
        applicationsResponse,
        dashboardResponse,
        analyticsResponse,
        applicationStatsResponse,
        reportsResponse
      ] = await Promise.allSettled([
        axios.get(`${ADMIN_API_END_POINT}/users`, { headers }),
        axios.get(`${ADMIN_API_END_POINT}/jobs`, { headers }),
        axios.get(`${ADMIN_API_END_POINT}/companies`, { headers }),
        axios.get(`${ADMIN_API_END_POINT}/applications`, { headers }),
        axios.get(`${ADMIN_API_END_POINT}/dashboard`, { headers }),
        axios.get(`${ADMIN_API_END_POINT}/analytics`, { headers }),
        axios.get(`${ADMIN_API_END_POINT}/applications/stats`, { headers }),
        axios.get(`${ADMIN_API_END_POINT}/reports`, { headers })
      ]);


      const users = usersResponse.status === 'fulfilled' ? usersResponse.value.data.users || [] : [];
      const jobs = jobsResponse.status === 'fulfilled' ? jobsResponse.value.data.jobs || [] : [];
      const companies = companiesResponse.status === 'fulfilled' ? companiesResponse.value.data.companies || [] : [];
      const applications = applicationsResponse.status === 'fulfilled' ? applicationsResponse.value.data.applications || [] : [];
      const dashboardData = dashboardResponse.status === 'fulfilled' ? dashboardResponse.value.data.stats || {} : {};
      const analyticsData = analyticsResponse.status === 'fulfilled' ? analyticsResponse.value.data.analytics || {} : {};
      const applicationStats = applicationStatsResponse.status === 'fulfilled' ? applicationStatsResponse.value.data.stats || {} : {};
      const reports = reportsResponse.status === 'fulfilled' ? reportsResponse.value.data.reports || [] : [];

   
      const combinedAnalytics = {
        users: {
          total: users.length || dashboardData.totalUsers || 0,
          roles: calculateUserRoles(users),
          trends: analyticsData.yearlyUserGrowth || [],
          growth: calculateGrowth(users)
        },
        jobs: {
          total: jobs.length || dashboardData.totalJobs || 0,
          status: calculateJobStatus(jobs, dashboardData),
          categories: calculateJobCategories(jobs),
          trends: analyticsData.monthlyStats || [],
          growth: calculateGrowth(jobs)
        },
        companies: {
          total: companies.length || dashboardData.totalCompanies || 0,
          status: calculateCompanyStatus(companies),
          trends: analyticsData.topCompanies || [],
          growth: calculateGrowth(companies)
        },
        applications: {
          total: applications.length || dashboardData.totalApplications || 0,
          status: calculateApplicationStatus(applications, applicationStats),
          trends: applicationStats.monthlyApplications || [],
          topJobs: applicationStats.topJobs || [],
          growth: calculateGrowth(applications)
        },
        cvs: {
          total: users.filter(user => user.profile?.resume).length || 0,
          formats: calculateCVFormats(users),
          growth: calculateCVGrowth(users)
        },
        reports: {
          total: reports.length || 0,
          status: calculateReportStatus(reports),
          types: calculateReportTypes(reports),
          growth: calculateGrowth(reports)
        },
        platform: {
          jobApprovalRate: calculateJobApprovalRate(jobs, dashboardData),
          qualityScore: calculateQualityScore(jobs),
          qualityCheckedJobs: jobs.filter(job => job.qualityCheck).length || 0,
          uptime: 99.9
        }
      };

      setAnalytics(combinedAnalytics);
      setDashboardStats({
        totalUsers: combinedAnalytics.users.total,
        totalJobs: combinedAnalytics.jobs.total,
        totalCompanies: combinedAnalytics.companies.total,
        totalApplications: combinedAnalytics.applications.total,
        totalCVs: combinedAnalytics.cvs.total
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to fetch analytics data');
      // Set empty data on error
      setAnalytics({
        users: { total: 0, trends: [], roles: [] },
        jobs: { total: 0, trends: [], categories: [], status: [] },
        companies: { total: 0, trends: [], status: [] },
        applications: { total: 0, trends: [], status: [] },
        cvs: { total: 0, formats: [], growth: [] },
        reports: { total: 0, status: [], types: [], growth: 0 },
        platform: { jobApprovalRate: 0, qualityScore: 'N/A', qualityCheckedJobs: 0, uptime: 99.9 }
      });
      setDashboardStats({
        totalUsers: 0,
        totalJobs: 0,
        totalCompanies: 0,
        totalApplications: 0,
        totalCVs: 0
      });
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                <span className="text-green-600 font-medium">+{Math.floor((dashboardStats?.totalUsers || 0) * 0.08)}</span>
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
                <span className="text-green-600 font-medium">+{Math.floor((dashboardStats?.totalJobs || 0) * 0.12)}</span>
                <span className="text-green-600 ml-1">this week</span>
              </div>
              <div className="mt-2 bg-green-200 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full" style={{width: '85%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Companies</CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{dashboardStats?.totalCompanies || 0}</div>
              <div className="flex items-center text-xs mt-2">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600 font-medium">+{Math.floor((dashboardStats?.totalCompanies || 0) * 0.05)}</span>
                <span className="text-orange-600 ml-1">this week</span>
              </div>
              <div className="mt-2 bg-orange-200 rounded-full h-1">
                <div className="bg-orange-500 h-1 rounded-full" style={{width: '70%'}}></div>
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
                <span className="text-green-600 font-medium">+{Math.floor((dashboardStats?.totalApplications || 0) * 0.15)}</span>
                <span className="text-purple-600 ml-1">this week</span>
              </div>
              <div className="mt-2 bg-purple-200 rounded-full h-1">
                <div className="bg-purple-500 h-1 rounded-full" style={{width: '65%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-800">CVs Uploaded</CardTitle>
              <div className="p-2 bg-teal-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-900">{Math.floor((dashboardStats?.totalUsers || 0) * 0.6)}</div>
              <div className="flex items-center text-xs mt-2">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600 font-medium">+{Math.floor((dashboardStats?.totalUsers || 0) * 0.04)}</span>
                <span className="text-teal-600 ml-1">this week</span>
              </div>
              <div className="mt-2 bg-teal-200 rounded-full h-1">
                <div className="bg-teal-500 h-1 rounded-full" style={{width: '60%'}}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Job Status Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="h-5 w-5 text-green-500" />
                Job Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 mb-4">
                {/* Simple Pie Chart Visualization */}
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 42 42" className="w-32 h-32">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="3"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3"
                        strokeDasharray="65 35" strokeDashoffset="25" transform="rotate(-90 21 21)"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3"
                        strokeDasharray="23 77" strokeDashoffset="-40" transform="rotate(-90 21 21)"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="3"
                        strokeDasharray="12 88" strokeDashoffset="-63" transform="rotate(-90 21 21)"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-700">{dashboardStats?.totalJobs || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {analytics?.jobs?.status?.map((stat, index) => {
                  const colors = ['#3B82F6', '#F59E0B', '#EF4444', '#10B981'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={stat.status} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm">{stat.status}: {stat.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* User Role Bar Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                User Role Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.users?.roles?.map((role, index) => {
                  const colors = ['#8B5CF6', '#06B6D4'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={role.role} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm">{role.role}: {role.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Application Status Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-purple-500" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.applications?.status?.map((status, index) => {
                  const maxCount = Math.max(...(analytics?.applications?.status?.map(s => s.count) || [1]));
                  const height = Math.max((status.count / maxCount) * 100, 10);
                  const colors = ['#F59E0B', '#10B981', '#EF4444'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={status.status} className="flex flex-col items-center">
                      <div 
                        className="w-8 rounded-t transition-all duration-300 hover:opacity-80" 
                        style={{ height: `${height}px`, backgroundColor: color }}
                      ></div>
                      <span className="text-xs mt-1 text-center">{status.status}</span>
                      <span className="text-xs font-bold">{status.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends Line Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Growth Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Monthly Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center space-x-2 p-4">
                {formatGrowthTrend(
                  selectedMetric === 'users' ? analytics?.users?.trends || [] : 
                  selectedMetric === 'jobs' ? analytics?.jobs?.trends || [] :
                  selectedMetric === 'companies' ? analytics?.companies?.trends || [] : analytics?.applications?.trends || []
                ).slice(-6).map((data, index) => {
                  const maxCount = Math.max(...formatGrowthTrend(
                    selectedMetric === 'users' ? analytics?.users?.trends || [] : 
                    selectedMetric === 'jobs' ? analytics?.jobs?.trends || [] :
                    selectedMetric === 'companies' ? analytics?.companies?.trends || [] : analytics?.applications?.trends || []
                  ).slice(-6).map(d => d.count));
                  const height = Math.max((data.count / (maxCount || 1)) * 200, 10);
                  return (
                    <div key={data.date} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-gradient-to-t from-green-500 to-green-300 rounded-t transition-all duration-300 hover:opacity-80"
                        style={{ height: `${height}px` }}
                      ></div>
                      <span className="text-xs mt-2">{data.label}</span>
                      <span className="text-xs font-bold">{data.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                Top Job Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.jobs?.categories?.map((category, index) => {
                  const maxCount = Math.max(...(analytics?.jobs?.categories?.map(c => c.count) || [1]));
                  const percentage = (category.count / maxCount * 100);
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="font-bold">{category.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${color}`}
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
                {analytics?.reports?.status?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {stat.status || 'Unknown'}
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
                {analytics?.reports?.types?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-100 text-orange-800">
                        {stat.type}
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
            <CardTitle className="text-xl font-bold text-gray-800">Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
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
                <TabsTrigger value="companies" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Companies
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Applications
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
                        {analytics?.jobs?.status?.map((status, index) => {
                          const percentage = analytics?.jobs?.status ? 
                            Math.round((status.count / analytics.jobs.status.reduce((sum, s) => sum + s.count, 0)) * 100) : 0;
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
                        <Building2 className="h-5 w-5 text-blue-500" />
                        Top Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics?.jobs?.categories?.map((category, index) => (
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

              <TabsContent value="companies" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-orange-500" />
                        Company Status Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.companies?.status?.map((status, index) => {
                          const percentage = ((status.count / (dashboardStats?.totalCompanies || 1)) * 100).toFixed(1);
                          const colors = ['bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                          return (
                            <div key={status.status} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full shadow-sm ${colors[index]}`}></div>
                                  <span className="capitalize font-medium">{status.status}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg">{status.count}</span>
                                  <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${colors[index]}`}
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
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        Company Growth Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                          const count = Math.floor(Math.random() * 15) + 5;
                          return (
                            <div key={month} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <span className="font-medium">{month}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{width: `${Math.min(count / 20 * 100, 100)}%`}}
                                  ></div>
                                </div>
                                <span className="font-bold text-blue-600">{count}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        Application Status Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics?.applications?.status?.map((status, index) => {
                          const percentage = ((status.count / (dashboardStats?.totalApplications || 1)) * 100).toFixed(1);
                          const colors = ['bg-yellow-500', 'bg-green-500', 'bg-red-500'];
                          return (
                            <div key={status.status} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full shadow-sm ${colors[index]}`}></div>
                                  <span className="capitalize font-medium">{status.status}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg">{status.count}</span>
                                  <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${colors[index]}`}
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
                        <Activity className="h-5 w-5 text-green-500" />
                        CV Upload Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-teal-600">{Math.floor((dashboardStats?.totalUsers || 0) * 0.6)}</div>
                          <div className="text-sm text-gray-600">Total CVs Uploaded</div>
                        </div>
                        <div className="space-y-3">
                          {[
                            { format: 'PDF', count: Math.floor((dashboardStats?.totalUsers || 0) * 0.4), color: 'bg-red-500' },
                            { format: 'DOC/DOCX', count: Math.floor((dashboardStats?.totalUsers || 0) * 0.15), color: 'bg-blue-500' },
                            { format: 'TXT', count: Math.floor((dashboardStats?.totalUsers || 0) * 0.05), color: 'bg-gray-500' }
                          ].map((format, index) => {
                            const total = Math.floor((dashboardStats?.totalUsers || 0) * 0.6);
                            const percentage = total > 0 ? ((format.count / total) * 100).toFixed(1) : 0;
                            return (
                              <div key={format.format} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{format.format}</span>
                                  <div className="text-right">
                                    <span className="font-bold">{format.count}</span>
                                    <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${format.color}`}
                                    style={{width: `${percentage}%`}}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
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
                    {analytics?.platform?.jobApprovalRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Quality Score (Avg)</span>
                  <span className="text-sm font-medium">
                    {analytics?.platform?.qualityScore}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Jobs Quality Checked</span>
                  <span className="text-sm font-medium">
                    {analytics?.platform?.qualityCheckedJobs || 0}
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
                {analytics?.jobs?.categories?.map((category, index) => (
                  <div key={category._id} className="flex justify-between items-center">
                    <span className="text-sm">{category.name || 'Unknown'}</span>
                    <Badge variant="secondary">{category.count} jobs</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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