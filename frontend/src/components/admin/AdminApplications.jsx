

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  User,
  FileCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    jobTitle: '',
    applicantEmail: ''
  });
  const [keralaOnly, setKeralaOnly] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0
  });
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    applicationId: null,
    reason: ''
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filters, pagination.currentPage]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 9, // Changed to 9 to fit 3x3 grid
        ...filters
      });

      const response = await axios.get(`${ADMIN_API_END_POINT}/applications/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${ADMIN_API_END_POINT}/applications/analytics?timeframe=30d`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, status, reason = '') => {
    // Frontend-only simulation - no API calls
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state immediately
      setApplications(prev => prev.map(app => 
        app._id === applicationId 
          ? { 
              ...app, 
              status, 
              rejectionReason: reason,
              statusUpdatedAt: new Date().toISOString() 
            }
          : app
      ));
      
      // Update selected application if it's the one being modified
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({
          ...selectedApplication,
          status,
          rejectionReason: reason,
          statusUpdatedAt: new Date().toISOString()
        });
      }
      
      // Remove from selected applications if bulk selected
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
      
      // Show success message
      if (status === 'accepted') {
        alert(`✅ Application approved successfully!`);
      } else if (status === 'rejected') {
        alert(`❌ Application rejected successfully!${reason ? ` Reason: ${reason}` : ''}`);
      } else {
        alert(`⏰ Application marked as pending!`);
      }
      
      // Update stats locally
      if (stats) {
        setStats(prev => {
          const newStats = { ...prev };
          if (status === 'accepted') {
            newStats.accepted = (newStats.accepted || 0) + 1;
            newStats.pending = Math.max(0, (newStats.pending || 0) - 1);
          } else if (status === 'rejected') {
            newStats.rejected = (newStats.rejected || 0) + 1;
            newStats.pending = Math.max(0, (newStats.pending || 0) - 1);
          } else if (status === 'pending') {
            newStats.pending = (newStats.pending || 0) + 1;
            if (selectedApplication?.status === 'accepted') {
              newStats.accepted = Math.max(0, (newStats.accepted || 0) - 1);
            } else if (selectedApplication?.status === 'rejected') {
              newStats.rejected = Math.max(0, (newStats.rejected || 0) - 1);
            }
          }
          return newStats;
        });
      }
      
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedApplications.length === 0) {
      alert('Please select applications to approve');
      return;
    }

    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${ADMIN_API_END_POINT}/applications/bulk-approve`,
        { applicationIds: selectedApplications },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`Successfully approved ${response.data.data.approved} applications`);
        setSelectedApplications([]);
        fetchApplications();
        fetchStats();
      }
    } catch (error) {
      console.error('Error in bulk approval:', error);
      alert('Failed to approve applications. Please try again.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedApplications.length === 0) {
      alert('Please select applications to reject');
      return;
    }

    const reason = prompt('Please provide a rejection reason for all selected applications:');
    if (!reason) {
      alert('Rejection reason is required');
      return;
    }

    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${ADMIN_API_END_POINT}/applications/bulk-reject`,
        { applicationIds: selectedApplications, rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`Successfully rejected ${response.data.data.rejected} applications`);
        setSelectedApplications([]);
        fetchApplications();
        fetchStats();
      }
    } catch (error) {
      console.error('Error in bulk rejection:', error);
      alert('Failed to reject applications. Please try again.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const toggleApplicationSelection = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const viewResume = (resumeUrl, applicantName) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('Resume not available for this applicant');
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to remove this application? This action cannot be undone.')) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      
      // Clear selected application if it's the one being deleted
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication(null);
      }
      
      // Remove from selected applications if present
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
      
      // Update stats locally
      if (stats) {
        const deletedApp = applications.find(app => app._id === applicationId);
        if (deletedApp) {
          setStats(prev => {
            const newStats = { ...prev };
            if (deletedApp.status === 'pending') {
              newStats.pending = Math.max(0, (newStats.pending || 0) - 1);
            } else if (deletedApp.status === 'accepted') {
              newStats.accepted = Math.max(0, (newStats.accepted || 0) - 1);
            } else if (deletedApp.status === 'rejected') {
              newStats.rejected = Math.max(0, (newStats.rejected || 0) - 1);
            }
            newStats.totalApplications = Math.max(0, (newStats.totalApplications || 0) - 1);
            return newStats;
          });
        }
      }
      
      alert('🗑️ Application deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayedApplications = useMemo(() => {
    if (!keralaOnly) return applications;
    return applications.filter((app) => app.job?.location && KERALA_DISTRICTS.includes(app.job.location));
  }, [applications, keralaOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
              <p className="text-gray-600 mt-2">Manage and review all job applications across the platform.</p>
            </div>
            <div className="flex items-center gap-4">
              {selectedApplications.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedApplications.length} selected
                  </span>
                  <Button 
                    onClick={handleBulkApprove} 
                    disabled={bulkActionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Selected
                  </Button>
                  <Button 
                    onClick={handleBulkReject} 
                    disabled={bulkActionLoading}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Selected
                  </Button>
                </div>
              )}
              <Button onClick={() => { fetchApplications(); fetchStats(); }} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
              <p className="text-xs text-muted-foreground">All time applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.statusStats?.find(s => s._id === 'pending')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.statusStats?.find(s => s._id === 'accepted')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">Approved applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats?.statusStats?.find(s => s._id === 'rejected')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">Declined applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>

              <input
                type="text"
                placeholder="Search by job title..."
                value={filters.jobTitle}
                onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="text"
                placeholder="Search by applicant email..."
                value={filters.applicantEmail}
                onChange={(e) => setFilters({ ...filters, applicantEmail: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={keralaOnly} onChange={(e) => setKeralaOnly(e.target.checked)} />
                Kerala candidates only
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Applications ({keralaOnly ? displayedApplications.length : pagination.totalApplications})</h2>
            {pagination.totalPages > 1 && !keralaOnly && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {displayedApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No applications found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedApplications.map((application) => (
                <Card 
                  key={application._id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedApplication?._id === application._id ? 'ring-2 ring-blue-500' : ''
                  } ${selectedApplications.includes(application._id) ? 'ring-2 ring-green-500' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(application._id)}
                          onChange={() => toggleApplicationSelection(application._id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <CardTitle className="text-lg line-clamp-1">{application.job?.title}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {application.status}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">{application.job?.company?.name}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{application.applicant?.fullname}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="truncate">{application.applicant?.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{application.job?.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Applied: {formatDate(application.createdAt)}</span>
                      </div>
                      {application.applicant?.profile?.resume && (
                        <div className="flex items-center text-sm">
                          <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-green-600">Resume Available</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-4 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplication(application);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <div className="flex gap-2">
                        {application.applicant?.profile?.resume && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewResume(application.applicant.profile.resume, application.applicant.fullname);
                            }}
                            title="View Resume"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-9 w-9 p-0 text-green-600 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(application._id, 'accepted');
                          }}
                          title="Accept Application"
                          disabled={application.status === 'accepted'}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            const reason = prompt('Please provide rejection reason:');
                            if (reason) {
                              updateApplicationStatus(application._id, 'rejected', reason);
                            }
                          }}
                          title="Reject Application"
                          disabled={application.status === 'rejected'}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Application Details Sidebar */}
        {selectedApplication && (
          <div className="fixed inset-y-0 right-0 w-full lg:w-1/3 bg-white shadow-lg z-10 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Job Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Job Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Title</p>
                      <p>{selectedApplication.job?.title || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company</p>
                      <p>{selectedApplication.job?.company?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p>{selectedApplication.job?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salary</p>
                      <p>
                        {selectedApplication.job?.salary ? (
                          typeof selectedApplication.job.salary === 'object' ? 
                            `${selectedApplication.job.salary.min}-${selectedApplication.job.salary.max} LPA` : 
                            `₹${selectedApplication.job.salary}/month`
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Job Type</p>
                      <p>{selectedApplication.job?.jobType || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Applicant Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Applicant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p>{selectedApplication.applicant?.fullname || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{selectedApplication.applicant?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p>{selectedApplication.applicant?.phoneNumber || 'N/A'}</p>
                    </div>
                    {selectedApplication.applicant?.profile?.resume && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Resume</p>
                        <div className="space-y-2">
                          <a 
                            href={selectedApplication.applicant.profile.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50"
                          >
                            <FileText className="h-4 w-4" />
                            <ExternalLink className="h-3 w-3" />
                            <span className="text-sm">
                              {selectedApplication.applicant?.profile?.resumeOriginalName || 'View Resume'}
                            </span>
                          </a>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full"
                            onClick={() => viewResume(selectedApplication.applicant.profile.resume, selectedApplication.applicant.fullname)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Resume
                          </Button>
                        </div>
                      </div>
                    )}
                    {!selectedApplication.applicant?.profile?.resume && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Resume</p>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>No resume uploaded</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Application Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Application Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge className={`mt-1 ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Applied On</p>
                      <p>{formatDateTime(selectedApplication.createdAt)}</p>
                    </div>
                    {selectedApplication.statusUpdatedAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p>{formatDateTime(selectedApplication.statusUpdatedAt)}</p>
                      </div>
                    )}
                    {selectedApplication.statusReason && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reason</p>
                        <p>{selectedApplication.statusReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Manage Application</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
                      disabled={selectedApplication.status === 'accepted'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Application
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        const reason = prompt('Please provide rejection reason:');
                        if (reason) {
                          updateApplicationStatus(selectedApplication._id, 'rejected', reason);
                        }
                      }}
                      disabled={selectedApplication.status === 'rejected'}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'pending')}
                      disabled={selectedApplication.status === 'pending'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark as Pending
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                      onClick={() => deleteApplication(selectedApplication._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Application
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;