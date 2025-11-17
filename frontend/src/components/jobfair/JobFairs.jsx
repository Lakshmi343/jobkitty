import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { JOBFAIR_API_END_POINT } from '../../utils/constant';
import { Link } from 'react-router-dom';

const JobFairs = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const res = await axios.get(`${JOBFAIR_API_END_POINT}?activeOnly=true&status=published`);
				setItems(res.data.data || []);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const filtered = items.filter(it => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return (
			it.title?.toLowerCase().includes(q) ||
			it.description?.toLowerCase().includes(q) ||
			it.location?.city?.toLowerCase().includes(q) ||
			it.location?.state?.toLowerCase().includes(q) ||
			it.location?.country?.toLowerCase().includes(q)
		);
	});

	const formatDate = (d) => {
		try {
			return new Date(d).toLocaleDateString();
		} catch {
			return '';
		}
	};

	return (
		<div className="py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Upcoming Job Fairs</h1>
				<p className="text-gray-600 mt-1">Discover and join career fairs near you.</p>

				<div className="mt-4 flex items-center gap-3">
					<input
						className="w-full md:w-96 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="Search by title, city, state, country..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="border rounded-lg overflow-hidden bg-white animate-pulse">
							<div className="w-full h-44 bg-gray-200" />
							<div className="p-4 space-y-2">
								<div className="h-5 bg-gray-200 rounded w-3/4" />
								<div className="h-4 bg-gray-200 rounded w-full" />
								<div className="h-4 bg-gray-200 rounded w-5/6" />
							</div>
						</div>
					))}
				</div>
			) : (
				<>
					{filtered.length === 0 ? (
						<div className="text-center text-gray-600 py-16 border rounded-lg bg-white">No job fairs match your search.</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filtered.map(it => (
								<Link key={it._id} to={`/job-fair/${it._id}`} className="group block border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
									<div className="relative bg-white">
										{it.image ? <img src={it.image} alt={it.title} className="w-full h-48 object-contain bg-gray-50" /> : <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-indigo-100" />}
										<div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-xs font-medium rounded shadow-sm">
											{formatDate(it.date)}{it.time ? ` • ${it.time}` : ''}
										</div>
									</div>
									<div className="p-4">
										<h3 className="text-lg font-semibold group-hover:text-indigo-600">{it.title}</h3>
										<p className="text-sm text-gray-600 line-clamp-3 mt-1">{it.description}</p>
										{(it.location?.city || it.location?.state || it.location?.country) && (
											<p className="text-xs text-gray-500 mt-3">{[it.location?.city, it.location?.state, it.location?.country].filter(Boolean).join(', ')}</p>
										)}
										<div className="mt-3">
											<span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full">View details →</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default JobFairs;


