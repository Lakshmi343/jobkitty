import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { JOBFAIR_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminJobFairs = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deletingId, setDeletingId] = useState(null);
	const navigate = useNavigate();

	const headers = () => {
		const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('adminToken');
		return { Authorization: `Bearer ${token}` };
	};

	const load = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await axios.get(`${JOBFAIR_API_END_POINT}/admin/list/all`, { 
				headers: headers() 
			});
			setItems(res.data.data || []);
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Failed to load job fairs';
			setError(errorMsg);
			toast.error(errorMsg);
			console.error('Error loading job fairs:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, []);

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this job fair? This action cannot be undone.')) return;
		
		try {
			setDeletingId(id);
			await axios.delete(`${JOBFAIR_API_END_POINT}/${id}`, { 
				headers: headers() 
			});
			toast.success('Job fair deleted successfully');
			await load(); 
		} catch (err) {
			const errorMsg = err.response?.data?.message || 'Failed to delete job fair';
			toast.error(errorMsg);
			console.error('Error deleting job fair:', err);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">Job Fairs</h2>
				<Button onClick={() => navigate('/admin/jobfairs/new')}>Create Job Fair</Button>
			</div>
			{error ? (
				<div className="bg-red-50 border-l-4 border-red-500 p-4">
					<p className="text-red-700">{error}</p>
					<Button 
						variant="outline" 
						onClick={load}
						className="mt-2"
					>
						Retry
					</Button>
				</div>
			) : loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				</div>
			) : items.length === 0 ? (
				<div className="text-center py-10">
					<p className="text-gray-500">No job fairs found.</p>
					<Button 
						onClick={() => navigate('/admin/jobfairs/new')}
						className="mt-4"
					>
						Create Your First Job Fair
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map(it => (
						<div key={it._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
							{it.image && (
								<div className="relative aspect-video mb-4 overflow-hidden rounded">
									<img 
										src={it.image} 
										alt={it.title} 
										className="w-full h-full object-cover"
										onError={(e) => {
											e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
										}}
									/>
							</div>
							)}
							<h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{it.title}</h3>
							<p className="text-sm text-gray-500 mt-1">
								{new Date(it.date).toLocaleDateString('en-US', { 
									year: 'numeric', 
									month: 'short', 
									day: 'numeric' 
								})}
								{it.time && ` • ${it.time}`}
							</p>
							{it.location?.city && (
								<p className="text-sm text-gray-500 mt-1">
									{it.location.city}
									{it.location.state && `, ${it.location.state}`}
								</p>
							)}
							<p className="text-sm text-gray-600 mt-2 line-clamp-2">{it.description}</p>
							
							<div className="mt-4 pt-3 border-t flex justify-end gap-2">
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => navigate(`/admin/jobfairs/${it._id}/edit`)}
								>
									Edit
								</Button>
								<Button 
									variant="destructive" 
									size="sm"
									disabled={deletingId === it._id}
									onClick={() => handleDelete(it._id)}
								>
									{deletingId === it._id ? 'Deleting...' : 'Delete'}
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AdminJobFairs;


