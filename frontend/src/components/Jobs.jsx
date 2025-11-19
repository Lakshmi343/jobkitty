import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import TopFilterBar from "./TopFilterBar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationSearchString, formatLocationForDisplay } from "../utils/locationUtils";
import Footer from "./shared/Footer";
import { setJobFilters, setSearchedQuery } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useLocation, useParams } from 'react-router-dom';
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Jobs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { allJobs = [], searchedQuery = "", filters = {}, pagination: jobPagination } = useSelector((store) => ({
    allJobs: store.job.allJobs || [],
    searchedQuery: store.job.searchedQuery || "",
    filters: store.job.filters || {},
    pagination: store.job.pagination || null
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

  // Use the useGetAllJobs hook for initial load and pagination
  const { isLoading, isLoadingMore, error: hookError, pagination } = useGetAllJobs({
    page: currentPage,
    limit: 20
  });

  // Update error state from hook
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  // Handle load more functionality
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchedQuery, filters]);
  if (isLoading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

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
                  {pagination?.total || jobPagination?.total || 0}{" "}
                  {(pagination?.total || jobPagination?.total || 0) === 1 ? "job" : "jobs"} found
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

            {(pagination?.total ?? 0) === 0 ? (
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
                    {allJobs.map((job) => (
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

                {pagination?.hasNext && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Jobs ({allJobs.length} of {pagination?.total || 0})
                        </>
                      )}
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