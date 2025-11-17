import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_END_POINT, JOBFAIR_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';

const AdminJobFairs = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const headers = () => {
		const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('adminToken');
		return { Authorization: `Bearer ${token}` };
	};

	const load = async () => {
		try {
			setLoading(true);
			const res = await axios.get(`${JOBFAIR_API_END_POINT}/admin/list/all`, { headers: headers() });
			setItems(res.data.data || []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, []);

	const handleDelete = async (id) => {
		if (!confirm('Delete this job fair?')) return;
		try {
			await axios.delete(`${JOBFAIR_API_END_POINT}/${id}`, { headers: headers() });
			load();
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">Job Fairs</h2>
				<Button onClick={() => navigate('/admin/jobfairs/new')}>Create Job Fair</Button>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{items.map(it => (
						<div key={it._id} className="border rounded-lg p-4 bg-white">
							{it.image ? <img src={it.image} alt={it.title} className="w-full h-36 object-cover rounded" /> : null}
							<h3 className="mt-2 font-semibold">{it.title}</h3>
							<p className="text-sm text-gray-600 line-clamp-3">{it.description}</p>
							<p className="text-sm mt-1">{new Date(it.date).toLocaleDateString()}</p>
							<div className="mt-3 flex gap-2">
								<Button variant="secondary" onClick={() => navigate(`/admin/jobfairs/${it._id}/edit`)}>Edit</Button>
								<Button variant="destructive" onClick={() => handleDelete(it._id)}>Delete</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminJobFairs;


