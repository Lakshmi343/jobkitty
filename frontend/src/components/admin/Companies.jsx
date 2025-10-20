import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '../../utils/constant'
import { ADMIN_API_END_POINT } from '../../utils/constant'
import { Building2, Search, TrendingUp, Users, Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const Companies = () => {
	const { user } = useSelector(store => store.auth)
	const [companies, setCompanies] = useState([])
	const [loading, setLoading] = useState(true)
	const [input, setInput] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, pending: 0 })
	const navigate = useNavigate()

	useEffect(() => {
		// Add a small delay to prevent immediate loading state flash
		const timer = setTimeout(() => {
			fetchCompanies()
		}, 100)
		
		return () => clearTimeout(timer)
	}, [])

	const fetchCompanies = async () => {
		try {
			setLoading(true)
			// Try different API endpoints
			let res;
			try {
				// First try with admin token (correct token key)
				const token = localStorage.getItem('adminToken')
				if (token) {
					res = await axios.get(`${ADMIN_API_END_POINT}/companies`, {
						headers: { Authorization: `Bearer ${token}` },
						timeout: 10000 // 10 second timeout
					})
				} else {
					throw new Error('No admin token found')
				}
			} catch (adminError) {
				console.log('Admin API failed, trying user API:', adminError.message)
				// Fallback to user API
				res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
					withCredentials: true,
					timeout: 10000
				})
			}
			
			if (res.data.success) {
				const companiesData = res.data.companies || []
				setCompanies(companiesData)
				
				// Calculate stats
				const statsData = {
					total: companiesData.length,
					active: companiesData.filter(c => c.status === 'active' || c.status === 'approved').length,
					suspended: companiesData.filter(c => c.status === 'suspended').length,
					pending: companiesData.filter(c => c.status === 'pending').length
				}
				setStats(statsData)
				toast.success(`Loaded ${companiesData.length} companies`)
			} else {
				console.error('API returned unsuccessful response')
				setCompanies([])
				toast.error('Unable to load companies. Please try again.')
			}
		} catch (error) {
			console.error('Failed to fetch companies:', error)
			setCompanies([])
			toast.error('Unable to load companies. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const filteredCompanies = useMemo(() => {
		let result = [...companies];
		
		// Apply search filter
		if (input) {
			result = result.filter((c) => c?.name?.toLowerCase().includes(input.toLowerCase()));
		}
		
		// Apply status filter
		if (statusFilter !== 'all') {
			if (statusFilter === 'active') {
				result = result.filter(c => c.status === 'active' || c.status === 'approved');
			} else {
				result = result.filter(c => c.status === statusFilter);
			}
		}
		
		return result;
	}, [companies, input, statusFilter])

	const handleUpdateStatus = async (companyId, status) => {
		try {
			const token = localStorage.getItem('adminAccessToken')
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
				// Update local state immediately for better UX
				setCompanies((prev) => prev.map((c) => 
					c._id === companyId ? { ...c, status: status } : c
				))
				// Update stats
				const updatedCompanies = companies.map(c => 
					c._id === companyId ? { ...c, status: status } : c
				)
				const statsData = {
					total: updatedCompanies.length,
					active: updatedCompanies.filter(c => c.status === 'active' || c.status === 'approved').length,
					suspended: updatedCompanies.filter(c => c.status === 'suspended').length,
					pending: updatedCompanies.filter(c => c.status === 'pending').length
				}
				setStats(statsData)
			}
		} catch (error) {
			console.error('Failed to update company status:', error)
		}
	}

	const handleDelete = async (companyId) => {
		// Show confirmation toast instead of window.confirm
		if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) return
		try {
			const token = localStorage.getItem('adminAccessToken')
			if (!token) {
				console.error('No admin token available')
				return
			}
			
			const res = await axios.delete(`${ADMIN_API_END_POINT}/companies/${companyId}`, {
				headers: { Authorization: `Bearer ${token}` },
				timeout: 5000
			})
			if (res.data.success) {
				// Update local state immediately
				const updatedCompanies = companies.filter((c) => c._id !== companyId)
				setCompanies(updatedCompanies)
				// Update stats
				const statsData = {
					total: updatedCompanies.length,
					active: updatedCompanies.filter(c => c.status === 'active' || c.status === 'approved').length,
					suspended: updatedCompanies.filter(c => c.status === 'suspended').length,
					pending: updatedCompanies.filter(c => c.status === 'pending').length
				}
				setStats(statsData)
			}
		} catch (error) {
			console.error('Failed to delete company:', error)
		}
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
				<div className="flex flex-col sm:flex-row gap-4 items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Search companies by name..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="pl-10"
						/>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" size="sm">
							Export Data
						</Button>
						<select 
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							<option value="all">All Statuses</option>
							<option value="active">Active</option>
							<option value="suspended">Suspended</option>
							<option value="pending">Pending</option>
						</select>
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
					companies={filteredCompanies}
					loading={loading}
					onEdit={(id) => navigate(`/admin/companies/${id}`)}
					onUpdateStatus={handleUpdateStatus}
					onDelete={handleDelete}
				/>
			</div>
		</div>
	)
}

export default Companies