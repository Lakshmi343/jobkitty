import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { JOBFAIR_API_END_POINT, USER_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { MapPin, Calendar, Clock, Users, Briefcase, ExternalLink, CalendarCheck, FileText, Map, Mail, Phone, Globe, Clock as ClockIcon } from 'lucide-react';

const JobFairDetail = () => {
	const { id } = useParams();
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [reg, setReg] = useState({ companyName: '', contactName: '', contactEmail: '', contactPhone: '', website: '', notes: '' });
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState('');
	const { user } = useSelector(store => store.auth);

	const formatDate = (dateString) => {
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const formatTime = (timeString) => {
		if (!timeString) return '';
		const [hours, minutes] = timeString.split(':');
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	};

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
							{/* <div className="text-sm opacity-90">{new Date(item.date).toLocaleDateString()} {item.time ? `• ${item.time}` : ''}</div> */}
							<h1 className="text-2xl md:text-3xl font-bold mt-1">{item.title}</h1>
							{/* {(item.location?.city || item.location?.state || item.location?.country) && (
								<div className="text-sm mt-1 opacity-90">{[item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ')}</div>
							)} */}
						</div>
					</div>
				) : (
					<div className="p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-indigo-100">
						{/* <div className="text-sm text-indigo-700">{new Date(item.date).toLocaleDateString()} {item.time ? `• ${item.time}` : ''}</div> */}
						<h1 className="text-2xl md:text-3xl font-bold mt-1">{item.title}</h1>
						{/* {(item.location?.city || item.location?.state || item.location?.country) && (
							<div className="text-sm mt-1 text-indigo-800">{[item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ')}</div>
						)} */}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					{/* About Section */}
					<div className="bg-white rounded-xl border p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
						<div className="prose max-w-none text-gray-700">
							{item.description}
						</div>
					</div>

					{/* Event Highlights */}
					{item.highlights && item.highlights.length > 0 && (
						<div className="bg-white rounded-xl border p-6">
							<h3 className="text-xl font-semibold mb-4">Event Highlights</h3>
							<ul className="space-y-3">
								{item.highlights.map((highlight, index) => (
									<li key={index} className="flex items-start">
										<svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span>{highlight}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Important Links */}
					{/* <div className="bg-white rounded-xl border p-6">
						<h3 className="text-xl font-semibold mb-4">Important Links</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{item.registrationLink && (
								<a 
									href={item.registrationLink} 
									target="_blank" 
									rel="noopener noreferrer"
									className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<CalendarCheck className="h-5 w-5 text-indigo-600 mr-3" />
									<div>
										<div className="font-medium">Register Now</div>
										<div className="text-sm text-gray-500">Secure your spot at the event</div>
									</div>
								</a>
							)}

							{item.agendaLink && (
								<a 
									href={item.agendaLink} 
									target="_blank" 
									rel="noopener noreferrer"
									className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<FileText className="h-5 w-5 text-indigo-600 mr-3" />
									<div>
										<div className="font-medium">Event Agenda</div>
										<div className="text-sm text-gray-500">View the schedule and sessions</div>
									</div>
								</a>
							)}

							{item.location?.mapLink && (
								<a 
									href={item.location.mapLink} 
									target="_blank" 
									rel="noopener noreferrer"
									className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<Map className="h-5 w-5 text-indigo-600 mr-3" />
									<div>
										<div className="font-medium">Venue Map</div>
										<div className="text-sm text-gray-500">Get directions to the venue</div>
									</div>
								</a>
							)}

							{item.contactEmail && (
								<a 
									href={`mailto:${item.contactEmail}`}
									className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<Mail className="h-5 w-5 text-indigo-600 mr-3" />
									<div>
										<div className="font-medium">Contact Organizers</div>
										<div className="text-sm text-gray-500">Email us for questions</div>
									</div>
								</a>
							)}

							{item.externalLink && (
								<a 
									href={item.externalLink} 
									target="_blank" 
									rel="noopener noreferrer"
									className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<ExternalLink className="h-5 w-5 text-indigo-600 mr-3" />
									<div>
										<div className="font-medium">Official Website</div>
										<div className="text-sm text-gray-500">Visit event website</div>
									</div>
								</a>
							)}
						</div>
					</div> */}

					{/* Participating Companies */}
					{item.participatingCompanies && item.participatingCompanies.length > 0 && (
						<div className="bg-white rounded-xl border p-6">
							<h3 className="text-xl font-semibold mb-4">Participating Companies</h3>
							<div className="flex flex-wrap gap-4">
								{item.participatingCompanies.map((company, index) => (
									<div key={index} className="flex items-center p-3 border rounded-lg">
										<Briefcase className="h-5 w-5 text-indigo-500 mr-3" />
										<span>{company}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div className="space-y-6">
					{/* Event Details Card */}
					<div className="bg-white rounded-xl border p-6 sticky top-6">
						<h3 className="text-xl font-semibold mb-4">Event Details</h3>
						<div className="space-y-4">
							{/* Registration Links */}
							{item.registrationLinks && item.registrationLinks.length > 0 && (
								<div className="mb-4">
									<h4 className="text-sm font-medium text-gray-900 mb-2">Registration Links</h4>
									<div className="space-y-2">
										{item.registrationLinks.map((link, index) => (
											<a
												key={index}
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
											>
												<ExternalLink className="h-4 w-4 mr-2" />
												{link.label || 'Register Here'}
											</a>
										))}
									</div>
								</div>
							)}

							{/* Location */}
							{/* {(item.location?.address || item.location?.city || item.location?.state || item.location?.country) && (
								<div className="flex items-start">
									<div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
										<MapPin className="h-5 w-5 text-indigo-600" />
									</div> */}
									{/* <div className="ml-4">
										<p className="text-sm font-medium text-gray-900">Location</p>
										<div className="text-sm text-gray-600">
											{item.location?.address && <p>{item.location.address}</p>}
											<p>{[item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ')}</p>
											{item.location?.mapLink && (
												<a 
													href={item.location.mapLink}
													target="_blank" 
													rel="noopener noreferrer"
													className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-1 text-sm"
												>
													<MapPin className="h-4 w-4 mr-1" />
													View on map
												</a>
											)}
										</div>
									</div> */}
								{/* </div>
							)} */}

							{/* Contact Information */}
							{item.contactEmail && (
								<div className="pt-4 border-t border-gray-200">
									<h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
									<div className="space-y-2">
										{item.contactEmail && (
											<a 
												href={`mailto:${item.contactEmail}`}
												className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
											>
												<Mail className="h-4 w-4 mr-2 text-gray-500" />
												{item.contactEmail}
											</a>
										)}
										{item.contactPhone && (
											<a 
												href={`tel:${item.contactPhone.replace(/\D/g, '')}`}
												className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
											>
												<Phone className="h-4 w-4 mr-2 text-gray-500" />
												{item.contactPhone}
											</a>
										)}
										{item.website && (
											<a 
												href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
												target="_blank" 
												rel="noopener noreferrer"
												className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
											>
												<Globe className="h-4 w-4 mr-2 text-gray-500" />
												Website
											</a>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Register Button */}
						{item.registrationLink && (
							<div className="mt-6">
								<a 
									href={item.registrationLink}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Register Now
								</a>
								<p className="mt-2 text-center text-xs text-gray-500">
									Registration required to attend
								</p>
							</div>
						)}
					</div>

					{/* Company Registration Form */}
					{user?.role === 'Employer' && (
						<div className="bg-white rounded-xl border p-6">
							<h3 className="text-xl font-semibold mb-4">Company Registration</h3>
							<p className="text-sm text-gray-600 mb-4">Register your company to participate as an employer at this job fair. Fill out the form below and our team will get in touch with you shortly.</p>
							
							{message && (
								<div className={`mb-4 p-3 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
									{message}
								</div>
							)}
							
							<form onSubmit={handleRegister} className="space-y-4">
								<div>
									<label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
									<input
										id="companyName"
										type="text"
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
										placeholder="Your company name"
										value={reg.companyName}
										onChange={e => setReg({ ...reg, companyName: e.target.value })}
										required
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Contact Person <span className="text-red-500">*</span></label>
										<input
											id="contactName"
											type="text"
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											placeholder="Your full name"
											value={reg.contactName}
											onChange={e => setReg({ ...reg, contactName: e.target.value })}
											required
										/>
									</div>

									<div>
										<label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
										<input
											id="contactEmail"
											type="email"
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											placeholder="your.email@company.com"
											value={reg.contactEmail}
											onChange={e => setReg({ ...reg, contactEmail: e.target.value })}
											required
										/>
									</div>

									<div>
										<label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
										<input
											id="contactPhone"
											type="tel"
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											placeholder="+91 1234567890"
											value={reg.contactPhone}
											onChange={e => setReg({ ...reg, contactPhone: e.target.value })}
										/>
									</div>

									<div>
										<label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
										<input
											id="website"
											type="url"
											className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											placeholder="https://yourcompany.com"
											value={reg.website}
											onChange={e => setReg({ ...reg, website: e.target.value })}
										/>
									</div>
								</div>

								<div>
									<label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
									<textarea
										id="notes"
										rows={4}
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
										placeholder="Tell us about your company and what you're looking for..."
										value={reg.notes}
										onChange={e => setReg({ ...reg, notes: e.target.value })}
									/>
								</div>

								<div className="pt-2">
									<button
										type="submit"
										disabled={submitting}
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{submitting ? 'Submitting...' : 'Submit Registration'}
									</button>
									<p className="mt-2 text-center text-xs text-gray-500">
										You must be logged in as an Employer to register.
									</p>
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


