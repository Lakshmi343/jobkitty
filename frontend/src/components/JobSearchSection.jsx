import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react';
import { setJobFilters, setSearchedQuery } from '@/redux/jobSlice';

const JobSearchSection = ({ onSearch, searchQuery, setSearchQuery, locationQuery, setLocationQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const { filters } = useSelector((store) => store.job);

  // Filter options
  const JOB_TYPES = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' },
  ];

  const EXPERIENCE_LEVELS = [
    { value: '0', label: '0 years' },
    { value: '0-1', label: '0-1 years' },
    { value: '2-5', label: '2-5 years' },
    { value: '5+', label: '5+ years' },
  ];

  const SALARY_RANGES = [
    { value: '0-300000', label: 'Up to ₹3L' },
    { value: '300000-700000', label: '₹3L - ₹7L' },
    { value: '700000-1500000', label: '₹7L - ₹15L' },
    { value: '1500000-2500000', label: '₹15L - ₹25L' },
    { value: '2500000+', label: '₹25L+' },
  ];

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    dispatch(setJobFilters(newFilters));
    
    // Update URL
    const searchParams = new URLSearchParams(location.search);
    if (value) {
      searchParams.set(filterName, value);
    } else {
      searchParams.delete(filterName);
    }
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const clearFilters = () => {
    dispatch(setJobFilters({
      jobType: '',
      experienceRange: '',
      salaryRange: '',
      datePosted: ''
    }));
    navigate(location.pathname, { replace: true });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Job title, company, or keyword"
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch(e)}
          />
        </div>
        
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Location"
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch(e)}
          />
        </div>
        
        <button
          onClick={onSearch}
          className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Search Jobs
        </button>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {Object.values(filters).filter(Boolean).length > 0 && (
          <button
            onClick={() => {
              dispatch(setJobFilters({
                jobType: '',
                experience: '',
                salaryRange: '',
                datePosted: ''
              }));
              navigate(location.pathname);
            }}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <X className="mr-1 h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Job Type Filter */}
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1.5">
                Job Type
              </label>
              <select
                id="jobType"
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                value={filters.jobType || ''}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
              >
                <option value="">Any Job Type</option>
                {JOB_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1.5">
                Experience Level
              </label>
              <select
                id="experience"
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                value={filters.experience || ''}
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
              <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-1.5">
                Salary Range
              </label>
              <select
                id="salaryRange"
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                value={filters.salaryRange || ''}
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
              <label htmlFor="datePosted" className="block text-sm font-medium text-gray-700 mb-1.5">
                Date Posted
              </label>
              <select
                id="datePosted"
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                value={filters.datePosted || ''}
                onChange={(e) => handleFilterChange('datePosted', e.target.value)}
              >
                <option value="">Any Time</option>
                <option value="1">Last 24 hours</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last week</option>
                <option value="30">Last month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {Object.entries(filters).some(([_, value]) => Boolean(value)) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
            let label = value;
            if (key === 'jobType') {
              label = JOB_TYPES.find(t => t.value === value)?.label || value;
            } else if (key === 'experience') {
              label = EXPERIENCE_LEVELS.find(l => l.value === value)?.label || value;
            } else if (key === 'salaryRange') {
              label = SALARY_RANGES.find(r => r.value === value)?.label || value;
            } else if (key === 'datePosted') {
              const dateLabels = {
                '1': 'Last 24 hours',
                '3': 'Last 3 days',
                '7': 'Last week',
                '30': 'Last month'
              };
              label = dateLabels[value] || value;
            }
            
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 border border-primary-100"
              >
                {label}
                <button
                  type="button"
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors duration-200"
                  onClick={() => handleFilterChange(key, '')}
                >
                  <span className="sr-only">Remove filter</span>
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobSearchSection;
