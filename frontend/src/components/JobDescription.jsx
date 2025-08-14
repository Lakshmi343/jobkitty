import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Briefcase, MapPin, DollarSign, Clock, Users, Calendar,Building,CheckCircle,ArrowLeft,ExternalLink,Star, TrendingUp, FileText} from 'lucide-react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar'

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); 
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); 
                toast.success('Application submitted successfully!');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to apply for job');
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to load job details');
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    if (!singleJob) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Jobs
                        </button>
                    </div>

                    {/* Main Job Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold mb-2">{singleJob?.title}</h1>
                                            <div className="flex items-center gap-2 text-blue-100">
                                                <Building className="w-4 h-4" />
                                                <span className="font-medium">{singleJob?.company?.name || 'Company Name'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Job Tags */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {singleJob?.location}
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {singleJob?.jobType}
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                            <Users className="w-3 h-3 mr-1" />
                                            {singleJob?.openings || singleJob?.position} Positions
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            {singleJob?.salary?.min && singleJob?.salary?.max 
                                                ? `${singleJob.salary.min}-${singleJob.salary.max} LPA`
                                                : `${singleJob?.salary} LPA`
                                            }
                                        </Badge>
                                    </div>
                                </div>
                                
                                {/* Apply Button */}
                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={isApplied ? null : applyJobHandler}
                                        disabled={isApplied}
                                        className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${
                                            isApplied 
                                                ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed' 
                                                : 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105'
                                        }`}
                                    >
                                        {isApplied ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Applied Successfully
                                            </>
                                        ) : (
                                            <>
                                                <TrendingUp className="w-5 h-5 mr-2" />
                                                Apply Now
                                            </>
                                        )}
                                    </Button>
                                    {!isApplied && (
                                        <p className="text-blue-100 text-sm text-center">
                                            {singleJob?.applications?.length || 0} people have applied
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8">
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Job Description */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Job Description
                                        </h2>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {singleJob?.description}
                                        </p>
                                    </div>

                                    {/* Requirements */}
                                    {singleJob?.requirements && singleJob.requirements.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                Requirements
                                            </h2>
                                            <ul className="space-y-3">
                                                {singleJob.requirements.map((req, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-gray-700">{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Job Details Card */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Experience</span>
                                                <span className="font-medium text-gray-900">
                                                    {singleJob?.experience?.min && singleJob?.experience?.max 
                                                        ? `${singleJob.experience.min}-${singleJob.experience.max} years`
                                                        : `${singleJob?.experienceLevel} years`
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Salary Range</span>
                                                <span className="font-medium text-gray-900">
                                                    {singleJob?.salary?.min && singleJob?.salary?.max 
                                                        ? `${singleJob.salary.min}-${singleJob.salary.max} `
                                                        : `${singleJob?.salary}`
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Job Type</span>
                                                <Badge variant="outline" className="font-medium">
                                                    {singleJob?.jobType}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Location</span>
                                                <span className="font-medium text-gray-900">{singleJob?.location}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Openings</span>
                                                <span className="font-medium text-gray-900">{singleJob?.openings || singleJob?.position}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company Info */}
                                    {singleJob?.company && (
                                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>

                                            {/* <div className="flex items-center gap-3 mb-4">
                                                {singleJob.company.logo ? (
                                                    <img 
                                                        src={singleJob.company.logo} 
                                                        alt={singleJob.company.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Building className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{singleJob.company.name}</h4>
                                                    <p className="text-sm text-gray-600">{singleJob.company.location}</p>
                                                </div>
                                            </div> */}

                                             <div className="flex-1 min-w-0">
                                             <div className="flex-shrink-0">
                    <Avatar className="w-12 h-12 border-2 border-gray-100">
                        <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                    </Avatar>
                </div>
                    <h3 className='font-semibold text-lg text-gray-900 truncate'>{singleJob?.company?.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{singleJob?.location || 'India'}</span>
                    </div>
                </div>
                                            {singleJob.company.description && (
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {singleJob.company.description}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Posted Date */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Posted on</p>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(singleJob?.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobDescription