import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '../../redux/applicationSlice';
import { Users, ArrowLeft, Calendar, Building, MapPin, CheckCircle, XCircle, Clock, MoreHorizontal, User, Mail, Phone, FileText, Download } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '../ui/dialog';
import Footer from '../shared/Footer';

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

    const toInline = (url) => {
        if (!url) return url;
        let out = url.replace('/upload/', '/upload/fl_inline/');
        if (out.includes('/raw/')) {
            try {
                const u = new URL(out);
                const segments = u.pathname.split('/');
                const last = segments[segments.length - 1];
                if (!last.includes('.')) {
                    segments[segments.length - 1] = `${last}.pdf`;
                    u.pathname = segments.join('/');
                    out = u.toString();
                }
            } catch {}
        }
        return out;
    };

    const previewOrDownload = async (url, filenameHint) => {
        const inline = toInline(url);
        try {
            await axios.head(inline);
            setPreviewUrl(inline);
        } catch {
            const link = document.createElement('a');
            link.href = url;
            if (filenameHint) link.download = filenameHint;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
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
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading applicants...</span>
                        </div>
                    ) : (
                        <Table>
                            <TableCaption className="py-4 text-gray-600">
                                {applications.length === 0 ? (
                                    <div className="text-center py-8">
                                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">No applicants yet</p>
                                        <p className="text-gray-500">Applications will appear here once candidates apply</p>
                                    </div>
                                ) : (
                                    `Showing ${applications.length} applicant${applications.length !== 1 ? 's' : ''}`
                                )}
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
                                                <Avatar className="w-10 h-10 border-2 border-gray-200">
                                                    <AvatarImage src={item?.applicant?.profile?.avatar} alt={item?.applicant?.fullname} />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                                        {getInitials(item?.applicant?.fullname)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">
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
                                                            <Button variant="outline" size="sm" onClick={() => previewOrDownload(item.applicant.profile.resume, item.applicant?.profile?.resumeOriginalName)}>
                                                                <FileText className="w-3 h-3 mr-1" /> Preview
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-5xl w-[90vw] h-[85vh] p-0">
                                                            <DialogHeader className="p-4 pb-2">
                                                                <DialogTitle>Resume Preview</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="w-full h-[calc(85vh-56px)]">
                                                                <iframe src={previewUrl} title="Resume Preview" width="100%" height="100%" />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <a
                                                        href={item.applicant.profile.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                    >
                                                        <Download className="w-3 h-3 mr-1" /> Download
                                                    </a>
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
                                                
                                                {item.status !== 'pending' && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                                                        onClick={() => statusHandler('pending', item._id)}
                                                        disabled={updatingStatus === item._id}
                                                    >
                                                        <Clock className="w-3 h-3 mr-1" /> Pending
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
            
            <Footer />
        </div>
    );
};

export default EmployerApplicants;