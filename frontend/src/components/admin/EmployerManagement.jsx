import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { Building2, UserCheck, UserX, Briefcase, TrendingUp, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import EmployerTable from './EmployerTable';

const EmployerManagement = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    withCompany: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerStats = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`${USER_API_END_POINT}/employers`, { 
          withCredentials: true 
        });
        const employers = response.data.employers || [];
        
        const employerStats = {
          total: employers.length,
          active: employers.filter(emp => emp.status === 'active').length,
          blocked: employers.filter(emp => emp.status === 'blocked').length,
          withCompany: employers.filter(emp => emp.profile?.company).length
        };

        setStats(employerStats);
      } catch (error) {
        console.error("Failed to fetch employer statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerStats();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employer Management</h1>
          <p className="text-gray-600 mt-1">Manage all employer accounts and their companies</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Total: {stats.total}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active: {stats.active}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Blocked: {stats.blocked}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employers"
          value={stats.total}
          icon={Building2}
          color="#F59E0B"
          description="All registered employers"
        />
        <StatCard
          title="Active Employers"
          value={stats.active}
          icon={UserCheck}
          color="#10B981"
          description="Can post jobs"
        />
        <StatCard
          title="Blocked Employers"
          value={stats.blocked}
          icon={UserX}
          color="#EF4444"
          description="Access restricted"
        />
        <StatCard
          title="With Company"
          value={stats.withCompany}
          icon={TrendingUp}
          color="#06B6D4"
          description="Company profile setup"
        />
      </div>


      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search employers by name, email, or company..."
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

      {/* Employer Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Employers</h2>
          <p className="text-sm text-gray-600">Manage employer accounts, view companies, and control access</p>
        </div>
        <EmployerTable />
      </div>
    </div>
  );
};

export default EmployerManagement;
