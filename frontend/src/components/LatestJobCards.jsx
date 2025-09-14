import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    
    const handleViewDetails = (e) => {
        e.stopPropagation();
        navigate(`/job/${job._id}?section=header`);
    };
    
    return (
        <div onClick={()=> navigate(`/job/${job._id}`)} className='p-3 md:p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow duration-300'>
            <div>
                <h1 className='font-medium text-base md:text-lg'>{job?.company?.name}</h1>
                <p className='text-xs md:text-sm text-gray-500'>India</p>
            </div>
            <div>
                <h1 className='font-bold text-base md:text-lg my-2 line-clamp-2'>{job?.title}</h1>
                <p className='text-xs md:text-sm text-gray-600 line-clamp-3'>{job?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-1 md:gap-2 mt-3 md:mt-4'>
                <Badge className={'text-blue-700 font-bold text-xs md:text-sm'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold text-xs md:text-sm'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold text-xs md:text-sm'} variant="ghost">{typeof job?.salary === 'object' ? `${job?.salary?.min}-${job?.salary?.max} LPA` : `${job?.salary} LPA`}</Badge>
            </div>
            
            <div className='mt-4 flex justify-end'>
                <Button
                    onClick={handleViewDetails}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Details
                </Button>
            </div>

        </div>
    )
}

export default LatestJobCards