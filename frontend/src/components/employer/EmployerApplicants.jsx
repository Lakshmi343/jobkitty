


// import React, { useEffect, useState } from 'react';
// import Navbar from '../shared/Navbar';
// import axios from 'axios';
// import { APPLICATION_API_END_POINT } from '../../utils/constant';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { setAllApplicants } from '../../redux/applicationSlice';
// import { 
//   Users, ArrowLeft, Calendar, Building, MapPin, CheckCircle, 
//   XCircle, Clock, MoreHorizontal, User, Mail, Phone, FileText, 
//   Download, Eye, Briefcase, GraduationCap, Award, Link, ExternalLink 
// } from 'lucide-react';
// import { Badge } from '../ui/badge';
// import { Button } from '../ui/button';
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { toast } from 'sonner';

// import Footer from '../shared/Footer';
// import LoadingSpinner from '../shared/LoadingSpinner';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogDescription, 
//   DialogFooter, 
//   DialogTrigger
// } from '../ui/dialog';


// const EmployerApplicants = () => {
//     const params = useParams();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { applicants } = useSelector(store => store.application);
//     const [loading, setLoading] = useState(true);
//     const [updatingStatus, setUpdatingStatus] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [selectedApplicant, setSelectedApplicant] = useState(null);
//     const [showRejectDialog, setShowRejectDialog] = useState(false);
//     const [rejectionReason, setRejectionReason] = useState('');
//     const [showProfileDialog, setShowProfileDialog] = useState(false);
//     const [profileDetails, setProfileDetails] = useState(null);

//     useEffect(() => {
//         const fetchAllApplicants = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
//                 dispatch(setAllApplicants(res.data.job));
//             } catch (error) {
//                 console.log(error);
//                 toast.error('Failed to load applicants');
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchAllApplicants();
//     }, [params.id, dispatch]);

//     const getApplicationStats = () => {
//         if (!applicants?.applications) return { total: 0, pending: 0, accepted: 0, rejected: 0 };
        
//         const applications = applicants.applications;
        
//         const stats = {
//             total: applications.length,
//             pending: 0,
//             accepted: 0,
//             rejected: 0
//         };

//         applications.forEach(app => {
//             const status = app.status || 'pending';
//             const statusLower = status.toLowerCase();
            
//             if (statusLower === 'pending') {
//                 stats.pending++;
//             } else if (statusLower === 'accepted') {
//                 stats.accepted++;
//             } else if (statusLower === 'rejected') {
//                 stats.rejected++;
//             } else {
//                 stats.pending++;
//             }
//         });

//         return stats;
//     };

//     const statusHandler = async (status, id, reason = '') => {
//         try {
//             setUpdatingStatus(id);
//             axios.defaults.withCredentials = true;
//             const payload = { status };
            
//             // Add reason if rejecting
//             if (status === 'rejected' && reason) {
//                 payload.rejectionReason = reason;
//             }
            
//             const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, payload);
            
//             if (res.data.success) {
//                 toast.success(`Application ${status} successfully`);
//                 // Refresh the data
//                 const updatedRes = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
//                 dispatch(setAllApplicants(updatedRes.data.job));
//                 setShowRejectDialog(false);
//                 setRejectionReason('');
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to update status');
//         } finally {
//             setUpdatingStatus(null);
//         }
//     };

//     const handleReject = (applicant) => {
//         setSelectedApplicant(applicant);
//         setShowRejectDialog(true);
//     };

//     const confirmReject = () => {
//         if (selectedApplicant) {
//             statusHandler('rejected', selectedApplicant._id, rejectionReason);
//         }
//     };

//     const viewProfileDetails = (applicant) => {
//         setProfileDetails(applicant);
//         setShowProfileDialog(true);
//     };

//     const getStatusBadge = (status) => {
//         const statusLower = (status || 'pending').toLowerCase();
        
//         const statusConfig = {
//             'pending': { 
//                 variant: 'secondary', 
//                 icon: Clock, 
//                 color: 'text-yellow-600',
//                 displayText: 'Pending'
//             },
//             'accepted': { 
//                 variant: 'default', 
//                 icon: CheckCircle, 
//                 color: 'text-green-600',
//                 displayText: 'Accepted'
//             },
//             'rejected': { 
//                 variant: 'destructive', 
//                 icon: XCircle, 
//                 color: 'text-red-600',
//                 displayText: 'Rejected'
//             }
//         };

//         const config = statusConfig[statusLower] || statusConfig['pending'];
//         const IconComponent = config.icon;

//         return (
//             <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
//                 <IconComponent className="w-3 h-3" />
//                 {config.displayText}
//             </Badge>
//         );
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-IN', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     const getInitials = (name) => {
//         return name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'U';
//     };

//     const downloadFile = async (url, filename) => {
//         try {
//             const response = await fetch(url);
//             if (!response.ok) throw new Error('Download failed');
            
//             const blob = await response.blob();
//             const downloadUrl = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = downloadUrl;
//             link.download = filename || 'resume.pdf';
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             window.URL.revokeObjectURL(downloadUrl);
//             toast.success('Resume downloaded successfully');
//         } catch (error) {
//             console.error('Download error:', error);
//             // Fallback to direct link
//             const link = document.createElement('a');
//             link.href = url;
//             link.target = '_blank';
//             link.download = filename || 'resume.pdf';
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.info('Resume opened in new tab');
//         }
//     };

//     const generatePreviewUrl = (url) => {
//         if (!url) return null;
        
//         try {
//             // For Cloudinary URLs
//             if (url.includes('cloudinary.com')) {
//                 // If it's a raw upload (PDF), try to convert to viewable format
//                 if (url.includes('/raw/upload/')) {
//                     // Use Google Docs viewer for PDFs
//                     return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
//                 }
//                 // For image uploads, return as is
//                 return url;
//             }
            
//             // For other URLs, use Google Docs viewer
//             return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
//         } catch (error) {
//             console.error('Error generating preview URL:', error);
//             return null;
//         }
//     };

//     const handlePreview = (url, filename) => {
//         if (!url) {
//             toast.error('Resume URL not available');
//             return;
//         }
        
//         const previewUrl = generatePreviewUrl(url);
//         if (previewUrl) {
//             setPreviewUrl(previewUrl);
//         } else {
//             toast.error('Unable to generate preview');
//             // Fallback to opening in new tab
//             window.open(url, '_blank');
//         }
//     };

//     // Get profile photo from the correct path
//     const getProfilePhoto = (applicant) => {
//         return applicant?.applicant?.profile?.profilePhoto || applicant?.applicant?.profile?.avatar;
//     };

//     const stats = getApplicationStats();
//     const applications = applicants?.applications || [];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             <Navbar />
            
//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 {/* Header Section */}
//                 <div className="mb-8">
//                     <div className="flex items-center gap-4 mb-6">
//                         <button
//                             onClick={() => navigate('/employer/jobs')}
//                             className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
//                         >
//                             <ArrowLeft className="w-5 h-5 text-gray-600" />
//                         </button>
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//                                 <Users className="w-8 h-8 text-blue-600" />
//                                 Job Applicants
//                             </h1>
//                             <p className="text-gray-600 mt-1">
//                                 Manage applications for this position
//                             </p>
//                         </div>
//                     </div>

//                     {/* Job Details Card */}
//                     {applicants && (
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//                             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                                 <div className="flex-1">
//                                     <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                                         {applicants.title}
//                                     </h2>
//                                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//                                         <div className="flex items-center gap-1">
//                                             <Building className="w-4 h-4" />
//                                             <span>{applicants.company?.name}</span>
//                                         </div>
//                                         {applicants.location && (
//                                             <div className="flex items-center gap-1">
//                                                 <MapPin className="w-4 h-4" />
//                                                 <span>{applicants.location}</span>
//                                             </div>
//                                         )}
//                                         <div className="flex items-center gap-1">
//                                             <Calendar className="w-4 h-4" />
//                                             <span>Posted {new Date(applicants.createdAt).toLocaleDateString()}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Stats Cards */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Total Applicants</p>
//                                     <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//                                 </div>
//                                 <div className="p-3 bg-blue-100 rounded-full">
//                                     <Users className="w-6 h-6 text-blue-600" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Pending</p>
//                                     <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
//                                 </div>
//                                 <div className="p-3 bg-yellow-100 rounded-full">
//                                     <Clock className="w-6 h-6 text-yellow-600" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Accepted</p>
//                                     <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
//                                 </div>
//                                 <div className="p-3 bg-green-100 rounded-full">
//                                     <CheckCircle className="w-6 h-6 text-green-600" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-600">Rejected</p>
//                                     <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
//                                 </div>
//                                 <div className="p-3 bg-red-100 rounded-full">
//                                     <XCircle className="w-6 h-6 text-red-600" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Table Section */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                     {loading ? (
//                         <div className="flex items-center justify-center py-12">
//                             <LoadingSpinner size={40} />
//                             <span className="ml-3 text-gray-600">Loading applicants...</span>
//                         </div>
//                     ) : (
//                         <Table>
//                             <TableCaption className="py-4 text-gray-600">
//                                 {applications.length === 0 ? (
//                                     <div className="text-center py-8">
//                                         <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                         <p className="text-lg font-medium text-gray-900 mb-2">No applicants yet</p>
//                                         <p className="text-gray-500">Applications will appear here once candidates apply</p>
//                                     </div>
//                                 ) : (
//                                     `Showing ${applications.length} applicant${applications.length !== 1 ? 's' : ''}`
//                                 )}
//                             </TableCaption>
//                             <TableHeader>
//                                 <TableRow className="bg-gray-50 hover:bg-gray-50">
//                                     <TableHead className="font-semibold text-gray-900">Applicant</TableHead>
//                                     <TableHead className="font-semibold text-gray-900">Contact</TableHead>
//                                     <TableHead className="font-semibold text-gray-900">Resume</TableHead>
//                                     <TableHead className="font-semibold text-gray-900">Applied Date</TableHead>
//                                     <TableHead className="font-semibold text-gray-900">Status</TableHead>
//                                     <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {applications.map((item) => (
//                                     <TableRow key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
//                                         <TableCell className="py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <Avatar className="w-10 h-10 border-2 border-gray-200 cursor-pointer" onClick={() => viewProfileDetails(item)}>
//                                                     <AvatarImage 
//                                                         src={getProfilePhoto(item)} 
//                                                         alt={item?.applicant?.fullname} 
//                                                         className="object-cover"
//                                                     />
//                                                     <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
//                                                         {getInitials(item?.applicant?.fullname)}
//                                                     </AvatarFallback>
//                                                 </Avatar>
//                                                 <div className="flex-1 min-w-0">
//                                                     <h3 className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600" onClick={() => viewProfileDetails(item)}>
//                                                         {item?.applicant?.fullname || 'N/A'}
//                                                     </h3>
//                                                     <p className="text-sm text-gray-600 truncate flex items-center gap-1">
//                                                         <Mail className="w-3 h-3" />
//                                                         {item?.applicant?.email || 'N/A'}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="flex items-center gap-1 text-gray-600">
//                                                 <Phone className="w-4 h-4" />
//                                                 <span className="text-sm">{item?.applicant?.phoneNumber || 'N/A'}</span>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             {item.applicant?.profile?.resume ? (
//                                                 <div className="flex items-center gap-2">
//                                                     <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
//                                                         <DialogTrigger asChild>
//                                                             <Button variant="outline" size="sm" onClick={() => handlePreview(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName)}>
//                                                                 <Eye className="w-3 h-3 mr-1" /> Preview
//                                                             </Button>
//                                                         </DialogTrigger>
//                                                         <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0">
//                                                             <DialogHeader className="p-4 pb-2 border-b">
//                                                                 <DialogTitle className="flex items-center gap-2">
//                                                                     <FileText className="w-5 h-5" />
//                                                                     Resume Preview - {item.applicant?.profile?.resumeOriginalName || 'Resume'}
//                                                                 </DialogTitle>
//                                                                 <div className="flex gap-2 mt-2">
//                                                                     <Button 
//                                                                         variant="outline" 
//                                                                         size="sm"
//                                                                         onClick={() => window.open(item.applicant.profile.resume, '_blank')}
//                                                                     >
//                                                                         <ExternalLink className="w-4 h-4 mr-1" /> Open in New Tab
//                                                                     </Button>
//                                                                     <Button 
//                                                                         variant="outline" 
//                                                                         size="sm"
//                                                                         onClick={() => downloadFile(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
//                                                                     >
//                                                                         <Download className="w-4 h-4 mr-1" /> Download
//                                                                     </Button>
//                                                                 </div>
//                                                             </DialogHeader>
//                                                             <div className="w-full h-[calc(90vh-120px)] bg-gray-50 relative">
//                                                                 {previewUrl ? (
//                                                                     <>
//                                                                         <iframe 
//                                                                             src={previewUrl} 
//                                                                             title="Resume Preview" 
//                                                                             width="100%" 
//                                                                             height="100%" 
//                                                                             className="border-0 rounded-md"
//                                                                             sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//                                                                             loading="lazy"
//                                                                             onLoad={() => console.log('Iframe loaded successfully')}
//                                                                             onError={(e) => {
//                                                                                 console.error('Iframe load error:', e);
//                                                                                 toast.error('Unable to preview resume. Please try opening in new tab.');
//                                                                             }}
//                                                                         />
//                                                                         <div className="absolute top-2 right-2 bg-white rounded-md shadow-sm p-1">
//                                                                             <Button 
//                                                                                 variant="ghost" 
//                                                                                 size="sm"
//                                                                                 onClick={() => setPreviewUrl(null)}
//                                                                                 className="h-8 w-8 p-0"
//                                                                             >
//                                                                                 ✕
//                                                                             </Button>
//                                                                         </div>
//                                                                     </>
//                                                                 ) : (
//                                                                     <div className="flex items-center justify-center h-full">
//                                                                         <div className="text-center">
//                                                                             <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                                                                             <p className="text-gray-600 mb-4">Unable to preview this resume</p>
//                                                                             <div className="space-y-2">
//                                                                                 <Button onClick={() => window.open(item.applicant.profile.resume, '_blank')}>
//                                                                                     <ExternalLink className="w-4 h-4 mr-2" /> View in New Tab
//                                                                                 </Button>
//                                                                                 <Button 
//                                                                                     variant="outline" 
//                                                                                     onClick={() => downloadFile(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
//                                                                                 >
//                                                                                     <Download className="w-4 h-4 mr-2" /> Download Resume
//                                                                                 </Button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </DialogContent>
//                                                     </Dialog>
//                                                     <Button
//                                                         variant="ghost"
//                                                         size="sm"
//                                                         onClick={() => downloadFile(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
//                                                         className="text-blue-600 hover:text-blue-800 h-auto p-1"
//                                                     >
//                                                         <Download className="w-3 h-3 mr-1" /> Download
//                                                     </Button>
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-gray-500 text-sm">No resume</span>
//                                             )}
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="text-sm text-gray-600">
//                                                 {formatDate(item.createdAt)}
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             {getStatusBadge(item.status)}
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             <div className="flex items-center justify-end gap-2">
//                                                 <Button 
//                                                     variant="outline" 
//                                                     size="sm" 
//                                                     className="text-blue-600 border-blue-600 hover:bg-blue-50"
//                                                     onClick={() => viewProfileDetails(item)}
//                                                 >
//                                                     <Eye className="w-3 h-3 mr-1" /> Candidate Profile
//                                                 </Button>
                                                
//                                                 {item.status !== 'accepted' && (
//                                                     <Button 
//                                                         variant="outline" 
//                                                         size="sm" 
//                                                         className="text-green-600 border-green-600 hover:bg-green-50"
//                                                         onClick={() => statusHandler('accepted', item._id)}
//                                                         disabled={updatingStatus === item._id}
//                                                     >
//                                                         <CheckCircle className="w-3 h-3 mr-1" /> Accept
//                                                     </Button>
//                                                 )}
                                                
//                                                 {item.status !== 'rejected' && (
//                                                     <Button 
//                                                         variant="outline" 
//                                                         size="sm" 
//                                                         className="text-red-600 border-red-600 hover:bg-red-50"
//                                                         onClick={() => handleReject(item)}
//                                                         disabled={updatingStatus === item._id}
//                                                     >
//                                                         <XCircle className="w-3 h-3 mr-1" /> Reject
//                                                     </Button>
//                                                 )}
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )}
//                 </div>
//             </div>

//             {/* Rejection Dialog */}
//             <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Reject Application</DialogTitle>
//                         <DialogDescription>
//                             Please provide a reason for rejecting this application. This will be shared with the applicant.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="py-4">
//                         <textarea
//                             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             rows="4"
//                             placeholder="Enter rejection reason..."
//                             value={rejectionReason}
//                             onChange={(e) => setRejectionReason(e.target.value)}
//                         ></textarea>
//                     </div>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
//                         <Button 
//                             variant="destructive" 
//                             onClick={confirmReject}
//                             disabled={!rejectionReason.trim()}
//                         >
//                             Confirm Rejection
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Profile Details Dialog */}
//              <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//             {profileDetails && (
//                 <>
//                     <DialogHeader>
//                         <DialogTitle>Applicant Profile</DialogTitle>
//                         <DialogDescription>
//                             Detailed information about the applicant
//                         </DialogDescription>
//                     </DialogHeader>
                    
//                     <div className="py-4 space-y-6">
                        
//                         {/* Profile Header */}
//                         <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
//                             <Avatar className="w-20 h-20 border-2 border-blue-100">
//                                 <AvatarImage 
//                                     src={getProfilePhoto(profileDetails)} 
//                                     alt={profileDetails?.applicant?.fullname}
//                                     className="object-cover"
//                                 />
//                                 <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold">
//                                     {getInitials(profileDetails?.applicant?.fullname)}
//                                 </AvatarFallback>
//                             </Avatar>
//                             <div>
//                                 <h2 className="text-2xl font-bold text-gray-900">
//                                     {profileDetails?.applicant?.fullname || 'N/A'}
//                                 </h2>
//                                 <p className="text-gray-600 flex items-center gap-1">
//                                     <Mail className="w-4 h-4" />
//                                     {profileDetails?.applicant?.email || 'N/A'}
//                                 </p>
//                                 <p className="text-gray-600 flex items-center gap-1">
//                                     <Phone className="w-4 h-4" />
//                                     {profileDetails?.applicant?.phoneNumber || 'N/A'}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Bio/Summary */}
//                         {profileDetails?.applicant?.profile?.bio && (
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                                     <Briefcase className="w-5 h-5 text-blue-600" />
//                                     About
//                                 </h3>
//                                 <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
//                                     {profileDetails.applicant.profile.bio}
//                                 </p>
//                             </div>
//                         )}

//                         {/* Education - Updated to match your data structure */}
//                         {profileDetails?.applicant?.profile?.education && (
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                                     <GraduationCap className="w-5 h-5 text-blue-600" />
//                                     Education
//                                 </h3>
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <h4 className="font-medium text-gray-900">
//                                         {profileDetails.applicant.profile.education.degree || 'Not specified'}
//                                     </h4>
//                                     <p className="text-gray-600">
//                                         {profileDetails.applicant.profile.education.institution || 'Not specified'}
//                                     </p>
//                                     {profileDetails.applicant.profile.education.yearOfCompletion && (
//                                         <p className="text-sm text-gray-500">
//                                             Completed: {profileDetails.applicant.profile.education.yearOfCompletion}
//                                         </p>
//                                     )}
//                                     {profileDetails.applicant.profile.education.grade && (
//                                         <p className="text-sm text-gray-500">
//                                             Grade: {profileDetails.applicant.profile.education.grade}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Skills */}
//                         {profileDetails?.applicant?.profile?.skills && profileDetails.applicant.profile.skills.length > 0 && (
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                                     <Award className="w-5 h-5 text-blue-600" />
//                                     Skills
//                                 </h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {profileDetails.applicant.profile.skills.map((skill, index) => (
//                                         <Badge key={index} variant="secondary" className="text-sm">
//                                             {skill.trim()}
//                                         </Badge>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Location */}
//                         {profileDetails?.applicant?.profile?.place && (
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                                     <MapPin className="w-5 h-5 text-blue-600" />
//                                     Location
//                                 </h3>
//                                 <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
//                                     {profileDetails.applicant.profile.place}
//                                 </p>
//                             </div>
//                         )}

//                         {/* Resume */}
//                         {profileDetails?.applicant?.profile?.resume && (
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
//                                 <div className="flex items-center gap-3">
//                                     <Button 
//                                         variant="outline" 
//                                         onClick={() => handlePreview(profileDetails.applicant.profile.resume, profileDetails.applicant?.profile?.resumeOriginalName)}
//                                     >
//                                         <Eye className="w-4 h-4 mr-2" /> Preview Resume
//                                     </Button>
//                                     <Button 
//                                         variant="outline" 
//                                         onClick={() => window.open(profileDetails.applicant.profile.resume, '_blank')}
//                                     >
//                                         <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
//                                     </Button>
//                                     <Button
//                                         variant="outline"
//                                         onClick={() => downloadFile(profileDetails.applicant.profile.resume, profileDetails.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
//                                         className="text-blue-600 hover:text-blue-800"
//                                     >
//                                         <Download className="w-4 h-4 mr-1" /> Download
//                                     </Button>
//                                 </div>
//                                 {profileDetails.applicant?.profile?.resumeOriginalName && (
//                                     <p className="text-sm text-gray-500 mt-2">
//                                         File: {profileDetails.applicant.profile.resumeOriginalName}
//                                     </p>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </>
//             )}
//         </DialogContent>
//     </Dialog>
            
//             <Footer />
//         </div>
//     );
// };

// export default EmployerApplicants;

import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '../../redux/applicationSlice';
import { 
  Users, ArrowLeft, Calendar, Building, MapPin, CheckCircle, 
  XCircle, Clock, MoreHorizontal, User, Mail, Phone, FileText, 
  Download, Eye, Briefcase, GraduationCap, Award, Link, ExternalLink,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';

import Footer from '../shared/Footer';
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';


const EmployerApplicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { applicants } = useSelector(store => store.application);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [profileDetails, setProfileDetails] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
                toast.error('Failed to load applicants');
            } finally {
                setLoading(false);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    const toggleRowExpansion = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const getApplicationStats = () => {
        if (!applicants?.applications) return { total: 0, pending: 0, accepted: 0, rejected: 0 };
        
        const applications = applicants.applications;
        
        const stats = {
            total: applications.length,
            pending: 0,
            accepted: 0,
            rejected: 0
        };

        applications.forEach(app => {
            const status = app.status || 'pending';
            const statusLower = status.toLowerCase();
            
            if (statusLower === 'pending') {
                stats.pending++;
            } else if (statusLower === 'accepted') {
                stats.accepted++;
            } else if (statusLower === 'rejected') {
                stats.rejected++;
            } else {
                stats.pending++;
            }
        });

        return stats;
    };

    const statusHandler = async (status, id, reason = '') => {
        try {
            setUpdatingStatus(id);
            axios.defaults.withCredentials = true;
            const payload = { status };
            
            // Add reason if rejecting
            if (status === 'rejected' && reason) {
                payload.rejectionReason = reason;
            }
            
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, payload);
            
            if (res.data.success) {
                toast.success(`Application ${status} successfully`);
                // Refresh the data
                const updatedRes = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(updatedRes.data.job));
                setShowRejectDialog(false);
                setRejectionReason('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleReject = (applicant) => {
        setSelectedApplicant(applicant);
        setShowRejectDialog(true);
    };

    const confirmReject = () => {
        if (selectedApplicant) {
            statusHandler('rejected', selectedApplicant._id, rejectionReason);
        }
    };

    const viewProfileDetails = (applicant) => {
        setProfileDetails(applicant);
        setShowProfileDialog(true);
    };

    const getStatusBadge = (status) => {
        const statusLower = (status || 'pending').toLowerCase();
        
        const statusConfig = {
            'pending': { 
                variant: 'secondary', 
                icon: Clock, 
                color: 'text-yellow-600',
                displayText: 'Pending'
            },
            'accepted': { 
                variant: 'default', 
                icon: CheckCircle, 
                color: 'text-green-600',
                displayText: 'Accepted'
            },
            'rejected': { 
                variant: 'destructive', 
                icon: XCircle, 
                color: 'text-red-600',
                displayText: 'Rejected'
            }
        };

        const config = statusConfig[statusLower] || statusConfig['pending'];
        const IconComponent = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
                <IconComponent className="w-3 h-3" />
                {config.displayText}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
            toast.success('Resume downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            // Fallback to direct link
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.download = filename || 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.info('Resume opened in new tab');
        }
    };

    const generatePreviewUrl = (url) => {
        if (!url) return null;
        
        try {
            // For Cloudinary URLs
            if (url.includes('cloudinary.com')) {
                // If it's a raw upload (PDF), try to convert to viewable format
                if (url.includes('/raw/upload/')) {
                    // Use Google Docs viewer for PDFs
                    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
                }
                // For image uploads, return as is
                return url;
            }
            
            // For other URLs, use Google Docs viewer
            return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        } catch (error) {
            console.error('Error generating preview URL:', error);
            return null;
        }
    };

    const handlePreview = (url, filename) => {
        if (!url) {
            toast.error('Resume URL not available');
            return;
        }
        
        const previewUrl = generatePreviewUrl(url);
        if (previewUrl) {
            setPreviewUrl(previewUrl);
        } else {
            toast.error('Unable to generate preview');
            // Fallback to opening in new tab
            window.open(url, '_blank');
        }
    };

    // Get profile photo from the correct path
    const getProfilePhoto = (applicant) => {
        return applicant?.applicant?.profile?.profilePhoto || applicant?.applicant?.profile?.avatar;
    };

    const stats = getApplicationStats();
    const applications = applicants?.applications || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/employer/jobs')}
                            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                Job Applicants
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage applications for this position
                            </p>
                        </div>
                    </div>

                    {/* Job Details Card */}
                    {applicants && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        {applicants.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Building className="w-4 h-4" />
                                            <span>{applicants.company?.name}</span>
                                        </div>
                                        {applicants.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{applicants.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Posted {new Date(applicants.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner size={40} />
                            <span className="ml-3 text-gray-600">Loading applicants...</span>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-8">
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No applicants yet</p>
                            <p className="text-gray-500">Applications will appear here once candidates apply</p>
                        </div>
                    ) : isMobile ? (
                        // Mobile view with cards
                        <div className="divide-y divide-gray-200">
                            {applications.map((item) => (
                                <div key={item._id} className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border-2 border-gray-200 cursor-pointer" onClick={() => viewProfileDetails(item)}>
                                                <AvatarImage 
                                                    src={getProfilePhoto(item)} 
                                                    alt={item?.applicant?.fullname} 
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                                    {getInitials(item?.applicant?.fullname)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600" onClick={() => viewProfileDetails(item)}>
                                                    {item?.applicant?.fullname || 'N/A'}
                                                </h3>
                                                <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {item?.applicant?.email || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleRowExpansion(item._id)}
                                            className="p-1 rounded-md hover:bg-gray-100"
                                        >
                                            {expandedRows.has(item._id) ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Phone className="w-3 h-3" />
                                            <span>{item?.applicant?.phoneNumber || 'N/A'}</span>
                                        </div>
                                        <div className="text-gray-600">
                                            {formatDate(item.createdAt)}
                                        </div>
                                        <div className="col-span-2">
                                            {getStatusBadge(item.status)}
                                        </div>
                                    </div>
                                    
                                    {expandedRows.has(item._id) && (
                                        <div className="mt-3 space-y-3 border-t pt-3">
                                            {/* Resume Section */}
                                            {item.applicant?.profile?.resume ? (
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-sm font-medium text-gray-700">Resume:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => handlePreview(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName)}
                                                            className="text-xs"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" /> Preview
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => downloadFile(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
                                                            className="text-blue-600 hover:text-blue-800 text-xs"
                                                        >
                                                            <Download className="w-3 h-3 mr-1" /> Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm">No resume available</p>
                                            )}
                                            
                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs"
                                                    onClick={() => viewProfileDetails(item)}
                                                >
                                                    <Eye className="w-3 h-3 mr-1" /> Profile
                                                </Button>
                                                
                                                {item.status !== 'accepted' && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-green-600 border-green-600 hover:bg-green-50 text-xs"
                                                        onClick={() => statusHandler('accepted', item._id)}
                                                        disabled={updatingStatus === item._id}
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                                                    </Button>
                                                )}
                                                
                                                {item.status !== 'rejected' && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-red-600 border-red-600 hover:bg-red-50 text-xs"
                                                        onClick={() => handleReject(item)}
                                                        disabled={updatingStatus === item._id}
                                                    >
                                                        <XCircle className="w-3 h-3 mr-1" /> Reject
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Desktop table view
                        <Table>
                            <TableCaption className="py-4 text-gray-600">
                                {`Showing ${applications.length} applicant${applications.length !== 1 ? 's' : ''}`}
                            </TableCaption>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="font-semibold text-gray-900">Applicant</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Contact</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Resume</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Applied Date</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                                    <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((item) => (
                                    <TableRow key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border-2 border-gray-200 cursor-pointer" onClick={() => viewProfileDetails(item)}>
                                                    <AvatarImage 
                                                        src={getProfilePhoto(item)} 
                                                        alt={item?.applicant?.fullname} 
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                                        {getInitials(item?.applicant?.fullname)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600" onClick={() => viewProfileDetails(item)}>
                                                        {item?.applicant?.fullname || 'N/A'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {item?.applicant?.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                <span className="text-sm">{item?.applicant?.phoneNumber || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.applicant?.profile?.resume ? (
                                                <div className="flex items-center gap-2">
                                                    <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" onClick={() => handlePreview(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName)}>
                                                                <Eye className="w-3 h-3 mr-1" /> Preview
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0">
                                                            <DialogHeader className="p-4 pb-2 border-b">
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <FileText className="w-5 h-5" />
                                                                    Resume Preview - {item.applicant?.profile?.resumeOriginalName || 'Resume'}
                                                                </DialogTitle>
                                                                <div className="flex gap-2 mt-2">
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        onClick={() => window.open(item.applicant.profile.resume, '_blank')}
                                                                    >
                                                                        <ExternalLink className="w-4 h-4 mr-1" /> Open in New Tab
                                                                    </Button>
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        onClick={() => downloadFile(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
                                                                    >
                                                                        <Download className="w-4 h-4 mr-1" /> Download
                                                                    </Button>
                                                                </div>
                                                            </DialogHeader>
                                                            <div className="w-full h-[calc(90vh-120px)] bg-gray-50 relative">
                                                                {previewUrl ? (
                                                                    <>
                                                                        <iframe 
                                                                            src={previewUrl} 
                                                                            title="Resume Preview" 
                                                                            width="100%" 
                                                                            height="100%" 
                                                                            className="border-0 rounded-md"
                                                                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                                                            loading="lazy"
                                                                            onLoad={() => console.log('Iframe loaded successfully')}
                                                                            onError={(e) => {
                                                                                console.error('Iframe load error:', e);
                                                                                toast.error('Unable to preview resume. Please try opening in new tab.');
                                                                            }}
                                                                        />
                                                                        <div className="absolute top-2 right-2 bg-white rounded-md shadow-sm p-1">
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="sm"
                                                                                onClick={() => setPreviewUrl(null)}
                                                                                className="h-8 w-8 p-0"
                                                                            >
                                                                                ✕
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full">
                                                                        <div className="text-center">
                                                                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                                            <p className="text-gray-600 mb-4">Unable to preview this resume</p>
                                                                            <div className="space-y-2">
                                                                                <Button onClick={() => window.open(item.applicant.profile.resume, '_blank')}>
                                                                                    <ExternalLink className="w-4 h-4 mr-2" /> View in New Tab
                                                                                </Button>
                                                                                <Button 
                                                                                    variant="outline" 
                                                                                    onClick={() => downloadFile(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
                                                                                >
                                                                                    <Download className="w-4 h-4 mr-2" /> Download Resume
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => downloadFile(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
                                                        className="text-blue-600 hover:text-blue-800 h-auto p-1"
                                                    >
                                                        <Download className="w-3 h-3 mr-1" /> Download
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 text-sm">No resume</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">
                                                {formatDate(item.createdAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(item.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    onClick={() => viewProfileDetails(item)}
                                                >
                                                    <Eye className="w-3 h-3 mr-1" /> Profile
                                                </Button>
                                                
                                                {item.status !== 'accepted' && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                        onClick={() => statusHandler('accepted', item._id)}
                                                        disabled={updatingStatus === item._id}
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                                                    </Button>
                                                )}
                                                
                                                {item.status !== 'rejected' && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                                        onClick={() => handleReject(item)}
                                                        disabled={updatingStatus === item._id}
                                                    >
                                                        <XCircle className="w-3 h-3 mr-1" /> Reject
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this application. This will be shared with the applicant.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        ></textarea>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmReject}
                            disabled={!rejectionReason.trim()}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Profile Details Dialog */}
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {profileDetails && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Applicant Profile</DialogTitle>
                                <DialogDescription>
                                    Detailed information about the applicant
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4 space-y-6">
                                
                                {/* Profile Header */}
                                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                    <Avatar className="w-20 h-20 border-2 border-blue-100">
                                        <AvatarImage 
                                            src={getProfilePhoto(profileDetails)} 
                                            alt={profileDetails?.applicant?.fullname}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold">
                                            {getInitials(profileDetails?.applicant?.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {profileDetails?.applicant?.fullname || 'N/A'}
                                        </h2>
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {profileDetails?.applicant?.email || 'N/A'}
                                        </p>
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {profileDetails?.applicant?.phoneNumber || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Bio/Summary */}
                                {profileDetails?.applicant?.profile?.bio && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                            About
                                        </h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                            {profileDetails.applicant.profile.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Education */}
                                {profileDetails?.applicant?.profile?.education && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-blue-600" />
                                            Education
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-900">
                                                {profileDetails.applicant.profile.education.degree || 'Not specified'}
                                            </h4>
                                            <p className="text-gray-600">
                                                {profileDetails.applicant.profile.education.institution || 'Not specified'}
                                            </p>
                                            {profileDetails.applicant.profile.education.yearOfCompletion && (
                                                <p className="text-sm text-gray-500">
                                                    Completed: {profileDetails.applicant.profile.education.yearOfCompletion}
                                                </p>
                                            )}
                                            {profileDetails.applicant.profile.education.grade && (
                                                <p className="text-sm text-gray-500">
                                                    Grade: {profileDetails.applicant.profile.education.grade}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {profileDetails?.applicant?.profile?.skills && profileDetails.applicant.profile.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-blue-600" />
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profileDetails.applicant.profile.skills.map((skill, index) => (
                                                <Badge key={index} variant="secondary" className="text-sm">
                                                    {skill.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                {profileDetails?.applicant?.profile?.place && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            Location
                                        </h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                            {profileDetails.applicant.profile.place}
                                        </p>
                                    </div>
                                )}

                                {/* Resume */}
                                {profileDetails?.applicant?.profile?.resume && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                                        <div className="flex items-center gap-3">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => handlePreview(profileDetails.applicant.profile.resume, profileDetails.applicant?.profile?.resumeOriginalName)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" /> Preview Resume
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => window.open(profileDetails.applicant.profile.resume, '_blank')}
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => downloadFile(profileDetails.applicant.profile.resume, profileDetails.applicant?.profile?.resumeOriginalName || 'resume.pdf')}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Download className="w-4 h-4 mr-1" /> Download
                                            </Button>
                                        </div>
                                        {profileDetails.applicant?.profile?.resumeOriginalName && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                File: {profileDetails.applicant.profile.resumeOriginalName}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            
            <Footer />
        </div>
    );
};

export default EmployerApplicants;