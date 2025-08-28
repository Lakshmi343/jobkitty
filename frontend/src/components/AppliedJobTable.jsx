

import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    
    // Function to get status details
    const getStatusDetails = (status) => {
        switch(status) {
            case "accepted":
                return {
                    text: "Accepted",
                    description: "Your application has been accepted",
                    icon: <CheckCircle size={16} />,
                    color: "bg-green-500 hover:bg-green-600"
                };
            case "rejected":
                return {
                    text: "Rejected",
                    description: "Your application was not selected",
                    icon: <XCircle size={16} />,
                    color: "bg-red-500 hover:bg-red-600"
                };
            case "pending":
            default:
                return {
                    text: "Under Review",
                    description: "Your application is being reviewed",
                    icon: <Clock size={16} />,
                    color: "bg-blue-500 hover:bg-blue-600"
                };
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.length <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <Eye size={48} className="text-gray-300 mb-2" />
                                    <p>You haven't applied to any jobs yet.</p>
                                    <p className="text-sm">Start applying to see your applications here.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : allAppliedJobs.map((appliedJob) => {
                        const statusInfo = getStatusDetails(appliedJob.status);
                        
                        return (
                            <TableRow key={appliedJob._id}>
                                <TableCell className="whitespace-nowrap">
                                    {appliedJob?.createdAt ? new Date(appliedJob.createdAt).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell className="font-medium">{appliedJob.job?.title || 'N/A'}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge 
                                        className={`${statusInfo.color} text-white flex items-center gap-1 w-fit`}
                                        title={statusInfo.description}
                                    >
                                        {statusInfo.icon}
                                        {statusInfo.text}
                                    </Badge>
                                </TableCell>
                            
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable