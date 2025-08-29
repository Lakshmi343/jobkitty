// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { ADMIN_API_END_POINT } from '../../utils/constant';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { 
//   FileText, 
//   Users, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   TrendingUp,
//   Search,
//   Filter,
//   Eye,
//   Edit,
//   Trash2,
//   Download,
//   RefreshCw,
//   Calendar,
//   Building2,
//   MapPin,
//   DollarSign
// } from 'lucide-react';

// const KERALA_DISTRICTS = [
//   "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
//   "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
//   "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
// ];

// const AdminApplications = () => {
//   const [applications, setApplications] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [filters, setFilters] = useState({
//     status: '',
//     jobId: '',
//     userId: ''
//   });
//   const [keralaOnly, setKeralaOnly] = useState(false);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalApplications: 0
//   });

//   useEffect(() => {
//     fetchApplications();
//     fetchStats();
//   }, [filters, pagination.currentPage]);

//   const fetchApplications = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const params = new URLSearchParams({
//         page: pagination.currentPage,
//         limit: 20,
//         ...filters
//       });

//       const response = await axios.get(`${ADMIN_API_END_POINT}/applications?${params}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setApplications(response.data.applications);
//         setPagination(response.data.pagination);
//       }
//     } catch (error) {
//       console.error('Error fetching applications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const response = await axios.get(`${ADMIN_API_END_POINT}/applications/stats`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setStats(response.data.stats);
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   const updateApplicationStatus = async (applicationId, status, reason = '') => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const response = await axios.patch(`${ADMIN_API_END_POINT}/applications/${applicationId}/status`, {
//         status,
//         reason
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         fetchApplications();
//         fetchStats();
//       }
//     } catch (error) {
//       console.error('Error updating application status:', error);
//     }
//   };

//   const deleteApplication = async (applicationId) => {
//     if (!window.confirm('Are you sure you want to delete this application?')) return;

//     try {
//       const token = localStorage.getItem('adminToken');
//       const response = await axios.delete(`${ADMIN_API_END_POINT}/applications/${applicationId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         fetchApplications();
//         fetchStats();
//       }
//     } catch (error) {
//       console.error('Error deleting application:', error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'accepted': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const displayedApplications = useMemo(() => {
//     if (!keralaOnly) return applications;
//     return applications.filter((app) => KERALA_DISTRICTS.includes(app.job?.location));
//   }, [applications, keralaOnly]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
//               <p className="text-gray-600 mt-2">Manage and review all job applications across the platform.</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <Button onClick={() => { fetchApplications(); fetchStats(); }} variant="outline">
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Refresh
//               </Button>
//               <Button variant="outline">
//                 <Download className="h-4 w-4 mr-2" />
//                 Export
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
//               <FileText className="h-4 w-4 text-blue-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
//               <p className="text-xs text-muted-foreground">All time applications</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Pending</CardTitle>
//               <Clock className="h-4 w-4 text-yellow-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-yellow-600">
//                 {stats?.statusStats?.find(s => s._id === 'pending')?.count || 0}
//               </div>
//               <p className="text-xs text-muted-foreground">Awaiting review</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Accepted</CardTitle>
//               <CheckCircle className="h-4 w-4 text-green-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-600">
//                 {stats?.statusStats?.find(s => s._id === 'accepted')?.count || 0}
//               </div>
//               <p className="text-xs text-muted-foreground">Approved applications</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Rejected</CardTitle>
//               <XCircle className="h-4 w-4 text-red-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-red-600">
//                 {stats?.statusStats?.find(s => s._id === 'rejected')?.count || 0}
//               </div>
//               <p className="text-xs text-muted-foreground">Declined applications</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Filter className="h-5 w-5" />
//               Filters
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                 className="border rounded-lg px-3 py-2"
//               >
//                 <option value="">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="accepted">Accepted</option>
//                 <option value="rejected">Rejected</option>
//               </select>

//               <input
//                 type="text"
//                 placeholder="Search by job title..."
//                 value={filters.jobId}
//                 onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
//                 className="border rounded-lg px-3 py-2"
//               />

//               <input
//                 type="text"
//                 placeholder="Search by applicant email..."
//                 value={filters.userId}
//                 onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
//                 className="border rounded-lg px-3 py-2"
//               />

//               <label className="inline-flex items-center gap-2 text-sm text-gray-700">
//                 <input type="checkbox" checked={keralaOnly} onChange={(e) => setKeralaOnly(e.target.checked)} />
//                 Kerala candidates only
//               </label>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Applications List */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Applications List */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Applications ({keralaOnly ? displayedApplications.length : pagination.totalApplications})</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {displayedApplications.map((application) => (
//                     <div 
//                       key={application._id} 
//                       className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
//                         selectedApplication?._id === application._id ? 'bg-blue-50 border-blue-200' : ''
//                       }`}
//                       onClick={() => setSelectedApplication(application)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2">
//                             <h4 className="font-medium">{application.job?.title}</h4>
//                             <Badge className={getStatusColor(application.status)}>
//                               {application.status}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
//                             <div className="flex items-center gap-1">
//                               <Users className="h-4 w-4" />
//                               <span>{application.applicant?.fullname}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <Building2 className="h-4 w-4" />
//                               <span>{application.job?.company?.name}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <MapPin className="h-4 w-4" />
//                               <span>{application.job?.location}</span>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-4 text-xs text-gray-500">
//                             <span>Applied: {formatDate(application.createdAt)}</span>
//                             {application.statusUpdatedAt && (
//                               <span>Updated: {formatDate(application.statusUpdatedAt)}</span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                           <Button 
//                             size="sm" 
//                             variant="outline"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSelectedApplication(application);
//                             }}
//                           >
//                             <Eye className="h-3 w-3" />
//                           </Button>
//                           <Button 
//                             size="sm" 
//                             variant="outline"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               updateApplicationStatus(application._id, 'accepted');
//                             }}
//                             className="text-green-600 hover:text-green-700"
//                           >
//                             <CheckCircle className="h-3 w-3" />
//                           </Button>
//                           <Button 
//                             size="sm" 
//                             variant="outline"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               updateApplicationStatus(application._id, 'rejected');
//                             }}
//                             className="text-red-600 hover:text-red-700"
//                           >
//                             <XCircle className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {displayedApplications.length === 0 && (
//                     <p className="text-gray-500 text-center py-8">No applications found</p>
//                   )}
//                 </div>

//                 {/* Pagination */}
//                 {pagination.totalPages > 1 && !keralaOnly && (
//                   <div className="flex items-center justify-between mt-6">
//                     <Button
//                       variant="outline"
//                       disabled={pagination.currentPage === 1}
//                       onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
//                     >
//                       Previous
//                     </Button>
//                     <span className="text-sm text-gray-600">
//                       Page {pagination.currentPage} of {pagination.totalPages}
//                     </span>
//                     <Button
//                       variant="outline"
//                       disabled={pagination.currentPage === pagination.totalPages}
//                       onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Application Details */}
//           <div className="lg:col-span-1">
//             {selectedApplication ? (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Application Details</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {/* Job Details */}
//                     <div>
//                       <h4 className="font-medium mb-2">Job Information</h4>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Title:</strong> {selectedApplication.job?.title}</p>
//                         <p><strong>Company:</strong> {selectedApplication.job?.company?.name}</p>
//                         <p><strong>Location:</strong> {selectedApplication.job?.location}</p>
//                         <p><strong>Salary:</strong> {typeof selectedApplication.job?.salary === 'object' ? `${selectedApplication.job?.salary?.min}-${selectedApplication.job?.salary?.max} LPA` : `₹${selectedApplication.job?.salary}/month`}</p>
//                         <p><strong>Type:</strong> {selectedApplication.job?.jobType}</p>
//                       </div>
//                     </div>

//                     {/* Applicant Details */}
//                     <div>
//                       <h4 className="font-medium mb-2">Applicant Information</h4>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Name:</strong> {selectedApplication.applicant?.fullname}</p>
//                         <p><strong>Email:</strong> {selectedApplication.applicant?.email}</p>
//                         <p><strong>Phone:</strong> {selectedApplication.applicant?.phoneNumber}</p>
//                         {selectedApplication.applicant?.profile?.resume && (
//                           <p><strong>Resume:</strong> 
//                             <a 
//                               href={selectedApplication.applicant.profile.resume} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               download
//                               className="text-blue-600 hover:underline ml-1"
//                             >
//                               {selectedApplication.applicant?.profile?.resumeOriginalName || 'View Resume'}
//                             </a>
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Application Status */}
//                     <div>
//                       <h4 className="font-medium mb-2">Application Status</h4>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Status:</strong> 
//                           <Badge className={`ml-2 ${getStatusColor(selectedApplication.status)}`}>
//                             {selectedApplication.status}
//                           </Badge>
//                         </p>
//                         <p><strong>Applied:</strong> {formatDate(selectedApplication.createdAt)}</p>
//                         {selectedApplication.statusUpdatedAt && (
//                           <p><strong>Last Updated:</strong> {formatDate(selectedApplication.statusUpdatedAt)}</p>
//                         )}
//                         {selectedApplication.statusReason && (
//                           <p><strong>Reason:</strong> {selectedApplication.statusReason}</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="space-y-2">
//                       <Button 
//                         className="w-full bg-green-600 hover:bg-green-700"
//                         onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
//                         disabled={selectedApplication.status === 'accepted'}
//                       >
//                         <CheckCircle className="h-4 w-4 mr-2" />
//                         Accept Application
//                       </Button>
//                       <Button 
//                         variant="outline"
//                         className="w-full text-red-600 hover:text-red-700"
//                         onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
//                         disabled={selectedApplication.status === 'rejected'}
//                       >
//                         <XCircle className="h-4 w-4 mr-2" />
//                         Reject Application
//                       </Button>
//                       <Button 
//                         variant="outline"
//                         className="w-full text-yellow-600 hover:text-yellow-700"
//                         onClick={() => updateApplicationStatus(selectedApplication._id, 'pending')}
//                         disabled={selectedApplication.status === 'pending'}
//                       >
//                         <Clock className="h-4 w-4 mr-2" />
//                         Mark as Pending
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Application Details</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-500 text-center py-8">Select an application to view details</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminApplications; 

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
  User
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

      const response = await axios.get(`${ADMIN_API_END_POINT}/applications?${params}`, {
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
      const response = await axios.get(`${ADMIN_API_END_POINT}/applications/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, status, reason = '') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(`${ADMIN_API_END_POINT}/applications/${applicationId}/status`, {
        status,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchApplications();
        fetchStats();
        // Update selected application if it's the one being modified
        if (selectedApplication && selectedApplication._id === applicationId) {
          setSelectedApplication({
            ...selectedApplication,
            status,
            statusReason: reason,
            statusUpdatedAt: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${ADMIN_API_END_POINT}/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Clear selected application if it's the one being deleted
        if (selectedApplication && selectedApplication._id === applicationId) {
          setSelectedApplication(null);
        }
        fetchApplications();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting application:', error);
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
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1">{application.job?.title}</CardTitle>
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-9 w-9 p-0 text-green-600 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(application._id, 'accepted');
                          }}
                          title="Accept Application"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(application._id, 'rejected');
                          }}
                          title="Reject Application"
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
                        <p className="text-sm font-medium text-gray-500">Resume</p>
                        <a 
                          href={selectedApplication.applicant.profile.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          {selectedApplication.applicant?.profile?.resumeOriginalName || 'Download Resume'}
                        </a>
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
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
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