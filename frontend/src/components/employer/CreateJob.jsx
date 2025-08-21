// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { JOB_API_END_POINT, CATEGORY_API_END_POINT } from '../../utils/constant';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { Textarea } from '../ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '../ui/select';
// import { FileText, MapPin, Clock, DollarSign, Briefcase, CheckCircle, ArrowLeft, Loader2, Plus, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import Navbar from '../shared/Navbar';
// import { useSelector } from 'react-redux';
// import Footer from '../shared/Footer';

// const CreateJob = () => {
//     const [input, setInput] = useState({
//         title: "",
//         description: "",
//         requirements: [],
//         salaryMin: "",
//         salaryMax: "",
//         experienceMin: "",
//         experienceMax: "",
//         experienceLevel: "",
//         location: "",
//         jobType: "",
//         position: "1",
//         openings: "1",
//         category: ""
//     });
    
//     const [loading, setLoading] = useState(false);
//     const [categories, setCategories] = useState([]);
//     const [currentStep, setCurrentStep] = useState(1);
//     const [requirements, setRequirements] = useState([]);
//     const [newRequirement, setNewRequirement] = useState("");
//     const [userCompany, setUserCompany] = useState(null);
//     const navigate = useNavigate();

//     const { user } = useSelector(store => store.auth);

//     useEffect(() => {
//         if (user && !user.profile.company) {
//             toast.info("Please set up your company profile before posting a job.");
//             navigate('/employer/company/setup');
//         } else if (user && user.profile.company) {
//             setUserCompany(user.profile.company);
//         }
//     }, [user, navigate]);

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`${CATEGORY_API_END_POINT}/all`);
//             if (response.data.success) {
//                 setCategories(response.data.categories);
//             }
//         } catch (error) {
//             console.error("Error fetching categories:", error);
//             toast.error("Failed to load job categories");
//         }
//     };

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     };

//     const selectChangeHandler = (name, value) => {
//         setInput({ ...input, [name]: value });
//     };

//     const addRequirement = () => {
//         if (newRequirement.trim()) {
//             setRequirements([...requirements, newRequirement.trim()]);
//             setNewRequirement("");
//         }
//     };

//     const removeRequirement = (index) => {
//         setRequirements(requirements.filter((_, i) => i !== index));
//     };

//     const nextStep = () => {
//         if (currentStep < 4) {
//             setCurrentStep(currentStep + 1);
//         }
//     };

//     const prevStep = () => {
//         if (currentStep > 1) {
//             setCurrentStep(currentStep - 1);
//         }
//     };

//     const submitHandler = async (e) => {
//         e.preventDefault();
        
//         if (currentStep !== 4) {
//             nextStep();
//             return;
//         }
        
//         // Validate required fields
//         if (!input.salaryMin || !input.salaryMax || !input.openings || 
//             !input.experienceMin || !input.experienceMax || !input.title || 
//             !input.description || !requirements.length || !input.location || 
//             !input.jobType || !input.experienceLevel || !input.category) {
//             toast.error("Please fill in all required fields");
//             return;
//         }
        
//         setLoading(true);
        
//         try {
//             // Prepare the data
//             const jobData = {
//                 title: input.title,
//                 description: input.description,
//                 requirements: requirements,
//                 salary: {
//                     min: parseInt(input.salaryMin),
//                     max: parseInt(input.salaryMax)
//                 },
//                 experience: {
//                     min: parseInt(input.experienceMin),
//                     max: parseInt(input.experienceMax)
//                 },
//                 experienceLevel: input.experienceLevel,
//                 location: input.location,
//                 jobType: input.jobType,
//                 position: parseInt(input.position),
//                 openings: parseInt(input.openings),
//                 category: input.category
//             };
            
//             const response = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
//                 withCredentials: true
//             });
            
//             if (response.data.success) {
//                 toast.success("Job posted successfully!");
//                 navigate('/employer/jobs');
//             }
//         } catch (error) {
//             console.error("Error posting job:", error);
//             toast.error(error.response?.data?.message || "Failed to post job");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const progressPercentage = ((currentStep - 1) / 3) * 100;
    
//     const locations = [
//         "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
//         "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
//         "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
//     ];
    
//     const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Remote"];
    
//     const experienceLevels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

//     return (
//         <div>
//             <Navbar />
//             <div className="max-w-4xl mx-auto my-10 px-4">
//                 <div className="flex items-center justify-between mb-6">
//                     <div>
//                         <h1 className="text-2xl font-bold">Post a New Job</h1>
//                         <p className="text-gray-600">Create a job posting to find the perfect candidate</p>
//                     </div>
//                     <Button 
//                         variant="outline" 
//                         onClick={() => navigate('/employer/jobs')}
//                         className="flex items-center gap-2"
//                     >
//                         <ArrowLeft className="h-4 w-4" />
//                         Back to Jobs
//                     </Button>
//                 </div>
                
//                 <div className="mb-8">
//                     <div className="relative">
//                         <div className="h-2 bg-gray-200 rounded-full">
//                             <div 
//                                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                 style={{ width: `${progressPercentage}%` }}
//                             ></div>
//                         </div>
//                         <div className="flex justify-between mt-2 text-xs text-gray-500">
//                             <span>Job Details</span>
//                             <span>Location & Type</span>
//                             <span>Compensation & Openings</span>
//                             <span>Experience & Requirements</span>
//                         </div>
//                     </div>
//                 </div>

//                 <form onSubmit={submitHandler}>
//                     {/* Step 1: Job Details */}
//                     {currentStep === 1 && (
//                         <div className='bg-white p-8 rounded-lg shadow-md border'>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <FileText className="h-6 w-6 text-blue-600" />
//                                     Job Details
//                                 </CardTitle>
//                                 <CardDescription>Provide the core details of the job.</CardDescription>
//                             </CardHeader>
//                             <CardContent className='mt-4 space-y-6'>
//                                 <div className="grid md:grid-cols-2 gap-6">
//                                     <div className="md:col-span-2">
//                                         <Label>Job Title*</Label>
//                                         <Input 
//                                             name="title"
//                                             value={input.title}
//                                             onChange={changeEventHandler}
//                                             placeholder="e.g., Senior Software Engineer"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="md:col-span-2">
//                                         <Label>Job Description*</Label>
//                                         <Textarea 
//                                             name="description"
//                                             value={input.description}
//                                             onChange={changeEventHandler}
//                                             placeholder="Describe the role, responsibilities, and ideal candidate..."
//                                             className="min-h-[150px]"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="md:col-span-2">
//                                         <Label>Category*</Label>
//                                         <Select
//                                             name="category"
//                                             value={input.category}
//                                             onValueChange={(value) => selectChangeHandler("category", value)}
//                                             required
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select a category" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectGroup>
//                                                     {categories.map(cat => (
//                                                         <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
//                                                     ))}
//                                                 </SelectGroup>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </div>
//                     )}

//                     {/* Step 2: Location & Type */}
//                     {currentStep === 2 && (
//                         <div className='bg-white p-8 rounded-lg shadow-md border'>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <MapPin className="h-6 w-6 text-blue-600" />
//                                     Location & Type
//                                 </CardTitle>
//                                 <CardDescription>Specify where and how the job will be performed.</CardDescription>
//                             </CardHeader>
//                             <CardContent className='mt-4 space-y-6'>
//                                 <div className="grid md:grid-cols-2 gap-6">
//                                     <div>
//                                         <Label>Location*</Label>
//                                         <Select
//                                             name="location"
//                                             value={input.location}
//                                             onValueChange={(value) => selectChangeHandler("location", value)}
//                                             required
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select a location" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectGroup>
//                                                     {locations.map(loc => (
//                                                         <SelectItem key={loc} value={loc}>{loc}</SelectItem>
//                                                     ))}
//                                                 </SelectGroup>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     <div>
//                                         <Label>Job Type*</Label>
//                                         <Select
//                                             name="jobType"
//                                             value={input.jobType}
//                                             onValueChange={(value) => selectChangeHandler("jobType", value)}
//                                             required
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select a job type" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectGroup>
//                                                     {jobTypes.map(type => (
//                                                         <SelectItem key={type} value={type}>{type}</SelectItem>
//                                                     ))}
//                                                 </SelectGroup>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </div>
//                     )}

//                     {/* Step 3: Compensation & Openings */}
//                    {/* Step 3: Compensation & Openings */}
// {currentStep === 3 && (
//     <div className='bg-white p-8 rounded-lg shadow-md border'>
//         <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//                 <DollarSign className="h-6 w-6 text-blue-600" />
//                 Compensation & Openings
//             </CardTitle>
//             <CardDescription>Detail the salary and number of open positions.</CardDescription>
//         </CardHeader>
//         <CardContent className='mt-4 space-y-6'>
//             <div className="grid md:grid-cols-3 gap-6">
//                 <div>
//                     <Label>Salary Range (LPA) - Min*</Label>
//                     <Input
//                         name="salaryMin"
//                         type="number"
//                         value={input.salaryMin}
//                         onChange={changeEventHandler}
//                         placeholder="e.g., 4"
//                         required
//                         min="0"
//                     />
//                 </div>
//                 <div>
//                     <Label>Salary Range (LPA) - Max*</Label>
//                     <Input
//                         name="salaryMax"
//                         type="number"
//                         value={input.salaryMax}
//                         onChange={changeEventHandler}
//                         placeholder="e.g., 8"
//                         required
//                         min="0"
//                     />
//                 </div>
//                 <div>
//                     <Label>No. of Openings*</Label>
//                     <Input
//                         name="openings"
//                         type="number"
//                         value={input.openings}
//                         onChange={changeEventHandler}
//                         placeholder="e.g., 2"
//                         min="1"
//                         required
//                     />
//                 </div>
//             </div>
//         </CardContent>
//     </div>
// )}


//                     {/* Step 4: Experience & Requirements */}
//                     {currentStep === 4 && (
//                         <div className='bg-white p-8 rounded-lg shadow-md border'>
//                             <CardHeader>
//                                 <CardTitle className="flex items-center gap-2">
//                                     <Briefcase className="h-6 w-6 text-blue-600" />
//                                     Experience & Requirements
//                                 </CardTitle>
//                                 <CardDescription>Define the experience level and skill requirements.</CardDescription>
//                             </CardHeader>
//                             <CardContent className='mt-4 space-y-6'>
//                                 <div className="grid md:grid-cols-3 gap-6">
//                                     <div>
//                                         <Label>Experience Level (years)*</Label>
//                                         <Select
//                                             name="experienceLevel"
//                                             value={input.experienceLevel}
//                                             onValueChange={(value) => selectChangeHandler("experienceLevel", value)}
//                                             required
//                                         >
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select experience level" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectGroup>
//                                                     {experienceLevels.map(level => (
//                                                         <SelectItem key={level} value={level}>{level}</SelectItem>
//                                                     ))}
//                                                 </SelectGroup>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     <div>
//                                         <Label>Experience Range - Min (years)*</Label>
//                                         <Input
//                                             name="experienceMin"
//                                             type="number"
//                                             value={input.experienceMin}
//                                             onChange={changeEventHandler}
//                                             placeholder="e.g., 2"
//                                             min="0"
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <Label>Experience Range - Max (years)*</Label>
//                                         <Input
//                                             name="experienceMax"
//                                             type="number"
//                                             value={input.experienceMax}
//                                             onChange={changeEventHandler}
//                                             placeholder="e.g., 5"
//                                             min="0"
//                                             required
//                                         />
//                                     </div>
//                                 </div>
                                
//                                 <div className="mt-6">
//                                     <Label>Requirements*</Label>
//                                     <div className="flex items-center gap-2 mt-2">
//                                         <Input
//                                             value={newRequirement}
//                                             onChange={(e) => setNewRequirement(e.target.value)}
//                                             placeholder="Add a requirement"
//                                             className="flex-1"
//                                         />
//                                         <Button 
//                                             type="button" 
//                                             onClick={addRequirement}
//                                             variant="outline"
//                                         >
//                                             <Plus className="h-4 w-4" />
//                                             Add
//                                         </Button>
//                                     </div>
                                    
//                                     <div className="mt-4 space-y-2">
//                                         {requirements.length === 0 && (
//                                             <p className="text-sm text-gray-500 italic">No requirements added yet. Add at least one requirement.</p>
//                                         )}
                                        
//                                         {requirements.map((req, index) => (
//                                             <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
//                                                 <span>{req}</span>
//                                                 <Button 
//                                                     type="button" 
//                                                     variant="ghost" 
//                                                     size="sm"
//                                                     onClick={() => removeRequirement(index)}
//                                                 >
//                                                     <X className="h-4 w-4 text-gray-500" />
//                                                 </Button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </div>
//                     )}

//                     {/* Navigation Buttons */}
//                     <div className="flex justify-between mt-6">
//                         {currentStep > 1 && (
//                             <Button 
//                                 type="button" 
//                                 variant="outline" 
//                                 onClick={prevStep}
//                             >
//                                 Previous
//                             </Button>
//                         )}
                        
//                         {currentStep < 4 ? (
//                             <Button 
//                                 type="button" 
//                                 onClick={nextStep} 
//                                 className="ml-auto"
//                             >
//                                 Next
//                             </Button>
//                         ) : (
//                             <Button 
//                                 type="submit" 
//                                 disabled={loading || requirements.length === 0} 
//                                 className="ml-auto bg-green-600 hover:bg-green-700"
//                             >
//                                 {loading ? (
//                                     <>
//                                         <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                                         Posting...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <CheckCircle className='mr-2 h-4 w-4' />
//                                         Post Job
//                                     </>
//                                 )}
//                             </Button>
//                         )}
//                     </div>
//                 </form>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default CreateJob;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT, CATEGORY_API_END_POINT } from '../../utils/constant';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '../ui/select';
import { FileText, MapPin, DollarSign, Briefcase, CheckCircle, ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import { useSelector } from 'react-redux';
import Footer from '../shared/Footer';

const CreateJob = () => {
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
        position: "1",
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
        fetchCategories();
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

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        console.log(`Updating ${name} to ${value}`); // Debug log
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const selectChangeHandler = (name, value) => {
        console.log(`Updating ${name} to ${value}`); // Debug log
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

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const validateStep = (step) => {
        console.log(`Validating step ${step} with input:`, input); // Debug log
        switch (step) {
            case 1:
                if (!input.title.trim() || !input.description.trim() || !input.category) {
                    toast.error("Please fill in all required fields in Job Details");
                    return false;
                }
                return true;
            case 2:
                if (!input.location || !input.jobType) {
                    toast.error("Please fill in all required fields in Location & Type");
                    return false;
                }
                return true;
            case 3:
                if (!input.salaryMin || !input.salaryMax || !input.openings) {
                    toast.error("Please fill in all required fields in Compensation & Openings");
                    console.log("Stage 3 Validation Failed - Input Values:", {
                        salaryMin: input.salaryMin,
                        salaryMax: input.salaryMax,
                        openings: input.openings
                    });
                    return false;
                }
                const minSalary = parseFloat(input.salaryMin);
                const maxSalary = parseFloat(input.salaryMax);
                const openingsCount = parseInt(input.openings);
                if (isNaN(minSalary) || isNaN(maxSalary) || isNaN(openingsCount)) {
                    toast.error("Please enter valid numbers in Compensation & Openings");
                    return false;
                }
                if (minSalary > maxSalary) {
                    toast.error("Minimum salary cannot be greater than maximum salary");
                    return false;
                }
                if (openingsCount < 1) {
                    toast.error("Number of openings must be at least 1");
                    return false;
                }
                return true;
            case 4:
                if (!input.experienceLevel || !input.experienceMin || !input.experienceMax || !requirements.length) {
                    toast.error("Please fill in all required fields in Experience & Requirements");
                    return false;
                }
                if (parseFloat(input.experienceMin) > parseFloat(input.experienceMax)) {
                    toast.error("Minimum experience cannot be greater than maximum experience");
                    return false;
                }
                return true;
            default:
                return false;
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(`Submitting form at step ${currentStep} with input:`, input, "requirements:", requirements); // Debug log

        // Ensure state is up-to-date before validation
        setInput(prev => prev); // Force re-render to sync state

        if (currentStep < 4) {
            if (validateStep(currentStep)) {
                nextStep();
            }
            return;
        }

        // Validate all steps only on final submission
        for (let step = 1; step <= 4; step++) {
            if (!validateStep(step)) {
                return;
            }
        }

        setLoading(true);

        try {
            const jobData = {
                title: input.title,
                description: input.description,
                requirements: requirements,
                salary: {
                    min: parseInt(input.salaryMin),
                    max: parseInt(input.salaryMax)
                },
                experience: {
                    min: parseInt(input.experienceMin),
                    max: parseInt(input.experienceMax)
                },
                experienceLevel: input.experienceLevel,
                location: input.location,
                jobType: input.jobType,
                position: parseInt(input.position),
                openings: parseInt(input.openings),
                category: input.category
            };

            console.log("Sending job data to backend:", jobData);

            const response = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success("Job posted successfully!");
                navigate('/employer/jobs');
            }
        } catch (error) {
            console.error("Error posting job:", error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    const progressPercentage = ((currentStep - 1) / 3) * 100;

    const locations = [
        "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
        "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
        "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
    ];

    const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Remote"];

    const experienceLevels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Post a New Job</h1>
                        <p className="text-gray-600">Create a job posting to find the perfect candidate</p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/employer/jobs')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Jobs
                    </Button>
                </div>

                <div className="mb-8">
                    <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Job Details</span>
                            <span>Location & Type</span>
                            <span>Compensation & Openings</span>
                            <span>Experience & Requirements</span>
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
                                            name="category"
                                            value={input.category}
                                            onValueChange={(value) => selectChangeHandler("category", value)}
                                            required
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
                            </CardContent>
                        </div>
                    )}

                    {/* Step 2: Location & Type */}
                    {currentStep === 2 && (
                        <div className='bg-white p-8 rounded-lg shadow-md border'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                    Location & Type
                                </CardTitle>
                                <CardDescription>Specify where and how the job will be performed.</CardDescription>
                            </CardHeader>
                            <CardContent className='mt-4 space-y-6'>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Location*</Label>
                                        <Select
                                            name="location"
                                            value={input.location}
                                            onValueChange={(value) => selectChangeHandler("location", value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {locations.map(loc => (
                                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Job Type*</Label>
                                        <Select
                                            name="jobType"
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
                    )}

                    {/* Step 3: Compensation & Openings */}
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
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    {/* Step 4: Experience & Requirements */}
                    {currentStep === 4 && (
                        <div className='bg-white p-8 rounded-lg shadow-md border'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-6 w-6 text-blue-600" />
                                    Experience & Requirements
                                </CardTitle>
                                <CardDescription>Define the experience level and skill requirements.</CardDescription>
                            </CardHeader>
                            <CardContent className='mt-4 space-y-6'>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <Label>Experience Level (years)*</Label>
                                        <Select
                                            name="experienceLevel"
                                            value={input.experienceLevel}
                                            onValueChange={(value) => selectChangeHandler("experienceLevel", value)}
                                            required
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
                                        <Label>Experience Range - Min (years)*</Label>
                                        <Input
                                            name="experienceMin"
                                            type="number"
                                            value={input.experienceMin}
                                            onChange={changeEventHandler}
                                            placeholder="e.g., 2"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Experience Range - Max (years)*</Label>
                                        <Input
                                            name="experienceMax"
                                            type="number"
                                            value={input.experienceMax}
                                            onChange={changeEventHandler}
                                            placeholder="e.g., 5"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Label>Requirements*</Label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input
                                            value={newRequirement}
                                            onChange={(e) => setNewRequirement(e.target.value)}
                                            placeholder="Add a requirement"
                                            className="flex-1"
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={addRequirement}
                                            variant="outline"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add
                                        </Button>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {requirements.length === 0 && (
                                            <p className="text-sm text-gray-500 italic">No requirements added yet. Add at least one requirement.</p>
                                        )}
                                        {requirements.map((req, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                                <span>{req}</span>
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => removeRequirement(index)}
                                                >
                                                    <X className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        {currentStep > 1 && (
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={prevStep}
                            >
                                Previous
                            </Button>
                        )}
                        
                        {currentStep < 4 ? (
                            <Button 
                                type="submit" 
                                className="ml-auto"
                                disabled={loading}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                disabled={loading || requirements.length === 0} 
                                className="ml-auto bg-green-600 hover:bg-green-700"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className='mr-2 h-4 w-4' />
                                        Post Job
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default CreateJob;
