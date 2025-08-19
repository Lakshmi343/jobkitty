import { setSingleCompany } from '@/redux/companySlice'
import { ADMIN_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyByIdAdmin = (companyId) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchSingleCompany = async () => {
			try {
				setLoading(true);
				setError(null);
				const token = localStorage.getItem('adminToken');
				const res = await axios.get(`${ADMIN_API_END_POINT}/companies/${companyId}`, {
					headers: { Authorization: `Bearer ${token}` }
				});
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
		if (companyId) fetchSingleCompany();
	}, [companyId, dispatch])

	return { loading, error };
}

export default useGetCompanyByIdAdmin 