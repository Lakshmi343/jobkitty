
import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import TopFilterBar from "./TopFilterBar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationSearchString, formatLocationForDisplay } from "../utils/locationUtils";
import Footer from "./shared/Footer";
import { setJobFilters, setSearchedQuery } from "@/redux/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, searchedQuery, filters } = useSelector((store) => store.job);

  const filterJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const q = searchedQuery?.toLowerCase().trim();
      
      // If there's a search query, check all relevant fields
      if (q) {
        // Create a searchable string from all relevant job fields
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
          .filter(Boolean) // Remove any undefined/null values
          .join(' ')
          .toLowerCase();

        // Check if any word in the query matches the searchable text
        const searchTerms = q.split(/\s+/);
        const hasMatch = searchTerms.every(term => 
          searchableText.includes(term)
        );

        if (!hasMatch) {
          return false;
        }
      }

      if (filters.location) {
        const locationQuery = String(filters.location).toLowerCase();
        const jobLocation = getLocationSearchString(job.location).toLowerCase();
        const jobState = job.location?.state?.toLowerCase() || "";
        const jobDistrict = job.location?.district?.toLowerCase() || "";
        const jobLegacy = job.location?.legacy?.toLowerCase() || "";
        if (
          !jobLocation.includes(locationQuery) &&
          !jobState.includes(locationQuery) &&
          !jobDistrict.includes(locationQuery) &&
          !jobLegacy.includes(locationQuery)
        ) {
          return false;
        }
      }

      if (filters.jobType && job.jobType?.toLowerCase() !== filters.jobType.toLowerCase()) {
        return false;
      }

      if (
        filters.categoryId &&
        job.category?._id !== filters.categoryId &&
        job.category !== filters.categoryId
      ) {
        return false;
      }

    
      if (filters.companyType) {
        const jobCompanyType = job.company?.companyType || '';
        if (jobCompanyType.toLowerCase() !== String(filters.companyType).toLowerCase()) {
          return false;
        }
      }

      
      if (filters.datePosted) {
        const createdAt = job.createdAt ? new Date(job.createdAt) : null;
        if (!createdAt || isNaN(createdAt.getTime())) return false;
        const now = new Date();
        const ms = {
          '24h': 24 * 60 * 60 * 1000,
          '7d': 7 * 24 * 60 * 60 * 1000,
          '14d': 14 * 24 * 60 * 60 * 1000,
          '30d': 30 * 24 * 60 * 60 * 1000,
        }[filters.datePosted] || 0;
        if (ms && (now.getTime() - createdAt.getTime()) > ms) {
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
