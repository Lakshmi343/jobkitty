import { setAllAdminJobs } from '@/redux/jobSlice'
import { ADMIN_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    console.error('No admin token found');
                    return;
                }
                const res = await axios.get(`${ADMIN_API_END_POINT}/jobs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.error('Error fetching admin jobs:', error);
                // Don't show error toast for hook-based fetching
            }
        }
        fetchAllAdminJobs();
    },[])
}

export default useGetAllAdminJobs