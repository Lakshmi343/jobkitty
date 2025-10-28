
import React from 'react'
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow,} from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

const AppliedJobTable = () => {

  const { allAppliedJobs } = useSelector((store) => store.job)

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
    <div className="p-3 sm:p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
        My Applications
      </h2>

    
      <div className="hidden md:block overflow-hidden border border-gray-200 rounded-lg">
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
                <TableCell colSpan={4} className="text-center py-10">
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

      
      <div className="md:hidden space-y-3">
        {allAppliedJobs.length <= 0 ? (
          <div className="text-center py-10 border border-gray-200 rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <Eye size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">You haven't applied to any jobs yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Start applying to see your applications here.
              </p>
            </div>
          </div>
        ) : (
          allAppliedJobs.map((appliedJob) => {
            const statusInfo = getStatusDetails(appliedJob.status)

            return (
              <div
                key={appliedJob._id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">
                      {appliedJob.job?.title || 'N/A'}
                    </h3>
                    <p className="text-gray-600 text-xs mt-1 truncate">
                      {appliedJob.job?.company?.name || 'N/A'}
                    </p>
                  </div>
                  <Badge
                    className={`${statusInfo.color} text-white px-2 py-1 flex items-center gap-1 rounded-full shadow-sm text-xs ml-2 flex-shrink-0`}
                    title={statusInfo.description}
                  >
                    {statusInfo.icon}
                    <span className="hidden xs:inline">{statusInfo.text}</span>
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Applied: {appliedJob?.createdAt
                      ? new Date(appliedJob.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AppliedJobTable
