import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { MoreHorizontal, User, Mail, Phone, FileText, Calendar, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const shortlistingStatus = [
    { value: "accepted", label: "Accepted", icon: CheckCircle },
    { value: "rejected", label: "Rejected", icon: XCircle },
    { value: "pending", label: "Pending", icon: Clock }
];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            setUpdatingStatus(id);
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            
            if (res.data.success) {
                toast.success(`Application ${status} successfully`);
                // Refresh the data or update the state
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(null);
        }
    }

    const getStatusBadge = (status) => {
        // Status comes from database in lowercase, but we want to display it capitalized
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

    const applications = applicants?.applications || [];

    return (
        <div className="w-full">
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
                                            download
                                            className="inline-flex items-center gap-2 h-8 px-3 border rounded-md text-sm hover:bg-gray-50"
                                        >
                                            <Download className="w-3 h-3" />
                                            <span className="text-xs">Download</span>
                                        </a>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-sm">No resume</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">{formatDate(item?.createdAt)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {getStatusBadge(item?.status || 'Pending')}
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0"
                                            disabled={updatingStatus === item._id}
                                        >
                                            {updatingStatus === item._id ? (
                                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <MoreHorizontal className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2" align="end">
                                        <div className="space-y-1">
                                            {shortlistingStatus.map((status, index) => (
                                                <Button
                                                    key={index}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start gap-2 h-9"
                                                    onClick={() => statusHandler(status.value, item._id)}
                                                    disabled={updatingStatus === item._id}
                                                >
                                                    {status.value === 'accepted' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                                    {status.value === 'rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                                                    {status.value === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                                                    {status.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable