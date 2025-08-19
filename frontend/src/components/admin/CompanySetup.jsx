import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { ADMIN_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyByIdAdmin from '@/hooks/useGetCompanyByIdAdmin'

const CompanySetup = () => {
	const params = useParams();
	const { loading: fetchingCompany, error } = useGetCompanyByIdAdmin(params.id);
	const [input, setInput] = useState({
		name: "",
		description: "",
		website: "",
		location: "",
		file: null
	});
	const { singleCompany } = useSelector(store => store.company);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const changeEventHandler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	}

	const changeFileHandler = (e) => {
		const file = e.target.files?.[0];
		setInput({ ...input, file });
	}

	const submitHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", input.name);
		formData.append("description", input.description);
		formData.append("website", input.website);
		formData.append("location", input.location);
		if (input.file) {
			formData.append("file", input.file);
		}
		try {
			setLoading(true);
			const token = localStorage.getItem('adminToken');
			const res = await axios.put(`${ADMIN_API_END_POINT}/companies/${params.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`
				}
			});
			if (res.data.success) {
				toast.success(res.data.message || 'Company updated');
				navigate("/admin/companies");
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message || "Failed to update company");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (singleCompany && singleCompany._id) {
			setInput({
				name: singleCompany.name || "",
				description: singleCompany.description || "",
				website: singleCompany.website || "",
				location: singleCompany.location || "",
				file: singleCompany.file || null
			});
		}
	}, [singleCompany]);

	// Show loading state while fetching company data
	if (fetchingCompany) {
		return (
			<div>
				<div className='flex items-center justify-center w-screen my-5'>
					<div className='text-center'>
						<Loader2 className='mr-2 h-8 w-8 animate-spin mx-auto mb-4' />
						<p>Loading company data...</p>
					</div>
				</div>
			</div>
		);
	}

	// Show error state if company not found
	if (error || !singleCompany) {
		return (
			<div>
				<div className='flex items-center justify-center w-screen my-5'>
					<div className='text-center max-w-md mx-auto p-6'>
						<AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
						<h2 className='text-xl font-semibold mb-2'>Company Not Found</h2>
						<p className='text-gray-600 mb-4'>
							The company you're looking for doesn't exist or you don't have permission to access it.
						</p>
						<Button onClick={() => navigate("/admin/companies")} variant="outline">
							Back to Companies
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className='max-w-xl mx-auto my-10'>
				<form onSubmit={submitHandler}>
					<div className='flex items-center gap-5 p-8'>
						<Button onClick={() => navigate("/admin/companies")} type="button" variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
							<ArrowLeft />
							<span>Back</span>
						</Button>
						<h1 className='font-bold text-xl'>Edit Company</h1>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label>Company Name</Label>
							<Input
								type="text"
								name="name"
								value={input.name}
								onChange={changeEventHandler}
							/>
						</div>
						<div>
							<Label>Description</Label>
							<Input
								type="text"
								name="description"
								value={input.description}
								onChange={changeEventHandler}
							/>
						</div>
						<div>
							<Label>Website</Label>
							<Input
								type="text"
								name="website"
								value={input.website}
								onChange={changeEventHandler}
							/>
						</div>
						<div>
							<Label>Location</Label>
							<Input
								type="text"
								name="location"
								value={input.location}
								onChange={changeEventHandler}
							/>
						</div>
						<div>
							<Label>Logo</Label>
							<Input
								type="file"
								accept="image/*"
								onChange={changeFileHandler}
							/>
						</div>
					</div>
					{
						loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
					}
				</form>
			</div>

		</div>
	)
}

export default CompanySetup