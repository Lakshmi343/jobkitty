import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery, setJobFilters } from '@/redux/jobSlice'
import { MapPin, Building, DollarSign } from 'lucide-react'
import axios from 'axios'
import { CATEGORY_API_END_POINT } from '@/utils/constant'

const LOCATIONS = ["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod","Remote"]
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"]
const SALARY = ["0-40k","42-1lakh","1lakh to 5lakh","5lakh+"]
const EXPERIENCE = ["0-1 years","1-3 years","3-5 years","5+ years"]

const FilterCard = () => {
    const [location, setLocation] = useState('')
    const [role, setRole] = useState('')
    const [salary, setSalary] = useState('')
    const [jobType, setJobType] = useState('')
    const [experience, setExperience] = useState('')
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState('')
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchCategories = async ()=>{
            try{
                const res = await axios.get(`${CATEGORY_API_END_POINT}/get`)
                if(res.data.success) setCategories(res.data.categories)
            }catch(err){
                // silently ignore
            }
        }
        fetchCategories()
    },[])

    const query = useMemo(() => {
        return [location, role, salary, jobType, experience].filter(Boolean).join(' ')
    }, [location, role, salary, jobType, experience])
    
    useEffect(() => {
        dispatch(setSearchedQuery(query))
        dispatch(setJobFilters({ location, jobType, salaryRange: salary, experienceRange: experience, categoryId }))
    }, [query, location, jobType, salary, experience, categoryId, dispatch]);

    const clearAll = ()=>{
        setLocation(''); setRole(''); setSalary(''); setJobType(''); setExperience(''); setCategoryId('')
    }

    return (
        <div className='w-full bg-white p-4 lg:p-6 rounded-xl shadow-lg border border-gray-100'>
            <h1 className='font-bold text-xl mb-4 text-gray-800'>Filter Jobs</h1>
            <hr className='mb-6 border-gray-200' />

            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <h2 className='font-semibold text-lg text-gray-800'>Location</h2>
                    </div>
                    <select value={location} onChange={(e)=>setLocation(e.target.value)} className='w-full border rounded-lg px-3 py-2'>
                        <option value=''>Any</option>
                        {LOCATIONS.map((l)=>(<option key={l} value={l}>{l}</option>))}
                    </select>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-gray-600" />
                        <h2 className='font-semibold text-lg text-gray-800'>Role</h2>
                    </div>
                    <input value={role} onChange={(e)=>setRole(e.target.value)} placeholder='e.g. Backend Developer' className='w-full border rounded-lg px-3 py-2' />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className='text-sm font-medium text-gray-700'>Job Type</label>
                        <select value={jobType} onChange={(e)=>setJobType(e.target.value)} className='w-full border rounded-lg px-3 py-2'>
                            <option value=''>Any</option>
                            {JOB_TYPES.map((t)=>(<option key={t} value={t}>{t}</option>))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className='text-sm font-medium text-gray-700'>Experience</label>
                        <select value={experience} onChange={(e)=>setExperience(e.target.value)} className='w-full border rounded-lg px-3 py-2'>
                            <option value=''>Any</option>
                            {EXPERIENCE.map((eR)=>(<option key={eR} value={eR}>{eR}</option>))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className='text-sm font-medium text-gray-700'>Salary</label>
                        <select value={salary} onChange={(e)=>setSalary(e.target.value)} className='w-full border rounded-lg px-3 py-2'>
                            <option value=''>Any</option>
                            {SALARY.map((s)=>(<option key={s} value={s}>{s}</option>))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className='text-sm font-medium text-gray-700'>Category</label>
                        <select value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} className='w-full border rounded-lg px-3 py-2'>
                            <option value=''>Any</option>
                            {categories.map((c)=>(<option key={c._id} value={c._id}>{c.name}</option>))}
                        </select>
                    </div>
                </div>

                {(location || role || salary || jobType || experience || categoryId) && (
                    <div className="pt-2">
                        <button
                            onClick={clearAll}
                            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FilterCard