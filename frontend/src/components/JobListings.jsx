import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { setJobFilters } from '@/redux/jobSlice';
import TopFilterBar from './TopFilterBar';
import Job from './Job';
import { getLocationSearchString } from '../utils/locationUtils';

const JobListings = () => {
  const { category, location } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { allJobs } = useSelector((store) => store.job);

  // Update filters when URL params change
  useEffect(() => {
    const filters = {};
    
    if (category && category !== 'all-jobs') {
      filters.category = category.replace(/-/g, ' ');
    }
    
    if (location && location !== 'all-locations') {
      filters.location = location.replace(/-/g, ' ');
    }

    // Update additional filters from query params
    const jobType = searchParams.get('jobType');
    if (jobType) {
      filters.jobType = jobType;
    }

    const experience = searchParams.get('experience');
    if (experience) {
      filters.experience = experience;
    }

    dispatch(setJobFilters(filters));
  }, [category, location, searchParams, dispatch]);

  // Filter jobs based on URL parameters
  const filteredJobs = allJobs.filter((job) => {
    if (category && category !== 'all-jobs') {
      const categorySlug = job.category?.name?.toLowerCase().replace(/\s+/g, '-');
      if (categorySlug !== category) return false;
    }

    if (location && location !== 'all-locations') {
      const jobLocation = getLocationSearchString(job.location).toLowerCase().replace(/\s+/g, '-');
      if (!jobLocation.includes(location)) return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {category && category !== 'all-jobs' ? `${category.replace(/-/g, ' ')} Jobs` : 'All Jobs'}
        {location && location !== 'all-locations' ? ` in ${location.replace(/-/g, ' ')}` : ''}
      </h1>
      
      <div className="mb-8">
        <TopFilterBar />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-xl font-semibold text-gray-600">
              No jobs found matching your criteria
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
