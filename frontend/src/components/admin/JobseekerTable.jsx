import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT, ADMIN_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, FileDown, UserCheck, UserX, Trash2, MoreHorizontal, Users, Search, Filter, Calendar, ChevronDown, RefreshCw, Eye, Download, Mail, Phone, MapPin, GraduationCap, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const JobseekerTable = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [filteredJobseekers, setFilteredJobseekers] = useState([]);
  const [selectedJobseeker, setSelectedJobseeker] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, action: '', title: '', description: '', userId: null });
  const [resumeDialog, setResumeDialog] = useState({ open: false, url: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/jobseekers`, { withCredentials: true });
        const jobseekersData = res.data.jobseekers || [];
        setJobseekers(jobseekersData);
        setFilteredJobseekers(jobseekersData);
      } catch (error) {
        console.error("Failed to fetch jobseekers:", error);
        toast.error('Failed to load jobseekers');
      } finally {
        setLoading(false);
      }
    };
    fetchJobseekers();
  }, []);


  useEffect(() => {
    let filtered = jobseekers;

    if (searchTerm) {
      filtered = filtered.filter(jobseeker => 
        jobseeker.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobseeker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobseeker.profile?.place?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(jobseeker => jobseeker.status === statusFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullname.localeCompare(b.fullname);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredJobseekers(filtered);
  }, [jobseekers, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  
  const viewCV = (user) => {
    if (user.profile?.resume) window.open(user.profile.resume, "_blank");
  };

  
  const previewCV = (user) => {
    if (user.profile?.resume) {
      setResumeDialog({ open: true, url: user.profile.resume });
    }
  };

  
  const downloadCV = (user) => {
    if (user.profile?.resume) {
      const link = document.createElement("a");
      link.href = user.profile.resume;
      link.download = user.profile.resumeOriginalName || "resume.pdf";
      link.click();
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(
        `${ADMIN_API_END_POINT}/users/${id}/status`,
        { status },
        { 
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      if (response.data.success) {
        setJobseekers(jobseekers.map(jobseeker => 
          jobseeker._id === id ? { ...jobseeker, status } : jobseeker
        ));
        
        const statusAction = status === 'active' ? 'activated' : 'blocked';
        toast.success(`Jobseeker ${statusAction} successfully`);
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '', userId: null });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update jobseeker status");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `${ADMIN_API_END_POINT}/users/${id}`, 
        { 
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      if (response.data.success) {
        setJobseekers(jobseekers.filter(jobseeker => jobseeker._id !== id));
        if (selectedJobseeker && selectedJobseeker._id === id) {
          setSelectedJobseeker(null);
        }
        toast.success("Jobseeker deleted successfully");
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '', userId: null });
    } catch (error) {
      console.error("Failed to delete jobseeker:", error);
      toast.error("Failed to delete jobseeker");
    }
  };

  const confirmAction = (action, jobseeker) => {
    let title = '';
    let description = '';
    
    switch(action) {
      case 'activate':
        title = 'Activate Jobseeker Account';
        description = `Are you sure you want to activate ${jobseeker.fullname}'s account?`;
        break;
      case 'block':
        title = 'Block Jobseeker Account';
        description = `Are you sure you want to block ${jobseeker.fullname}'s account?`;
        break;
      case 'delete':
        title = 'Delete Jobseeker Account';
        description = `Are you sure you want to delete ${jobseeker.fullname}'s account? This cannot be undone.`;
        break;
      default:
        return;
    }
    
    setActionDialog({
      open: true,
      action,
      title,
      description,
      userId: jobseeker._id
    });
  };

  const executeAction = () => {
    const { action, userId } = actionDialog;
    switch(action) {
      case 'activate':
        handleStatusUpdate(userId, 'active');
        break;
      case 'block':
        handleStatusUpdate(userId, 'blocked');
        break;
      case 'delete':
        handleDeleteUser(userId);
        break;
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'JS';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API_END_POINT}/jobseekers`, { withCredentials: true });
      const jobseekersData = res.data.jobseekers || [];
      setJobseekers(jobseekersData);
      setFilteredJobseekers(jobseekersData);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-600" />
                <span className="break-words">Jobseeker Management</span>
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base lg:text-lg">Manage all jobseeker accounts and their profiles</p>
            </div>
            <Button onClick={refreshData} disabled={loading} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-10 sm:h-11">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 h-10 sm:h-11">
                  <ChevronDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="date">Date Joined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

      
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              Jobseekers ({filteredJobseekers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
        
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b">
                    <TableHead className="font-semibold text-gray-700 py-4">Jobseeker</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact Info</TableHead>
                    <TableHead className="font-semibold text-gray-700">Profile Details</TableHead>
                    <TableHead className="font-semibold text-gray-700">Resume</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 animate-spin text-green-600 mr-2" />
                          <span className="text-gray-600">Loading jobseekers...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredJobseekers.length > 0 ? filteredJobseekers.map(user => (
                    <TableRow key={user._id} className="hover:bg-green-50 transition-colors duration-200 border-b border-gray-100">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 border-2 border-gray-200">
                            <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                            <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                              {getInitials(user.fullname)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{user.fullname}</div>
                            <div className="text-sm text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm max-w-[280px] md:max-w-[360px] truncate">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="truncate text-gray-700">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{user.phoneNumber || "N/A"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.profile?.place && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{user.profile.place}</span>
                            </div>
                          )}
                          {user.profile?.skills && user.profile.skills.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{user.profile.skills.slice(0, 2).join(', ')}</span>
                              {user.profile.skills.length > 2 && <span className="text-gray-500">+{user.profile.skills.length - 2}</span>}
                            </div>
                          )}
                          {user.profile?.education && (
                            <div className="flex items-center gap-2 text-sm">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700 truncate max-w-[150px]">{user.profile.education.degree}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.profile?.resume ? (
                            <>
                              <Button variant="outline" size="sm" onClick={() => previewCV(user)} className="text-blue-600 hover:bg-blue-50">
                                <Eye className="mr-1 h-4 w-4" /> Preview
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => downloadCV(user)} className="text-green-600 hover:bg-green-50">
                                <Download className="mr-1 h-4 w-4" /> Download
                              </Button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">No resume</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(user.status)} border`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedJobseeker(user)}
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {user.status !== 'blocked' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => confirmAction('block', user)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Block
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => confirmAction('activate', user)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activate
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => confirmAction('delete', user)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-500 mb-2">No jobseekers found</p>
                          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-green-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading jobseekers...</p>
                </div>
              ) : filteredJobseekers.length > 0 ? filteredJobseekers.map((user) => (
                <Card key={user._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                          <AvatarFallback className="bg-green-100 text-green-600 font-semibold text-sm">
                            {getInitials(user.fullname)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{user.fullname}</div>
                          <div className="text-xs text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                      <Badge className={`text-xs ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'blocked' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <span className="capitalize">{user.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700 truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">{user.phoneNumber || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">{user.profile?.place || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600">{formatDate(user.createdAt)}</span>
                      </div>
                      {user.profile?.skills && user.profile.skills.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <Award className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {user.profile.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {user.profile.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{user.profile.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedJobseeker(user)}
                        className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {user.profile?.resume && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => previewCV(user)}
                          className="flex-1 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      {user.status !== 'blocked' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => confirmAction('block', user)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => confirmAction('activate', user)}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => confirmAction('delete', user)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
                  <p className="text-lg font-medium text-gray-500 mb-2">No jobseekers found</p>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      
        <Dialog open={!!selectedJobseeker} onOpenChange={() => setSelectedJobseeker(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Jobseeker Details</DialogTitle>
            </DialogHeader>
            {selectedJobseeker && (
              <div className="space-y-3 text-sm">
                <p><strong>Name:</strong> {selectedJobseeker.fullname}</p>
                <p><strong>Email:</strong> {selectedJobseeker.email}</p>
                <p><strong>Phone:</strong> {selectedJobseeker.phoneNumber}</p>
                <p><strong>Place:</strong> {selectedJobseeker.profile?.place || 'N/A'}</p>
                <p><strong>Skills:</strong> {selectedJobseeker.profile?.skills?.map((s,i) => <Badge key={i} className="mr-1">{s}</Badge>)}</p>
                <p><strong>Education:</strong> {selectedJobseeker.profile?.education ? `${selectedJobseeker.profile.education.degree}, ${selectedJobseeker.profile.education.institution}, ${selectedJobseeker.profile.education.yearOfCompletion}` : 'N/A'}</p>
                <p><strong>Experience:</strong> {selectedJobseeker.profile?.experience ? `${selectedJobseeker.profile.experience.years} yrs, ${selectedJobseeker.profile.experience.field}` : 'N/A'}</p>
                <p><strong>Bio:</strong> {selectedJobseeker.profile?.bio || 'N/A'}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedJobseeker(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

     
        <Dialog open={resumeDialog.open} onOpenChange={() => setResumeDialog({ open: false, url: '' })}>
          <DialogContent className="max-w-4xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
            </DialogHeader>
            {resumeDialog.url ? (
              <iframe 
                src={resumeDialog.url} 
                className="w-full h-[75vh] border rounded" 
                title="Resume Preview"
              />
            ) : (
              <p>No resume available</p>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setResumeDialog({ open: false, url: '' })}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    
        <Dialog open={actionDialog.open} onOpenChange={() => setActionDialog({ open: false, action: '', title: '', description: '', userId: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionDialog.title}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-4">
              {actionDialog.description}
            </p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setActionDialog({ open: false, action: '', title: '', description: '', userId: null })}
              >
                Cancel
              </Button>
              <Button 
                onClick={executeAction}
                className={actionDialog.action === 'delete' || actionDialog.action === 'block' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {actionDialog.action === 'activate' ? 'Activate' : 
                 actionDialog.action === 'block' ? 'Block' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobseekerTable;

