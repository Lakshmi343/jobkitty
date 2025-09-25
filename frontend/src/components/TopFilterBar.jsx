import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery, setJobFilters } from '@/redux/jobSlice'
import { Search, MapPin, Building, DollarSign, Clock, Briefcase, X } from 'lucide-react'
import axios from 'axios'
import { CATEGORY_API_END_POINT } from '@/utils/constant'

const LOCATIONS = ["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod","Remote"]
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"]
const SALARY = ["0-40k","42-1lakh","1lakh to 5lakh","5lakh+"]
const EXPERIENCE = ["0-1 years","1-3 years","3-5 years","5+ years"]

const DATE_POSTED = [
  { label: 'Any time', value: '' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' }
]

const TopFilterBar = ({ variant = 'top', locationInputMode = 'select' }) => {
    const dispatch = useDispatch();
    const { filters, searchedQuery } = useSelector(state => state.job);
    const [location, setLocation] = useState('')
    const [role, setRole] = useState('')
    const [salary, setSalary] = useState('')
    const [jobType, setJobType] = useState('')
    const [experience, setExperience] = useState('')
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState('')
    const [companyType, setCompanyType] = useState('')
    const [datePosted, setDatePosted] = useState('')

    useEffect(()=>{
        const fetchCategories = async ()=>{
            try{
                const res = await axios.get(`${CATEGORY_API_END_POINT}/get`)
                if(res.data.success) setCategories(res.data.categories)
            }catch(err){
              
            }
        }
        fetchCategories()
    },[])

    const query = useMemo(() => {
       
        return role || ''
    }, [role])
    

    useEffect(() => {
        dispatch(setSearchedQuery(query))
        dispatch(setJobFilters({ location, jobType, salaryRange: salary, experienceRange: experience, categoryId, companyType, datePosted }))
    }, [query, location, jobType, salary, experience, categoryId, companyType, datePosted, dispatch]);

   
    useEffect(() => {
        setLocation(filters.location || '')
        setRole(searchedQuery || '')
        setSalary(filters.salaryRange || '')
        setJobType(filters.jobType || '')
        setExperience(filters.experienceRange || '')
        setCategoryId(filters.categoryId || '')
        setCompanyType(filters.companyType || '')
        setDatePosted(filters.datePosted || '')
    }, [filters.location, filters.salaryRange, filters.jobType, filters.experienceRange, filters.categoryId, filters.companyType, filters.datePosted, searchedQuery])

    const clearAll = ()=>{
        setLocation(''); setRole(''); setSalary(''); setJobType(''); setExperience(''); setCategoryId(''); setCompanyType(''); setDatePosted('')
    }

    const hasActiveFilters = location || role || salary || jobType || experience || categoryId || companyType || datePosted;

    
    const containerClasses = variant === 'top'
        ? 'w-full bg-white shadow-lg border-b border-gray-200 sticky top-0 z-20'
        : 'w-full';

    const innerClasses = variant === 'top'
        ? 'max-w-7xl mx-auto px-4 py-6'
        : '';

    return (
        <div className={containerClasses}>
            <div className={innerClasses}>
               
                <div className={variant === 'top' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4" : "grid grid-cols-1 gap-4 mb-4"}>
                    
                    <div className="relative xl:col-span-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Search jobs, companies..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                    </div>

               
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        {locationInputMode === 'text' ? (
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, District or Remote"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                        ) : (
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                            >
                                <option value=''>All Locations</option>
                                {LOCATIONS.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                            <option value=''>All Types</option>
                            {JOB_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                 
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                            <option value=''>Any Experience</option>
                            {EXPERIENCE.map((eR) => (
                                <option key={eR} value={eR}>{eR}</option>
                            ))}
                        </select>
                    </div>

                    
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                            <option value=''>Any Salary</option>
                            {SALARY.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

           
                <div className={variant === 'top' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>
                   
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                            <option value=''>All Categories</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                 
                   

                
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={datePosted}
                            onChange={(e) => setDatePosted(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                        >
                            {DATE_POSTED.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

               
                {hasActiveFilters && (
                    <div className={variant === 'top' ? "mt-2 flex items-center gap-4" : "mt-2 flex items-center gap-4"}>
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-300"
                        >
                            <X className="h-4 w-4" />
                            Clear All
                        </button>
                        <span className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                            {[location, role, salary, jobType, experience, categoryId, companyType, datePosted].filter(Boolean).length} filter(s) active
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TopFilterBar
