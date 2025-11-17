 import React from 'react'
 import { Badge } from './ui/badge'
 import { Button } from './ui/button'
 import { useNavigate } from 'react-router-dom'
 import { ExternalLink, Briefcase } from 'lucide-react'
 
 const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    const handleViewDetails = (e) => {
        e.stopPropagation();
        navigate(`/job/${job._id}?section=header`);
    };

    // Format experience for display
    const formatExperience = (experience, experienceLevel) => {
        if (experienceLevel) {
            if (experienceLevel === 'Fresher') return 'Fresher (0 years)'
            if (experienceLevel === 'Entry Level') return '0-1 years'
            if (experienceLevel === 'Mid Level') return '2-5 years'
            if (experienceLevel === 'Senior Level') return '5+ years'
            return experienceLevel
        }
        
        if (experience?.min !== undefined && experience?.max !== undefined) {
            const min = experience.min
            const max = experience.max
            
            if (min === 0 && max === 0) return 'Fresher (0 years)'
            if (min === 0 && max === 1) return '0-1 years'
            if (min >= 1 && max <= 3) return '1-3 years'
            if (min >= 3 && max <= 5) return '3-5 years'
            if (min >= 5) return '5+ years'
            
            return `${min}-${max} years`
        }
        
        return 'Not specified'
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
                <Badge className={'text-blue-700 font-bold text-xs md:text-sm'} variant="ghost">{job?.
openings} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold text-xs md:text-sm'} variant="ghost">{job?.jobType}</Badge>
                {job?.experience && (
                    <Badge className={'text-purple-700 font-bold text-xs md:text-sm flex items-center gap-1'} variant="ghost">
                        <Briefcase className="w-3 h-3" />
                        {formatExperience(job.experience, job.experienceLevel)}
                    </Badge>
                )}
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