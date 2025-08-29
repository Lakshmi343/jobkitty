// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { 
//   UserCheck, UserX, Trash2, Globe, MapPin, Phone, Mail, MoreHorizontal 
// } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

// const EmployerTable = () => {
//   const [employers, setEmployers] = useState([]);
//   const [selectedEmployer, setSelectedEmployer] = useState(null);

//   // Fetch employers from your API
//   useEffect(() => {
//     const fetchEmployers = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/user/employers", { withCredentials: true });
//         setEmployers(res.data.employers || []);
//       } catch (error) {
//         console.error("Failed to fetch employers:", error);
//       }
//     };
//     fetchEmployers();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active": return "bg-green-100 text-green-800";
//       case "inactive": return "bg-red-100 text-red-800";
//       case "pending": return "bg-yellow-100 text-yellow-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const updateUserStatus = (id, status) => {
//     console.log(`Update employer ${id} to ${status}`);
//     // Add your API call here to update status
//   };

//   const deleteUser = (id) => {
//     console.log(`Delete employer ${id}`);
//     // Add your API call here to delete employer
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Employer Management</h1>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b bg-gray-100">
//                 <th className="p-3">Employer</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Company</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employers.length > 0 ? employers.map((user) => {
//                 const company = user.profile?.company;
//                 return (
//                   <tr key={user._id} className="border-b hover:bg-gray-50">
//                     <td className="p-3 font-medium cursor-pointer" onClick={() => setSelectedEmployer(user)}>
//                       {user.fullname}
//                     </td>
//                     <td className="p-3 flex items-center gap-1"><Mail className="h-4 w-4 text-gray-500"/> {user.email}</td>
//                     <td className="p-3 flex items-center gap-1"><Phone className="h-4 w-4 text-gray-500"/> {user.phoneNumber}</td>
//                     <td className="p-3">{company?.name || "-"}</td>
//                     <td className="p-3">
//                       <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
//                     </td>
//                     <td className="p-3">
//                       <Button variant="outline" size="sm" onClick={() => setSelectedEmployer(user)}>
//                         <MoreHorizontal className="h-4 w-4" />
//                         Details
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-6 text-gray-500">No employers found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Modal for More Details */}
//         <Dialog open={!!selectedEmployer} onOpenChange={() => setSelectedEmployer(null)}>
//           <DialogContent className="max-w-xl">
//             <DialogHeader>
//               <DialogTitle>Employer Details</DialogTitle>
//             </DialogHeader>

//             {selectedEmployer && (
//               <div className="space-y-3 text-sm">
//                 <p><strong>Name:</strong> {selectedEmployer.fullname}</p>
//                 <p><strong>Email:</strong> {selectedEmployer.email}</p>
//                 <p><strong>Phone:</strong> {selectedEmployer.phoneNumber}</p>
//                 <p><strong>Status:</strong> 
//                   <Badge className={`ml-2 ${getStatusColor(selectedEmployer.status)}`}>
//                     {selectedEmployer.status}
//                   </Badge>
//                 </p>

//                 <h4 className="font-medium mt-3">Company Info</h4>
//                 {selectedEmployer.profile?.company ? (
//                   <div className="space-y-1 text-sm">
//                     <p><strong>Name:</strong> {selectedEmployer.profile.company.name}</p>
//                     <p><strong>Type:</strong> {selectedEmployer.profile.company.companyType}</p>
//                     <p><strong>Employees:</strong> {selectedEmployer.profile.company.numberOfEmployees}</p>
//                     <p><strong>Location:</strong> {selectedEmployer.profile.company.location}</p>
//                     {selectedEmployer.profile.company.website && (
//                       <p>
//                         <strong>Website:</strong> <a href={selectedEmployer.profile.company.website} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1"><Globe className="h-4 w-4"/> Visit</a>
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <p>N/A</p>
//                 )}
//               </div>
//             )}

//             <DialogFooter className="flex flex-col gap-2">
//               <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => updateUserStatus(selectedEmployer._id, "active")}>Activate</Button>
//               <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => updateUserStatus(selectedEmployer._id, "inactive")}>Deactivate</Button>
//               <Button className="w-full bg-gray-200 hover:bg-gray-300" onClick={() => deleteUser(selectedEmployer._id)}>Delete</Button>
//               <Button variant="outline" className="w-full" onClick={() => setSelectedEmployer(null)}>Close</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default EmployerTable;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  UserCheck, 
  UserX, 
  Trash2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
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

  // Fetch employers from your API
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/v1/user/employers", { withCredentials: true });
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
      // Add your API call here to update status
      console.log(`Update employer ${id} to ${status}`);
      // Example: await axios.patch(`/api/v1/user/${id}/status`, { status }, { withCredentials: true });
      
      // Update local state
      setEmployers(employers.map(employer => 
        employer._id === id ? { ...employer, status } : employer
      ));
      
      // If we're viewing this employer's details, update that too
      if (selectedEmployer && selectedEmployer._id === id) {
        setSelectedEmployer({ ...selectedEmployer, status });
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      // Add your API call here to delete employer
      console.log(`Delete employer ${id}`);
      // Example: await axios.delete(`/api/v1/user/${id}`, { withCredentials: true });
      
      // Update local state
      setEmployers(employers.filter(employer => employer._id !== id));
      
      // If we're viewing this employer's details, close the dialog
      if (selectedEmployer && selectedEmployer._id === id) {
        setSelectedEmployer(null);
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '' });
    } catch (error) {
      console.error("Failed to delete employer:", error);
    }
  };

  const confirmAction = (action, employer) => {
    let title = '';
    let description = '';
    
    switch(action) {
      case 'activate':
        title = 'Activate Employer Account';
        description = `Are you sure you want to activate ${employer.fullname}'s account?`;
        break;
      case 'deactivate':
        title = 'Deactivate Employer Account';
        description = `Are you sure you want to deactivate ${employer.fullname}'s account?`;
        break;
      case 'delete':
        title = 'Delete Employer Account';
        description = `Are you sure you want to delete ${employer.fullname}'s account? This action cannot be undone.`;
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

        {/* Employer Details Dialog */}
        <Dialog open={!!selectedEmployer} onOpenChange={(open) => !open && setSelectedEmployer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Employer Details</DialogTitle>
            </DialogHeader>

            {selectedEmployer && (
              <div className="space-y-6">
                {/* Personal Information */}
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

                {/* Company Information */}
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

                {/* Actions */}
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