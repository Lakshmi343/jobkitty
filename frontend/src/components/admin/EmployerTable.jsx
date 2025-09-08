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
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const EmployerTable = () => {
  const [employers, setEmployers] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState({ open: false, action: '', title: '', description: '' });

 
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/employers`, { withCredentials: true });
        setEmployers(res.data.employers || []);
      } catch (error) {
        console.error("Failed to fetch employers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

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

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Employer Management</h1>
          <p className="text-gray-600 mt-2">Manage all employer accounts and their company information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employers ({employers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableHead className="font-semibold">Employer</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employers.length > 0 ? employers.map((user) => {
                    const company = user.profile?.company;
                    return (
                      <TableRow key={user._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium">{user.fullname}</div>
                          <div className="text-sm text-gray-500">ID: {user._id.substring(0, 8)}...</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="truncate max-w-[180px]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{user.phoneNumber || "N/A"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{company?.name || "-"}</span>
                            </div>
                            {company?.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{company.location}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`flex items-center gap-1 py-1 ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedEmployer(user)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-12 w-12 text-gray-400 mb-2" />
                          <p>No employers found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionDialog.title}</DialogTitle>
              <DialogDescription>{actionDialog.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog({ open: false, action: '', title: '', description: '' })}>
                Cancel
              </Button>
              <Button 
                onClick={executeAction}
                className={
                  actionDialog.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 
                  actionDialog.action === 'activate' ? 'bg-green-600 hover:bg-green-700' : 
                  'bg-yellow-600 hover:bg-yellow-700'
                }
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmployerTable;