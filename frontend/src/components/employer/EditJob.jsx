
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT, CATEGORY_API_END_POINT } from '../../utils/constant';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '../ui/select';
import { FileText, MapPin, DollarSign, Briefcase, CheckCircle, ArrowLeft, Plus, X, Building } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import { useSelector } from 'react-redux';
import Footer from '../shared/Footer';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatLocationForDisplay } from '../../utils/locationUtils';


const EditJob = () => {
    const { id } = useParams();
    const [input, setInput] = useState({

        title: "",
        description: "",
        salaryMin: "",
        salaryMax: "",
        experienceMin: "",
        experienceMax: "",
        experienceLevel: "",
        location: "",
        jobType: "",
        position: "1",
        openings: "1",
        category: "",
        skills: "",
        benefits: "",
        workMode: "",
        deadline: ""

    });
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [newRequirement, setNewRequirement] = useState("");
    const [userCompany, setUserCompany] = useState(null);
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (user && !user.profile.company) {
            toast.info("Please set up your company profile before editing a job.");
            navigate('/employer/company/setup');
        } else if (user && user.profile.company) {
            setUserCompany(user.profile.company);
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchCategories();
        fetchJobData();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${CATEGORY_API_END_POINT}/all`);
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Could not load job categories. Please try again.");
        }
    };

    const fetchJobData = async () => {
        try {
            setFetching(true);
            const jobResponse = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
            if (jobResponse.data.success) {
                const job = jobResponse.data.job;
                setInput({
                    title: job.title || "",
                    description: job.description || "",
                    salaryMin: job.salary?.min?.toString() || "",
                    salaryMax: job.salary?.max?.toString() || "",
                    experienceLevel: job.experienceLevel || "",
                    experienceMin: job.experience?.min?.toString() || "",
                    experienceMax: job.experience?.max?.toString() || "",
                    location: typeof job.location === 'object' ? formatLocationForDisplay(job.location) : job.location || "",
                    jobType: job.jobType || "",
                    position: job.position?.toString() || "",
                    openings: job.openings?.toString() || "",
                    category: job.category?._id || "",
                    skills: job.skills?.join(", ") || "",
                    benefits: job.benefits?.join(", ") || "",
                    workMode: job.workMode || "",
                    deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ""
                });
                setRequirements(job.requirements || []);
            }
        } catch (error) {
            console.error("Error fetching job data:", error);
            toast.error("Could not load job information. Please try again.");
        } finally {
            setFetching(false);
        }
    };

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const selectChangeHandler = (name, value) => {
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setRequirements(prev => [...prev, newRequirement.trim()]);
            setNewRequirement("");
        }
    };

    const removeRequirement = (index) => {
        setRequirements(prev => prev.filter((_, i) => i !== index));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
    
        if (!input.title || !input.description || !input.category) {
            toast.error("Job title, description, and category are required");
            return;
        }

        setLoading(true);

        try {
            
            const updatedInput = {
                ...input,
                location: input.location || "Remote",
                jobType: input.jobType || "Full-time",
                salaryMin: input.salaryMin || "0",
                salaryMax: input.salaryMax || "0",
                openings: input.openings || "1",
                experienceLevel: input.experienceLevel || "Entry Level",
                experienceMin: input.experienceMin || "0",
                experienceMax: input.experienceMax || "5"
            };
            
           
            let salaryMin = parseInt(updatedInput.salaryMin);
            let salaryMax = parseInt(updatedInput.salaryMax);
            
         
            if (salaryMin > salaryMax) {
                const temp = salaryMin;
                salaryMin = salaryMax;
                salaryMax = temp;
            }
            
            const expMin = parseInt(updatedInput.experienceMin);
            const expMax = parseInt(updatedInput.experienceMax);
            const openingsCount = parseInt(updatedInput.openings);
            
    
            const jobData = {
                title: updatedInput.title.trim(),
                description: updatedInput.description.trim(),
                requirements: requirements.length > 0 ? requirements : ["No specific requirements"],
                salary: {
                    min: salaryMin,
                    max: salaryMax
                },
                experience: {
                    min: expMin,
                    max: expMax
                },
                experienceLevel: updatedInput.experienceLevel,
                location: updatedInput.location,
                jobType: updatedInput.jobType,
                workMode: updatedInput.workMode || "On-site",
                position: parseInt(updatedInput.position) || 1,
                openings: openingsCount,
                category: updatedInput.category,
                skills: updatedInput.skills ? updatedInput.skills.split(',').map(s => s.trim()).filter(s => s) : [],
                benefits: updatedInput.benefits ? updatedInput.benefits.split(',').map(b => b.trim()).filter(b => b) : [],
                deadline: updatedInput.deadline ? new Date(updatedInput.deadline) : null
            };

            console.log("Sending job data to backend:", jobData);

            const response = await axios.put(`${JOB_API_END_POINT}/update/${id}`, jobData, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success("Job updated successfully!");
                navigate('/employer/jobs');
            }
        } catch (error) {
            console.error("Error updating job:", error);
            toast.error(error.response?.data?.message || "Failed to update job");
        } finally {
            setLoading(false);
        }
    };

    const locations = [
        "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
        "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
        "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
    ];

    const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"];
    
    const workModes = ["On-site", "Remote", "Hybrid"];

    const experienceLevels = ["Fresher", "Entry Level", "Mid Level", "Senior Level"];

    if (fetching) {
        return (
            <div>
                <Navbar />
                <div className='flex items-center justify-center w-screen my-5'>
                    <div className='text-center'>
                        <LoadingSpinner size={40} />
                        <p className="mt-2">Loading job data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            <Navbar />
            <div className="max-w-6xl mx-auto py-12 px-6">
         
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl transform rotate-1"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                                    <FileText className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Edit Job Posting
                                    </h1>
                                    <p className="text-gray-600 text-lg mt-1">
                                        Transform your job listing to attract top talent
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => navigate('/employer/jobs')} 
                                variant="outline" 
                                className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 px-6 py-3"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Jobs
                            </Button>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler} className="space-y-10">
           
                    <div className='relative group'>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                        <div className='relative bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-purple-200 ml-4"></div>
                            </div>
                            <CardContent className="px-0 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Job Title*</Label>
                                    <Input 
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., Senior Software Engineer"
                                        required
                                        className="h-14 text-lg border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-300"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Job Description*</Label>
                                    <Textarea 
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        placeholder="Describe the role, responsibilities, and ideal candidate..."
                                        className="min-h-[240px] text-lg border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-300 resize-y"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Category*</Label>
                                    <Select
                                        value={input.category}
                                        onValueChange={(value) => selectChangeHandler("category", value)}
                                        required
                                    >
                                        <SelectTrigger className="h-14 text-lg border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categories.map(category => (
                                                    <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        </div>
                    </div>

             
                    <div className='relative group'>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                        <div className='relative bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Location & Job Type</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-blue-200 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Location*</Label>
                                    <Select
                                        value={input.location}
                                        onValueChange={(value) => selectChangeHandler("location", value)}
                                        required
                                    >
                                        <SelectTrigger className="h-14 text-lg border-2 border-gray-200 focus:border-green-400 rounded-xl">
                                            <SelectValue placeholder="Select a location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {locations.map(location => (
                                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Job Type*</Label>
                                    <Select
                                        value={input.jobType}
                                        onValueChange={(value) => selectChangeHandler("jobType", value)}
                                        required
                                    >
                                        <SelectTrigger className="h-14 text-lg border-2 border-gray-200 focus:border-green-400 rounded-xl">
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
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Work Mode*</Label>
                                    <Select
                                        value={input.workMode}
                                        onValueChange={(value) => selectChangeHandler("workMode", value)}
                                        required
                                    >
                                        <SelectTrigger className="h-14 text-lg border-2 border-gray-200 focus:border-green-400 rounded-xl">
                                            <SelectValue placeholder="Select work mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {workModes.map(mode => (
                                                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Application Deadline</Label>
                                    <Input 
                                        type="date" 
                                        name="deadline" 
                                        value={input.deadline} 
                                        onChange={changeEventHandler} 
                                        min={new Date().toISOString().split('T')[0]}
                                        className="h-14 text-lg border-2 border-gray-200 focus:border-green-400 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                   
                    <div className='relative group'>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                        <div className='relative bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Compensation & Openings</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-yellow-200 to-orange-200 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Minimum Salary*</Label>
                                    <Input 
                                        type="number" 
                                        name="salaryMin" 
                                        value={input.salaryMin} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 30000"
                                        min="0"
                                        className="h-14 text-lg border-2 border-gray-200 focus:border-yellow-400 rounded-xl transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Maximum Salary*</Label>
                                    <Input 
                                        type="number" 
                                        name="salaryMax" 
                                        value={input.salaryMax} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 50000"
                                        min={input.salaryMin || 0}
                                        className="h-14 text-lg border-2 border-gray-200 focus:border-yellow-400 rounded-xl transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Number of Positions*</Label>
                                    <Input 
                                        type="number" 
                                        name="position" 
                                        value={input.position} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 1"
                                        min="1"
                                        className="h-14 text-lg border-2 border-gray-200 focus:border-yellow-400 rounded-xl transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <Label className="text-lg font-semibold text-gray-700 mb-3 block">Number of Openings*</Label>
                                    <Input 
                                        type="number" 
                                        name="openings" 
                                        value={input.openings} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 1"
                                        min="1"
                                        className="h-14 text-lg border-2 border-gray-200 focus:border-yellow-400 rounded-xl transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300'>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                                Experience & Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Experience Level*</Label>
                                    <Select
                                        value={input.experienceLevel}
                                        onValueChange={(value) => selectChangeHandler("experienceLevel", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select experience level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Fresher">Fresher (0 years)</SelectItem>
                                                <SelectItem value="Entry Level">Entry Level (0-1 years)</SelectItem>
                                                <SelectItem value="Mid Level">Mid Level (2-5 years)</SelectItem>
                                                <SelectItem value="Senior Level">Senior Level (5+ years)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Experience Min (years)*</Label>
                                    <Input 
                                        type="number" 
                                        name="experienceMin" 
                                        value={input.experienceMin} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 0"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <Label>Experience Max (years)*</Label>
                                    <Input 
                                        type="number" 
                                        name="experienceMax" 
                                        value={input.experienceMax} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 1"
                                        min={input.experienceMin || 0}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Requirements* (Point-based format)</Label>
                                    <div className="flex gap-2 mb-2">
                                        <Input 
                                            value={newRequirement}
                                            onChange={(e) => setNewRequirement(e.target.value)}
                                            placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addRequirement();
                                                }
                                            }}
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
                            </div>
                        </CardContent>
                    </div>

             
                    <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300'>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-6 w-6 text-blue-600" />
                                Additional Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-0 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Required Skills (comma-separated)</Label>
                                    <Input 
                                        name="skills"
                                        value={input.skills}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., JavaScript, React, Node.js"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                                </div>
                                <div>
                                    <Label>Benefits (comma-separated)</Label>
                                    <Input 
                                        name="benefits"
                                        value={input.benefits}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., Health Insurance, Flexible Hours, Remote Work"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple benefits with commas</p>
                                </div>
                            </div>
                        </CardContent>
                    </div>

                 
                    <div className='relative group'>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                        <div className="relative bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => navigate('/employer/jobs')}
                                    className="w-full lg:w-auto px-10 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-gray-500 hover:bg-gray-50 rounded-xl transition-all duration-300"
                                >
                                    <ArrowLeft className="mr-3 h-5 w-5" />
                                    Cancel Changes
                                </Button>
                                
                                <Button 
                                    type="submit" 
                                    disabled={loading || requirements.length === 0} 
                                    className="w-full lg:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl rounded-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <LoadingSpinner size={24} color="#ffffff" />
                                            <span className="ml-3">Updating Job...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <CheckCircle className='mr-3 h-6 w-6' />
                                            Update Job Posting
                                        </>
                                    )}
                                </Button>
                            </div>
                            {requirements.length === 0 && (
                                <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                    <p className="text-amber-700 text-center font-semibold">
                                        ⚠️ Please add at least one requirement to update the job
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditJob;