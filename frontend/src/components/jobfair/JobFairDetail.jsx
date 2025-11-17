import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { JOBFAIR_API_END_POINT, USER_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';

const JobFairDetail = () => {
	const { id } = useParams();
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [reg, setReg] = useState({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', website: '', notes: '' });
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState('');
	const { user } = useSelector(store => store.auth);

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const res = await axios.get(`${JOBFAIR_API_END_POINT}/${id}`);
				setItem(res.data.data);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [id]);

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			setSubmitting(true);
			setMessage('');
			const userToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
			const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};
			await axios.post(`${JOBFAIR_API_END_POINT}/${id}/registrations`, reg, { headers, withCredentials: true });
			setMessage('Registration submitted successfully. We will contact you soon.');
			setReg({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', website: '', notes: '' });
		} catch (e) {
			setMessage(e?.response?.data?.message || 'Failed to submit registration. Please ensure you are logged in as an Employer.');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return (
		<div className="py-8">
			<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg" />
			<div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-3">
					<div className="h-8 bg-gray-100 rounded animate-pulse" />
					<div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
					<div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
				</div>
				<div className="space-y-3">
					<div className="h-40 bg-gray-100 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
	if (!item) return <p>Not found</p>;

	return (
		<div className="py-8">
			{/* Hero */}
			<div className="relative rounded-2xl overflow-hidden border">
				{item.image ? (
					<div className="relative h-64 md:h-80 bg-black">
						<img src={item.image} alt={item.title} className="w-full h-full object-contain bg-black" />
						<div className="absolute inset-0 pointer-events-none" />
						<div className="absolute bottom-4 left-4 right-4 md:left-6 md:bottom-6 text-white">
							<div className="text-sm opacity-90">{new Date(item.date).toLocaleDateString()} {item.time ? `• ${item.time}` : ''}</div>
							<h1 className="text-2xl md:text-3xl font-bold mt-1">{item.title}</h1>
							{(item.location?.city || item.location?.state || item.location?.country) && (
								<div className="text-sm mt-1 opacity-90">{[item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ')}</div>
							)}
						</div>
					</div>
				) : (
					<div className="p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-indigo-100">
						<div className="text-sm text-indigo-700">{new Date(item.date).toLocaleDateString()} {item.time ? `• ${item.time}` : ''}</div>
						<h1 className="text-2xl md:text-3xl font-bold mt-1">{item.title}</h1>
						{(item.location?.city || item.location?.state || item.location?.country) && (
							<div className="text-sm mt-1 text-indigo-800">{[item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ')}</div>
						)}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<div className="bg-white rounded-xl border p-6">
						<h2 className="text-xl font-semibold">About this Job Fair</h2>
						<p className="text-gray-700 mt-3 whitespace-pre-wrap leading-7">{item.description}</p>
						<div className="mt-5 flex flex-wrap gap-3">
							{item.registrationLink ? (
								<a href={item.registrationLink} target="_blank" rel="noreferrer">
									<Button className="bg-indigo-600 hover:bg-indigo-700">Open Registration</Button>
								</a>
							) : null}
							{item.externalLink ? (
								<a href={item.externalLink} target="_blank" rel="noreferrer">
									<Button variant="outline">More Info</Button>
								</a>
							) : null}
						</div>
					</div>
				</div>
				<div className="space-y-6">
					<div className="bg-white rounded-xl border p-6">
						<h3 className="font-semibold mb-3">Event Details</h3>
						<ul className="text-sm text-gray-700 space-y-2">
							<li><span className="font-medium">Date:</span> {new Date(item.date).toLocaleDateString()}</li>
							{item.time ? <li><span className="font-medium">Time:</span> {item.time}</li> : null}
							{(item.location?.city || item.location?.state || item.location?.country) ? (
								<li><span className="font-medium">Location:</span> {[item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ')}</li>
							) : null}
						</ul>
					</div>

					{user?.role === 'Employer' && (
						<div className="bg-white rounded-xl border p-6">
							<h3 className="font-semibold mb-3">Company Registration</h3>
							<p className="text-sm text-gray-600 mb-4">Employers can register to participate in this job fair.</p>
							{message ? <div className="mb-3 text-sm">{message}</div> : null}
							<form onSubmit={handleRegister} className="grid grid-cols-1 gap-3">
								<input className="border rounded p-2" placeholder="Company Name" value={reg.companyName} onChange={e => setReg({ ...reg, companyName: e.target.value })} required />
								<input className="border rounded p-2" placeholder="Contact Name" value={reg.contactName} onChange={e => setReg({ ...reg, contactName: e.target.value })} required />
								<input className="border rounded p-2" placeholder="Contact Email" type="email" value={reg.contactEmail} onChange={e => setReg({ ...reg, contactEmail: e.target.value })} required />
								<input className="border rounded p-2" placeholder="Contact Phone" value={reg.contactPhone} onChange={e => setReg({ ...reg, contactPhone: e.target.value })} />
								<input className="border rounded p-2" placeholder="Website (optional)" value={reg.website} onChange={e => setReg({ ...reg, website: e.target.value })} />
								<textarea className="border rounded p-2" rows={4} placeholder="Notes (optional)" value={reg.notes} onChange={e => setReg({ ...reg, notes: e.target.value })} />
								<div>
									<Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Registration'}</Button>
									<span className="ml-3 text-xs text-gray-500">You must be logged in as an Employer.</span>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default JobFairDetail;


