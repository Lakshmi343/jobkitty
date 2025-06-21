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
import { JOB_API_END_POINT, CATEGORY_API_END_POINT, USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
    Loader2, 
    Briefcase, 
    MapPin, 
    DollarSign, 
    Clock, 
    Users, 
    Building, 
    FileText,
    ArrowLeft,
    Plus,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

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
        requirements: "",
        salary: "",
        experienceLevel: "",
        location: "",
        jobType: "",
        position: "",
        category: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [requirements, setRequirements] = useState([]);
    const [newRequirement, setNewRequirement] = useState("");
    const [userCompany, setUserCompany] = useState(null);
    const navigate = useNavigate();

    const { user } = useSelector(store => store.user || {});

    // Get user's company information
    useEffect(() => {
        const fetchUserCompany = async () => {
            try {
                if (user?._id) {
                    const response = await axios.get(`${USER_API_END_POINT}/profile`, {
                        withCredentials: true
                    });
                    if (response.data.success && response.data.user.profile?.company) {
                        setUserCompany(response.data.user.profile.company);
                    }
                }
            } catch (error) {
                console.error("Error fetching user company:", error);
            }
        };
        fetchUserCompany();
    }, [user]);

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
                return input.title && input.description && input.category;
            case 2:
                return input.location && input.jobType && input.experienceLevel;
            case 3:
                return input.salary && input.position && userCompany;
            default:
                return true;
        }
    };

    const nextStep = () => {
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
        
        if (requirements.length === 0) {
            toast.error("Please add at least one requirement");
            return;
        }

        if (!userCompany) {
            toast.error("Company information is required. Please update your profile with company details.");
            return;
        }

        try {
            setLoading(true);
            
            const jobData = {
                ...input,
                requirements: requirements,
                salary: Number(input.salary),
                experienceLevel: Number(input.experienceLevel),
                position: Number(input.position)
            };

            const res = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Job posted successfully!");
                navigate("/employer/jobs");
            }
        } catch (error) {
            console.error("Job posting error:", error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    const progressPercentage = (currentStep / 3) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
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

                    {/* Progress Bar */}
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
                            <span>Requirements</span>
                            <span>Company Info</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler}>
                    {/* Step 1: Job Details */}
                    {currentStep === 1 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Job Details
                                </CardTitle>
                                <CardDescription>
                                    Provide basic information about the position
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium">Job Title *</Label>
                                        <Input
                                            type="text"
                                            name="title"
                                            value={input.title}
                                            onChange={changeEventHandler}
                                            placeholder="e.g., Senior React Developer"
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium">Job Description *</Label>
                                        <Textarea
                                            name="description"
                                            value={input.description}
                                            onChange={changeEventHandler}
                                            placeholder="Enter your description..."
                                            className="min-h-[120px]"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium">Category *</Label>
                                        <Select 
                                            onValueChange={(value) => selectChangeHandler("category", value)}
                                            value={input.category}
                                            required
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select job category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Requirements */}
                    {currentStep === 2 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    Job Requirements
                                </CardTitle>
                                <CardDescription>
                                    Specify location, type, and experience requirements
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium">Location *</Label>
                                        <Select 
                                            onValueChange={(value) => selectChangeHandler("location", value)}
                                            value={input.location}
                                            required
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map(location => (
                                                    <SelectItem key={location} value={location}>
                                                        {location}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Job Type *</Label>
                                        <Select 
                                            onValueChange={(value) => selectChangeHandler("jobType", value)}
                                            value={input.jobType}
                                            required
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select job type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jobTypes.map(type => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Experience Level *</Label>
                                        <Select 
                                            onValueChange={(value) => selectChangeHandler("experienceLevel", value)}
                                            value={input.experienceLevel}
                                            required
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select experience level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {experienceLevels.map(level => (
                                                    <SelectItem key={level.value} value={level.value}>
                                                        {level.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium">Skills & Requirements</Label>
                                        <div className="mt-1 space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    value={newRequirement}
                                                    onChange={(e) => setNewRequirement(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Add a requirement (e.g., React, Node.js)"
                                                    className="flex-1"
                                                />
                                                <Button 
                                                    type="button" 
                                                    onClick={addRequirement}
                                                    variant="outline"
                                                    className="px-4"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            
                                            {requirements.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {requirements.map((req, index) => (
                                                        <Badge 
                                                            key={index} 
                                                            variant="secondary"
                                                            className="flex items-center gap-1"
                                                        >
                                                            {req}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRequirement(index)}
                                                                className="ml-1 hover:text-red-600"
                                                            >
                                                                ×
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Company Info */}
                    {currentStep === 3 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-5 h-5 text-blue-600" />
                                    Company Information
                                </CardTitle>
                                <CardDescription>
                                    Set salary, positions, and company details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium">Salary (₹) *</Label>
                                        <Input
                                            type="number"
                                            name="salary"
                                            value={input.salary}
                                            onChange={changeEventHandler}
                                            placeholder="50000"
                                            min="0"
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Number of Positions *</Label>
                                        <Input
                                            type="number"
                                            name="position"
                                            value={input.position}
                                            onChange={changeEventHandler}
                                            placeholder="2"
                                            min="1"
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium">Company *</Label>
                                        <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-gray-600" />
                                                <span className="text-gray-900 font-medium">
                                                    {userCompany?.name || 'Company not set'}
                                                </span>
                                            </div>
                                            {!userCompany && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    Please update your profile with company information
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </Button>

                        {currentStep < 3 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2"
                            >
                                Next
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Posting Job...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Post Job
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostJob;