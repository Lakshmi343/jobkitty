import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import Footer from './shared/Footer';

const Jobs = () => {
    const { allJobs, searchedQuery, filters } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        let filteredJobs = [...allJobs];

        if (searchedQuery) {
            const q = searchedQuery.toLowerCase();
            filteredJobs = filteredJobs.filter((job) => {
                return (
                    job.title?.toLowerCase().includes(q) ||
                    job.description?.toLowerCase().includes(q) ||
                    job.location?.toLowerCase().includes(q) ||
                    job.company?.name?.toLowerCase().includes(q)
                )
            })
        }

        // Apply location filter (case-insensitive)
        if (filters.location) {
            filteredJobs = filteredJobs.filter((job) => 
                job.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Apply job type filter (case-insensitive)
        if (filters.jobType) {
            filteredJobs = filteredJobs.filter((job) => 
                job.jobType?.toLowerCase() === filters.jobType.toLowerCase()
            );
        }

        // Apply category filter
        if (filters.categoryId) {
            filteredJobs = filteredJobs.filter((job) => 
                job.category?._id === filters.categoryId || job.category === filters.categoryId
            );
        }

        // Apply salary range filter
        if (filters.salaryRange) {
            filteredJobs = filteredJobs.filter((job) => {
                if (!job.salary || (job.salary.min === 0 && job.salary.max === 0)) return true;
                
                const salaryRange = filters.salaryRange;
                const jobMaxSalary = job.salary.max || job.salary.min || 0;
                
                switch (salaryRange) {
                    case '0-40k':
                        return jobMaxSalary <= 40000;
                    case '42-1lakh':
                        return jobMaxSalary >= 42000 && jobMaxSalary <= 100000;
                    case '1lakh to 5lakh':
                        return jobMaxSalary >= 100000 && jobMaxSalary <= 500000;
                    case '5lakh+':
                        return jobMaxSalary >= 500000;
                    default:
                        return true;
                }
            });
        }

        // Apply experience range filter
        if (filters.experienceRange) {
            filteredJobs = filteredJobs.filter((job) => {
                if (!job.experience) return true;
                
                const expRange = filters.experienceRange;
                const jobMaxExp = job.experience.max || job.experience.min || 0;
                
                switch (expRange) {
                    case '0-1 years':
                        return jobMaxExp <= 1;
                    case '1-3 years':
                        return jobMaxExp >= 1 && jobMaxExp <= 3;
                    case '3-5 years':
                        return jobMaxExp >= 3 && jobMaxExp <= 5;
                    case '5+ years':
                        return jobMaxExp >= 5;
                    default:
                        return true;
                }
            });
        }

        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery, filters]);

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


