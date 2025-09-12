import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT, ADMIN_API_END_POINT } from '../../utils/constant';
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { UserCheck, UserX, Trash2, Globe, MapPin, Phone, Mail, 
  MoreHorizontal,
  Building,
  Users,
  Briefcase,
  Eye,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Download,
  RefreshCw
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const EmployerTable = () => {
  const [employers, setEmployers] = useState([]);
  const [filteredEmployers, setFilteredEmployers] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState({ open: false, action: '', title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

 
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/employers`, { withCredentials: true });
        const employersData = res.data.employers || [];
        setEmployers(employersData);
        setFilteredEmployers(employersData);
      } catch (error) {
        console.error("Failed to fetch employers:", error);
        toast.error('Failed to load employers');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = employers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(employer => 
        employer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employer.profile?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(employer => employer.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullname.localeCompare(b.fullname);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'company':
          return (a.profile?.company?.name || '').localeCompare(b.profile?.company?.name || '');
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredEmployers(filtered);
  }, [employers, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <UserCheck className="h-3 w-3" />;
      case "inactive": return <UserX className="h-3 w-3" />;
      case "pending": return <Briefcase className="h-3 w-3" />;
      default: return <Briefcase className="h-3 w-3" />;
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.patch(
        `${ADMIN_API_END_POINT}/users/${id}/status`, 
        { status }, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        
        setEmployers(employers.map(employer => 
          employer._id === id ? { ...employer, status } : employer
        ));

        if (selectedEmployer && selectedEmployer._id === id) {
          setSelectedEmployer({ ...selectedEmployer, status });
        }
        
        toast.success(`Employer ${status === 'active' ? 'activated' : 'blocked'} successfully`);
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update employer status");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(
        `${ADMIN_API_END_POINT}/users/${id}`, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
    
        setEmployers(employers.filter(employer => employer._id !== id));
     
        if (selectedEmployer && selectedEmployer._id === id) {
          setSelectedEmployer(null);
        }
        
        toast.success("Employer and associated company/jobs deleted successfully");
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      console.error("Failed to delete employer:", error);
      toast.error("Failed to delete employer");
    }
  };

  const confirmAction = (action, employer) => {
    let title = '';
    let description = '';
    
    switch(action) {
      case 'activate':
        title = 'Activate Employer Account';
        description = `Are you sure you want to activate ${employer.fullname}'s account? This will allow them to access the website and post jobs.`;
        break;
      case 'deactivate':
        title = 'Block Employer Account';
        description = `Are you sure you want to block ${employer.fullname}'s account? This will restrict their access to the website until you unblock them. After unblocking, they can use it again as an employer or jobseeker.`;
        break;
      case 'delete':
        title = 'Delete Employer Account';
        description = `You are viewing this employer's details and their registered company information. Deleting this employer will permanently remove their company and all job posts. This action cannot be undone.`;
        break;
      default:
        return;
    }
    
    setActionDialog({
      open: true,
      action,
      title,
      description,
      employer
    });
  };

  const executeAction = () => {
    const { action, employer } = actionDialog;
    
    switch(action) {
      case 'activate':
        handleStatusUpdate(employer._id, 'active');
        break;
      case 'deactivate':
        handleStatusUpdate(employer._id, 'inactive');
        break;
      case 'delete':
        handleDeleteUser(employer._id);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'EM';
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
      const res = await axios.get(`${USER_API_END_POINT}/employers`, { withCredentials: true });
      const employersData = res.data.employers || [];
      setEmployers(employersData);
      setFilteredEmployers(employersData);
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
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Building className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-600" />
                <span className="break-words">Employer Management</span>
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base lg:text-lg">Manage all employer accounts and their company information</p>
            </div>
            <Button onClick={refreshData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or company..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 h-11">
                  <ChevronDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="date">Date Joined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Table */}
        <Card className="shadow-lg mt-6">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-600" />
              Employers ({filteredEmployers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Employer</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact Info</TableHead>
                    <TableHead className="font-semibold text-gray-700">Company</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date Joined</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                          <span className="text-gray-600">Loading employers...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredEmployers.length > 0 ? filteredEmployers.map((user) => {
                    const company = user.profile?.company;
                    return (
                      <TableRow key={user._id} className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-gray-200">
                              <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
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
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="truncate max-w-[200px] text-gray-700">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{user.phoneNumber || "N/A"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{company?.name || "No Company"}</span>
                            </div>
                            {company?.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{company.location}</span>
                              </div>
                            )}
                            {company?.website && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Globe className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{company.website}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`flex items-center gap-1 py-1 px-3 ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedEmployer(user)}
                              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-500 mb-2">No employers found</p>
                          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {filteredEmployers.length > 0 ? filteredEmployers.map((user) => {
                const company = user.company;
                return (
                  <Card key={user._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                              {getInitials(user.fullname)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{user.fullname}</div>
                            <div className="text-xs text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
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
                          <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700">{company?.name || "No Company"}</span>
                        </div>
                        {company?.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-600">{company.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-600">{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedEmployer(user)}
                        className="w-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              }) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
                  <p className="text-lg font-medium text-gray-500 mb-2">No employers found</p>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

       
        <Dialog open={!!selectedEmployer} onOpenChange={(open) => !open && setSelectedEmployer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Employer Details</DialogTitle>
            </DialogHeader>

            {selectedEmployer && (
              <div className="space-y-6">
       
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p>{selectedEmployer.fullname}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <Badge className={`mt-1 flex items-center gap-1 w-fit ${getStatusColor(selectedEmployer.status)}`}>
                          {getStatusIcon(selectedEmployer.status)}
                          {selectedEmployer.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {selectedEmployer.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {selectedEmployer.phoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

               
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedEmployer.profile?.company ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Company Name</p>
                          <p>{selectedEmployer.profile.company.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Company Type</p>
                          <p>{selectedEmployer.profile.company.companyType || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Number of Employees</p>
                          <p>{selectedEmployer.profile.company.numberOfEmployees || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {selectedEmployer.profile.company.location || "N/A"}
                          </p>
                        </div>
                        {selectedEmployer.profile.company.website && (
                          <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500">Website</p>
                            <a 
                              href={selectedEmployer.profile.company.website} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Globe className="h-4 w-4" />
                              {selectedEmployer.profile.company.website}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No company information available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                      onClick={() => confirmAction('activate', selectedEmployer)}
                      disabled={selectedEmployer.status === 'active'}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      onClick={() => confirmAction('deactivate', selectedEmployer)}
                      disabled={selectedEmployer.status === 'inactive'}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="col-span-2 bg-gray-100 text-red-600 hover:bg-gray-200 border-gray-300"
                      onClick={() => confirmAction('delete', selectedEmployer)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {actionDialog.action === 'delete' && <Trash2 className="w-5 h-5 text-red-600" />}
                {actionDialog.action === 'activate' && <UserCheck className="w-5 h-5 text-green-600" />}
                {actionDialog.action === 'deactivate' && <UserX className="w-5 h-5 text-yellow-600" />}
                {actionDialog.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {actionDialog.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setActionDialog({ open: false, action: '', title: '', description: '' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={executeAction}
                className={`flex-1 ${
                  actionDialog.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 
                  actionDialog.action === 'activate' ? 'bg-green-600 hover:bg-green-700' : 
                  'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {actionDialog.action === 'delete' && 'Delete'}
                {actionDialog.action === 'activate' && 'Activate'}
                {actionDialog.action === 'deactivate' && 'Deactivate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmployerTable;