import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { JOBFAIR_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';

const AdminJobFairForm = () => {
	const { id } = useParams();
	const isEdit = Boolean(id);
	const [form, setForm] = useState({
		title: '',
		description: '',
		date: '',
		time: '',
		registrationLink: '',
		location: { city: '', state: '', country: '' }
	});
	const [poster, setPoster] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const headers = () => {
		const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('adminToken');
		return { Authorization: `Bearer ${token}` };
	};

	useEffect(() => {
		const load = async () => {
			if (!isEdit) return;
			try {
				const res = await axios.get(`${JOBFAIR_API_END_POINT}/${id}`);
				const data = res.data.data;
				setForm({
					title: data.title || '',
					description: data.description || '',
					date: data.date ? data.date.substring(0, 10) : '',
					time: data.time || '',
					registrationLink: data.registrationLink || '',
					location: {
						city: data.location?.city || '',
						state: data.location?.state || '',
						country: data.location?.country || ''
					}
				});
				// No need to preset poster file; display handled elsewhere if needed
			} catch (e) {
				console.error(e);
			}
		};
		load();
	}, [id, isEdit]);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const fd = new FormData();
			fd.append('title', form.title);
			fd.append('description', form.description);
			if (form.date) fd.append('date', form.date);
			fd.append('time', form.time || '');
			fd.append('registrationLink', form.registrationLink || '');
			fd.append('location[city]', form.location.city || '');
			fd.append('location[state]', form.location.state || '');
			fd.append('location[country]', form.location.country || '');
			if (poster) fd.append('file', poster);
			if (isEdit) {
				await axios.put(`${JOBFAIR_API_END_POINT}/${id}`, fd, { headers: { ...headers() } });
			} else {
				await axios.post(`${JOBFAIR_API_END_POINT}`, fd, { headers: { ...headers() } });
			}
			navigate('/admin/jobfairs');
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const setNested = (path, value) => {
		setForm(prev => {
			const next = { ...prev };
			let ref = next;
			const parts = path.split('.');
			for (let i = 0; i < parts.length - 1; i++) {
				ref[parts[i]] = { ...ref[parts[i]] };
				ref = ref[parts[i]];
			}
			ref[parts[parts.length - 1]] = value;
			return next;
		});
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4 max-w-3xl">
			<h2 className="text-xl font-semibold">{isEdit ? 'Edit Job Fair' : 'Create Job Fair'}</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium">Title</label>
					<input className="mt-1 w-full border rounded p-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
				</div>
				<div>
					<label className="block text-sm font-medium">Date</label>
					<input type="date" className="mt-1 w-full border rounded p-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
				</div>
				<div>
					<label className="block text-sm font-medium">Time</label>
					<input className="mt-1 w-full border rounded p-2" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
				</div>
				<div>
					<label className="block text-sm font-medium">Poster (image)</label>
					<input type="file" accept="image/*" className="mt-1 w-full border rounded p-2" onChange={e => setPoster(e.target.files?.[0] || null)} />
				</div>
				<div className="md:col-span-2">
					<label className="block text-sm font-medium">Description</label>
					<textarea className="mt-1 w-full border rounded p-2" rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium">Registration Link (external)</label>
					<input className="mt-1 w-full border rounded p-2" value={form.registrationLink} onChange={e => setForm({ ...form, registrationLink: e.target.value })} />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium">City</label>
					<input className="mt-1 w-full border rounded p-2" value={form.location.city} onChange={e => setNested('location.city', e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">State</label>
					<input className="mt-1 w-full border rounded p-2" value={form.location.state} onChange={e => setNested('location.state', e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium">Country</label>
					<input className="mt-1 w-full border rounded p-2" value={form.location.country} onChange={e => setNested('location.country', e.target.value)} />
				</div>
			</div>

			<Button type="submit" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}</Button>
		</form>
	);
};

export default AdminJobFairForm;


