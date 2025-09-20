import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { JOB_API_END_POINT, ADMIN_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Edit, Eye, Trash2, Search, MapPin, DollarSign, Users, Calendar, Briefcase, CheckCircle, XCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { formatLocationForDisplay, getLocationSearchString } from '../../utils/locationUtils';
import { 
  Briefcase, Search, MoreHorizontal, CheckCircle, XCircle, Eye, Trash2, Clock,
  TrendingUp, Users, Building, MapPin, DollarSign, Calendar, Filter,
  RefreshCw, Download, Edit2, AlertTriangle, Star, ExternalLink, Mail, Phone,
  FileText, User, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';

const AdminJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [expandedApplications, setExpandedApplications] = useState(new Set());
  const [jobApplicationCounts, setJobApplicationCounts] = useState({});

  // Statistics
  const stats = {
    total: jobs.length,
    pending: jobs.filter(job => job.status === 'pending').length,
    approved: jobs.filter(job => job.status === 'approved').length,
    rejected: jobs.filter(job => job.status === 'rejected').length
  };

  const handleBulkApprove = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        return;
      }
      const confirm = window.confirm('Approve all pending jobs? This will set status=approved for every pending job.');
      if (!confirm) return;

      const res = await axios.post(`${ADMIN_API_END_POINT}/jobs/bulk-approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Approved all pending jobs');
        await fetchJobs();
      } else {
        toast.error(res.data?.message || 'Bulk approve failed');
      }
    } catch (error) {
      console.error('Bulk approve error:', error);
      toast.error(error.response?.data?.message || 'Bulk approve failed');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter]);

  const fetchJobs = async () => {
    try {
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
        // Fetch application counts for each job
        fetchApplicationCounts(response.data.jobs);
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

  const fetchApplicationCounts = async (jobsList) => {
    try {
      const token = localStorage.getItem('adminToken');
      const counts = {};
      
      // Fetch application count for each job
      await Promise.all(
        jobsList.map(async (job) => {
          try {
            const response = await axios.get(`${ADMIN_API_END_POINT}/jobs/${job._id}/applications`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
              counts[job._id] = response.data.applications.length;
            } else {
              counts[job._id] = 0;
            }
          } catch (error) {
            console.error(`Error fetching applications for job ${job._id}:`, error);
            counts[job._id] = 0;
          }
        })
      );
      
      setJobApplicationCounts(counts);
    } catch (error) {
      console.error('Error fetching application counts:', error);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLocationSearchString(job.location).includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      let reason = '';
      
      if (newStatus === 'rejected') {
        reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;
      }

      const response = await axios.patch(
        `${ADMIN_API_END_POINT}/jobs/${jobId}/status`,
        { status: newStatus, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setJobs(jobs.map(job => 
          job._id === jobId ? { ...job, status: newStatus } : job
        ));
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

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

  const fetchJobApplications = async (jobId) => {
    setLoadingApplications(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${ADMIN_API_END_POINT}/jobs/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
    fetchJobApplications(job._id);
  };

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
    fetchJobApplications(job._id);
  };

  const handleViewJobDetails = (jobId) => {
    navigate(`/job/${jobId}?section=header`);
  };

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantModal(true);
  };

  const toggleApplicationExpansion = (applicationId) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId);
    } else {
      newExpanded.add(applicationId);
    }
    setExpandedApplications(newExpanded);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = filename || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const generatePreviewUrl = (url) => {
    if (!url) return null;
    
    try {
      if (url.includes('cloudinary.com')) {
        if (url.includes('/raw/upload/')) {
          return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        }
        return url;
      }
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    } catch (error) {
      console.error('Error generating preview URL:', error);
      return null;
    }
  };

  const handlePreview = (url, filename) => {
    if (!url) return;
    
    const previewUrl = generatePreviewUrl(url);
    if (previewUrl) {
      setPreviewUrl(previewUrl);
    } else {
      window.open(url, '_blank');
    }
  };

  const getApplicationStats = () => {
    if (!applications || applications.length === 0) {
      return { total: 0, pending: 0, accepted: 0, rejected: 0 };
    }
    
    const stats = {
      total: applications.length,
      pending: 0,
      accepted: 0,
      rejected: 0
    };

    applications.forEach(app => {
      const status = (app.status || 'pending').toLowerCase();
      if (status === 'pending') {
        stats.pending++;
      } else if (status === 'accepted') {
        stats.accepted++;
      } else if (status === 'rejected') {
        stats.rejected++;
      } else {
        stats.pending++;
      }
    });

    return stats;
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    
    const statusConfig = {
      'pending': { 
        variant: 'secondary', 
        icon: Clock, 
        color: 'bg-yellow-100 text-yellow-800',
        displayText: 'Pending'
      },
      'accepted': { 
        variant: 'default', 
        icon: CheckCircle, 
        color: 'bg-green-100 text-green-800',
        displayText: 'Accepted'
      },
      'rejected': { 
        variant: 'destructive', 
        icon: XCircle, 
        color: 'bg-red-100 text-red-800',
        displayText: 'Rejected'
      }
    };

    const config = statusConfig[statusLower] || statusConfig['pending'];
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
        <IconComponent className="w-3 h-3" />
        {config.displayText}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return `$${salary.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
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
            <Button onClick={handleBulkApprove} variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve All Pending
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
              <p className="text-xs text-gray-500 mt-1">Live on platform</p>
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

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Job Listings</CardTitle>
              <Badge variant="secondary" className="text-sm">
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
                        <TableHead className="text-left p-3 font-medium">Job Details</TableHead>
                        <TableHead className="text-left p-3 font-medium">Company</TableHead>
                        <TableHead className="text-left p-3 font-medium">Location & Salary</TableHead>
                        <TableHead className="text-left p-3 font-medium">Applicants</TableHead>
                        <TableHead className="text-left p-3 font-medium">Status</TableHead>
                        <TableHead className="text-left p-3 font-medium">Posted Date</TableHead>
                        <TableHead className="text-left p-3 font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow key={job._id} className="hover:bg-gray-50">
                          <TableCell className="p-3">
                            <div>
                              <div className="font-medium text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-500">{job.jobType || 'Full-time'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="p-3">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{job.company?.name || 'Unknown Company'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                {formatLocationForDisplay(job.location)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <DollarSign className="h-3 w-3" />
                                {formatSalary(job.salary)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => handleViewApplications(job)}
                            >
                              <Users className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-600">
                                {jobApplicationCounts[job._id] || 0}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(jobApplicationCounts[job._id] || 0) === 1 ? 'applicant' : 'applicants'}
                              </span>
                            </Button>
                          </TableCell>
                          <TableCell className="p-3">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status || 'pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-3">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              {formatDate(job.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="p-3">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48" align="end">
                                <div className="space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleViewJob(job)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Modal
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-blue-600 hover:text-blue-700"
                                    onClick={() => handleViewJobDetails(job._id)}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                  {job.status !== 'approved' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start text-green-600 hover:text-green-700"
                                      onClick={() => handleStatusUpdate(job._id, 'approved')}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                  )}
                                  {job.status !== 'rejected' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start text-red-600 hover:text-red-700"
                                      onClick={() => handleStatusUpdate(job._id, 'rejected')}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteJob(job._id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile view */}
                <div className="md:hidden space-y-4 p-4">
                  {filteredJobs.map((job) => (
                    <Card key={job._id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company?.name || 'Unknown Company'}</p>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status || 'pending'}
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {formatLocationForDisplay(job.location)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary(job.salary)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {formatDate(job.createdAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 hover:bg-blue-50"
                              onClick={() => handleViewApplications(job)}
                            >
                              <Users className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-600 font-medium">
                                {jobApplicationCounts[job._id] || 0} applicants
                              </span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewJob(job)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {job.status !== 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleStatusUpdate(job._id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {job.status !== 'rejected' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(job._id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Job Details Modal */}
        <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedJob?.title} - Job Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedJob && (
              <div className="space-y-6">
                {/* Job Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Job Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Title:</span> {selectedJob.title}</div>
                        <div><span className="font-medium">Type:</span> {selectedJob.jobType || 'Full-time'}</div>
                        <div><span className="font-medium">Location:</span> {selectedJob.location || 'Remote'}</div>
                        <div><span className="font-medium">Salary:</span> {formatSalary(selectedJob.salary)}</div>
                        <div><span className="font-medium">Experience:</span> {selectedJob.experienceLevel || 'Not specified'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Company Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Name:</span> {selectedJob.company?.name || 'Unknown'}</div>
                        <div><span className="font-medium">Website:</span> {selectedJob.company?.website || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                      <div className="text-sm text-gray-600">
                        {selectedJob.requirements ? (
                          <ul className="list-disc list-inside space-y-1">
                            {selectedJob.requirements.split('\n').map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        ) : (
                          'No requirements specified'
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedJob.description || 'No description provided'}
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Applications ({applications.length})</h3>
                    {applications.length > 0 && (
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Pending: {getApplicationStats().pending}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Accepted: {getApplicationStats().accepted}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Rejected: {getApplicationStats().rejected}</span>
                      </div>
                    )}
                  </div>
                  {loadingApplications ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      No applications yet
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {applications.map((application) => (
                        <div key={application._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-12 w-12 cursor-pointer" onClick={() => handleViewApplicant(application)}>
                                <AvatarImage src={application.applicant?.profile?.profilePhoto || application.applicant?.profilePhoto} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                  {getInitials(application.applicant?.fullname)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleViewApplicant(application)}>
                                    {application.applicant?.fullname || 'Unknown'}
                                  </h4>
                                  {getStatusBadge(application.status)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{application.applicant?.email}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{application.applicant?.phoneNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Applied {formatDate(application.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {application.applicant?.profile?.resume && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreview(application.applicant.profile.resume, application.applicant?.profile?.resumeOriginalName)}
                                    className="text-xs"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => downloadFile(application.applicant.profile.resume, application.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewApplicant(application)}
                                className="text-xs"
                              >
                                <User className="w-3 h-3 mr-1" />
                                View Profile
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleApplicationExpansion(application._id)}
                              >
                                {expandedApplications.has(application._id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          
                          {expandedApplications.has(application._id) && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                                  <div className="space-y-1 text-gray-600">
                                    <div><span className="font-medium">Email:</span> {application.applicant?.email || 'N/A'}</div>
                                    <div><span className="font-medium">Phone:</span> {application.applicant?.phoneNumber || 'N/A'}</div>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-2">Application Details</h5>
                                  <div className="space-y-1 text-gray-600">
                                    <div><span className="font-medium">Status:</span> {application.status || 'Pending'}</div>
                                    <div><span className="font-medium">Applied:</span> {formatDate(application.createdAt)}</div>
                                    {application.rejectionReason && (
                                      <div><span className="font-medium">Rejection Reason:</span> {application.rejectionReason}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {application.applicant?.profile?.bio && (
                                <div className="mt-4">
                                  <h5 className="font-medium text-gray-900 mb-2">Bio</h5>
                                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{application.applicant.profile.bio}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowJobModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Applicant Profile Modal */}
        <Dialog open={showApplicantModal} onOpenChange={setShowApplicantModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5" />
                Applicant Profile - {selectedApplicant?.applicant?.fullname || 'Unknown'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedApplicant && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="flex items-start gap-6">
                  <Avatar className="h-20 w-20 border-4 border-gray-200">
                    <AvatarImage 
                      src={selectedApplicant.applicant?.profile?.profilePhoto || selectedApplicant.applicant?.profilePhoto} 
                      alt={selectedApplicant.applicant?.fullname} 
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xl">
                      {getInitials(selectedApplicant.applicant?.fullname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedApplicant.applicant?.fullname || 'Unknown'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{selectedApplicant.applicant?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{selectedApplicant.applicant?.phoneNumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Applied {formatDate(selectedApplicant.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedApplicant.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Profile Information</h4>
                      <div className="space-y-2 text-sm">
                        {selectedApplicant.applicant?.profile?.bio && (
                          <div>
                            <span className="font-medium text-gray-700">Bio:</span>
                            <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded">{selectedApplicant.applicant.profile.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Application Status</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Status:</span> {selectedApplicant.status || 'Pending'}</div>
                        <div><span className="font-medium">Applied Date:</span> {formatDate(selectedApplicant.createdAt)}</div>
                        {selectedApplicant.rejectionReason && (
                          <div>
                            <span className="font-medium">Rejection Reason:</span>
                            <p className="text-red-600 mt-1">{selectedApplicant.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Section */}
                {selectedApplicant.applicant?.profile?.resume && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Resume</h4>
                    <div className="flex gap-3 mb-4">
                      <Button
                        variant="outline"
                        onClick={() => handlePreview(selectedApplicant.applicant.profile.resume, selectedApplicant.applicant?.profile?.resumeOriginalName)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Resume
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadFile(selectedApplicant.applicant.profile.resume, selectedApplicant.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedApplicant.applicant.profile.resume, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplicantModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resume Preview Modal */}
        <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
          <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0">
            <DialogHeader className="p-4 pb-2 border-b">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Preview
              </DialogTitle>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPreviewUrl(null)}
                >
                  Close Preview
                </Button>
              </div>
            </DialogHeader>
            <div className="w-full h-[calc(90vh-120px)] bg-gray-50 relative">
              {previewUrl && (
                <iframe 
                  src={previewUrl} 
                  title="Resume Preview" 
                  width="100%" 
                  height="100%" 
                  className="border-0 rounded-md"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminJobs;
