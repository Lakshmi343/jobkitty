import { setSingleCompany } from '@/redux/companySlice'
import { setAllJobs } from '@/redux/jobSlice'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSingleCompany = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { withCredentials: true });
                console.log(res.data.company);
                if (res.data.success) {
                    dispatch(setSingleCompany(res.data.company));
                } else {
                    setError("Failed to fetch company data");
                }
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || "Failed to fetch company data");
            } finally {
                setLoading(false);
            }
        }
        fetchSingleCompany();
    }, [companyId, dispatch])

    return { loading, error };
}

export default useGetCompanyById