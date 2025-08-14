import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Briefcase, Search, MoreHorizontal, CheckCircle, XCircle, Eye, Trash2, Clock, Edit, Users, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import { useSelector } from 'react-redux';
import Footer from '../shared/Footer';

const EmployerJobs = () => {
  const { user } = useSelector(store => store.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchEmployerJobs();
    }
  }, [user]);

  useEffect(() => {
    let filtered = jobs.filter(job =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  const fetchEmployerJobs = async () => {
    try {
      if (!user) {
        toast.error('Please login to view your jobs');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${JOB_API_END_POINT}/employer/jobs`, {
        withCredentials: true
      });

      if (response.data.success) {
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to continue');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Only employers can view this page.');
        navigate('/');
      } else {
        toast.error('Failed to fetch jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      if (!user) {
        toast.error('Please login to delete jobs');
        navigate('/login');
        return;
      }

      const response = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setJobs(jobs.filter(job => job._id !== jobId));
        toast.success('Job deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to continue');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Only employers can delete jobs.');
      } else {
        toast.error('Failed to delete job');
      }
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

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending Review';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your jobs.</p>
          <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'Employer') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only employers can access this page.</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
                <p className="text-gray-600 mt-2">Manage your job postings and track applications</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{jobs.length} jobs</span>
                </div>
                <Button 
                  onClick={() => navigate('/employer/jobs/create')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>My Jobs</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search your jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Job Title</th>
                        <th className="text-left p-3 font-medium">Location</th>
                        <th className="text-left p-3 font-medium">Salary Range</th>
                        <th className="text-left p-3 font-medium">Openings</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Applications</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job._id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{job.title}</div>
                              <div className="text-sm text-gray-500">{job.type}</div>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{job.location}</td>
                          <td className="p-3 text-sm text-gray-600">
                            {job.salary?.min && job.salary?.max 
                              ? `${job.salary.min}-${job.salary.max} LPA`
                              : `${job.salary} LPA`
                            }
                          </td>
                          <td className="p-3 text-sm text-gray-600">{job.openings || job.position}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusText(job.status)}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                              className="flex items-center gap-1"
                            >
                              <Users className="h-4 w-4" />
                              {job.applicationCount || 0}
                            </Button>
                          </td>
                          <td className="p-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(`/job/${job._id}`, '_blank')}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Public
                                </DropdownMenuItem>
                                {job.status === 'approved' && (
                                  <DropdownMenuItem onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}>
                                    <Users className="mr-2 h-4 w-4" />
                                    View Applications
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Job
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteJob(job._id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm || statusFilter !== 'all' ? 'No jobs match your filters' : 'No jobs posted yet'}
                      {!searchTerm && statusFilter === 'all' && (
                        <div className="mt-4">
                          <Button 
                            onClick={() => navigate('/employer/jobs/create')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Post Your First Job
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default EmployerJobs; 


