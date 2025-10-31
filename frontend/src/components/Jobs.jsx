import React, { useMemo, useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import TopFilterBar from "./TopFilterBar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationSearchString, formatLocationForDisplay } from "../utils/locationUtils";
import Footer from "./shared/Footer";
import { setJobFilters, setSearchedQuery, setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useLocation, useParams } from 'react-router-dom';

const Jobs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const [error, setError] = useState(null);

  const { allJobs = [], searchedQuery = "", filters = {} } = useSelector((store) => ({
    allJobs: store.job.allJobs || [],
    searchedQuery: store.job.searchedQuery || "",
    filters: store.job.filters || {}
  }));

  // Initialize filters from URL on mount and when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = {};

    // Get role from search query or URL params
    const roleFromUrl = searchParams.get('q') || '';
    
    // Get category from URL params (e.g., /jobs/category/it-jobs)
    if (params.category) {
      // Handle both /category/ID and ?category=ID formats
      const categoryParam = params.category.replace(/-/g, ' ');
      // Extract just the ID part if it contains a slash
      filtersFromUrl.categoryId = categoryParam.split('/')[0];
      console.log('Extracted category ID from URL:', filtersFromUrl.categoryId);
    }
    
    // Get location from URL params (e.g., /jobs/location/kochi)
    if (params.location) {
      filtersFromUrl.location = params.location.replace(/-/g, ' ');
    }

    // Get other filters from search params
    if (searchParams.has('jobType')) filtersFromUrl.jobType = searchParams.get('jobType');
    if (searchParams.has('salary')) filtersFromUrl.salaryRange = searchParams.get('salary');
    if (searchParams.has('experience')) filtersFromUrl.experienceRange = searchParams.get('experience');
    if (searchParams.has('companyType')) filtersFromUrl.companyType = searchParams.get('companyType');
    if (searchParams.has('datePosted')) filtersFromUrl.datePosted = searchParams.get('datePosted');

    // Update Redux store with filters from URL
    dispatch(setSearchedQuery(roleFromUrl));
    dispatch(setJobFilters(filtersFromUrl));
  }, [dispatch, location.search, params]);

  // Fetch jobs on component mount and when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setError(null);
        
        // Build query parameters from filters
        const params = new URLSearchParams();
        if (searchedQuery) params.append('keyword', searchedQuery);
        if (filters.location) params.append('location', filters.location);
        if (filters.jobType) params.append('jobType', filters.jobType);
        if (filters.salaryRange) params.append('salary', filters.salaryRange);
        if (filters.experienceRange) params.append('experience', filters.experienceRange);
        if (filters.categoryId) params.append('category', filters.categoryId);
        if (filters.companyType) params.append('companyType', filters.companyType);
        if (filters.datePosted) params.append('datePosted', filters.datePosted);

        const response = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`);
        
        if (response.data.success) {
          dispatch(setAllJobs(response.data.jobs || []));
        } else {
          setError("Failed to load jobs. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please check your connection and try again.");
      }
    };

    fetchJobs();
  }, [dispatch, searchedQuery, filters]);

  const filterJobs = useMemo(() => {
    console.log('Filtering jobs with filters:', filters);
    
    return allJobs.filter((job) => {
      // Debug info for each job being filtered
      const jobDebugInfo = {
        id: job._id,
        title: job.title,
        location: job.location,
        jobType: job.jobType,
        category: job.category,
        companyType: job.company?.companyType,
        salary: job.salary,
        experience: job.experience,
        createdAt: job.createdAt
      };
      console.log('Checking job:', jobDebugInfo);

      // 1. Search Query Filter
      const q = searchedQuery?.toLowerCase().trim();
      if (q) {
        const searchableText = [
          job.title,
          job.description,
          job.requirements,
          job.responsibilities,
          job.jobType,
          job.company?.name,
          job.company?.industry,
          job.company?.description,
          job.category?.name,
          job.skills?.join(' '),
          job.employmentType,
          job.workMode,
          job.qualification,
          job.benefits,
          job.aboutCompany,
          getLocationSearchString(job.location)
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const searchTerms = q.split(/\s+/);
        const hasMatch = searchTerms.every(term => searchableText.includes(term));
        if (!hasMatch) {
          console.log('Job filtered out by search query');
          return false;
        }
      }

      // 2. Location Filter
      if (filters.location) {
        const jobLocation = getLocationSearchString(job.location)?.toLowerCase() || '';
        const filterLocation = filters.location.toLowerCase();
        if (!jobLocation.includes(filterLocation) && 
            job.location?.city?.toLowerCase() !== filterLocation &&
            job.location?.state?.toLowerCase() !== filterLocation) {
          console.log('Job filtered out by location');
          return false;
        }
      }

      // 3. Job Type Filter
      if (filters.jobType && job.jobType !== filters.jobType) {
        console.log('Job filtered out by job type');
        return false;
      }

      // 4. Category Filter
      if (filters.categoryId) {
        // Handle cases where categoryId might be in format 'categoryId/' or just 'categoryId'
        const cleanCategoryId = String(filters.categoryId).split('/')[0];
        const categoryMatches = 
          job.category?._id === cleanCategoryId || 
          job.category?._id?.includes(cleanCategoryId) ||
          job.category?.name?.toLowerCase() === cleanCategoryId.toLowerCase();
          
        if (!categoryMatches) {
          console.log('Job filtered out by category. Expected:', cleanCategoryId, 'Got:', job.category?._id);
          return false;
        }
      }

      // 5. Company Type Filter
      if (filters.companyType && job.company?.companyType !== filters.companyType) {
        console.log('Job filtered out by company type');
        return false;
      }

      // 6. Date Posted Filter
      if (filters.datePosted) {
        const jobDate = new Date(job.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let shouldExclude = false;
        switch (filters.datePosted) {
          case 'today':
            shouldExclude = diffDays > 1;
            break;
          case 'yesterday':
            shouldExclude = diffDays > 2;
            break;
          case 'week':
            shouldExclude = diffDays > 7;
            break;
          case 'month':
            shouldExclude = diffDays > 30;
            break;
          default:
            break;
        }
        if (shouldExclude) {
          console.log('Job filtered out by date posted');
          return false;
        }
      }

      // 7. Salary Range Filter
      if (filters.salaryRange) {
        const jobMinSalary = job.salary?.min || 0;
        const jobMaxSalary = job.salary?.max || jobMinSalary;
        let shouldExclude = false;

        switch (filters.salaryRange) {
          case '0-40k':
            shouldExclude = jobMaxSalary > 40000;
            break;
          case '42-1lakh':
            shouldExclude = jobMaxSalary < 42000 || jobMaxSalary > 100000;
            break;
          case '1lakh to 5lakh':
            shouldExclude = jobMaxSalary < 100000 || jobMaxSalary > 500000;
            break;
          case '5lakh+':
            shouldExclude = jobMaxSalary < 500000;
            break;
          default:
            break;
        }
        
        if (shouldExclude) {
          console.log('Job filtered out by salary range');
          return false;
        }
      }

      if (filters.salaryRange) {
        const jobMaxSalary = job.salary?.max || job.salary?.min || 0;
        switch (filters.salaryRange) {
          case "0-40k":
            if (jobMaxSalary > 40000) return false;
            break;
          case "42-1lakh":
            if (jobMaxSalary < 42000 || jobMaxSalary > 100000) return false;
            break;
          case "1lakh to 5lakh":
            if (jobMaxSalary < 100000 || jobMaxSalary > 500000) return false;
            break;
          case "5lakh+":
            if (jobMaxSalary < 500000) return false;
            break;
          default:
            break;
        }
      }

      if (filters.experienceRange) {
        const jobMaxExp = job.experience?.max || job.experience?.min || 0;
        switch (filters.experienceRange) {
          case "0-1 years":
            if (jobMaxExp > 1) return false;
            break;
          case "1-3 years":
            if (jobMaxExp < 1 || jobMaxExp > 3) return false;
            break;
          case "3-5 years":
            if (jobMaxExp < 3 || jobMaxExp > 5) return false;
            break;
          case "5+ years":
            if (jobMaxExp < 5) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  }, [allJobs, searchedQuery, filters]);
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Browse Jobs</h1>
          <p className="text-gray-500 mt-2">
            Discover opportunities from across{" "}
            {filters.location ? formatLocationForDisplay(filters.location) : "Kerala"} and beyond
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-10 flex flex-col md:flex-row gap-6">
         
          <div className="hidden md:block md:w-80 flex-shrink-0">
            <div className="bg-white shadow rounded-lg p-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
              <h3 className="font-semibold text-lg mb-6">Filters</h3>
              <TopFilterBar variant="sidebar" locationInputMode="text" />
            </div>
          </div>

         
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-700">
                  {filterJobs.length} {filterJobs.length === 1 ? "job" : "jobs"} found
                  {filters.location && ` in ${formatLocationForDisplay(filters.location)}`}
                </h3>
                {searchedQuery && (
                  <p className="text-sm text-gray-500">
                    Search results for "<span className="font-medium">{searchedQuery}</span>"
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-600 mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="relevance">Relevance</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {filterJobs.length <= 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-lg shadow"
              >
                <div className="text-4xl mb-3">🔎</div>
                <div className="text-gray-500 text-lg mb-2">No jobs found</div>
                <div className="text-gray-400">Try adjusting your search criteria or filters</div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    dispatch(setSearchedQuery(""));
                    dispatch(setJobFilters({
                      location: "",
                      jobType: "",
                      salaryRange: "",
                      experienceRange: "",
                      categoryId: "",
                      companyType: "",
                      datePosted: "",
                    }));
                  }}
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <div className="pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  <AnimatePresence>
                    {filterJobs.map((job) => (
                      <motion.div
                        key={job?._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="h-fit"
                      >
                        <Job job={job} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filterJobs.length > 9 && (
                  <div className="mt-8 text-center">
                    <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                      Load More Jobs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Jobs;