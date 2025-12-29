import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  X, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Building
} from 'lucide-react';
import { setJobFilters, setSearchedQuery, setSearchResults } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

// Filter options
const JOB_TYPES = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Temporary', label: 'Temporary' },
];

const EXPERIENCE_LEVELS = [
  { value: '0', label: 'Entry Level (0-2 years)' },
  { value: '3-5', label: 'Mid Level (3-5 years)' },
  { value: '5-10', label: 'Senior Level (5-10 years)' },
  { value: '10+', label: 'Executive (10+ years)' },
];

const SALARY_RANGES = [
  { value: '0-300000', label: 'Up to ₹3L' },
  { value: '300000-600000', label: '₹3L - ₹6L' },
  { value: '600000-1200000', label: '₹6L - ₹12L' },
  { value: '1200000-2400000', label: '₹12L - ₹24L' },
  { value: '2400000+', label: '₹24L+' },
];

const DATE_POSTED_OPTIONS = [
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 3 months' },
];

// Constants for job filters
const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

const EXPERIENCE_LEVELS = [
  { value: '0-2', label: '0-2 years' },
  { value: '2-5', label: '2-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
];

const SALARY_RANGES = [
  { value: '0-300000', label: 'Up to ₹3L' },
  { value: '300000-700000', label: '₹3L - ₹7L' },
  { value: '700000-1500000', label: '₹7L - ₹15L' },
  { value: '1500000-2500000', label: '₹15L - ₹25L' },
  { value: '2500000+', label: '₹25L+' },
];

const DATE_POSTED = [
  { value: '1', label: 'Last 24 hours' },
  { value: '3', label: 'Last 3 days' },
  { value: '7', label: 'Last week' },
  { value: '30', label: 'Last month' },
];

const JobSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults } = useSelector((state) => state.job);
  
  // Search states
  const [jobRole, setJobRole] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filter states (only shown after initial search)
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    salaryRange: '',
    datePosted: '',
    category: ''
  });
  
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/categories`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Check URL for initial search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('q') || '';
    const loc = params.get('location') || '';
    
    if (search || loc) {
      setJobRole(search);
      setLocation(loc);
      if (search) {
        performSearch(search, loc);
      }
    }
  }, []);

  // Perform the actual search
  const performSearch = async (role, loc) => {
    if (!role.trim()) {
      toast.error('Please enter a job role to search');
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/search`, {
        params: {
          q: role,
          ...(loc && { location: loc })
        }
      });
      
      dispatch(setSearchResults(response.data.jobs || []));
      dispatch(setSearchedQuery(role));
      setHasSearched(true);
      setShowFilters(true); // Show filters after search
      
      // Update URL
      navigate(`/jobs?q=${encodeURIComponent(role)}${loc ? `&location=${encodeURIComponent(loc)}` : ''}`, { replace: true });
      
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast.error(error.response?.data?.message || 'Failed to search jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Main search handler
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(jobRole, location);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      jobType: '',
      experience: '',
      salaryRange: '',
      datePosted: '',
      category: ''
    });
  };

  // Apply filters to search results
  const getFilteredJobs = () => {
    if (!hasSearched || !searchResults.length) return [];
    
    return searchResults.filter(job => {
      // Job Type filter
      if (filters.jobType && job.jobType !== filters.jobType) return false;
      
      // Experience filter
      if (filters.experience) {
        const [minExp, maxExp] = filters.experience.includes('+') 
          ? [parseInt(filters.experience), Infinity]
          : filters.experience.split('-').map(Number);
        
        if (job.experience < minExp || (maxExp && job.experience > maxExp)) return false;
      }
      
      // Salary filter
      if (filters.salaryRange) {
        const [minSalary, maxSalary] = filters.salaryRange.includes('+')
          ? [parseInt(filters.salaryRange), Infinity]
          : filters.salaryRange.split('-').map(Number);
          
        if (job.salary < minSalary || (maxSalary && job.salary > maxSalary)) return false;
      }
      
      // Date Posted filter
      if (filters.datePosted) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(filters.datePosted));
        const jobDate = new Date(job.createdAt);
        if (jobDate < daysAgo) return false;
      }
      
      // Category filter
      if (filters.category && job.categoryId !== filters.category) return false;
      
      return true;
    });
  };

  const filteredJobs = getFilteredJobs();
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Toggle filter section
  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  // Get filtered jobs based on secondary filters
  const filteredJobs = hasSearched ? applyFilters(searchResults) : [];

  // Reset all filters
  const resetFilters = () => {
    setJobType('');
    setExperience('');
    setSalaryRange('');
    setDatePosted('');
    setSelectedCategory('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="jobRole"
                placeholder="Job title, keywords, or company"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                placeholder="City, state, or remote"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
              <Search className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Job Listings */}
        <div className={hasSearched ? 'lg:col-span-3' : 'col-span-full'}>
          {!hasSearched ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100">
                <Search className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Search for jobs</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter a job role and location to find matching job listings.
              </p>
            </div>
          ) : isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setJobRole('');
                  setLocation('');
                  setHasSearched(false);
                  setShowFilters(false);
                  navigate('/jobs');
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                  {jobRole && ` for "${jobRole}"`}
                  {location && ` in ${location}`}
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <li key={job._id}>
                      <a href={`/job/${job._id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">{job.title}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {job.jobType || 'Full-time'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Building className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {job.company?.name || 'Company not specified'}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {job.location || 'Location not specified'}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>
                                {timeAgo(job.createdAt)}
                              </p>
                            </div>
                          </div>
                          {job.salary && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">
                                  ₹{new Intl.NumberFormat('en-IN').format(job.salary)} LPA
                                </span>
                                {job.experience && (
                                  <span className="ml-4">
                                    {job.experience === 0 ? 'Fresher' : `${job.experience}+ years exp`}
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                          {job.skills && job.skills.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-2">
                                {job.skills.slice(0, 4).map((skill, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {skill}
                                  </span>
                                ))}
                                {job.skills.length > 4 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{job.skills.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section - Only shown after initial search */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Filter className="h-5 w-5 text-indigo-600 mr-2" />
              Filter Jobs
            </h3>
            <div className="flex items-center space-x-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters ({activeFilterCount})
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showFilters ? (
                  <span className="flex items-center">
                    Hide filters <ChevronUp className="ml-1 h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Show filters <ChevronDown className="ml-1 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                >
                  <option value="">Any Experience</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.salaryRange}
                  onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                >
                  <option value="">Any Salary</option>
                  {SALARY_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Posted Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Posted</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.datePosted}
                  onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                >
                  <option value="">Any Time</option>
                  {DATE_POSTED_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
                className={`text-sm ${activeFilterCount > 0 ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
              >
                Clear all filters
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filter by</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    disabled={activeFilterCount === 0}
                  >
                    Reset all
                  </button>
                </div>

              {/* Job Type Filter */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <button 
                  onClick={() => toggleFilter('jobType')} 
                  className="flex justify-between items-center w-full text-left"
                >
                  <h4 className="text-md font-medium flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    Job Type
                  </h4>
                  {activeFilter === 'jobType' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                <div className={`mt-3 space-y-2 ${activeFilter === 'jobType' ? 'block' : 'hidden'}`}>
                  {JOB_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="radio"
                        name="jobType"
                        checked={jobType === type.value}
                        onChange={() => setJobType(jobType === type.value ? '' : type.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <button 
                  onClick={() => toggleFilter('experience')} 
                  className="flex justify-between items-center w-full text-left"
                >
                  <h4 className="text-md font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    Experience Level
                  </h4>
                  {activeFilter === 'experience' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                <div className={`mt-3 space-y-2 ${activeFilter === 'experience' ? 'block' : 'hidden'}`}>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="experience"
                        checked={experience === level.value}
                        onChange={() => setExperience(experience === level.value ? '' : level.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <button 
                  onClick={() => toggleFilter('salary')} 
                  className="flex justify-between items-center w-full text-left"
                >
                  <h4 className="text-md font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    Salary Range
                  </h4>
                  {activeFilter === 'salary' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                <div className={`mt-3 space-y-2 ${activeFilter === 'salary' ? 'block' : 'hidden'}`}>
                  {SALARY_RANGES.map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="salaryRange"
                        checked={salaryRange === range.value}
                        onChange={() => setSalaryRange(salaryRange === range.value ? '' : range.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Posted Filter */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <button 
                  onClick={() => toggleFilter('datePosted')} 
                  className="flex justify-between items-center w-full text-left"
                >
                  <h4 className="text-md font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    Date Posted
                  </h4>
                  {activeFilter === 'datePosted' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                <div className={`mt-3 space-y-2 ${activeFilter === 'datePosted' ? 'block' : 'hidden'}`}>
                  {DATE_POSTED.map((date) => (
                    <label key={date.value} className="flex items-center">
                      <input
                        type="radio"
                        name="datePosted"
                        checked={datePosted === date.value}
                        onChange={() => setDatePosted(datePosted === date.value ? '' : date.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{date.label}</span>
                    </label>
                  ))}
                </div>
              </div>
                      <input
                        type="radio"
                        name="jobType"
                        checked={jobType === type.value}
                        onChange={() => setJobType(type.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2">Experience Level</h4>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Any experience</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Range Filter */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  Salary Range
                </h4>
                <div className="space-y-2">
                  {SALARY_RANGES.map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="salaryRange"
                        checked={salaryRange === range.value}
                        onChange={() => setSalaryRange(range.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Posted Filter */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  Date Posted
                </h4>
                <div className="space-y-2">
                  {DATE_POSTED.map((date) => (
                    <label key={date.value} className="flex items-center">
                      <input
                        type="radio"
                        name="datePosted"
                        checked={datePosted === date.value}
                        onChange={() => setDatePosted(date.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{date.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-2">Job Category</h4>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <label key={category._id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category._id}
                          onChange={() => setSelectedCategory(selectedCategory === category._id ? '' : category._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Job Listings */}
            <div className="flex-1">
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div 
                      key={job._id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {job.jobType}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{job.company?.name}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {job.location}
                              </div>
                              {job.experience > 0 && (
                                <div className="flex items-center">
                                  <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {job.experience}+ years exp
                                </div>
                              )}
                              <div className="flex items-center">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                Posted {formatDate(job.createdAt)}
                              </div>
                            </div>
                            {job.salary && (
                              <div className="mt-2">
                                <span className="font-medium text-gray-900">
                                  ₹{job.salary.toLocaleString()}
                                </span>
                                <span className="text-gray-500 text-sm ml-1">/ year</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                            <button
                              onClick={() => navigate(`/jobs/${job._id}`)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              View Details
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {job.skills && job.skills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                +{job.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
