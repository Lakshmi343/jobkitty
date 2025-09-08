import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { Users, UserCheck, UserX, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import JobseekerTable from './JobseekerTable';
import EmployerTable from './EmployerTable';

const UserManagementDashboard = () => {
  const [stats, setStats] = useState({
    jobseekers: {
      total: 0,
      active: 0,
      blocked: 0,
      withResume: 0
    },
    employers: {
      total: 0,
      active: 0,
      blocked: 0,
      withCompany: 0
    }
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch jobseekers
        const jobseekersRes = await axios.get(`${USER_API_END_POINT}/jobseekers`, { 
          withCredentials: true 
        });
        const jobseekers = jobseekersRes.data.jobseekers || [];
        
        // Fetch employers
        const employersRes = await axios.get(`${USER_API_END_POINT}/employers`, { 
          withCredentials: true 
        });
        const employers = employersRes.data.employers || [];

        // Calculate jobseeker stats
        const jobseekerStats = {
          total: jobseekers.length,
          active: jobseekers.filter(js => js.status === 'active').length,
          blocked: jobseekers.filter(js => js.status === 'blocked').length,
          withResume: jobseekers.filter(js => js.profile?.resume).length
        };

        // Calculate employer stats
        const employerStats = {
          total: employers.length,
          active: employers.filter(emp => emp.status === 'active').length,
          blocked: employers.filter(emp => emp.status === 'blocked').length,
          withCompany: employers.filter(emp => emp.profile?.company).length
        };

        setStats({
          jobseekers: jobseekerStats,
          employers: employerStats
        });
      } catch (error) {
        console.error("Failed to fetch user statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>{loading ? '...' : value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'jobseekers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('jobseekers')}
          >
            Jobseekers
          </Button>
          <Button 
            variant={activeTab === 'employers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('employers')}
          >
            Employers
          </Button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Jobseeker Statistics */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Jobseeker Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Jobseekers"
                value={stats.jobseekers.total}
                icon={Users}
                color="#3B82F6"
                description="All registered jobseekers"
              />
              <StatCard
                title="Active Jobseekers"
                value={stats.jobseekers.active}
                icon={UserCheck}
                color="#10B981"
                description="Can access the platform"
              />
              <StatCard
                title="Blocked Jobseekers"
                value={stats.jobseekers.blocked}
                icon={UserX}
                color="#EF4444"
                description="Access restricted"
              />
              <StatCard
                title="With Resume"
                value={stats.jobseekers.withResume}
                icon={FileText}
                color="#8B5CF6"
                description="Uploaded CV/Resume"
              />
            </div>
          </div>

          {/* Employer Statistics */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Employer Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Employers"
                value={stats.employers.total}
                icon={Briefcase}
                color="#F59E0B"
                description="All registered employers"
              />
              <StatCard
                title="Active Employers"
                value={stats.employers.active}
                icon={UserCheck}
                color="#10B981"
                description="Can post jobs"
              />
              <StatCard
                title="Blocked Employers"
                value={stats.employers.blocked}
                icon={UserX}
                color="#EF4444"
                description="Access restricted"
              />
              <StatCard
                title="With Company"
                value={stats.employers.withCompany}
                icon={TrendingUp}
                color="#06B6D4"
                description="Company profile setup"
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Platform Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.jobseekers.total + stats.employers.total}</p>
                <p className="text-blue-100">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.jobseekers.active + stats.employers.active}</p>
                <p className="text-blue-100">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.jobseekers.blocked + stats.employers.blocked}</p>
                <p className="text-blue-100">Blocked Users</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobseekers Tab */}
      {activeTab === 'jobseekers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Jobseeker Management</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Total: {stats.jobseekers.total}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active: {stats.jobseekers.active}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                Blocked: {stats.jobseekers.blocked}
              </Badge>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <JobseekerTable />
          </div>
        </div>
      )}

      {/* Employers Tab */}
      {activeTab === 'employers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Employer Management</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Total: {stats.employers.total}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active: {stats.employers.active}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                Blocked: {stats.employers.blocked}
              </Badge>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <EmployerTable />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementDashboard;
