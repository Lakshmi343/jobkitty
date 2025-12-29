import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import {  Edit, Eye, Trash2, Search, MapPin, DollarSign, Users, Calendar, Briefcase,  CheckCircle, XCircle, Clock, AlertCircle, MoreHorizontal, TrendingUp,  Building, Filter, RefreshCw, Download, Edit2, AlertTriangle, Star, Plus} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatLocationForDisplay } from '../../utils/locationUtils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow,} from "../ui/table";
import { Popover, PopoverTrigger, PopoverContent,} from "../ui/popover";

const PAGE_SIZE = 20;

const AdminJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  // Fetch categories and companies for filters
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch categories
        const categoriesRes = await axios.get(`${ADMIN_API_END_POINT}/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories || []);
        }

        // Fetch companies
        const companiesRes = await axios.get(`${ADMIN_API_END_POINT}/companies`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (companiesRes.data.success) {
          setCompanies(companiesRes.data.companies || []);
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFiltersData();
  }, []);

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const handleCompanyChange = (value) => {
    setCompanyFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleJobTypeChange = (value) => {
    setJobTypeFilter(value);
    setPage(1);
  };

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    setPage(1);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setAppliedSearch(searchTerm.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setAppliedSearch('');
    setStatusFilter('all');
    setJobTypeFilter('all');
    setDateFilter('');
    setCategoryFilter('all');
    setCompanyFilter('all');
    setPage(1);
  };

  const fetchJobs = useCallback(async (targetPage = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        navigate('/admin/login');
        return;
      }

      const params = new URLSearchParams();
      params.set('page', targetPage);
      params.set('limit', PAGE_SIZE);
      if (appliedSearch) params.set('search', appliedSearch.trim());
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (jobTypeFilter !== 'all') params.set('jobType', jobTypeFilter);
      if (dateFilter) params.set('postedWithin', dateFilter);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (companyFilter !== 'all') params.set('company', companyFilter);

      const response = await axios.get(`${ADMIN_API_END_POINT}/jobs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setJobs(response.data.jobs || []);
        setPaginationData(response.data.pagination || null);
        setStats({
          total: response.data.stats?.total || 0,
          pending: response.data.stats?.status?.pending || 0,
          approved: response.data.stats?.status?.approved || 0,
          rejected: response.data.stats?.status?.rejected || 0
        });
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
  }, [appliedSearch, statusFilter, jobTypeFilter, dateFilter, categoryFilter, companyFilter, navigate]);

  useEffect(() => {
    fetchJobs(page);
  }, [fetchJobs, page]);

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
      let violationType = '';
      
      if (newStatus === 'rejected') {
        reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;
        
        violationType = prompt('Violation type (spam, fake, inappropriate, scam, duplicate, violation, other):') || 'other';
      }

      let endpoint = '';
      let payload = {};
      
      if (newStatus === 'approved') {
        endpoint = `${ADMIN_API_END_POINT}/jobs/${jobId}/approve`;
      } else if (newStatus === 'rejected') {
        endpoint = `${ADMIN_API_END_POINT}/jobs/${jobId}/reject`;
        payload = { reason, violationType };
      }

      const response = await axios.patch(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Job ${newStatus} successfully`);
        fetchJobs(page);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error(error.response?.data?.message || `Failed to ${newStatus} job`);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${ADMIN_API_END_POINT}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Job removed successfully');
        fetchJobs(page);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Could not remove job. Please try again.');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    const normalizeNumber = (val) => {
      if (val == null) return null;
      if (typeof val === 'object') {
        if ('$numberDecimal' in val) return parseFloat(val.$numberDecimal);
        if ('value' in val) return Number(val.value);
      }
      const n = Number(val);
      return isNaN(n) ? null : n;
    };

    if (!salary) return 'Not specified';
    if (typeof salary === 'object') {
      const rawMin = salary.min ?? salary.minimum ?? salary.from ?? salary.start;
      const rawMax = salary.max ?? salary.maximum ?? salary.to ?? salary.end;
      const min = normalizeNumber(rawMin);
      const max = normalizeNumber(rawMax);
      const unit = salary.unit;
      const unitStr = unit ? ` ${unit}` : '';
      if (min != null && max != null) return `${min}-${max}${unitStr}`;
      if (min != null) return `${min}${unitStr}`;
      if (max != null) return `${max}${unitStr}`;
      if (typeof salary.legacy === 'string') return salary.legacy;
      return 'Not specified';
    }
    if (typeof salary === 'number') return `₹${salary.toLocaleString()}`;
    if (typeof salary === 'string') return salary;
    return 'Not specified';
  };

  const renderPagination = () => {
    if (!paginationData?.totalPages || paginationData.totalPages <= 1) {
      return null;
    }

    const totalPages = paginationData.totalPages;
    const current = paginationData.currentPage || page;
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    const startRecord = (current - 1) * PAGE_SIZE + 1;
    const endRecord = Math.min(current * PAGE_SIZE, paginationData.total);

    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-t">
        <p className="text-sm text-gray-600">
          Showing {Math.min(startRecord, paginationData.total)}-
          {Math.min(endRecord, paginationData.total)} of {paginationData.total} jobs
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={!paginationData.hasPrev}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-1 text-sm rounded-md border ${
                pageNumber === current
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={!paginationData.hasNext}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
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
      
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600 mt-2">Manage and approve job postings across the platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/admin/job-posting')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
            <Button onClick={() => fetchJobs(page)} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

     
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

       
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Job Listings</CardTitle>
              <Badge variant="secondary" className="text-sm">
                {jobs.length} of {stats.total} jobs
              </Badge>
            </div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 mt-4">
              <form className="relative flex-1 w-full" onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
                <button type="submit" className="hidden">Search</button>
              </form>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 h-10 min-w-[130px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => handleJobTypeChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 h-10 min-w-[140px]"
                >
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => handleDateFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 h-10 min-w-[140px]"
                >
                  <option value="">Any Date</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 h-10 min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={companyFilter}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 h-10 min-w-[160px]"
                >
                  <option value="all">All Companies</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={handleSearchSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10" 
                  onClick={handleResetFilters} 
                  type="button"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No jobs found</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
              
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="text-left p-3 font-medium">Job Details</TableHead>
                        <TableHead className="text-left p-3 font-medium">Company</TableHead>
                        <TableHead className="text-left p-3 font-medium">Location & Salary</TableHead>
                        <TableHead className="text-left p-3 font-medium">Status</TableHead>
                        <TableHead className="text-left p-3 font-medium">Posted Date</TableHead>
                        <TableHead className="text-left p-3 font-medium">Applicants</TableHead>
                        <TableHead className="text-left p-3 font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
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
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Users className="h-4 w-4 text-gray-500" />
                              <Badge variant="secondary" className="text-xs">
                                {Array.isArray(job?.applications) ? job.applications.length : (job?.applicationsCount || 0)}
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600" onClick={() => navigate(`/admin/applications?jobId=${job._id}`)}>
                                View
                              </Button>
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
                                    onClick={() => navigate(`/job/${job._id}`)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => navigate(`/admin/applications?jobId=${job._id}`)}
                                  >
                                    <Users className="h-4 w-4 mr-2" />
                                    View Applicants
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-blue-600 hover:text-blue-700"
                                    onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                  >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Job
                                  </Button>
                                  {job.status !== 'approved' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start text-green-600 hover:text-green-700"
                                      onClick={() => handleStatusUpdate(job._id, 'approved', 'adminToken')}
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
                                      onClick={() => handleStatusUpdate(job._id, 'rejected', 'adminToken')}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  )}
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteJob(job._id, 'adminToken')}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Job
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

                <div className="md:hidden space-y-4 p-4">
                  {jobs.map((job) => (
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
                        </div>
                        <div className="flex items-center justify-between p-4 border-b">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/job/${job._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <div className="flex gap-2">
                            {job.createdByAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            )}
                            {job.status !== 'approved' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate(job._id, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {job.status !== 'rejected' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(job._id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteJob(job._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
          {renderPagination()}
        </Card>

        
        <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedJob?.title} - Job Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedJob && (
              <div className="space-y-6">
       
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Job Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Title:</span> {selectedJob.title}</div>
                        <div><span className="font-medium">Type:</span> {selectedJob.jobType || 'Full-time'}</div>
                        <div><span className="font-medium">Location:</span> {formatLocationForDisplay(selectedJob.location)}</div>
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

                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedJob.description || 'No description provided'}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Applications ({applications.length})</h3>
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
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {applications.map((application) => (
                        <div key={application._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={application.applicant?.profilePhoto} />
                              <AvatarFallback>
                                {application.applicant?.fullname?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{application.applicant?.fullname || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{application.applicant?.email}</div>
                              <div className="text-xs text-gray-500">{application.applicant?.phoneNumber}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              Applied {formatDate(application.createdAt)}
                            </div>
                            <Badge variant="outline" className="mt-1">
                              {application.status || 'pending'}
                            </Badge>
                          </div>
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
      </div>
    </div>
  );
};

export default AdminJobs;
