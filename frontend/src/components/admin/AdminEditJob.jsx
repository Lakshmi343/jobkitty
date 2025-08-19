import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { ADMIN_API_END_POINT, CATEGORY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const locations = [
	"Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
	"Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
	"Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];

const AdminEditJob = () => {
	const { id } = useParams();
	const [input, setInput] = useState({
		title: "",
		description: "",
		requirements: "",
		salary: "",
		experienceLevel: "",
		location: "",
		jobType: "",
		position: "",
		openings: "",
		category: ""
	});
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [categories, setCategories] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setFetching(true);
				const categoriesResponse = await axios.get(`${CATEGORY_API_END_POINT}/get`);
				if (categoriesResponse.data.success) setCategories(categoriesResponse.data.categories);

				const token = localStorage.getItem('adminToken');
				const jobResponse = await axios.get(`${ADMIN_API_END_POINT}/jobs/${id}`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				if (jobResponse.data.success) {
					const job = jobResponse.data.job;
					setInput({
						title: job.title || "",
						description: job.description || "",
						requirements: job.requirements ? job.requirements.join(", ") : "",
						salary: job.salary?.toString() || "",
						experienceLevel: job.experienceLevel?.toString() || "",
						location: job.location || "",
						jobType: job.jobType || "",
						position: job.position?.toString() || "",
						openings: job.openings?.toString() || "",
						category: job.category?._id || job.category || ""
					});
				}
			} catch (error) {
				console.error('Admin fetch job error:', error);
				toast.error('Failed to fetch job');
			} finally {
				setFetching(false);
			}
		}
		fetchData();
	}, [id]);

	const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
	const selectChangeHandler = (name, value) => setInput({ ...input, [name]: value });

	const submitHandler = async (e) => {
		e.preventDefault();
		const required = ['title','description','requirements','salary','experienceLevel','location','jobType','position','category'];
		const missing = required.filter((k) => !input[k]);
		if (missing.length) return toast.error(`Missing: ${missing.join(', ')}`);
		try {
			setLoading(true);
			const token = localStorage.getItem('adminToken');
			const payload = {
				...input,
				requirements: input.requirements.split(',').map((r) => r.trim()),
				salary: Number(input.salary),
				experienceLevel: Number(input.experienceLevel),
				position: Number(input.position),
				openings: input.openings ? Number(input.openings) : undefined
			};
			const res = await axios.put(`${ADMIN_API_END_POINT}/jobs/${id}`, payload, {
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
			});
			if (res.data.success) {
				toast.success('Job updated');
				navigate('/admin/jobs');
			}
		} catch (error) {
			console.error('Admin update job error:', error);
			toast.error(error.response?.data?.message || 'Failed to update job');
		} finally {
			setLoading(false);
		}
	};

	if (fetching) {
		return (
			<div className='flex items-center justify-center w-full py-10'>
				<Loader2 className='mr-2 h-8 w-8 animate-spin' />
			</div>
		)
	}

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<h2 className='text-xl font-semibold mb-6'>Admin Edit Job</h2>
			<form onSubmit={submitHandler} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className="md:col-span-2">
					<Label>Title*</Label>
					<Input name="title" value={input.title} onChange={changeEventHandler} />
				</div>
				<div className="md:col-span-2">
					<Label>Description*</Label>
					<Input name="description" value={input.description} onChange={changeEventHandler} />
				</div>
				<div className="md:col-span-2">
					<Label>Requirements (comma separated)*</Label>
					<Input name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="JavaScript, React, Node.js" />
				</div>
				<div>
					<Label>Salary*</Label>
					<Input type="number" name="salary" value={input.salary} onChange={changeEventHandler} min="0" />
				</div>
				<div>
					<Label>Experience (years)*</Label>
					<Input type="number" name="experienceLevel" value={input.experienceLevel} onChange={changeEventHandler} min="0" />
				</div>
				<div>
					<Label>Location*</Label>
					<Select onValueChange={(v) => selectChangeHandler('location', v)} value={input.location}>
						<SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
						<SelectContent>
							{locations.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label>Job Type*</Label>
					<Select onValueChange={(v) => selectChangeHandler('jobType', v)} value={input.jobType}>
						<SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
						<SelectContent>
							{jobTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label>Positions*</Label>
					<Input type="number" name="position" value={input.position} onChange={changeEventHandler} min="1" />
				</div>
				<div>
					<Label>Openings</Label>
					<Input type="number" name="openings" value={input.openings} onChange={changeEventHandler} min="0" />
				</div>
				<div>
					<Label>Category*</Label>
					<Select onValueChange={(v) => selectChangeHandler('category', v)} value={input.category}>
						<SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
						<SelectContent>
							{categories.map((c) => (<SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>))}
						</SelectContent>
					</Select>
				</div>
				<div className='md:col-span-2'>
					<Button type='submit' className='w-full' disabled={loading}>
						{loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
						{loading ? 'Updating...' : 'Update Job'}
					</Button>
				</div>
			</form>
		</div>
	)
}

export default AdminEditJob 