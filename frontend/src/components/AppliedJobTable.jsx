

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job)

  // Function to get status details
  const getStatusDetails = (status) => {
    switch (status) {
      case 'accepted':
        return {
          text: 'Accepted',
          description: 'Your application has been accepted',
          icon: <CheckCircle size={16} />,
          color: 'bg-green-500',
        }
      case 'rejected':
        return {
          text: 'Rejected',
          description: 'Your application was not selected',
          icon: <XCircle size={16} />,
          color: 'bg-red-500',
        }
      case 'pending':
      default:
        return {
          text: 'Under Review',
          description: 'Your application is being reviewed',
          icon: <Clock size={16} />,
          color: 'bg-blue-500',
        }
    }
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        My Applications
      </h2>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-gray-600 font-medium">Date</TableHead>
              <TableHead className="text-gray-600 font-medium">Job Role</TableHead>
              <TableHead className="text-gray-600 font-medium">Company</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAppliedJobs.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Eye size={48} className="text-gray-300 mb-2" />
                    <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                    <p className="text-sm text-gray-400">
                      Start applying to see your applications here.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              allAppliedJobs.map((appliedJob) => {
                const statusInfo = getStatusDetails(appliedJob.status)

                return (
                  <TableRow
                    key={appliedJob._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell className="whitespace-nowrap text-gray-700">
                      {appliedJob?.createdAt
                        ? new Date(appliedJob.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {appliedJob.job?.title || 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {appliedJob.job?.company?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusInfo.color} text-white px-3 py-1 flex items-center gap-1 rounded-full shadow-sm`}
                        title={statusInfo.description}
                      >
                        {statusInfo.icon}
                        {statusInfo.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AppliedJobTable
