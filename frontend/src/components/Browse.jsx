import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, Briefcase } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header Section */}
                <div className='text-center mb-8 lg:mb-12'>
                    <div className='flex items-center justify-center gap-3 mb-4'>
                        <div className='p-3 bg-blue-100 rounded-full'>
                            <Briefcase className='w-6 h-6 text-blue-600' />
                        </div>
                    </div>
                    <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
                        Browse All Jobs
                    </h1>
                    <p className='text-gray-600 text-lg'>
                        Discover {allJobs.length} opportunities waiting for you
                    </p>
                </div>

                {/* Results Count */}
                <div className='mb-8'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-gray-600'>
                            <Search className='w-5 h-5' />
                            <span className='font-medium'>{allJobs.length} jobs found</span>
                        </div>
                        <div className='text-sm text-gray-500'>
                            Showing all available positions
                        </div>
                    </div>
                </div>

                {/* Jobs Grid */}
                {allJobs.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
                            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs available</h3>
                            <p className="text-gray-600">Check back later for new opportunities</p>
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8'>
                        {allJobs.map((job) => (
                            <div key={job._id} className="h-fit">
                                <Job job={job} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse