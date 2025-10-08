import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import axios from 'axios';
import { CATEGORY_API_END_POINT, ADMIN_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Building, FileText, ArrowLeft, Plus, CheckCircle, X, Users, Upload, Image } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import LocationSelector from '../ui/LocationSelector';
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
const AdminJobPosting = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryQuery, setCategoryQuery] = useState("");
    const [companies, setCompanies] = useState([]);
    const [companyQuery, setCompanyQuery] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        requirements: [],
        salaryMin: "",
        salaryMax: "",
        location: {
            state: "",
            district: "",
            legacy: ""
        },
        jobType: "",
        position: "",
        openings: "1",
        category: ""
    });
    const [requirements, setRequirements] = useState([]);
    const [newRequirement, setNewRequirement] = useState("");
    const filteredCategories = categories.filter(cat =>
        cat?.name?.toLowerCase().includes(categoryQuery.toLowerCase())
    );
    const filteredCompanies = companies.filter(c =>
        c?.name?.toLowerCase().includes(companyQuery.toLowerCase())
    );
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${CATEGORY_API_END_POINT}/get`);
                if (response.data.success) {
                    setCategories(response.data.categories);
                }
            } catch (error) {
                toast.error("Failed to fetch categories");
            }
        };
        
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) throw new Error('Missing admin token');
                const res = await axios.get(`${ADMIN_API_END_POINT}/companies`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setCompanies(res.data.companies || []);
                }
            } catch (error) {
                toast.error('Failed to load companies');
            }
        };
        
        fetchCategories();
        fetchCompanies();
    }, []);

    
    useEffect(() => {
        const cid = searchParams.get('companyId');
        if (cid) {
            setSelectedCompanyId(cid);
            setCurrentStep(2);
        }
    }, [searchParams]);

    const handleJobChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

   
    const handleLocationChange = (selectedLocation) => {
        if (typeof selectedLocation === 'string') {
            const parts = selectedLocation.split(',').map(s => s.trim()).filter(Boolean);
            let state = '';
            let district = '';
            if (parts.length >= 2) {
                state = parts[parts.length - 1];
                district = parts[parts.length - 2];
            } else if (parts.length === 1) {
                state = parts[0];
            }

            const legacy = district && state ? `${district}, ${state}` : (state || '');

            setJobData(prev => ({
                ...prev,
                location: {
                    state,
                    district,
                    legacy
                }
            }));
        } else if (selectedLocation && typeof selectedLocation === 'object') {
          
            const state = selectedLocation.state || '';
            const district = selectedLocation.district || '';
            const legacy = selectedLocation.legacy || (district && state ? `${district}, ${state}` : (state || ''));
            setJobData(prev => ({
                ...prev,
                location: { state, district, legacy }
            }));
        } else {
            setJobData(prev => ({
                ...prev,
                location: { state: '', district: '', legacy: '' }
            }));
        }
    };

    const selectChangeHandler = (name, value) => {
        setJobData({ ...jobData, [name]: value });
    };

    const addRequirement = () => {
        if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
            setRequirements([...requirements, newRequirement.trim()]);
            setNewRequirement("");
        }
    };

    const removeRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRequirement();
        }
    };

    const validateCompanyStep = () => {
        return Boolean(selectedCompanyId);
    };

    const validateJobStep = () => {
        return jobData.title && 
               jobData.description && 
               jobData.category && 
               requirements.length > 0 && 
               jobData.location.district && 
               jobData.location.state &&
               jobData.jobType &&
               jobData.salaryMin && 
               jobData.salaryMax && 
               jobData.openings;
    };

    const nextStep = () => {
        if (currentStep === 1 && validateCompanyStep()) {
            setCurrentStep(2);
        } else if (currentStep === 1) {
            toast.error("Please select a company to continue");
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!validateJobStep()) {
            toast.error("Please complete all required job information");
            return;
        }
        
        try {
            setLoading(true);
            
            
            const payload = {
                companyId: selectedCompanyId,
                title: jobData.title,
                description: jobData.description,
                requirements: requirements.length > 0 ? requirements : ["No specific requirements"],
                salary: {
                    min: Number(jobData.salaryMin),
                    max: Number(jobData.salaryMax)
                },
                location: jobData.location, 
                jobType: jobData.jobType,
                position: jobData.position || 1,
                openings: Number(jobData.openings),
                category: jobData.category
            };

            console.log("Submitting job data:", payload); // Debug log

            const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
            const response = await axios.post(`${ADMIN_API_END_POINT}/post-job`, payload, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                toast.success('Job posted successfully!');
                navigate('/admin/jobs');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            let errorMessage = 'Unable to create job posting. Please try again.';
            
            if (error.response?.status === 400) {
                errorMessage = 'Please check all required fields and try again.';
                console.error('Validation error:', error.response.data);
            } else if (error.response?.status === 401) {
                errorMessage = 'You need to log in again to continue.';
            } else if (error.response?.status === 403) {
                errorMessage = 'You do not have permission to create jobs.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const progressPercentage = (currentStep / 2) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Plus className="w-8 h-8 text-blue-600" />
                                Admin Job Posting
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Create company profile and post job listing
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Step {currentStep} of 2</h2>
                            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Select Company</span>
                            <span>Job Details</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler}>
                    {/* Step 1: Company Selection */}
                    {currentStep === 1 && (
                        <div className='bg-white p-8 rounded-lg shadow-md border'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-6 w-6 text-blue-600" />
                                    Select Company
                                </CardTitle>
                                <CardDescription>Choose an existing company to post a job for.</CardDescription>
                            </CardHeader>
                            <CardContent className='mt-4 space-y-6'>
                                <div>
                                    <Label>Company *</Label>
                                    <Select
                                        value={selectedCompanyId}
                                        onValueChange={(value) => setSelectedCompanyId(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a company" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-64 overflow-auto">
                                            <div className="p-2 sticky top-0 bg-white border-b">
                                                <Input
                                                    value={companyQuery}
                                                    onChange={(e) => setCompanyQuery(e.target.value)}
                                                    placeholder="Search company..."
                                                />
                                            </div>
                                            <SelectGroup>
                                                {filteredCompanies.length > 0 ? (
                                                    filteredCompanies.map(c => (
                                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem disabled value="no_company_results">No companies found</SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {!companies.length && (
                                        <p className="text-sm text-gray-500 mt-2">No companies found. Create a company first from Companies page.</p>
                                    )}
                                </div>
                                
                             
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-blue-900">Don't see your company?</h3>
                                            <p className="text-blue-700 text-sm">Create a new company profile first</p>
                                        </div>
                                        <Button 
                                            type="button"
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate('/admin/companies')}
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Company
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    
                    {currentStep === 2 && (
                        <div className='bg-white p-8 rounded-lg shadow-md border'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-6 w-6 text-blue-600" />
                                    Job Details
                                </CardTitle>
                                <CardDescription>Provide the job posting details.</CardDescription>
                            </CardHeader>
                            <CardContent className='mt-4 space-y-6'>
                             
                                {selectedCompanyId && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <Building className="h-5 w-5 text-green-600" />
                                            <div>
                                                <span className="text-sm text-green-800 font-medium">Posting job for: </span>
                                                <span className="text-green-900 font-semibold">
                                                    {companies.find(c => c._id === selectedCompanyId)?.name || 'Selected Company'}
                                                </span>
                                            </div>
                                            <Button 
                                                type="button"
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => setCurrentStep(1)}
                                                className="text-green-700 hover:text-green-900 ml-auto"
                                            >
                                                Change
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Job Title *</Label>
                                        <Input 
                                            name="title" 
                                            value={jobData.title} 
                                            onChange={handleJobChange} 
                                            placeholder="e.g., Software Engineer" 
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Category *</Label>
                                        <Select
                                            name="category"
                                            value={jobData.category}
                                            onValueChange={(value) => selectChangeHandler("category", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-64 overflow-auto">
                                                <div className="p-2 sticky top-0 bg-white border-b">
                                                    <Input
                                                        value={categoryQuery}
                                                        onChange={(e) => setCategoryQuery(e.target.value)}
                                                        placeholder="Search category..."
                                                    />
                                                </div>
                                                <SelectGroup>
                                                    {filteredCategories.length > 0 ? (
                                                        filteredCategories.map(cat => (
                                                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem disabled value="no_results">No categories found</SelectItem>
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label>Job Description *</Label>
                                    <Textarea 
                                        name="description" 
                                        value={jobData.description} 
                                        onChange={handleJobChange} 
                                        placeholder="Describe the role and responsibilities..." 
                                        className="min-h-[120px] resize-y"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label>Requirements * (Point-based format)</Label>
                                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                                        <Input 
                                            value={newRequirement}
                                            onChange={(e) => setNewRequirement(e.target.value)}
                                            placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)"
                                            onKeyPress={handleKeyPress}
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={addRequirement}
                                            variant="outline"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        {requirements.map((req, index) => (
                                            <div key={index} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-start gap-2">
                                                <span className="text-blue-600 font-semibold mt-1">•</span>
                                                <span className="flex-1">{req}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeRequirement(index)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {requirements.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-2">Add job requirements as bullet points.</p>
                                    )}
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                  
                                    <div>
                                        <Label>Job Location *</Label>
                                        <LocationSelector
                                            value={jobData.location.legacy || `${jobData.location.district}, ${jobData.location.state}`}
                                            onChange={handleLocationChange}
                                            required={true}
                                            placeholder="Select job location (e.g., Kochi, Kerala)"
                                        />
                                        <div className="text-xs text-gray-500 mt-1">
                                            Currently selected: {jobData.location.district && jobData.location.state 
                                                ? `${jobData.location.district}, ${jobData.location.state}`
                                                : 'No location selected'
                                            }
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label>Job Type *</Label>
                                        <Select
                                            name="jobType"
                                            value={jobData.jobType}
                                            onValueChange={(value) => selectChangeHandler("jobType", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select job type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {jobTypes.map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <Label>Minimum Salary (LPA) *</Label>
                                        <Input
                                            name="salaryMin"
                                            type="number"
                                            inputMode="decimal"
                                            step="0.1"
                                            value={jobData.salaryMin}
                                            onChange={handleJobChange}
                                            placeholder="e.g., 4"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <Label>Maximum Salary (LPA) *</Label>
                                        <Input
                                            name="salaryMax"
                                            type="number"
                                            inputMode="decimal"
                                            step="0.1"
                                            value={jobData.salaryMax}
                                            onChange={handleJobChange}
                                            placeholder="e.g., 8"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <Label>Number of Openings *</Label>
                                        <Input
                                            name="openings"
                                            type="number"
                                            inputMode="numeric"
                                            value={jobData.openings}
                                            onChange={handleJobChange}
                                            placeholder="e.g., 2"
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>
                                
                                
                               
                            </CardContent>
                        </div>
                    )}

                 
                    <div className='mt-8 flex justify-between items-center'>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevStep} 
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className='h-4 w-4' /> 
                            Previous
                        </Button>
                        
                        <div className="text-sm text-gray-500">
                            Step {currentStep} of 2
                        </div>
                        
                        {currentStep < 2 ? (
                            <Button 
                                type="button" 
                                onClick={nextStep}
                                className="flex items-center gap-2"
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button 
                                type="submit"
                                disabled={loading || requirements.length === 0} 
                                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size={20} color="#ffffff" />
                                        <span>Posting Job...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className='h-4 w-4' />
                                        <span>Post Job</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    
                    {currentStep === 2 && requirements.length === 0 && (
                        <p className="text-amber-600 text-sm mt-2 text-center">
                            ⚠️ Please add at least one requirement to post the job
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminJobPosting;