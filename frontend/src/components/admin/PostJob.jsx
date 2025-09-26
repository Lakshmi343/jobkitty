import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { JOB_API_END_POINT, CATEGORY_API_END_POINT, USER_API_END_POINT } from '../../utils/constant';
import { parseLocation } from '../../utils/locationData';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin,  DollarSign, Clock, Users,  Building,  FileText,ArrowLeft,Plus,CheckCircle, AlertCircle, X} from 'lucide-react';
import LocationSelector from '../ui/LocationSelector';
import LoadingSpinner from '../shared/LoadingSpinner';

const locations = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];

const experienceLevels = [

    { value: "0", label: "Entry Level (0-1 years)" },
    { value: "1", label: "Junior (1-3 years)" },
    { value: "3", label: "Mid Level (3-5 years)" },
    { value: "5", label: "Senior (5-8 years)" },
    { value: "8", label: "Expert (8+ years)" }
    
];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: [],
        salaryMin: "",
        salaryMax: "",
        experienceMin: "",
        experienceMax: "",
        experienceLevel: "",
        location: "",
        jobType: "",
        position: "",
        openings: "1",
        category: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [requirements, setRequirements] = useState([]);
    const [newRequirement, setNewRequirement] = useState("");
    const [userCompany, setUserCompany] = useState(null);
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (user && !user.profile.company) {
            toast.info("Please set up your company profile before posting a job.");
            navigate('/employer/company/setup');
        } else if (user && user.profile.company) {
            setUserCompany(user.profile.company);
        }
    }, [user, navigate]);

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
        fetchCategories();
    }, []);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (name, value) => {
        setInput({ ...input, [name]: value });
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

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return input.title && input.description && input.category && requirements.length > 0;
            case 2:
                return input.location && input.jobType; 
            case 3:
                return input.salaryMin && input.salaryMax && input.openings; 
            default:
                return true;
        }
    };

    const nextStep = () => {
        console.log('Current step:', currentStep, 'Input state:', input);
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            return;
        }
        
        try {
            setLoading(true);
            const parsedLoc = parseLocation(input.location);
            const formData = {
                ...input,
                requirements: requirements.length > 0 ? requirements : ["No specific requirements"],
                salary: {
                    min: Number(input.salaryMin),
                    max: Number(input.salaryMax)
                },
                // Normalize location into structured object for backend
                location: {
                    state: parsedLoc.state || "",
                    district: parsedLoc.district || "",
                    legacy: input.location || ""
                },
                experience: (input.experienceMin || input.experienceMax) ? {
                    min: Number(input.experienceMin || 0),
                    max: Number(input.experienceMax || 0)
                } : undefined,
                openings: Number(input.openings)
            };
            
            
            delete formData.salaryMin;
            delete formData.salaryMax;
            delete formData.experienceMin;
            delete formData.experienceMax;
            delete formData.position; 
            if (!formData.experience) delete formData.experience;
            
            const response = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                toast.success('Job posted successfully!');
                if (user?.role === 'admin' || user?.role === 'superadmin') {
                    navigate('/admin/jobs');
                } else {
                    navigate('/employer/jobs');
                }
            }
        } catch (error) {
            console.error('Error posting job:', error);
            toast.error(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    const progressPercentage = (currentStep / 3) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            
            
            <div className="max-w-4xl mx-auto px-4 py-8">
               
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Plus className="w-8 h-8 text-blue-600" />
                                Post New Job
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Create a new job listing to attract talented candidates
                            </p>
                        </div>
                    </div>

                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Step {currentStep} of 3</h2>
                            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Job Details</span>
                            <span>Location & Type</span>
                            <span>Compensation & Openings</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler}>
                    {/* Step 1: Job Details */}
                    {currentStep === 1 && (
                        <div className='bg-white p-8 rounded-lg shadow-md border'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                    Job Details
                                </CardTitle>
                                <CardDescription>Provide the core details of the job.</CardDescription>
                            </CardHeader>
                            <CardContent className='mt-4 space-y-6'>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Job Title</Label>
                                        <Input name="title" value={input.title} onChange={changeEventHandler} placeholder="e.g., Software Engineer" />
                                    </div>
                                    <div>
                                        <Label>Category</Label>
                                        <Select
                                            name="category"
                                            value={input.category}
                                            onValueChange={(value) => selectChangeHandler("category", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Job Description</Label>
                                    <Textarea 
                                      name="description" 
                                      value={input.description} 
                                      onChange={changeEventHandler} 
                                      placeholder="Describe the role and responsibilities"
                                      className="min-h-[320px] resize-y"
                                    />
                                </div>
                                <div>
                                    <Label>Requirements* (Point-based format)</Label>
                                    <div className="flex gap-2 mb-2">
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
                                        <p className="text-sm text-gray-500 mt-2">Add job requirements as bullet points. Each requirement will be displayed as a separate point.</p>
                                    )}
                                </div>
                            </CardContent>
                        </div>
                    )}
            
            {currentStep === 2 && (
    <div className='bg-white p-8 rounded-lg shadow-md border'>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                Location & Type
            </CardTitle>
            <CardDescription>Specify where and how the job is offered.</CardDescription>
        </CardHeader>
        <CardContent className='mt-4 space-y-6'>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <LocationSelector
                      label="Location"
                      value={input.location}
                      onChange={(value) => selectChangeHandler("location", value)}
                      required={true}
                      placeholder="Select location"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported states: Tamil Nadu, Kerala, Telangana, Andhra Pradesh, Karnataka</p>
                </div>
                <div>
                    <Label>Job Type</Label>
                    <Select
                        name="jobType"
                        value={input.jobType}
                        onValueChange={(value) => selectChangeHandler("jobType", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a job type" />
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
        </CardContent>
    </div>
)}

                    {currentStep === 3 && (
                        <div className='bg-white p-8 rounded-lg shadow-md border'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                    Compensation & Openings
                                </CardTitle>
                                <CardDescription>Detail the salary and number of open positions.</CardDescription>
                            </CardHeader>
                            <CardContent className='mt-4 space-y-6'>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <Label>Salary Range (LPA) - Min*</Label>
                                        <Input
                                            name="salaryMin"
                                            type="number"
                                            value={input.salaryMin}
                                            onChange={changeEventHandler}
                                            placeholder="e.g., 4"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <Label>Salary Range (LPA) - Max*</Label>
                                        <Input
                                            name="salaryMax"
                                            type="number"
                                            value={input.salaryMax}
                                            onChange={changeEventHandler}
                                            placeholder="e.g., 8"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <Label>No. of Openings*</Label>
                                        <Input
                                            name="openings"
                                            type="number"
                                            value={input.openings}
                                            onChange={changeEventHandler}
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
                        <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                            <ArrowLeft className='mr-2 h-4 w-4' /> Previous
                        </Button>
                        <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
                        {currentStep < 3 ? (
                            <Button type="button" onClick={nextStep}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={submitHandler} disabled={loading || requirements.length === 0} className="bg-green-600 hover:bg-green-700">
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSpinner size={20} color="#ffffff" />
                                        <span className="ml-2">Posting...</span>
                                    </div>
                                ) : (
                                    <>
                                        <CheckCircle className='mr-2 h-4 w-4' />
                                        Post Job
                                    </>
                                )}
                            </Button>
                        )}
                        {requirements.length === 0 && (
                            <p className="text-amber-600 text-sm mt-2 text-center">
                                ⚠️ Please add at least one requirement to post the job
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostJob;