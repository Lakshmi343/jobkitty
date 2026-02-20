import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Users, UserCheck, UserX, FileText, TrendingUp, Search, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import JobseekerTable from './JobseekerTable';

const JobseekerManagement = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    withResume: 0,
    todayRegistered: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobseekerStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${ADMIN_API_END_POINT}/jobseekers`, { 
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let jobseekers = Array.isArray(response.data) ? response.data : (response.data?.jobseekers || []);
        if (!jobseekers || jobseekers.length === 0) {
          try {
            const fb = await axios.get(`${ADMIN_API_END_POINT.replace('/admin', '/user')}/jobseekers`, { 
              withCredentials: true,
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            jobseekers = Array.isArray(fb.data) ? fb.data : (fb.data?.jobseekers || []);
          } catch (fbErr) {
            console.error('Fallback jobseeker stats fetch failed:', fbErr);
          }
        }
        
        const jobseekerStats = {
          total: jobseekers.length,
          active: jobseekers.filter(js => js.status === 'active').length,
          blocked: jobseekers.filter(js => js.status === 'blocked').length,
          withResume: jobseekers.filter(js => js.profile?.resume).length,
          todayRegistered: jobseekers.filter(js => {
            const today = new Date();
            const createdDate = new Date(js.createdAt);
            return createdDate.toDateString() === today.toDateString();
          }).length
        };

        setStats(jobseekerStats);
      } catch (error) {
        console.error("Failed to fetch jobseeker statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobseekerStats();
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
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobseeker Management</h1>
          <p className="text-gray-600 mt-1">Manage all jobseeker accounts and their activities</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Total: {stats.total}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active: {stats.active}
          </Badge>
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            Today: {stats.todayRegistered}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Blocked: {stats.blocked}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Jobseekers"
          value={stats.total}
          icon={Users}
          color="#3B82F6"
          description="All registered jobseekers"
        />
        <StatCard
          title="Active Jobseekers"
          value={stats.active}
          icon={UserCheck}
          color="#10B981"
          description="Can access platform"
        />
        <StatCard
          title="Blocked Jobseekers"
          value={stats.blocked}
          icon={UserX}
          color="#EF4444"
          description="Access restricted"
        />
        <StatCard
          title="With Resume"
          value={stats.withResume}
          icon={FileText}
          color="#8B5CF6"
          description="Uploaded CV/Resume"
        />
        <StatCard
          title="Today Registered"
          value={stats.todayRegistered}
          icon={Calendar}
          color="#F59E0B"
          description="New registrations today"
        />
      </div>


    
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search jobseekers by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              Filter by Status
            </Button>
          </div>
        </div>
      </div>

   
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Jobseekers</h2>
          <p className="text-sm text-gray-600">Manage jobseeker accounts, view profiles, and control access</p>
        </div>
        <JobseekerTable />
      </div>
    </div>
  );
};

export default JobseekerManagement;
