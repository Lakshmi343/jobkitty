import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {  Flag,  Eye,  CheckCircle,  XCircle,  Clock, AlertTriangle, User, Building2, Briefcase,FileText,  MessageSquare,  Gavel} from 'lucide-react';

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    reportType: ''
  });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.reportType) params.append('reportType', filters.reportType);

      const response = await axios.get(`${ADMIN_API_END_POINT}/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignReport = async (reportId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(`${ADMIN_API_END_POINT}/reports/${reportId}/assign`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const resolveReport = async (reportId, action, details) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(`${ADMIN_API_END_POINT}/reports/${reportId}/resolve`, {
        action,
        details,
        status: 'resolved'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchReports();
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'user': return <User className="h-4 w-4" />;
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'application': return <FileText className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600 mt-2">Handle user reports and complaints</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filters.reportType}
                onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">All Types</option>
                <option value="spam">Spam</option>
                <option value="fake">Fake</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="scam">Scam</option>
                <option value="duplicate">Duplicate</option>
                <option value="violation">Violation</option>
                <option value="other">Other</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reports ({reports.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div 
                      key={report._id} 
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedReport?._id === report._id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getReportTypeIcon(report.reportedItem.type)}
                            <h4 className="font-medium">{report.reportType}</h4>
                            <Badge className={getPriorityColor(report.priority)}>
                              {report.priority}
                            </Badge>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {report.description.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>By: {report.reporter?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            {report.assignedTo && (
                              <>
                                <span>•</span>
                                <span>Assigned to: {report.assignedTo.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {report.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                assignReport(report._id);
                              }}
                            >
                              Assign
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(report);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {reports.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No reports found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Details */}
          <div className="lg:col-span-1">
            {selectedReport ? (
              <Card>
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Report Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Type:</strong> {selectedReport.reportType}</p>
                        <p><strong>Priority:</strong> 
                          <Badge className={`ml-2 ${getPriorityColor(selectedReport.priority)}`}>
                            {selectedReport.priority}
                          </Badge>
                        </p>
                        <p><strong>Status:</strong> 
                          <Badge className={`ml-2 ${getStatusColor(selectedReport.status)}`}>
                            {selectedReport.status}
                          </Badge>
                        </p>
                        <p><strong>Reported Item:</strong> {selectedReport.reportedItem.type}</p>
                        <p><strong>Reporter:</strong> {selectedReport.reporter?.name || 'Unknown'}</p>
                        <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedReport.description}</p>
                    </div>

                    {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Evidence</h4>
                        <div className="space-y-2">
                          {selectedReport.evidence.map((evidence, index) => (
                            <div key={index} className="text-sm">
                              <p><strong>Description:</strong> {evidence.description}</p>
                              <a href={evidence.type} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View Evidence
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedReport.status === 'investigating' && (
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => resolveReport(selectedReport._id, 'resolved', 'Issue resolved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => resolveReport(selectedReport._id, 'dismissed', 'Report dismissed')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-center py-8">Select a report to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement; 