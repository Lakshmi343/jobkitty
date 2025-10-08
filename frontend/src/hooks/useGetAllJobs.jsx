import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authUtils } from '@/utils/authUtils'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                const token = authUtils.getAccessToken?.() || localStorage.getItem('accessToken') || '';
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery || '')}`,
                    {
                        withCredentials: true,
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    }
                );
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                // If unauthorized and we have refresh support, try once more
                try {
                    const ok = await authUtils.validateToken();
                    if (ok) {
                        const token2 = authUtils.getAccessToken?.() || localStorage.getItem('accessToken') || '';
                        const res2 = await axios.get(
                            `${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery || '')}`,
                            {
                                withCredentials: true,
                                headers: token2 ? { Authorization: `Bearer ${token2}` } : {}
                            }
                        );
                        if (res2.data.success) {
                            dispatch(setAllJobs(res2.data.jobs));
                            return;
                        }
                    }
                } catch {}
                console.error('Error fetching jobs:', error);
            }
        }
        fetchAllJobs();
    },[dispatch, searchedQuery])
}

export default useGetAllJobs