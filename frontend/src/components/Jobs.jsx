import React, { useEffect, useState, useMemo } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import Footer from './shared/Footer';

const Jobs = () => {
  const { allJobs, searchedQuery, filters } = useSelector((store) => store.job);
  const [showFilters, setShowFilters] = useState(false);

  // Memoized filtering logic
  const filterJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const q = searchedQuery?.toLowerCase();

      // Search filter
      if (
        q &&
        !(
          job.title?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.company?.name?.toLowerCase().includes(q)
        )
      ) {
        return false;
      }

      // Location filter
      if (
        filters.location &&
        !job.location?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Job Type filter
      if (
        filters.jobType &&
        job.jobType?.toLowerCase() !== filters.jobType.toLowerCase()
      ) {
        return false;
      }

      // Category filter
      if (
        filters.categoryId &&
        job.category?._id !== filters.categoryId &&
        job.category !== filters.categoryId
      ) {
        return false;
      }

      // Salary Range filter
      if (filters.salaryRange) {
        const jobMaxSalary = job.salary?.max || job.salary?.min || 0;
        switch (filters.salaryRange) {
          case '0-40k':
            if (jobMaxSalary > 40000) return false;
            break;
          case '42-1lakh':
            if (jobMaxSalary < 42000 || jobMaxSalary > 100000) return false;
            break;
          case '1lakh to 5lakh':
            if (jobMaxSalary < 100000 || jobMaxSalary > 500000) return false;
            break;
          case '5lakh+':
            if (jobMaxSalary < 500000) return false;
            break;
          default:
            break;
        }
      }

      // Experience filter
      if (filters.experienceRange) {
        const jobMaxExp = job.experience?.max || job.experience?.min || 0;
        switch (filters.experienceRange) {
          case '0-1 years':
            if (jobMaxExp > 1) return false;
            break;
          case '1-3 years':
            if (jobMaxExp < 1 || jobMaxExp > 3) return false;
            break;
          case '3-5 years':
            if (jobMaxExp < 3 || jobMaxExp > 5) return false;
            break;
          case '5+ years':
            if (jobMaxExp < 5) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  }, [allJobs, searchedQuery, filters]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
      Browse Jobs
    </h1>
    <p className="text-gray-500 mt-2">
      Find your dream job from thousands of opportunities across Kerala.
    </p>
  </div>
        <div className="lg:hidden p-4 sticky top-0 bg-gradient-to-br from-gray-50 to-gray-100 z-10">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
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
            <div className="flex-1">
              {filterJobs.length <= 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🔎</div>
                  <div className="text-gray-500 text-lg mb-2">No jobs found</div>
                  <div className="text-gray-400">
                    Try adjusting your search criteria
                  </div>
                </div>
              ) : (
                <div className="pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {filterJobs.map((job) => (
                      <motion.div
                        key={job?._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
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
      
      </div>
    </>
  );
};

export default Jobs;
