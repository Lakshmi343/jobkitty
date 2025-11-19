import React, { useEffect, useState } from "react";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Search, Briefcase } from "lucide-react";

const Browse = () => {
  const [page, setPage] = useState(1);
  const { isLoading, isLoadingMore, error, pagination } = useGetAllJobs({ page, limit: 20 });
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  if (isLoading && page === 1) {
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
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header Section - Clean (No Background) */}
      <div className=" text-center">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full shadow-md">
              <Briefcase className="w-8 h-8 text-blue-700" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Browse All Jobs
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Discover <span className="font-semibold">{pagination?.total || 0}</span>{" "}
            opportunities waiting for you
          </p>
        </div>
      </div>

      {/* Results Count Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Search className="w-5 h-5" />
            <span className="font-medium">{pagination?.total || 0} jobs found</span>
          </div>
          <div className="text-sm text-gray-500">
            Showing all available positions
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {(pagination?.total ?? 0) === 0 ? (
          <div className="text-center py-16">
            <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs available
              </h3>
              <p className="text-gray-600">
                Check back later for new opportunities
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {allJobs.map((job) => (
                <div key={job._id} className="h-fit">
                  <Job job={job} />
                </div>
              ))}
            </div>
            {pagination?.hasNext && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isLoadingMore}
                  className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading more jobs...
                    </>
                  ) : (
                    <>
                      Load More ({allJobs.length} of {pagination?.total || 0})
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
