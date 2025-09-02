import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import Footer from './shared/Footer';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const q = searchedQuery.toLowerCase();
            const filteredJobs = allJobs.filter((job) => {
                return (
                    job.title?.toLowerCase().includes(q) ||
                    job.description?.toLowerCase().includes(q) ||
                    job.location?.toLowerCase().includes(q)
                )
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden p-4 sticky top-0 bg-gradient-to-br from-gray-50 to-gray-100 z-10">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-6'>
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Filter Sidebar */}
                    <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="lg:hidden mb-4 flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <FilterCard />
                    </div>

                    {/* Jobs Grid */}
                    <div className='flex-1'>
                        {filterJobs.length <= 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg mb-2">No jobs found</div>
                                <div className="text-gray-400">Try adjusting your search criteria</div>
                            </div>
                        ) : (
                            <div className='pb-5'>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}
                                                className="h-fit"
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Jobs


