import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {Select,SelectContent,SelectGroup,SelectItem,SelectTrigger,SelectValue,} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT, CATEGORY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const locations = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];

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
        company: "",
        category: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const { companies = [] } = useSelector(store => store.company || {});
    const { user } = useSelector(store => store.user || {});

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

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const requiredFields = [
            'title', 'description', 'requirements', 'salary', 
            'experienceLevel', 'location', 'jobType', 
            'position', 'company', 'category'
        ];
        
        const missingFields = requiredFields.filter(field => !input[field]);
        
        if (missingFields.length > 0) {
            toast.error(`Missing required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            setLoading(true);
            
            const jobData = {
                ...input,
                requirements: input.requirements.split(",").map(req => req.trim()),
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
                toast.success(res.data.message);
                navigate("/employer/jobs");
            }
        } catch (error) {
            console.error("Job posting error:", error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Title */}
                        <div className="col-span-2">
                            <Label>Title*</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <Label>Description*</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>

                        {/* Requirements */}
                        <div className="col-span-2">
                            <Label>Requirements (comma separated)*</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                placeholder="JavaScript, React, Node.js"
                                required
                            />
                        </div>

                        {/* Salary */}
                        <div>
                            <Label>Salary*</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                min="0"
                                required
                            />
                        </div>

                        {/* Experience Level */}
                        <div>
                            <Label>Experience (years)*</Label>
                            <Input
                                type="number"
                                name="experienceLevel"
                                value={input.experienceLevel}
                                onChange={changeEventHandler}
                                min="0"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <Label>Location*</Label>
                            <Select 
                                onValueChange={(value) => selectChangeHandler("location", value)}
                                value={input.location}
                                required
                            >
                                <SelectTrigger>
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

                        {/* Job Type */}
                        <div>
                            <Label>Job Type*</Label>
                            <Select 
                                onValueChange={(value) => selectChangeHandler("jobType", value)}
                                value={input.jobType}
                                required
                            >
                                <SelectTrigger>
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

                        {/* Positions */}
                        <div>
                            <Label>Positions*</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                min="1"
                                required
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <Label>Company*</Label>
                            <Select 
                                onValueChange={(value) => selectChangeHandler("company", value)}
                                value={input.company}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map(company => (
                                        <SelectItem key={company._id} value={company._id}>
                                            {company.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div>
                            <Label>Category*</Label>
                            <Select 
                                onValueChange={(value) => selectChangeHandler("category", value)}
                                value={input.category}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
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

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        className="w-full my-4" 
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : null}
                        {loading ? "Posting..." : "Post Job"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default PostJob;
