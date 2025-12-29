import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// Components
import Navbar from "./shared/Navbar";
import Job from "./Job";
import Footer from "./shared/Footer";
import JobSearchSection from "./JobSearchSection";
import TopFilterBar from "./TopFilterBar";

// Hooks
import useGetAllJobs from "@/hooks/useGetAllJobs";

// Utils & Redux
import { formatLocationForDisplay } from "../utils/locationUtils";
import { setJobFilters, setSearchedQuery } from "@/redux/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { allJobs = [], searchedQuery = "", filters = {}, pagination: jobPagination } = useSelector((store) => ({
    allJobs: store.job.allJobs || [],
    searchedQuery: store.job.searchedQuery || "",
    filters: store.job.filters || {},
    pagination: store.job.pagination || null
  }));

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !locationQuery.trim()) return;
    
    setIsSearching(true);
    const searchParams = new URLSearchParams();
    
    if (searchQuery) searchParams.set('q', searchQuery);
    if (locationQuery) searchParams.set('location', locationQuery);
    
    navigate(`/jobs?${searchParams.toString()}`);
    
    // Reset pagination to first page on new search
    setCurrentPage(1);
    setIsSearching(false);
  }, [searchQuery, locationQuery, navigate]);

  // Handle search when component mounts with URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get('q') || '';
    const locationTerm = params.get('location') || '';
    
    setSearchQuery(searchTerm);
    setLocationQuery(locationTerm);
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = {};

 
    const roleFromUrl = searchParams.get('q') || '';
    
   
    if (params.category) {
     
      const categoryParam = params.category.replace(/-/g, ' ');
   
      filtersFromUrl.categoryId = categoryParam.split('/')[0];
      console.log('Extracted category ID from URL:', filtersFromUrl.categoryId);
    }
    
  
    if (params.location) {
      filtersFromUrl.location = params.location.replace(/-/g, ' ');
    }

    
    if (searchParams.has('jobType')) filtersFromUrl.jobType = searchParams.get('jobType');
    if (searchParams.has('salary')) filtersFromUrl.salaryRange = searchParams.get('salary');
    if (searchParams.has('experience')) filtersFromUrl.experienceRange = searchParams.get('experience');
    if (searchParams.has('companyType')) filtersFromUrl.companyType = searchParams.get('companyType');
    if (searchParams.has('datePosted')) filtersFromUrl.datePosted = searchParams.get('datePosted');


    dispatch(setSearchedQuery(roleFromUrl));
    dispatch(setJobFilters(filtersFromUrl));
  }, [dispatch, location.search, params]);

  const { isLoading, isLoadingMore, error: hookError, pagination } = useGetAllJobs({
    page: currentPage,
    limit: 20
  });

 
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchedQuery, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Find Your Dream Job</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover opportunities from across {filters.location ? formatLocationForDisplay(filters.location) : "Kerala"} and beyond
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <JobSearchSection 
              onSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            {/* <div className="hidden md:block md:w-80 flex-shrink-0">
              <div className="bg-white shadow rounded-lg p-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                <h3 className="font-semibold text-lg mb-6">Filters</h3>
                {allJobs.length > 0 || Object.values(filters).some(Boolean) ? (
                  <TopFilterBar variant="top" />
                ) : null}
              </div>
            </div> */}

            {/* Job Listings */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">
                      {pagination?.total || jobPagination?.total || 0}{" "}
                      {(pagination?.total || jobPagination?.total || 0) === 1 ? "job" : "jobs"} found
                      {filters.location && ` in ${formatLocationForDisplay(filters.location)}`}
                    </h3>
                    {searchedQuery && (
                      <p className="text-sm text-gray-500 mt-1">
                        Search results for "<span className="font-medium">{searchedQuery}</span>"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <label htmlFor="sort" className="text-sm text-gray-600 mr-2 whitespace-nowrap">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[160px]"
                    >
                      <option value="newest">Newest</option>
                      <option value="relevance">Relevance</option>
                      <option value="salary-high">Salary: High to Low</option>
                      <option value="salary-low">Salary: Low to High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* No Results */}
              {(pagination?.total ?? 0) === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-lg shadow"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
                  <button
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
                      setSearchQuery("");
                      setLocationQuery("");
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              ) : (
                /* Job Listings Grid */
                <div className="pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    <AnimatePresence>
                      {allJobs.map((job) => (
                        <motion.div
                          key={job?._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="h-full"
                        >
                          <Job job={job} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Load More Button */}
                  {pagination?.hasNext && (
                    <div className="mt-10 text-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-6 py-2.5 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        {isLoadingMore ? (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : (
                          `Load More (${allJobs.length} of ${pagination?.total || 0})`
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
 
    </div>
  );
};

export default Jobs;