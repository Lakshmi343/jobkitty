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
        category: ""
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
            toast.error("Failed to load job categories");
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
                    location: job.location || "",
                    jobType: job.jobType || "",
                    position: job.position?.toString() || "",
                    openings: job.openings?.toString() || "",
                    category: job.category?._id || ""
                });
                setRequirements(job.requirements || []);
            }
        } catch (error) {
            console.error("Error fetching job data:", error);
            toast.error("Failed to fetch job data");
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
        
        // Basic validation
        if (!input.title || !input.description || !input.category) {
            toast.error("Job title, description, and category are required");
            return;
        }

        setLoading(true);

        try {
            // Set default values for all fields before submission
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
            
            // Ensure all values are properly formatted
            let salaryMin = parseInt(updatedInput.salaryMin);
            let salaryMax = parseInt(updatedInput.salaryMax);
            
            // If min > max, swap the values
            if (salaryMin > salaryMax) {
                const temp = salaryMin;
                salaryMin = salaryMax;
                salaryMax = temp;
            }
            
            const expMin = parseInt(updatedInput.experienceMin);
            const expMax = parseInt(updatedInput.experienceMax);
            const openingsCount = parseInt(updatedInput.openings);
            
            // Create the job data object with all required fields and defaults
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
                position: parseInt(updatedInput.position) || 1,
                openings: openingsCount,
                category: updatedInput.category
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

    const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Remote"];

    const experienceLevels = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Manager", "Executive"];

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
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Job</h1>
                        <p className="text-gray-600">Update your job posting details</p>
                    </div>
                    <Button 
                        onClick={() => navigate('/employer/jobs')} 
                        variant="outline" 
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Jobs
                    </Button>
                </div>

                <form onSubmit={submitHandler}>
                    {/* Job Details */}
                    <div className='bg-white p-8 rounded-lg shadow-md border mb-6'>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-6 w-6 text-blue-600" />
                                Job Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label>Job Title*</Label>
                                    <Input 
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., Senior Software Engineer"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Job Description*</Label>
                                    <Textarea 
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        placeholder="Describe the role, responsibilities, and ideal candidate..."
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Category*</Label>
                                    <Select
                                        value={input.category}
                                        onValueChange={(value) => selectChangeHandler("category", value)}
                                        required
                                    >
                                        <SelectTrigger>
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

                    {/* Location & Job Type */}
                    <div className='bg-white p-8 rounded-lg shadow-md border mb-6'>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-6 w-6 text-blue-600" />
                                Location & Job Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Location*</Label>
                                    <Select
                                        value={input.location}
                                        onValueChange={(value) => selectChangeHandler("location", value)}
                                        required
                                    >
                                        <SelectTrigger>
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
                                    <Label>Job Type*</Label>
                                    <Select
                                        value={input.jobType}
                                        onValueChange={(value) => selectChangeHandler("jobType", value)}
                                        required
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

                    {/* Compensation & Openings */}
                    <div className='bg-white p-8 rounded-lg shadow-md border mb-6'>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                                Compensation & Openings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Minimum Salary*</Label>
                                    <Input 
                                        type="number" 
                                        name="salaryMin" 
                                        value={input.salaryMin} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 30000"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <Label>Maximum Salary*</Label>
                                    <Input 
                                        type="number" 
                                        name="salaryMax" 
                                        value={input.salaryMax} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 50000"
                                        min={input.salaryMin || 0}
                                    />
                                </div>
                                <div>
                                    <Label>Number of Positions*</Label>
                                    <Input 
                                        type="number" 
                                        name="position" 
                                        value={input.position} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 1"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <Label>Number of Openings*</Label>
                                    <Input 
                                        type="number" 
                                        name="openings" 
                                        value={input.openings} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 1"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </div>

                    {/* Experience & Requirements */}
                    <div className='bg-white p-8 rounded-lg shadow-md border mb-6'>
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                                Experience & Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                {experienceLevels.map(level => (
                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Minimum Experience (years)*</Label>
                                    <Input 
                                        type="number" 
                                        name="experienceMin" 
                                        value={input.experienceMin} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 2"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <Label>Maximum Experience (years)*</Label>
                                    <Input 
                                        type="number" 
                                        name="experienceMax" 
                                        value={input.experienceMax} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g., 5"
                                        min={input.experienceMin || 0}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label>Requirements*</Label>
                                    <div className="flex gap-2 mb-2">
                                        <Input 
                                            value={newRequirement}
                                            onChange={(e) => setNewRequirement(e.target.value)}
                                            placeholder="Add a requirement"
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={addRequirement}
                                            variant="outline"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {requirements.map((req, index) => (
                                            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                                <span>{req}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeRequirement(index)}
                                                    className="text-gray-500 hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </div>

                    <div className="flex justify-between mt-6">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate('/employer/jobs')}
                        >
                            Cancel
                        </Button>
                        
                        <Button 
                            type="submit" 
                            disabled={loading || requirements.length === 0} 
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner size={20} color="#ffffff" />
                                    <span className="ml-2">Updating...</span>
                                </div>
                            ) : (
                                <>
                                    <CheckCircle className='mr-2 h-4 w-4' />
                                    Update Job
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditJob;