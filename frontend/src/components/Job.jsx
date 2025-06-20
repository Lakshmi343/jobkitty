import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    
    const navigate = useNavigate();
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <div className='p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-300'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full border-white/20 hover:bg-white/20" size="icon">
                    <Bookmark className="text-teal-400" />
                </Button>
            </div>

            <div className='flex items-center gap-4 my-4'>
                <Button className="p-6 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 hover:from-teal-400/30 hover:to-cyan-400/30" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-300'>India</p>
                </div>
            </div>

            <div className='mt-4'>
                <h2 className='text-xl font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text'>{job?.title}</h2>
                <p className='text-gray-300 mt-2'>{job?.description}</p>
            </div>

            <div className='flex flex-wrap gap-2 mt-4'>
                {job?.skills?.map((skill, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-teal-400/20 to-cyan-400/20 text-teal-400 border border-teal-400/20">
                        {skill}
                    </Badge>
                ))}
            </div>

            <div className='flex items-center justify-between mt-6'>
                <div className='flex items-center gap-2'>
                    <span className='text-teal-400 font-medium'>${job?.salary}</span>
                    <span className='text-gray-300'>/year</span>
                </div>
                <Button 
                    onClick={() => navigate(`/job/${job?._id}`)}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                >
                    View Details
                </Button>
            </div>
        </div>
    )
}

export default Job