import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck, MapPin, Clock } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatLocationForDisplay } from '../utils/locationUtils'

const Job = ({ job }) => {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime)
    const currentTime = new Date()
    const timeDifference = currentTime - createdAt
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="p-5 lg:p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>
            {daysAgoFunction(job?.createdAt) === 0
              ? 'Today'
              : `${daysAgoFunction(job?.createdAt)} days ago`}
          </span>
        </div>
        <Button
          onClick={() => setSaved(!saved)}
          variant="outline"
          className="rounded-full border-gray-200 hover:bg-gray-50"
          size="icon"
        >
          {saved ? (
            <BookmarkCheck className="w-5 h-5 text-blue-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-gray-600" />
          )}
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-start gap-3 mb-4 ">
        <div className="flex-shrink-0">
          <Avatar className="w-14 h-14 border-2 border-gray-200">
            <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {job?.company?.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{formatLocationForDisplay(job?.location) || 'India'}</span>
          </div>
        </div>
      </div>

      {/* Job Title & Description */}
      <div className="mb-4 flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {job?.title}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {job?.description}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job?.skills?.slice(0, 3).map((skill, index) => (
            <Badge
              key={index}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-lg transition"
            >
              {skill}
            </Badge>
          ))}
          {job?.skills?.length > 3 && (
            <Badge className="bg-gray-50 text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded-lg">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-600">
            {typeof job?.salary === 'object'
              ? `${job?.salary?.min}-${job?.salary?.max} LPA`
              : `₹${Number(job?.salary || 0).toLocaleString()}`}
          </span>
          <span className="text-sm text-gray-500">
            {typeof job?.salary === 'object' ? '' : '/year'}
          </span>
        </div>
        <Button
          onClick={() => navigate(`/job/${job?._id}?section=header`)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  )
}

export default Job