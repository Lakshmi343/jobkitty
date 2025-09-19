import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { JOB_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Edit, Eye, Trash2, Search, Plus, MapPin, DollarSign, Users, Calendar, Briefcase, ExternalLink, CheckCircle, XCircle, Clock, Filter, ChevronDown, BarChart3, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatLocationForDisplay, getLocationSearchString } from '../../utils/locationUtils';

const EmployerJobs = () => {
  const { user } = useSelector(store => store.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchEmployerJobs();
    }
  }, [user]);

  useEffect(() => {
    let filtered = jobs.filter(job =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocationSearchString(job.location).includes(searchTerm.toLowerCase()) ||
      job.requirements?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'applications') {
        return (b.applicationCount || 0) - (a.applicationCount || 0);
      }
      return 0;
    });

    setFilteredJobs(sorted);
  }, [searchTerm, statusFilter, jobs, sortBy]);

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
      } else {
        toast.error('Failed to fetch jobs');
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
    if (!window.confirm('Are you sure you want to remove this job? This action cannot be undone.')) {
      return;
    }

    try {
      if (!user) {
        toast.error('Please log in to continue.');
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
        toast.error('You do not have permission to remove this job.');
      } else {
        toast.error('Could not remove job. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'rejected': return <XCircle className="h-3 w-3 mr-1" />;
      case 'pending': return <Clock className="h-3 w-3 mr-1" />;
      default: return null;
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={60} />
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
    <div>
      
      <div className="pt-16">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Your Job Postings</h1>
                <p className="text-gray-600 mt-2">Create, monitor, and manage your job opportunities</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}</span>
                </div>
                <Button 
                  onClick={() => navigate('/employer/jobs/create')}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Post New Job
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {jobs.filter(job => job.status === 'approved').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {jobs.filter(job => job.status === 'pending').length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {jobs.reduce((total, job) => total + (job.applicationCount || 0), 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Controls */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-gray-800">Job Postings</CardTitle>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search jobs, locations, skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full md:w-64"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Status: {statusFilter === 'all' ? 'All Status' : getStatusText(statusFilter)}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                            All Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                            Pending Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Sort
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setSortBy('newest')}>
                            Newest First
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                            Oldest First
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('title')}>
                            Title (A-Z)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('applications')}>
                            Most Applications
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <div className="hidden md:flex border border-gray-300 rounded-md overflow-hidden">
                        <Button 
                          variant={viewMode === 'table' ? 'default' : 'ghost'} 
                          size="sm" 
                          className="rounded-none border-r border-gray-300"
                          onClick={() => setViewMode('table')}
                        >
                          Table
                        </Button>
                        <Button 
                          variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                          size="sm" 
                          className="rounded-none"
                          onClick={() => setViewMode('grid')}
                        >
                        card
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {viewMode === 'table' ? (
                  // Table View
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-500 text-sm uppercase">Job Title</th>
                          <th className="text-left p-4 font-medium text-gray-500 text-sm uppercase">Details</th>
                          <th className="text-left p-4 font-medium text-gray-500 text-sm uppercase">Status</th>
                          <th className="text-left p-4 font-medium text-gray-500 text-sm uppercase">Applications</th>
                          <th className="text-left p-4 font-medium text-gray-500 text-sm uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredJobs.map((job) => (
                          <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div>
                                <div className="font-semibold text-gray-900">{job.title}</div>
                                <div className="text-sm text-gray-500 mt-1">{job.type}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {formatLocationForDisplay(job.location)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {job.salary?.min && job.salary?.max 
                                    ? `${job.salary.min}-${job.salary.max} LPA`
                                    : `${job.salary} LPA`
                                  }
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  {job.openings || job.position} position(s)
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getStatusColor(job.status)} border flex items-center w-fit`}>
                                {getStatusIcon(job.status)}
                                {getStatusText(job.status)}
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">
                                Posted: {formatDate(job.createdAt)}
                              </div>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                                className="flex items-center gap-1"
                                disabled={!job.applicationCount}
                              >
                                <Users className="h-4 w-4" />
                                {job.applicationCount || 0}
                                <span className="hidden md:inline"> Applicants</span>
                              </Button>
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => window.open(`/job/${job._id}`, '_blank')}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Public Page
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
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => deleteJob(job._id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Job
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Grid View
                  <div className="p-4">
                    {filteredJobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredJobs.map((job) => (
                          <Card key={job._id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">{job.title}</CardTitle>
                                  <p className="text-sm text-gray-600 mt-1">{job.type}</p>
                                </div>
                                <Badge className={`${getStatusColor(job.status)} border flex items-center`}>
                                  {getStatusIcon(job.status)}
                                  {getStatusText(job.status)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span className="truncate">{formatLocationForDisplay(job.location)}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                                  {job.salary?.min && job.salary?.max 
                                    ? `${job.salary.min}-${job.salary.max} LPA`
                                    : `${job.salary} LPA`
                                  }
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                                  {job.openings || job.position} position(s)
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                  Posted: {formatDate(job.createdAt)}
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                                    className="flex items-center gap-1"
                                    disabled={!job.applicationCount}
                                  >
                                    <Users className="h-4 w-4" />
                                    {job.applicationCount || 0} Applicants
                                  </Button>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => window.open(`/job/${job._id}`, '_blank')}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Public Page
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
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => deleteJob(job._id)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Job
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filter to find what you\'re looking for.'
                            : 'You haven\'t posted any jobs yet.'
                          }
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                          <Button 
                            onClick={() => navigate('/employer/jobs/create')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Post Your First Job
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {filteredJobs.length === 0 && viewMode === 'table' && (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter to find what you\'re looking for.'
                        : 'You haven\'t posted any jobs yet.'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Button 
                        onClick={() => navigate('/employer/jobs/create')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
     
      </div>
    </div>
  );
};

export default EmployerJobs;