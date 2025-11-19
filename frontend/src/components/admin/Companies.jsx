import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { ADMIN_API_END_POINT } from '../../utils/constant'
import { Building2, Search, TrendingUp, Users, Briefcase } from 'lucide-react'
import { toast } from 'sonner'
 
const PAGE_SIZE = 20

const Companies = () => {
	const [companies, setCompanies] = useState([])
	const [loading, setLoading] = useState(true)
	const [input, setInput] = useState("")
	const [appliedSearch, setAppliedSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, pending: 0 })
	const [page, setPage] = useState(1)
	const [pagination, setPagination] = useState(null)
	const navigate = useNavigate()

	const fetchCompanies = useCallback(async (targetPage = 1) => {
		try {
			setLoading(true)
			const token = localStorage.getItem('adminToken')
			if (!token) {
				toast.error('Authentication required. Please login again.')
				navigate('/admin/login')
				return
			}

			const params = new URLSearchParams()
			params.set('page', targetPage)
			params.set('limit', PAGE_SIZE)
			if (statusFilter !== 'all') params.set('status', statusFilter)
			if (appliedSearch) params.set('search', appliedSearch.trim())

			const res = await axios.get(`${ADMIN_API_END_POINT}/companies?${params.toString()}`, {
				headers: { Authorization: `Bearer ${token}` },
				timeout: 10000
			})

			if (res.data.success) {
				const companiesData = res.data.companies || []
				setCompanies(companiesData)
				setStats({
					total: res.data.stats?.total || 0,
					active: res.data.stats?.active || 0,
					suspended: res.data.stats?.suspended || 0,
					pending: res.data.stats?.pending || 0
				})
				setPagination(res.data.pagination || null)
			} else {
				setCompanies([])
				toast.error(res.data.message || 'Unable to load companies. Please try again.')
			}
		} catch (error) {
			console.error('Failed to fetch companies:', error)
			if (error.response?.status === 401) {
				toast.error('Session expired. Please login again.')
				localStorage.removeItem('adminToken')
				navigate('/admin/login')
			} else {
				toast.error('Unable to load companies. Please try again.')
			}
			setCompanies([])
		} finally {
			setLoading(false)
		}
	}, [appliedSearch, statusFilter, navigate])

	useEffect(() => {
		fetchCompanies(page)
	}, [fetchCompanies, page])

	const handleUpdateStatus = async (companyId, status) => {
		try {
			const token = localStorage.getItem('adminToken')
			if (!token) {
				console.error('No admin token available')
				return
			}
			
			const res = await axios.patch(
				`${ADMIN_API_END_POINT}/companies/${companyId}/status`,
				{ status },
				{ 
					headers: { Authorization: `Bearer ${token}` },
					timeout: 5000
				}
			)
			if (res.data.success) {
				toast.success('Company status updated')
				fetchCompanies(page)
			}
		} catch (error) {
			console.error('Failed to update company status:', error)
			toast.error('Failed to update company status')
		}
	}

	const handleDelete = async (companyId) => {
		// Show confirmation toast instead of window.confirm
		if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) return
		try {
			const token = localStorage.getItem('adminToken')
			if (!token) {
				console.error('No admin token available')
				return
			}
			
			const res = await axios.delete(`${ADMIN_API_END_POINT}/companies/${companyId}`, {
				headers: { Authorization: `Bearer ${token}` },
				timeout: 5000
			})
			if (res.data.success) {
				toast.success('Company deleted successfully')
				fetchCompanies(page)
			}
		} catch (error) {
			console.error('Failed to delete company:', error)
			toast.error('Failed to delete company')
		}
	}

	const handleSearchSubmit = (e) => {
		e.preventDefault()
		setAppliedSearch(input.trim())
		setPage(1)
	}

	const handleStatusChange = (value) => {
		setStatusFilter(value)
		setPage(1)
	}

	const handleResetFilters = () => {
		setInput("")
		setAppliedSearch("")
		setStatusFilter("all")
		setPage(1)
	}

	const StatCard = ({ title, value, icon: Icon, color, description }) => (
		<div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-3xl font-bold" style={{ color }}>{loading ? '...' : value}</p>
					{description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
				</div>
				<div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
					<Icon className="w-6 h-6" style={{ color }} />
				</div>
			</div>
		</div>
	)

	const renderPagination = () => {
		if (!pagination?.totalPages || pagination.totalPages <= 1) return null

		const current = pagination.currentPage || page
		const totalPages = pagination.totalPages
		const pages = []
		const maxButtons = 5
		let start = Math.max(1, current - 2)
		let end = Math.min(totalPages, start + maxButtons - 1)

		if (end - start < maxButtons - 1) {
			start = Math.max(1, end - maxButtons + 1)
		}

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		const startRecord = (current - 1) * PAGE_SIZE + 1
		const endRecord = Math.min(current * PAGE_SIZE, pagination.total)

		return (
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-t">
				<p className="text-sm text-gray-600">
					Showing {Math.min(startRecord, pagination.total)}-
					{Math.min(endRecord, pagination.total)} of {pagination.total} companies
				</p>
				<div className="flex items-center gap-2 flex-wrap">
					<Button
						variant="outline"
						size="sm"
						disabled={!pagination.hasPrev}
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
					>
						Previous
					</Button>
					{pages.map((pageNumber) => (
						<button
							key={pageNumber}
							onClick={() => setPage(pageNumber)}
							className={`px-3 py-1 text-sm rounded-md border ${
								pageNumber === current
									? 'bg-blue-600 text-white border-blue-600'
									: 'border-gray-300 text-gray-600 hover:bg-gray-100'
							}`}
						>
							{pageNumber}
						</button>
					))}
					<Button
						variant="outline"
						size="sm"
						disabled={!pagination.hasNext}
						onClick={() => setPage((prev) => prev + 1)}
					>
						Next
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
					<p className="text-gray-600 mt-1">Manage all registered companies and their job postings</p>
				</div>
				<div className="flex items-center gap-2">
					<Button onClick={() => navigate('/admin/companies/create')} className="bg-blue-600 hover:bg-blue-700">
						+ Add Company
					</Button>
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						Total: {stats.total}
					</Badge>
					<Badge variant="outline" className="bg-green-50 text-green-700">
						Active: {stats.active}
					</Badge>
					<Badge variant="outline" className="bg-yellow-50 text-yellow-700">
						Suspended: {stats.suspended}
					</Badge>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Total Companies"
					value={stats.total}
					icon={Building2}
					color="#3B82F6"
					description="All registered companies"
				/>
				<StatCard
					title="Active Companies"
					value={stats.active}
					icon={TrendingUp}
					color="#10B981"
					description="Can post jobs"
				/>
				<StatCard
					title="Suspended Companies"
					value={stats.suspended}
					icon={Users}
					color="#F59E0B"
					description="Access restricted"
				/>
				<StatCard
					title="Pending Approval"
					value={stats.pending}
					icon={Briefcase}
					color="#8B5CF6"
					description="Awaiting review"
				/>
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-lg shadow-md p-4">
				<div className="flex flex-col lg:flex-row gap-4 items-center">
					<form className="relative flex-1 w-full" onSubmit={handleSearchSubmit}>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Search companies by name..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="pl-10"
						/>
						<button type="submit" className="hidden">Search</button>
					</form>
					<div className="flex flex-wrap gap-2 w-full lg:w-auto">
						<Button variant="outline" size="sm">
							Export Data
						</Button>
						<select 
							value={statusFilter}
							onChange={(e) => handleStatusChange(e.target.value)}
							className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							<option value="all">All Statuses</option>
							<option value="active">Active</option>
							<option value="suspended">Suspended</option>
							<option value="pending">Pending</option>
						</select>
						<Button variant="outline" size="sm" onClick={handleResetFilters}>
							Reset
						</Button>
					</div>
				</div>
			</div>

			{/* Companies Table */}
			<div className="bg-white rounded-lg shadow-md">
				<div className="p-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-800">All Companies</h2>
					<p className="text-sm text-gray-600">Manage company profiles, view job postings, and control access</p>
				</div>
				<CompaniesTable
					companies={companies}
					loading={loading}
					onEdit={(id) => navigate(`/admin/companies/${id}`)}
					onUpdateStatus={handleUpdateStatus}
					onDelete={handleDelete}
				/>
			</div>
			{renderPagination()}
		</div>
	)
}

export default Companies