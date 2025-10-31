// import React, { useMemo, useEffect } from "react";
// import Navbar from "./shared/Navbar";
// import TopFilterBar from "./TopFilterBar";
// import Job from "./Job";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { getLocationSearchString, formatLocationForDisplay } from "../utils/locationUtils";
// import Footer from "./shared/Footer";
// import { setJobFilters, setSearchedQuery } from "@/redux/jobSlice";

// const Internships = () => {
//   const dispatch = useDispatch();
//   const { allJobs, searchedQuery, filters } = useSelector((store) => store.job);

//   // Set job type filter to 'internship' when component mounts
//   useEffect(() => {
//     dispatch(setJobFilters({ ...filters, jobType: 'internship' }));
    
//     // Cleanup function to reset filters when component unmounts
//     return () => {
//       dispatch(setJobFilters({ ...filters, jobType: '' }));
//     };
//   }, [dispatch]);

//   const filterJobs = useMemo(() => {
//     return allJobs.filter((job) => {
//       // First filter for internships
//       if (job.jobType?.toLowerCase() !== 'internship') {
//         return false;
//       }

//       const q = searchedQuery?.toLowerCase();

//       if (
//         q &&
//         !(
//           job.title?.toLowerCase().includes(q) ||
//           job.description?.toLowerCase().includes(q) ||
//           getLocationSearchString(job.location).includes(q) ||
//           job.company?.name?.toLowerCase().includes(q) ||
//           job.skills?.some((skill) => skill.toLowerCase().includes(q))
//         )
//       ) {
//         return false;
//       }

//       if (filters.location) {
//         const locationQuery = String(filters.location).toLowerCase();
//         const jobLocation = getLocationSearchString(job.location).toLowerCase();
//         const jobState = job.location?.state?.toLowerCase() || "";
//         const jobDistrict = job.location?.district?.toLowerCase() || "";
//         const jobLegacy = job.location?.legacy?.toLowerCase() || "";
//         if (
//           !jobLocation.includes(locationQuery) &&
//           !jobState.includes(locationQuery) &&
//           !jobDistrict.includes(locationQuery) &&
//           !jobLegacy.includes(locationQuery)
//         ) {
//           return false;
//         }
//       }

//       if (filters.categoryId &&
//           job.category?._id !== filters.categoryId &&
//           job.category !== filters.categoryId
//       ) {
//         return false;
//       }

//       if (filters.companyType) {
//         const jobCompanyType = job.company?.companyType || '';
//         if (jobCompanyType.toLowerCase() !== String(filters.companyType).toLowerCase()) {
//           return false;
//         }
//       }
      
//       if (filters.datePosted) {
//         const createdAt = job.createdAt ? new Date(job.createdAt) : null;
//         if (!createdAt || isNaN(createdAt.getTime())) return false;
//         const now = new Date();
//         const ms = {
//           '24h': 24 * 60 * 60 * 1000,
//           '7d': 7 * 24 * 60 * 60 * 1000,
//           '14d': 14 * 24 * 60 * 60 * 1000,
//           '30d': 30 * 24 * 60 * 60 * 1000,
//         }[filters.datePosted] || 0;
//         if (ms && (now.getTime() - createdAt.getTime()) > ms) {
//           return false;
//         }
//       }

//       if (filters.salaryRange) {
//         const jobMaxSalary = job.salary?.max || job.salary?.min || 0;
//         switch (filters.salaryRange) {
//           case "0-40k":
//             if (jobMaxSalary > 40000) return false;
//             break;
//           case "42-1lakh":
//             if (jobMaxSalary < 42000 || jobMaxSalary > 100000) return false;
//             break;
//           case "1lakh to 5lakh":
//             if (jobMaxSalary < 100000 || jobMaxSalary > 500000) return false;
//             break;
//           case "5lakh+":
//             if (jobMaxSalary < 500000) return false;
//             break;
//           default:
//             break;
//         }
//       }

//       if (filters.experienceRange) {
//         const jobMaxExp = job.experience?.max || job.experience?.min || 0;
//         switch (filters.experienceRange) {
//           case "0-1 years":
//             if (jobMaxExp > 1) return false;
//             break;
//           case "1-3 years":
//             if (jobMaxExp < 1 || jobMaxExp > 3) return false;
//             break;
//           case "3-5 years":
//             if (jobMaxExp < 3 || jobMaxExp > 5) return false;
//             break;
//           case "5+ years":
//             if (jobMaxExp < 5) return false;
//             break;
//           default:
//             break;
//         }
//       }

//       return true;
//     });
//   }, [allJobs, searchedQuery, filters]);

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
//         <div className="max-w-7xl mx-auto px-4 text-center mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Internship Opportunities</h1>
//           <p className="text-gray-500 mt-2">
//             Find the perfect internship to kickstart your career in {" "}
//             {filters.location ? formatLocationForDisplay(filters.location) : "Kerala"} and beyond
//           </p>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 pb-10 flex flex-col md:flex-row gap-6">
//           {/* Sidebar Filters - Hidden on mobile, shown on md and up */}
//           <div className="hidden md:block md:w-80 flex-shrink-0">
//             <div className="bg-white shadow rounded-lg p-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
//               <h3 className="font-semibold text-lg mb-6">Filters</h3>
//               <TopFilterBar variant="sidebar" locationInputMode="text" />
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
//               <div>
//                 <h3 className="font-medium text-gray-700">
//                   {filterJobs.length} {filterJobs.length === 1 ? "internship" : "internships"} found
//                   {filters.location && ` in ${formatLocationForDisplay(filters.location)}`}
//                 </h3>
//                 {searchedQuery && (
//                   <p className="text-sm text-gray-500">
//                     Search results for "<span className="font-medium">{searchedQuery}</span>"
//                   </p>
//                 )}
//               </div>

//               <div className="flex items-center">
//                 <label htmlFor="sort" className="text-sm text-gray-600 mr-2">
//                   Sort by:
//                 </label>
//                 <select
//                   id="sort"
//                   className="border border-gray-300 rounded px-2 py-1 text-sm"
//                 >
//                   <option value="newest">Newest</option>
//                   <option value="relevance">Relevance</option>
//                   <option value="salary-high">Stipend: High to Low</option>
//                   <option value="salary-low">Stipend: Low to High</option>
//                 </select>
//               </div>
//             </div>

//             {filterJobs.length <= 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-12 bg-white rounded-lg shadow"
//               >
//                 <div className="text-4xl mb-3">🔎</div>
//                 <div className="text-gray-500 text-lg mb-2">No internships found</div>
//                 <div className="text-gray-400">Try adjusting your search criteria or filters</div>
//                 <button
//                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                   onClick={() => {
//                     dispatch(setSearchedQuery(""));
//                     dispatch(setJobFilters({
//                       location: "",
//                       jobType: "internship",
//                       salaryRange: "",
//                       experienceRange: "",
//                       categoryId: "",
//                       companyType: "",
//                       datePosted: ""
//                     }));
//                   }}
//                 >
//                   Clear all filters
//                 </button>
//               </motion.div>
//             ) : (
//               <AnimatePresence>
//                 <div className="space-y-4">
//                   {filterJobs.map((job) => (
//                     <motion.div
//                       key={job._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Job job={job} />
//                     </motion.div>
//                   ))}
//                 </div>
//               </AnimatePresence>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Internships;

import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationSearchString, formatLocationForDisplay } from "../utils/locationUtils";
import { setJobFilters, setSearchedQuery, setAllJobs } from "@/redux/jobSlice";
import Navbar from "./shared/Navbar";
import TopFilterBar from "./TopFilterBar";
import Job from "./Job";
import Footer from "./shared/Footer";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const Internships = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { allJobs = [], searchedQuery = "", filters = {} } = useSelector((store) => ({
    allJobs: store.job.allJobs || [],
    searchedQuery: store.job.searchedQuery || "",
    filters: store.job.filters || {}
  }));


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = {
      jobType: 'Internship' 
   
    };


    const roleFromUrl = searchParams.get('q') || '';
    
 
    if (params.category) {
      filtersFromUrl.categoryId = params.category.replace(/-/g, ' ');
    }
    
    
    if (params.location) {
      filtersFromUrl.location = params.location.replace(/-/g, ' ');
    }

   
    if (searchParams.has('salary')) filtersFromUrl.salaryRange = searchParams.get('salary');
    if (searchParams.has('experience')) filtersFromUrl.experienceRange = searchParams.get('experience');
    if (searchParams.has('companyType')) filtersFromUrl.companyType = searchParams.get('companyType');
    if (searchParams.has('datePosted')) filtersFromUrl.datePosted = searchParams.get('datePosted');


    dispatch(setSearchedQuery(roleFromUrl));
    dispatch(setJobFilters(filtersFromUrl));
  }, [dispatch, location.search, params]);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
       
        const params = new URLSearchParams();
        if (searchedQuery) params.append('keyword', searchedQuery);
        params.append('jobType', 'Internship'); 
        if (filters.location) params.append('location', filters.location);
        if (filters.salaryRange) params.append('salary', filters.salaryRange);
        if (filters.experienceRange) params.append('experience', filters.experienceRange);
        if (filters.categoryId) params.append('category', filters.categoryId);
        if (filters.companyType) params.append('companyType', filters.companyType);
        if (filters.datePosted) params.append('datePosted', filters.datePosted);

        const response = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`);
        
        if (response.data.success) {
          dispatch(setAllJobs(response.data.jobs || []));
        } else {
          setError("Failed to load internships. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to load internships. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [dispatch, searchedQuery, filters]);

  const filterJobs = useMemo(() => {
    console.log('Filtering internships with filters:', filters);
    
    return allJobs.filter((job) => {
   
      console.log('Checking job:', {
        id: job._id,
        title: job.title,
        jobType: job.jobType,
        location: job.location,
        category: job.category
      });
      
      // First filter for internships (case-insensitive check)
      if (job.jobType?.toLowerCase() !== 'internship') {
        console.log('Filtered out - Not an internship');
        return false;
      }

      const q = searchedQuery?.toLowerCase();

      if (
        q &&
        !(
          job.title?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          getLocationSearchString(job.location).includes(q) ||
          job.company?.name?.toLowerCase().includes(q) ||
          job.skills?.some((skill) => skill.toLowerCase().includes(q))
        )
      ) {
        return false;
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

      if (filters.categoryId &&
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Internship Opportunities</h1>
          <p className="text-gray-500 mt-2">
            Find the perfect internship to kickstart your career in {" "}
            {filters.location ? formatLocationForDisplay(filters.location) : "your area"}
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
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                {isLoading ? (
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <h3 className="font-medium text-gray-700">
                    {filterJobs.length} {filterJobs.length === 1 ? "internship" : "internships"} found
                    {filters.location && ` in ${formatLocationForDisplay(filters.location)}`}
                  </h3>
                )}
                {searchedQuery && (
                  <p className="text-sm text-gray-500 mt-1">
                    Search results for "<span className="font-medium">{searchedQuery}</span>"
                  </p>
                )}
              </div>

              <div className="w-full sm:w-auto flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-600 mr-2 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="relevance">Relevance</option>
                  <option value="salary-high">Stipend: High to Low</option>
                  <option value="salary-low">Stipend: Low to High</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Internships</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filterJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-lg shadow"
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
                <p className="text-gray-500 mb-6">
                  We couldn't find any internships matching your criteria.
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  <p className="text-sm text-gray-500">Try these tips:</p>
                  <ul className="text-sm text-gray-500 space-y-1 text-left">
                    <li>• Remove some filters to expand your search</li>
                    <li>• Check your spelling</li>
                    <li>• Try different keywords or locations</li>
                  </ul>
                </div>
                <button
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    dispatch(setSearchedQuery(""));
                    dispatch(setJobFilters({
                      ...filters,
                      jobType: 'Internship',
                      location: "",
                      salaryRange: "",
                      experienceRange: "",
                      categoryId: "",
                      companyType: "",
                      datePosted: ""
                    }));
                  }}
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {filterJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
     
    </>
  );
};

export default Internships;