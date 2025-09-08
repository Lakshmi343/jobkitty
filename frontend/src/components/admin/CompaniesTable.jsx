import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT } from '../../utils/constant';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Edit2, MoreHorizontal, ShieldCheck, ShieldAlert, Trash2, Building, Calendar, Briefcase, MapPin, Globe, Users } from 'lucide-react'
import LoadingSpinner from '../shared/LoadingSpinner'

const CompaniesTable = ({ companies = [], loading = false, onEdit, onUpdateStatus, onDelete }) => {
	const [selectedCompany, setSelectedCompany] = useState(null)
	const [companyJobs, setCompanyJobs] = useState([])
	const [jobsLoading, setJobsLoading] = useState(false)

	const getStatus = (status) => {
		switch ((status || 'active').toLowerCase()) {
			case 'approved':
			case 'active':
				return { label: 'Active', className: 'bg-green-100 text-green-800' }
			case 'suspended':
				return { label: 'Suspended', className: 'bg-yellow-100 text-yellow-800' }
			case 'pending':
				return { label: 'Pending', className: 'bg-gray-100 text-gray-800' }
			default:
				return { label: status || 'Unknown', className: 'bg-gray-100 text-gray-800' }
		}
	}

	const fetchCompanyJobs = async (companyId) => {
		try {
			setJobsLoading(true)
			const response = await axios.get(`${JOB_API_END_POINT}/get?companyId=${companyId}`, {
				withCredentials: true,
				timeout: 8000 // 8 second timeout
			})
			if (response.data.success) {
				setCompanyJobs(response.data.jobs || [])
			} else {
				setCompanyJobs([])
			}
		} catch (error) {
			console.error('Failed to fetch company jobs:', error)
			setCompanyJobs([])
		} finally {
			setJobsLoading(false)
		}
	}

	const handleViewCompany = (company) => {
		setSelectedCompany(company)
		fetchCompanyJobs(company._id)
	}

	if (loading) {
		return (
			<div className='py-12 flex flex-col items-center justify-center text-gray-500'>
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span className="mt-3 text-sm">Loading companies...</span>
			</div>
		)
	}

	return (
		<div className="w-full">
			{/* Desktop table */}
			<div className="hidden md:block">
				<Table>
					<TableCaption className="py-4 text-gray-600">
						{companies.length === 0 ? (
							<div className="text-center py-8">
								<Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p className="text-lg font-medium text-gray-900 mb-2">No companies found</p>
								<p className="text-gray-500">Try adjusting your filters</p>
							</div>
						) : (
							`Showing ${companies.length} compan${companies.length !== 1 ? 'ies' : 'y'}`
						)}
					</TableCaption>
					<TableHeader>
						<TableRow className="bg-gray-50 hover:bg-gray-50">
							<TableHead className="font-semibold text-gray-900">Company</TableHead>
							<TableHead className="font-semibold text-gray-900">Status</TableHead>
							<TableHead className="font-semibold text-gray-900">Created</TableHead>
							<TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{companies.map((company) => {
							const status = getStatus(company.status)
							return (
								<TableRow key={company._id} className="hover:bg-gray-50 transition-colors duration-200">
									<TableCell className="py-4">
										<div className="flex items-center gap-3">
											<Avatar className="w-10 h-10 border-2 border-gray-200">
												<AvatarImage src={company?.logo} alt={company?.name} />
												<AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
													{(company?.name || 'CO').slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 truncate">{company?.name}</h3>
												<p className="text-sm text-gray-600 truncate">{company?.website || '—'}</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge className={status.className}>{status.label}</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1 text-gray-600">
											<Calendar className="w-4 h-4" />
											<span className="text-sm">{new Date(company?.createdAt).toLocaleDateString()}</span>
										</div>
									</TableCell>
									<TableCell className="text-right">
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
													<MoreHorizontal className="w-4 h-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-48 p-2" align="end">
												<div className="space-y-1">
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start gap-2 h-9"
														onClick={() => handleViewCompany(company)}
													>
														<Building className="w-4 h-4" />
														View Details
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start gap-2 h-9"
														onClick={() => onEdit?.(company._id)}
													>
														<Edit2 className="w-4 h-4" />
														Edit
													</Button>
													{status.label !== 'Active' && (
														<Button
															variant="ghost"
															size="sm"
															className="w-full justify-start gap-2 h-9"
															onClick={() => onUpdateStatus?.(company._id, 'approved')}
														>
															<ShieldCheck className="w-4 h-4" />
															Approve
														</Button>
													)}
													{status.label !== 'Suspended' && (
														<Button
															variant="ghost"
															size="sm"
															className="w-full justify-start gap-2 h-9"
															onClick={() => onUpdateStatus?.(company._id, 'suspended')}
														>
															<ShieldAlert className="w-4 h-4" />
															Suspend
														</Button>
													)}
													<Button
														variant="ghost"
														size="sm"
														className="w-full justify-start gap-2 h-9 text-red-600"
														onClick={() => onDelete?.(company._id)}
													>
														<Trash2 className="w-4 h-4" />
														Delete
													</Button>
												</div>
											</PopoverContent>
										</Popover>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>

			{/* Mobile list */}
			<div className="md:hidden space-y-3">
				{companies.map((company) => {
					const status = getStatus(company.status)
					return (
						<div key={company._id} className="border rounded-lg p-4 bg-white shadow-sm">
							<div className="flex items-center gap-3">
								<Avatar className="w-10 h-10 border-2 border-gray-200">
									<AvatarImage src={company?.logo} alt={company?.name} />
									<AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
										{(company?.name || 'CO').slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<div className="font-semibold text-gray-900">{company?.name}</div>
									<div className="text-xs text-gray-500">{company?.website || '—'}</div>
									<div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
										<Calendar className="w-3 h-3" />
										{new Date(company?.createdAt).toLocaleDateString()}
									</div>
								</div>
								<Badge className={status.className}>{status.label}</Badge>
							</div>
							<div className="flex items-center gap-2 mt-3">
								<Button size="sm" variant="secondary" onClick={() => handleViewCompany(company)}>
									View Details
								</Button>
								<Button size="sm" variant="outline" onClick={() => onEdit?.(company._id)}>
									Edit
								</Button>
								{status.label !== 'Active' && (
									<Button size="sm" variant="outline" onClick={() => onUpdateStatus?.(company._id, 'approved')}>
										Approve
									</Button>
								)}
								{status.label !== 'Suspended' && (
									<Button size="sm" variant="outline" onClick={() => onUpdateStatus?.(company._id, 'suspended')}>
										Suspend
									</Button>
								)}
								<Button size="sm" variant="destructive" onClick={() => onDelete?.(company._id)}>
									Delete
								</Button>
							</div>
						</div>
					)
				})}
			</div>

			{/* Company Details Dialog */}
			<Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
				<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Building className="w-5 h-5" />
							{selectedCompany?.name} - Company Details
						</DialogTitle>
					</DialogHeader>

					{selectedCompany && (
						<div className="space-y-6">
							{/* Company Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<Avatar className="w-16 h-16 border-2 border-gray-200">
											<AvatarImage src={selectedCompany.logo} alt={selectedCompany.name} />
											<AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
												{selectedCompany.name?.slice(0, 2).toUpperCase() || 'CO'}
											</AvatarFallback>
										</Avatar>
										<div>
											<h3 className="text-xl font-bold text-gray-900">{selectedCompany.name || 'Unknown Company'}</h3>
											<Badge className={getStatus(selectedCompany.status).className}>
												{getStatus(selectedCompany.status).label}
											</Badge>
										</div>
									</div>

									<div className="space-y-3">
										<div>
											<p className="text-sm font-medium text-gray-500">Company Type</p>
											<p className="text-gray-900">{String(selectedCompany.companyType || 'N/A')}</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-500">Number of Employees</p>
											<p className="flex items-center gap-1 text-gray-900">
												<Users className="w-4 h-4 text-gray-500" />
												{(() => {
													const employees = selectedCompany.numberOfEmployees;
													if (typeof employees === 'object' && employees !== null) {
														return `${employees.min || 0}-${employees.max || 0}`;
													}
													return String(employees || 'N/A');
												})()}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-500">Location</p>
											<p className="flex items-center gap-1 text-gray-900">
												<MapPin className="w-4 h-4 text-gray-500" />
												{String(selectedCompany.location || 'N/A')}
											</p>
										</div>
										{selectedCompany.website && (
											<div>
												<p className="text-sm font-medium text-gray-500">Website</p>
												<a 
													href={selectedCompany.website} 
													target="_blank" 
													rel="noreferrer" 
													className="flex items-center gap-1 text-blue-600 hover:underline"
												>
													<Globe className="w-4 h-4" />
													{String(selectedCompany.website)}
												</a>
											</div>
										)}
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<p className="text-sm font-medium text-gray-500">Description</p>
										<p className="text-gray-900 text-sm leading-relaxed">
											{String(selectedCompany.description || 'No description available')}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-500">Created Date</p>
										<p className="flex items-center gap-1 text-gray-900">
											<Calendar className="w-4 h-4 text-gray-500" />
											{selectedCompany.createdAt ? new Date(selectedCompany.createdAt).toLocaleDateString() : 'N/A'}
										</p>
									</div>
								</div>
							</div>

							{/* Job Postings */}
							<div className="border-t pt-6">
								<h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<Briefcase className="w-5 h-5" />
									Job Postings ({companyJobs.length})
								</h4>
								
								{jobsLoading ? (
									<div className="flex items-center justify-center py-8">
										<LoadingSpinner size={24} />
										<span className="ml-2 text-gray-500">Loading jobs...</span>
									</div>
								) : companyJobs.length > 0 ? (
									<div className="space-y-3 max-h-60 overflow-y-auto">
										{companyJobs.map((job) => (
											<div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50">
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<h5 className="font-semibold text-gray-900">{String(job.title || 'Untitled Job')}</h5>
														<p className="text-sm text-gray-600 mt-1">{String(job.description || 'No description').slice(0, 100)}...</p>
														<div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
															<span>📍 {String(job.location || 'N/A')}</span>
															<span>💰 {String(job.salary || 'N/A')} LPA</span>
															<span>📅 {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</span>
														</div>
													</div>
													<Badge variant="outline" className="ml-2">
														{String(job.jobType || 'N/A')}
													</Badge>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-gray-500">
										<Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
										<p>No job postings found</p>
									</div>
								)}
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setSelectedCompany(null)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default CompaniesTable