import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { authUtils } from '@/utils/authUtils';
import { setAllJobs, setJobPagination } from '@/redux/jobSlice';

const buildQueryParams = ({ page, limit, searchedQuery, filters }) => {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);

  if (searchedQuery) params.set('keyword', searchedQuery.trim());
  if (filters.location) params.set('location', filters.location.trim());
  if (filters.jobType) params.set('jobType', filters.jobType);
  if (filters.salaryRange) params.set('salaryRange', filters.salaryRange);
  if (filters.experienceRange) params.set('experienceRange', filters.experienceRange);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.companyType) params.set('companyType', filters.companyType);
  if (filters.datePosted) params.set('datePosted', filters.datePosted);

  return params.toString();
};

const useGetAllJobs = ({ page = 1, limit = 20 } = {}) => {
  const dispatch = useDispatch();
  const { searchedQuery, filters, pagination } = useSelector((store) => ({
    searchedQuery: store.job.searchedQuery,
    filters: store.job.filters,
    pagination: store.job.pagination
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      const isLoadMoreRequest = page > 1;
      setError(null);

      if (isLoadMoreRequest) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const request = async () => {
        const query = buildQueryParams({ page, limit, searchedQuery, filters });
        const token = authUtils.getAccessToken?.() || localStorage.getItem('accessToken') || '';
        return axios.get(`${JOB_API_END_POINT}/get?${query}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
      };

      try {
        const response = await request();
        if (!isMounted) return;

        if (response.data.success) {
          dispatch(
            setAllJobs({
              jobs: response.data.jobs || [],
              append: page > 1
            })
          );
          dispatch(setJobPagination(response.data.pagination || null));
        } else {
          throw new Error(response.data.message || 'Failed to fetch jobs');
        }
      } catch (err) {
        if (!isMounted) return;

        if (err.response?.status === 401) {
          try {
            const refreshed = await authUtils.validateToken();
            if (refreshed) {
              const retryResponse = await request();
              if (retryResponse.data.success) {
                dispatch(
                  setAllJobs({
                    jobs: retryResponse.data.jobs || [],
                    append: page > 1
                  })
                );
                dispatch(setJobPagination(retryResponse.data.pagination || null));
                return;
              }
            }
          } catch (tokenErr) {
            console.error('Token refresh failed:', tokenErr);
          }
        }

        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, [
    dispatch,
    page,
    limit,
    searchedQuery,
    filters.location,
    filters.jobType,
    filters.salaryRange,
    filters.experienceRange,
    filters.categoryId,
    filters.companyType,
    filters.datePosted
  ]);

  return { isLoading, isLoadingMore, error, pagination };
};

export default useGetAllJobs;