// import React, { useState, useEffect } from 'react';
// import Navbar from '../shared/Navbar';
// import { Label } from '../ui/label';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { useSelector } from 'react-redux';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import axios from 'axios';
// import { JOB_API_END_POINT, CATEGORY_API_END_POINT, USER_API_END_POINT } from '../../utils/constant';
// import { toast } from 'sonner';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Loader2, Building } from 'lucide-react';

// const locations = [
//     "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
//     "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
//     "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
// ];

// const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];

// const EditJob = () => {
//     const { id } = useParams();
//     const [input, setInput] = useState({
//         title: "",
//         description: "",
//         requirements: "",
//         salaryMin: "",
//         salaryMax: "",
//         experienceLevel: "",
//         expMin: "",
//         expMax: "",
//         location: "",
//         jobType: "",
//         position: "",
//         openings: "",
//         category: ""
//     });
    
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);
//     const [categories, setCategories] = useState([]);
//     const [userCompany, setUserCompany] = useState(null);
//     const navigate = useNavigate();

//     const { user } = useSelector(store => store.auth || {});

//     useEffect(() => {
//         const fetchUserCompany = async () => {
//             try {
//                 if (user?._id) {
//                     const response = await axios.get(`${USER_API_END_POINT}/profile`, {
//                         withCredentials: true
//                     });
//                     if (response.data.success && response.data.user.profile?.company) {
//                         setUserCompany(response.data.user.profile.company);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching user company:", error);
//             }
//         };
//         fetchUserCompany();
//     }, [user]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setFetching(true);
//                 const categoriesResponse = await axios.get(`${CATEGORY_API_END_POINT}/get`);
//                 if (categoriesResponse.data.success) {
//                     setCategories(categoriesResponse.data.categories);
//                 }
//                 const jobResponse = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
//                 if (jobResponse.data.success) {
//                     const job = jobResponse.data.job;
//                     setInput({
//                         title: job.title || "",
//                         description: job.description || "",
//                         requirements: job.requirements ? job.requirements.join(", ") : "",
//                         salaryMin: job.salary?.min?.toString() || "",
//                         salaryMax: job.salary?.max?.toString() || "",
//                         experienceLevel: job.experienceLevel?.toString() || "",
//                         expMin: job.experience?.min?.toString() || "",
//                         expMax: job.experience?.max?.toString() || "",
//                         location: job.location || "",
//                         jobType: job.jobType || "",
//                         position: job.position?.toString() || "",
//                         openings: job.openings?.toString() || "",
//                         category: job.category?._id || ""
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 toast.error("Failed to fetch job data");
//             } finally {
//                 setFetching(false);
//             }
//         };
//         fetchData();
//     }, [id]);

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     };

//     const selectChangeHandler = (name, value) => {
//         setInput({ ...input, [name]: value });
//     };

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const requiredFields = ['title','description','requirements','salaryMin','salaryMax','experienceLevel','expMin','expMax','location','jobType','position','category'];
//         const missingFields = requiredFields.filter(field => !input[field]);
//         if (missingFields.length > 0) {
//             toast.error(`Missing required fields: ${missingFields.join(', ')}`);
//             return;
//         }
//         if (!userCompany) {
//             toast.error("Company information is required. Please update your profile with company details.");
//             return;
//         }
//         try {
//             setLoading(true);
//             const jobData = {
//                 title: input.title,
//                 description: input.description,
//                 requirements: input.requirements.split(",").map(req => req.trim()),
//                 salary: { min: Number(input.salaryMin), max: Number(input.salaryMax) },
//                 experience: { min: Number(input.expMin), max: Number(input.expMax) },
//                 location: input.location,
//                 jobType: input.jobType,
//                 experienceLevel: Number(input.experienceLevel),
//                 position: Number(input.position),
//                 openings: input.openings ? Number(input.openings) : undefined,
//                 category: input.category
//             };
//             const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, jobData, {
//                 headers: { 'Content-Type': 'application/json' },
//                 withCredentials: true
//             });
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 navigate("/employer/jobs");
//             }
//         } catch (error) {
//             console.error("Job update error:", error);
//             toast.error(error.response?.data?.message || "Failed to update job");
//         } finally {
//             setLoading(false);
//         }
//     }

//     if (fetching) {
//         return (
//             <div>
//                 <Navbar />
//                 <div className='flex items-center justify-center w-screen my-5'>
//                     <div className='text-center'>
//                         <Loader2 className='mr-2 h-8 w-8 animate-spin mx-auto mb-4' />
//                         <p>Loading job data...</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <Navbar />
//             <div className='flex items-center justify-center w-screen my-5'>
//                 <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
//                     <h2 className='text-xl font-semibold mb-6 text-center'>Edit Job</h2>
//                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                         <div className="md:col-span-2">
//                             <Label>Title*</Label>
//                             <Input name="title" value={input.title} onChange={changeEventHandler} />
//                         </div>
//                         <div className="md:col-span-2">
//                             <Label>Description*</Label>
//                             <Input name="description" value={input.description} onChange={changeEventHandler} />
//                         </div>
//                         <div className="md:col-span-2">
//                             <Label>Requirements (comma separated)*</Label>
//                             <Input name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="JavaScript, React, Node.js" />
//                         </div>
//                         <div>
//                             <Label>Salary Min*</Label>
//                             <Input type="number" name="salaryMin" value={input.salaryMin} onChange={changeEventHandler} min="0" />
//                         </div>
//                         <div>
//                             <Label>Salary Max*</Label>
//                             <Input type="number" name="salaryMax" value={input.salaryMax} onChange={changeEventHandler} min={input.salaryMin || 0} />
//                         </div>
//                         <div>
//                             <Label>Experience Level (years)*</Label>
//                             <Input type="number" name="experienceLevel" value={input.experienceLevel} onChange={changeEventHandler} min="0" />
//                         </div>
//                         <div>
//                             <Label>Experience Min*</Label>
//                             <Input type="number" name="expMin" value={input.expMin} onChange={changeEventHandler} min="0" />
//                         </div>
//                         <div>
//                             <Label>Experience Max*</Label>
//                             <Input type="number" name="expMax" value={input.expMax} onChange={changeEventHandler} min={input.expMin || 0} />
//                         </div>
//                         <div>
//                             <Label>Location*</Label>
//                             <Select onValueChange={(value) => selectChangeHandler("location", value)} value={input.location}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select location" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {locations.map(location => (
//                                         <SelectItem key={location} value={location}>{location}</SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div>
//                             <Label>Job Type*</Label>
//                             <Select onValueChange={(value) => selectChangeHandler("jobType", value)} value={input.jobType}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select job type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {jobTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div>
//                             <Label>Positions*</Label>
//                             <Input type="number" name="position" value={input.position} onChange={changeEventHandler} min="1" />
//                         </div>
//                         <div>
//                             <Label>Openings</Label>
//                             <Input type="number" name="openings" value={input.openings} onChange={changeEventHandler} min="0" />
//                         </div>
//                         <div className="md:col-span-2">
//                             <Label>Company</Label>
//                             <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
//                                 <div className="flex items-center gap-2">
//                                     <Building className="w-4 h-4 text-gray-600" />
//                                     <span className="text-gray-900 font-medium">{userCompany?.name || 'Company not set'}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div>
//                             <Label>Category*</Label>
//                             <Select onValueChange={(value) => selectChangeHandler("category", value)} value={input.category}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select category" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {categories.map(category => (<SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                     <Button type="submit" className="w-full my-4" disabled={loading}>
//                         {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
//                         {loading ? "Updating..." : "Update Job"}
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default EditJob; 



import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT, CATEGORY_API_END_POINT, USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Building } from 'lucide-react';

const locations = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];

const EditJob = () => {
    const { id } = useParams();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
        experienceLevel: "",
        expMin: "",
        expMax: "",
        location: "",
        jobType: "",
        position: "",
        openings: "",
        category: ""
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState([]);
    const [userCompany, setUserCompany] = useState(null);
    const navigate = useNavigate();

    const { user } = useSelector(store => store.auth || {});

    useEffect(() => {
        const fetchUserCompany = async () => {
            try {
                if (user?._id) {
                    const response = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
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
        const fetchData = async () => {
            try {
                setFetching(true);
                const categoriesResponse = await axios.get(`${CATEGORY_API_END_POINT}/get`);
                if (categoriesResponse.data.success) setCategories(categoriesResponse.data.categories);

                const jobResponse = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
                if (jobResponse.data.success) {
                    const job = jobResponse.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: job.requirements ? job.requirements.join(", ") : "",
                        salaryMin: job.salary?.min?.toString() || "",
                        salaryMax: job.salary?.max?.toString() || "",
                        experienceLevel: job.experienceLevel || "",
                        expMin: job.experience?.min?.toString() || "",
                        expMax: job.experience?.max?.toString() || "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        position: job.position?.toString() || "",
                        openings: job.openings?.toString() || "",
                        category: job.category?._id || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch job data");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id]);

    const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
    const selectChangeHandler = (name, value) => setInput({ ...input, [name]: value });

    const submitHandler = async (e) => {
        e.preventDefault();
        const requiredFields = ['title','description','requirements','salaryMin','salaryMax','experienceLevel','expMin','expMax','location','jobType','position','category'];
        const missingFields = requiredFields.filter(field => !input[field]);
        if (missingFields.length) return toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        if (!userCompany) return toast.error("Company info is required in profile.");

        try {
            setLoading(true);
            const jobData = {
                title: input.title,
                description: input.description,
                requirements: input.requirements.split(",").map(req => req.trim()),
                salary: { min: Number(input.salaryMin), max: Number(input.salaryMax) },
                experience: { min: Number(input.expMin), max: Number(input.expMax) },
                location: input.location,
                jobType: input.jobType,
                experienceLevel: input.experienceLevel,
                position: Number(input.position),
                openings: input.openings ? Number(input.openings) : undefined,
                category: input.category
            };
            const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, jobData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/employer/jobs");
            }
        } catch (error) {
            console.error("Job update error:", error);
            toast.error(error.response?.data?.message || "Failed to update job");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div>
                
                <div className='flex items-center justify-center w-screen my-10'>
                    <div className='text-center'>
                        <Loader2 className='mx-auto h-10 w-10 animate-spin mb-3' />
                        <p className='text-gray-700 text-lg'>Loading job data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className='flex justify-center w-full py-8 bg-gray-50 min-h-screen'>
                <form onSubmit={submitHandler} className='w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 space-y-6'>
                    <h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>Edit Job</h2>

                    {/* Job Details */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className="md:col-span-2">
                            <Label>Title*</Label>
                            <Input name="title" value={input.title} onChange={changeEventHandler} className="mt-1" />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description*</Label>
                            <Input name="description" value={input.description} onChange={changeEventHandler} className="mt-1" />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Requirements*</Label>
                            <Input name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="JavaScript, React, Node.js" className="mt-1" />
                        </div>
                        <div>
                            <Label>Salary Min*</Label>
                            <Input type="number" name="salaryMin" value={input.salaryMin} onChange={changeEventHandler} min="0" className="mt-1" />
                        </div>
                        <div>
                            <Label>Salary Max*</Label>
                            <Input type="number" name="salaryMax" value={input.salaryMax} onChange={changeEventHandler} min={input.salaryMin || 0} className="mt-1" />
                        </div>
                        <div>
                            <Label>Experience Level*</Label>
                            <Select 
                                value={input.experienceLevel} 
                                onValueChange={(value) => selectChangeHandler("experienceLevel", value)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fresher">Fresher (0 years)</SelectItem>
                                    <SelectItem value="Entry Level">Entry Level (0-1 years)</SelectItem>
                                    <SelectItem value="Mid Level">Mid Level (2-5 years)</SelectItem>
                                    <SelectItem value="Senior Level">Senior Level (5+ years)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience Min (years)*</Label>
                            <Input type="number" name="expMin" value={input.expMin} onChange={changeEventHandler} min="0" placeholder="e.g., 0" className="mt-1" />
                        </div>
                        <div>
                            <Label>Experience Max (years)*</Label>
                            <Input type="number" name="expMax" value={input.expMax} onChange={changeEventHandler} min={input.expMin || 0} placeholder="e.g., 1" className="mt-1" />
                        </div>
                        <div>
                            <Label>Location*</Label>
                            <Select onValueChange={(value) => selectChangeHandler("location", value)} value={input.location}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Job Type*</Label>
                            <Select onValueChange={(value) => selectChangeHandler("jobType", value)} value={input.jobType}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Positions*</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} min="1" className="mt-1" />
                        </div>
                        <div>
                            <Label>Openings</Label>
                            <Input type="number" name="openings" value={input.openings} onChange={changeEventHandler} min="0" className="mt-1" />
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className='p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3'>
                        <Building className="w-5 h-5 text-gray-600" />
                        <span className='text-gray-800 font-medium'>{userCompany?.name || 'Company not set'}</span>
                    </div>

                    {/* Category */}
                    <div>
                        <Label>Category*</Label>
                        <Select onValueChange={(value) => selectChangeHandler("category", value)} value={input.category}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (<SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full py-3 text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg flex justify-center items-center gap-2" disabled={loading}>
                        {loading && <Loader2 className='h-5 w-5 animate-spin' />}
                        {loading ? "Updating..." : "Update Job"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default EditJob;
