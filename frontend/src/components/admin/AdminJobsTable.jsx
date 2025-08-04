import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Edit2, Eye, MoreHorizontal, Calendar, Building, MapPin, Users, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => { 
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => { 
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                   job?.location?.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCompanyInitials = (companyName) => {
        return companyName?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'CO';
    };

    const getStatusBadge = (job) => {
        const isActive = true; 
        return (
            <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                {isActive ? "Active" : "Inactive"}
            </Badge>
        );
    };

    return (
        <div className="w-full">
            <Table>
                <TableCaption className="py-4 text-gray-600">
                    {filterJobs.length === 0 ? (
                        <div className="text-center py-8">
                            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">No jobs found</p>
                            <p className="text-gray-500">
                                {searchJobByText ? `No jobs match "${searchJobByText}"` : "Start by posting your first job"}
                            </p>
                        </div>
                    ) : (
                        `Showing ${filterJobs.length} job${filterJobs.length !== 1 ? 's' : ''}`
                    )}
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Company & Position</TableHead>
                        <TableHead className="font-semibold text-gray-900">Location</TableHead>
                        <TableHead className="font-semibold text-gray-900">Posted Date</TableHead>
                        <TableHead className="font-semibold text-gray-900">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow key={job._id} className="hover:bg-gray-50 transition-colors duration-200">
                            <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 border-2 border-gray-200">
                                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                            {getCompanyInitials(job?.company?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {job?.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                                            <Building className="w-3 h-3" />
                                            {job?.company?.name}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{job?.location || 'Remote'}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">{formatDate(job?.createdAt)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {getStatusBadge(job)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2" align="end">
                                        <div className="space-y-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start gap-2 h-9"
                                                onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Job
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start gap-2 h-9"
                                                onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Applicants
                                            </Button>
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

export default AdminJobsTable