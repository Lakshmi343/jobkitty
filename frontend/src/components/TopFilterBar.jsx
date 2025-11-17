

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { setSearchedQuery, setJobFilters } from '@/redux/jobSlice';
import { Search, MapPin, Building, DollarSign, Clock, Briefcase, X } from 'lucide-react';
import axios from 'axios';
import { CATEGORY_API_END_POINT } from '@/utils/constant';


const LOCATIONS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode",
  "Wayanad", "Kannur", "Kasaragod", "Remote"
];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
const SALARY = ["0-40k", "42-1lakh", "1lakh to 5lakh", "5lakh+"];
const EXPERIENCE = ["Fresher (0 years)", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
const DATE_POSTED = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const TopFilterBar = ({ variant = 'top', locationInputMode = 'select' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();


  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);


  const [locationFilter, setLocation] = useState(params.location?.replace(/-/g, ' ') || '');
  const [role, setRole] = useState(searchParams.get('q') || '');
  const [salary, setSalary] = useState(searchParams.get('salary') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [companyType, setCompanyType] = useState(searchParams.get('companyType') || '');
  const [datePosted, setDatePosted] = useState(searchParams.get('datePosted') || '');


  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${CATEGORY_API_END_POINT}/get`);
        if (res.data.success && isMounted) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('❌ Failed to fetch categories:', err.message);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

 
  const updateURL = useCallback((updates) => {
   
    const currentState = {
      q: role,
      location: locationFilter,
      jobType,
      salary,
      experience,
      category: categoryId, 
      companyType,
      datePosted,
    };


    if (updates.role !== undefined) {
      currentState.q = updates.role;
      setRole(updates.role);
    }
    if (updates.location !== undefined) {
      currentState.location = updates.location;
      setLocation(updates.location);
    }
    if (updates.jobType !== undefined) {
      currentState.jobType = updates.jobType;
      setJobType(updates.jobType);
    }
    if (updates.salary !== undefined) {
      currentState.salary = updates.salary;
      setSalary(updates.salary);
    }
    if (updates.experience !== undefined) {
      currentState.experience = updates.experience;
      setExperience(updates.experience);
    }
    if (updates.categoryId !== undefined) {
      currentState.category = updates.categoryId; // Map to 'category' in URL
      setCategoryId(updates.categoryId);
    }
    if (updates.companyType !== undefined) {
      currentState.companyType = updates.companyType;
      setCompanyType(updates.companyType);
    }
    if (updates.datePosted !== undefined) {
      currentState.datePosted = updates.datePosted;
      setDatePosted(updates.datePosted);
    }

    // Build URL with non-empty parameters
    const newSearchParams = new URLSearchParams();
    Object.entries(currentState).forEach(([key, value]) => {
      if (value) newSearchParams.set(key, value);
    });

    // Update URL without adding to history
    navigate({ 
      pathname: location.pathname, // Keep current path
      search: newSearchParams.toString() 
    }, { replace: true });
  }, [navigate, role, locationFilter, jobType, salary, experience, categoryId, companyType, datePosted, location.pathname]);

  // ✅ Sync Redux Store with filters
  useEffect(() => {
    // Update search query in Redux
    dispatch(setSearchedQuery(role || ''));
    
    // Update filters in Redux
    const filters = {
      location: locationFilter || '',
      jobType: jobType || '',
      salaryRange: salary || '',
      experienceRange: experience || '',
      categoryId: categoryId || '', // Make sure this matches your jobSlice
      companyType: companyType || '',
      datePosted: datePosted || ''
    };
    
    dispatch(setJobFilters(filters));
    
    // Debug log to verify filters are being set correctly
    console.log('Updating Redux filters:', filters);
  }, [role, locationFilter, jobType, salary, experience, categoryId, companyType, datePosted, dispatch]);

  // ✅ Clear all filters
  const clearAll = () => {
    setRole('');
    setLocation('');
    setJobType('');
    setSalary('');
    setExperience('');
    setCategoryId('');
    setCompanyType('');
    setDatePosted('');
    navigate('/jobs');
  };

  // ✅ UI logic
  const hasActiveFilters = [role, locationFilter, salary, jobType, experience, categoryId, companyType, datePosted].some(Boolean);
  const activeFiltersCount = [role, locationFilter, salary, jobType, experience, categoryId, companyType, datePosted].filter(Boolean).length;

  const containerClasses = variant === 'top'
    ? "w-full bg-white shadow-sm border-b border-gray-200"
    : "w-full bg-white rounded-lg border border-gray-200";

  const innerClasses = variant === 'top'
    ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    : "p-4";

  return (
    <div className={containerClasses}>
      <div className={innerClasses}>
        {/* Grid of filters */}
        <div className={variant === 'top' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>

          {/* 🔍 Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={role}
              onChange={(e) => updateURL({ role: e.target.value })}
              placeholder="Job title, company, or keywords"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          {/* 🏢 Category Filter */}
          <div className="relative">
            <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={categoryId}
              onChange={(e) => updateURL({ categoryId: e.target.value })}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 📍 Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            {locationInputMode === 'text' ? (
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => updateURL({ location: e.target.value })}
                placeholder="City, District or Remote"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
              />
            ) : (
              <select
                value={locationFilter}
                onChange={(e) => updateURL({ location: e.target.value })}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            )}
          </div>

          {/* 💼 Job Type */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={jobType}
              onChange={(e) => updateURL({ jobType: e.target.value })}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
            >
              <option value="">All Job Types</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* 🧭 Experience */}
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={experience}
              onChange={(e) => updateURL({ experience: e.target.value })}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
            >
              <option value="">Any Experience</option>
              {EXPERIENCE.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* 💰 Salary */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={salary}
              onChange={(e) => updateURL({ salary: e.target.value })}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
            >
              <option value="">Any Salary</option>
              {SALARY.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 🕓 Date Posted */}
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={datePosted}
              onChange={(e) => updateURL({ datePosted: e.target.value })}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
            >
              {DATE_POSTED.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ❌ Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-3 text-gray-600 
              hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-300"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
            <span className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              {activeFiltersCount} filter(s) active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopFilterBar;
