import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { JOBFAIR_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Plus, X, Loader2, Link as LinkIcon, MapPin } from 'lucide-react';

const AdminJobFairForm = () => {
	const { id } = useParams();
	const isEdit = Boolean(id);
	const [form, setForm] = useState({
		title: '',
		description: '',
		date: new Date(),
		time: '',
		location: {
			city: '',
			state: 'Kerala',
			country: 'India'
		},
		registrationLinks: [{ label: 'Registration', url: '' }],
		isActive: true
	});
	const [errors, setErrors] = useState({});
	const [poster, setPoster] = useState(null);
	const [existingImage, setExistingImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const headers = () => {
		const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('adminToken');
		return { 
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/json'
		};
	};

	const setNested = (path, value) => {
		setForm(prev => {
			const newForm = { ...prev };
			const keys = path.split('.');
			let current = newForm;
			
			for (let i = 0; i < keys.length - 1; i++) {
				if (!current[keys[i]]) current[keys[i]] = {};
				current = current[keys[i]];
			}
			
			current[keys[keys.length - 1]] = value;
			return newForm;
		});
	};

	const validateForm = () => {
		const newErrors = {};
		if (!form.title.trim()) newErrors.title = 'Title is required';
		if (!form.description.trim()) newErrors.description = 'Description is required';
		if (!form.date) newErrors.date = 'Date is required';
		
		// Validate registration links
		if (!form.registrationLinks || form.registrationLinks.length === 0) {
			newErrors.registrationLinks = 'At least one registration link is required';
		} else {
			form.registrationLinks.forEach((link, index) => {
				if (!link.url.trim()) {
					newErrors[`registrationLink-${index}-url`] = 'URL is required';
				} else if (!/^https?:\/\//.test(link.url)) {
					newErrors[`registrationLink-${index}-url`] = 'URL must start with http:// or https://';
				}
				if (!link.label.trim()) {
					newErrors[`registrationLink-${index}-label`] = 'Label is required';
				}
			});
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	useEffect(() => {
		let isMounted = true;
		
		const load = async () => {
			if (!isEdit) return;
			
			try {
				setLoading(true);
				const res = await axios.get(`${JOBFAIR_API_END_POINT}/${id}`, { 
					headers: headers() 
				});
				
				if (!isMounted) return;
				
				const data = res.data.data;
				setForm({
					title: data.title || '',
					description: data.description || '',
					date: data.date ? new Date(data.date) : new Date(),
					time: data.time || '',
					location: {
						city: data.location?.city || '',
						state: data.location?.state || 'Kerala',
						country: data.location?.country || 'India'
					},
					registrationLinks: data.registrationLinks?.length > 0 
						? data.registrationLinks 
						: data.registrationLink 
							? [{ label: 'Registration', url: data.registrationLink }] 
							: [{ label: 'Registration', url: '' }],
					isActive: data.isActive !== undefined ? data.isActive : true,
					image: data.image || ''
				});
				
			
				if (data.image) {
					setExistingImage(data.image);
				}
			} catch (error) {
				if (!isMounted) return;
				console.error('Error loading job fair:', error);
				toast.error(error.response?.data?.message || 'Failed to load job fair details');
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};
		
		load();
		
		return () => {
			isMounted = false;
		};
	}, [id, isEdit]);

	const onSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			toast.error('Please fix the form errors before submitting');
			return;
		}

		try {
			setIsSubmitting(true);
			setErrors({});
			
			const fd = new FormData();
			fd.append('title', form.title.trim());
			fd.append('description', form.description.trim());
			fd.append('date', form.date);
			fd.append('time', form.time);
			fd.append('isActive', form.isActive);
			
			// Append location data
			fd.append('location[city]', form.location.city);
			fd.append('location[state]', form.location.state);
			fd.append('location[country]', form.location.country);
			
			// Append registration links
			form.registrationLinks.forEach((link, index) => {
				if (link.url.trim()) {
					fd.append(`registrationLinks[${index}][label]`, link.label || 'Registration');
					fd.append(`registrationLinks[${index}][url]`, link.url.trim());
				}
			});
			
			// Add poster if it's a new file
			if (poster) {
				fd.append('file', poster);
			}

			const response = isEdit 
				? await axios.put(`${JOBFAIR_API_END_POINT}/${id}`, fd, { 
					headers: headers() 
				})
			: await axios.post(`${JOBFAIR_API_END_POINT}`, fd, { 
					headers: headers() 
				});

			const successMessage = isEdit 
				? 'Job fair updated successfully' 
				: 'Job fair created successfully';
			
			toast.success(successMessage);
			navigate('/admin/jobfairs');
		} catch (error) {
			console.error('Form submission error:', error);
			
		
			if (error.response?.data?.errors) {
				setErrors(error.response.data.errors);
			}
			
			const errorMessage = error.response?.data?.message || 
				`Failed to ${isEdit ? 'update' : 'create'} job fair. Please try again.`;
			
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAddLink = () => {
		setForm(prev => ({
			...prev,
			registrationLinks: [
				...prev.registrationLinks,
				{ label: 'Registration', url: '' }
			]
		}));
	};

	const handleRemoveLink = (index) => {
		setForm(prev => ({
			...prev,
			registrationLinks: prev.registrationLinks.filter((_, i) => i !== index)
		}));
	};

	const handleLinkChange = (index, field, value) => {
		setForm(prev => {
			const newLinks = [...prev.registrationLinks];
			newLinks[index] = { ...newLinks[index], [field]: value };
			return { ...prev, registrationLinks: newLinks };
		});
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				{isEdit ? 'Edit Job Fair' : 'Create New Job Fair'}
			</h2>

			<form onSubmit={onSubmit} className="space-y-6">
				{/* Basic Information */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
					
					<div className="space-y-4">
						{/* Title */}
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Title <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.title ? 'ring-red-500' : ''}`}
								value={form.title}
								onChange={(e) => setForm({...form, title: e.target.value})}
								disabled={isSubmitting}
							/>
							{errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
						</div>

						{/* Description */}
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								rows={4}
								className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.description ? 'ring-red-500' : ''}`}
								value={form.description}
								onChange={(e) => setForm({...form, description: e.target.value})}
								disabled={isSubmitting}
							/>
							{errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
						</div>

						{/* Date and Time */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700">
									Date <span className="text-red-500">*</span>
								</label>
								<input
									type="date"
									className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.date ? 'ring-red-500' : ''}`}
									value={form.date ? new Date(form.date).toISOString().split('T')[0] : ''}
									onChange={(e) => setForm({...form, date: e.target.value ? new Date(e.target.value) : null})}
									disabled={isSubmitting}
								/>
								{errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700">
									Time (Optional)
								</label>
								<input
									type="text"
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="e.g., 10:00 AM - 4:00 PM"
									value={form.time}
									onChange={(e) => setForm({...form, time: e.target.value})}
									disabled={isSubmitting}
								/>
							</div>
						</div>

						{/* Location */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-gray-900 border-b pb-2">Location</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* City */}
								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-700">City</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<MapPin className="h-5 w-5 text-gray-400" />
										</div>
										<input
											type="text"
											className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 sm:text-sm"
											value={form.location.city}
											onChange={e => setNested('location.city', e.target.value)}
											placeholder="E.g., Kochi"
											disabled={isSubmitting}
										/>
									</div>
								</div>

								{/* State */}
								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-700">State</label>
									<select
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 sm:text-sm"
										value={form.location.state}
										onChange={e => setNested('location.state', e.target.value)}
										disabled={isSubmitting}
									>
										<option value="Kerala">Kerala</option>
										<option value="Other">Other</option>
									</select>
								</div>

								{/* Country */}
								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-700">Country</label>
									<input
										type="text"
										className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 sm:text-sm"
										value={form.location.country}
										onChange={e => setNested('location.country', e.target.value)}
										disabled={true}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Registration Links */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium text-gray-900">Registration Links</h3>
						<Button
							type="button"
							onClick={handleAddLink}
							variant="outline"
							size="sm"
							className="flex items-center space-x-1"
							disabled={isSubmitting}
						>
							<Plus size={16} />
							<span>Add Link</span>
						</Button>
					</div>

					{errors.registrationLinks && (
						<p className="text-sm text-red-600">{errors.registrationLinks}</p>
					)}

					{form.registrationLinks.map((link, index) => (
						<div key={index} className="space-y-2 border border-gray-200 rounded-md p-4">
							<div className="flex justify-between items-start">
								<h4 className="text-sm font-medium text-gray-700">Link {index + 1}</h4>
								{form.registrationLinks.length > 1 && (
									<button
										type="button"
										onClick={() => handleRemoveLink(index)}
										className="text-gray-400 hover:text-red-500"
										disabled={isSubmitting}
									>
										<X size={18} />
									</button>
								)}
							</div>

							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Link Label <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors[`registrationLink-${index}-label`] ? 'ring-red-500' : ''}`}
										value={link.label}
										onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
										disabled={isSubmitting}
										placeholder="e.g., General Registration, Student Registration"
									/>
									{errors[`registrationLink-${index}-label`] && (
										<p className="mt-1 text-sm text-red-600">
											{errors[`registrationLink-${index}-label`]}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										URL <span className="text-red-500">*</span>
									</label>
									<div className="flex rounded-md shadow-sm">
										<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
											<LinkIcon size={14} />
										</span>
										<input
											type="url"
											className={`flex-1 min-w-0 block w-full px-3 py-1.5 rounded-none rounded-r-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors[`registrationLink-${index}-url`] ? 'ring-red-500' : ''}`}
											placeholder="https://example.com/register"
											value={link.url}
											onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
											disabled={isSubmitting}
										/>
									</div>
									{errors[`registrationLink-${index}-url`] && (
										<p className="mt-1 text-sm text-red-600">
											{errors[`registrationLink-${index}-url`]}
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Poster Image */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium text-gray-900 border-b pb-2">Poster Image</h3>
					<div className="space-y-4">
						{existingImage && !poster && (
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700">Current Poster</label>
								<div className="mt-1 flex items-center">
									<img 
										src={existingImage} 
										alt="Current poster" 
										className="h-40 w-auto object-cover rounded-md"
										onError={(e) => e.target.style.display = 'none'}
									/>
								</div>
							</div>
						)}

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								{isEdit ? 'Update Poster' : 'Upload Poster'} (Optional)
							</label>
							<div className="mt-1 flex items-center">
								<input
									type="file"
									accept="image/png, image/jpeg, image/jpg, image/webp"
									className="block w-full text-sm text-gray-500
										file:mr-4 file:py-2 file:px-4
										file:rounded-md file:border-0
										file:text-sm file:font-semibold
										file:bg-blue-50 file:text-blue-700
										hover:file:bg-blue-100"
									onChange={e => setPoster(e.target.files?.[0] || null)}
									disabled={isSubmitting}
								/>
							</div>
							<p className="mt-1 text-xs text-gray-500">
								Recommended size: 800x400px (JPG, PNG, or WebP)
							</p>
							{poster && (
								<div className="mt-2">
									<p className="text-sm text-gray-700">New image selected: {poster.name}</p>
									<button
										type="button"
										onClick={() => setPoster(null)}
										className="mt-1 text-sm text-red-600 hover:text-red-800"
									>
										Remove selected image
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Status */}
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						id="isActive"
						checked={form.isActive}
						onChange={(e) => setForm({...form, isActive: e.target.checked})}
						className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						disabled={isSubmitting}
					/>
					<label htmlFor="isActive" className="text-sm font-medium text-gray-700">
						Active
					</label>
				</div>

				{/* Form Actions */}
				<div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => navigate('/admin/jobfairs')}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{isEdit ? 'Updating...' : 'Creating...'}
							</>
						) : isEdit ? (
							'Update Job Fair'
						) : (
							'Create Job Fair'
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AdminJobFairForm;
