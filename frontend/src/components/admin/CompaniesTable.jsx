import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Edit2, MoreHorizontal, ShieldCheck, ShieldAlert, Trash2, Building, Calendar } from 'lucide-react'

const CompaniesTable = ({ companies = [], loading = false, onEdit, onUpdateStatus, onDelete }) => {
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

	if (loading) {
		return (
			<div className='py-20 text-center text-gray-500'>Loading companies...</div>
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
								<Button size="sm" variant="secondary" onClick={() => onEdit?.(company._id)}>
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
		</div>
	)
}

export default CompaniesTable