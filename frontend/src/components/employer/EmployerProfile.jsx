import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, AlertCircle, Contact, Mail, Pen, Building, Globe, MapPin, Briefcase } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarImage } from '../ui/avatar'

const EmployerProfile = () => {
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [fetchingCompany, setFetchingCompany] = useState(true);
	const [error, setError] = useState(false);
	const [companyData, setCompanyData] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [input, setInput] = useState({
		name: "",
		description: "",
		website: "",
		location: "",
		file: null
	});
	const { user } = useSelector(store => store.auth);
	const navigate = useNavigate();

	// Fetch company data
	useEffect(() => {
		const fetchCompanyData = async () => {
			try {
				setFetchingCompany(true);
				const response = await axios.get(`${COMPANY_API_END_POINT}/user`, {
					withCredentials: true
				});
				if (response.data.success) {
					setCompanyData(response.data.company);
					setInput({
						name: response.data.company.name || "",
						description: response.data.company.description || "",
						website: response.data.company.website || "",
						location: response.data.company.location || "",
						file: null
					});
				}
			} catch (error) {
				console.error('Error fetching company data:', error);
				toast.error('Failed to load company data');
				setError(true);
			} finally {
				setFetchingCompany(false);
			}
		};

		fetchCompanyData();
	}, []);

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
			const res = await axios.put(`${COMPANY_API_END_POINT}/update/${companyData._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			});
			if (res.data.success) {
				toast.success(res.data.message || 'Company profile updated');
				// Refresh company data
				const response = await axios.get(`${COMPANY_API_END_POINT}/user`, {
					withCredentials: true
				});
				if (response.data.success) {
					setCompanyData(response.data.company);
					setEditMode(false); // Exit edit mode after successful update
				}
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message || "Failed to update company profile");
		} finally {
			setLoading(false);
		}
	}

	// Show loading state while fetching company data
	if (fetchingCompany) {
		return (
			<div>
				<Navbar />
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
	if (error || !companyData) {
		return (
			<div>
				<Navbar />
				<div className='flex items-center justify-center w-screen my-5'>
					<div className='text-center max-w-md mx-auto p-6'>
						<AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
						<h2 className='text-xl font-semibold mb-2'>Company Not Found</h2>
						<p className='text-gray-600 mb-4'>
							Your company profile hasn't been set up yet. Please set up your company profile first.
						</p>
						<Button onClick={() => navigate("/employer/company/setup")} variant="outline">
							Set Up Company Profile
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Show company profile view (not edit mode)
	if (!editMode) {
		return (
			<div>
				<Navbar />
				<div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
					<div className='flex justify-between'>
						<div className='flex items-center gap-4'>
							<Avatar className="h-24 w-24">
								<AvatarImage src={companyData?.logo || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="company logo" />
							</Avatar>
							<div>
								<h1 className='font-medium text-xl'>{companyData?.name || 'Company Name'}</h1>
								<p className='text-gray-600'>{companyData?.description || 'No description available'}</p>
							</div>
						</div>
						<Button 
							onClick={() => setEditMode(true)} 
							className="text-right" 
							variant="outline"
						>
							<Pen className="mr-2 h-4 w-4" />
							Edit Profile
						</Button>
					</div>
					
					<div className='my-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='flex items-center gap-3'>
							<Building className="h-5 w-5 text-gray-500" />
							<span className='font-medium'>Company Type:</span>
							<span>{companyData?.companyType || 'Not specified'}</span>
						</div>
						<div className='flex items-center gap-3'>
							<Briefcase className="h-5 w-5 text-gray-500" />
							<span className='font-medium'>Experience:</span>
							<span>{companyData?.experience ? `${companyData.experience} years` : 'Not specified'}</span>
						</div>
						<div className='flex items-center gap-3'>
							<Globe className="h-5 w-5 text-gray-500" />
							<span className='font-medium'>Website:</span>
							{companyData?.website ? (
								<a href={companyData.website} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>
									{companyData.website}
								</a>
							) : (
								<span>Not specified</span>
							)}
						</div>
						<div className='flex items-center gap-3'>
							<MapPin className="h-5 w-5 text-gray-500" />
							<span className='font-medium'>Location:</span>
							<span>{companyData?.location || 'Not specified'}</span>
						</div>
					</div>

					<div className='my-5'>
						<div className='flex items-center gap-3 my-2'>
							<Mail />
							<span>{user?.email}</span>
						</div>
						<div className='flex items-center gap-3 my-2'>
							<Contact />
							<span>{user?.phoneNumber}</span>
						</div>
					</div>
					
					<div className='mt-8'>
						<Button onClick={() => navigate("/employer/jobs")} variant="outline" className="flex items-center gap-2">
							<ArrowLeft />
							<span>Back to Jobs</span>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Show edit form (edit mode)
	return (
		<div>
			<Navbar />
			<div className='max-w-xl mx-auto my-10'>
				<form onSubmit={submitHandler}>
					<div className='flex items-center gap-5 p-8'>
						<Button onClick={() => setEditMode(false)} type="button" variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
							<ArrowLeft />
							<span>Back</span>
						</Button>
						<h1 className='font-bold text-xl'>Edit Company Profile</h1>
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
						loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update Profile</Button>
					}
				</form>
			</div>
		</div>
	)
}

export default EmployerProfile