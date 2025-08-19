import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ADMIN_API_END_POINT } from '@/utils/constant'

const Companies = () => {
	const [companies, setCompanies] = useState([])
	const [loading, setLoading] = useState(true)
	const [input, setInput] = useState("")
	const navigate = useNavigate()

	const fetchCompanies = async () => {
		try {
			setLoading(true)
			const token = localStorage.getItem('adminToken')
			const res = await axios.get(`${ADMIN_API_END_POINT}/companies`, {
				headers: { Authorization: `Bearer ${token}` }
			})
			if (res.data.success) {
				setCompanies(res.data.companies || [])
			}
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCompanies()
	}, [])

	const filteredCompanies = useMemo(() => {
		if (!input) return companies
		return companies.filter((c) => c?.name?.toLowerCase().includes(input.toLowerCase()))
	}, [companies, input])

	const handleUpdateStatus = async (companyId, status) => {
		try {
			const token = localStorage.getItem('adminToken')
			const res = await axios.patch(
				`${ADMIN_API_END_POINT}/companies/${companyId}/status`,
				{ status },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			if (res.data.success) {
				setCompanies((prev) => prev.map((c) => (c._id === companyId ? { ...c, status: res.data.company.status } : c)))
			}
		} catch (error) {
			console.error(error)
		}
	}

	const handleDelete = async (companyId) => {
		if (!window.confirm('Delete this company? This cannot be undone.')) return
		try {
			const token = localStorage.getItem('adminToken')
			const res = await axios.delete(`${ADMIN_API_END_POINT}/companies/${companyId}`, {
				headers: { Authorization: `Bearer ${token}` }
			})
			if (res.data.success) {
				setCompanies((prev) => prev.filter((c) => c._id !== companyId))
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className='max-w-6xl mx-auto my-10'>
			<div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between my-5'>
				<Input
					className="w-full md:w-auto"
					placeholder="Filter by name"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				{/* Optional: add create flow later when backend supports admin create */}
				{/* <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button> */}
			</div>
			<CompaniesTable
				companies={filteredCompanies}
				loading={loading}
				onEdit={(id) => navigate(`/admin/companies/${id}`)}
				onUpdateStatus={handleUpdateStatus}
				onDelete={handleDelete}
			/>
		</div>
	)
}

export default Companies