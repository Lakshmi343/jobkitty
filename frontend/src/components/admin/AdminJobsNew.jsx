import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { 
  Briefcase, Search, MoreHorizontal, CheckCircle, XCircle, Eye, Trash2, Clock,
  TrendingUp, Users, Building, MapPin, DollarSign, Calendar, Filter,
  RefreshCw, Download, Edit2, AlertTriangle, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatLocationForDisplay, getLocationSearchString } from '../../utils/locationUtils';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs.filter(job =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocationSearchString(job.location).includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  useEffect(() => {
    if (jobs.length > 0) {
      const newStats = {
        total: jobs.length,
        pending: jobs.filter(job => job.status === 'pending').length,
        approved: jobs.filter(job => job.status === 'approved').length,
        rejected: jobs.filter(job => job.status === 'rejected').length
      };
      setStats(newStats);
    }
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        toast.error('Authentication required. Please login again.');
        return;
      }
      const response = await axios.get(`${ADMIN_API_END_POINT}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        toast.error('Failed to fetch jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async (jobId) => {
    try {
      setApplicationsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${ADMIN_API_END_POINT}/jobs/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000
      });

      if (response.data.success) {
        setJobApplications(response.data.applications || []);
      } else {
        setJobApplications([]);
      }
    } catch (error) {
      console.error('Error fetching job applications:', error);
      setJobApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    fetchJobApplications(job._id);
  };

  const approveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(
        `${ADMIN_API_END_POINT}/jobs/${jobId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobs(jobs.map(job => 
          job._id === jobId ? { ...job, status: 'approved' } : job
        ));
      }
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const rejectJob = async (jobId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(
        `${ADMIN_API_END_POINT}/jobs/${jobId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobs(jobs.map(job => 
          job._id === jobId ? { ...job, status: 'rejected', rejectionReason: reason } : job
        ));
      }
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${ADMIN_API_END_POINT}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setJobs(jobs.filter(job => job._id !== jobId));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
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
      <div className='py-12 flex flex-col items-center justify-center text-gray-500'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mt-3 text-sm">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600 mt-2">Manage and approve job postings across the platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={fetchJobs} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
              <Briefcase className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">All job postings</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
              <p className="text-xs text-gray-500 mt-1">Active listings</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
              <p className="text-xs text-gray-500 mt-1">Declined posts</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Listings ({filteredJobs.length})
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {filteredJobs.length} of {jobs.length} jobs
              </Badge>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 h-10 min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No jobs found</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Job Details</TableHead>
                        <TableHead className="font-semibold text-gray-900">Company</TableHead>
                        <TableHead className="font-semibold text-gray-900">Location & Salary</TableHead>
                        <TableHead className="font-semibold text-gray-900">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900">Posted</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => {
                        const status = getStatusColor(job.status);
                        return (
                          <TableRow key={job._id} className="hover:bg-gray-50 transition-colors duration-200">
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Badge variant="outline" className="text-xs">{job.jobType || job.type}</Badge>
                                  {job.experience && (
                                    <span className="text-xs text-gray-500">{job.experience} exp</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8 border border-gray-200">
                                  <AvatarImage src={job.company?.logo} alt={job.company?.name} />
                                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                                    {(job.company?.name || 'CO').slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">{job.company?.name || 'Unknown Company'}</p>
                                  <p className="text-xs text-gray-500">{job.company?.industry || 'N/A'}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-sm text-gray-900">
                                  <MapPin className="w-3 h-3 text-gray-500" />
                                  <span>{formatLocationForDisplay(job.location) || 'Remote'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <DollarSign className="w-3 h-3 text-gray-500" />
                                  <span>{job.salary ? `${job.salary} LPA` : 'Not disclosed'}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={status}>
                                {job.status || 'pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="w-3 h-3 text-gray-500" />
                                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2" align="end">
                                  <div className="space-y-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start gap-2 h-9"
                                      onClick={() => handleViewJob(job)}
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </Button>
                                    {job.status === 'pending' && (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="w-full justify-start gap-2 h-9 text-green-600"
                                          onClick={() => approveJob(job._id)}
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                          Approve
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="w-full justify-start gap-2 h-9 text-red-600"
                                          onClick={() => rejectJob(job._id)}
                                        >
                                          <XCircle className="w-4 h-4" />
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start gap-2 h-9"
                                      onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start gap-2 h-9 text-red-600"
                                      onClick={() => deleteJob(job._id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile list */}
                <div className="md:hidden space-y-3 p-4">
                  {filteredJobs.map((job) => {
                    const status = getStatusColor(job.status);
                    return (
                      <div key={job._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-6 h-6 border border-gray-200">
                                <AvatarImage src={job.company?.logo} alt={job.company?.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                  {(job.company?.name || 'CO').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{job.company?.name || 'Unknown Company'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {formatLocationForDisplay(job.location) || 'Remote'}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {job.salary ? `${job.salary} LPA` : 'Not disclosed'}
                              </span>
                            </div>
                          </div>
                          <Badge className={status}>
                            {job.status || 'pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewJob(job)}>
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            {job.status === 'pending' && (
                              <>
                                <Button size="sm" variant="secondary" onClick={() => approveJob(job._id)}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => rejectJob(job._id)}>
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Job Details Modal */}
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {selectedJob?.title} - Job Details
              </DialogTitle>
            </DialogHeader>

            {selectedJob && (
              <div className="space-y-6">
                {/* Job Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-16 h-16 border-2 border-gray-200">
                        <AvatarImage src={selectedJob.company?.logo} alt={selectedJob.company?.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                          {selectedJob.company?.name?.slice(0, 2).toUpperCase() || 'CO'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                        <p className="text-gray-600">{selectedJob.company?.name || 'Unknown Company'}</p>
                        <Badge className={getStatusColor(selectedJob.status)}>
                          {selectedJob.status || 'pending'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Job Type</p>
                        <p className="text-gray-900">{selectedJob.jobType || selectedJob.type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Experience Required</p>
                        <p className="text-gray-900">{selectedJob.experience || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="flex items-center gap-1 text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {selectedJob.location || 'Remote'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Salary</p>
                        <p className="flex items-center gap-1 text-gray-900">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          {selectedJob.salary ? `${selectedJob.salary} LPA` : 'Not disclosed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {selectedJob.description || 'No description available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Requirements</p>
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {selectedJob.requirements || 'No requirements specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Posted Date</p>
                      <p className="flex items-center gap-1 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Applications ({jobApplications.length})
                  </h4>
                  
                  {applicationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner size={24} />
                      <span className="ml-2 text-gray-500">Loading applications...</span>
                    </div>
                  ) : jobApplications.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {jobApplications.map((application) => (
                        <div key={application._id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">{application.applicant?.name || 'Unknown Applicant'}</h5>
                              <p className="text-sm text-gray-600 mt-1">{application.applicant?.email || 'No email'}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>📧 {application.applicant?.email || 'N/A'}</span>
                                <span>📱 {application.applicant?.phone || 'N/A'}</span>
                                <span>📅 {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {application.status || 'Applied'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>No applications found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminJobs;
