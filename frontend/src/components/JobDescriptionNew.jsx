

import React, { useEffect, useState, useRef } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar, 
  Building, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  TrendingUp, 
  FileText, 
  Share2, 
  Mail, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Copy, 
  Check,
  Bookmark,
  Eye,
  Send
} from 'lucide-react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import LoadingSpinner from './shared/LoadingSpinner';
import { formatLocationForDisplay } from '../utils/locationUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import ResumeUpload from './jobseeker/ResumeUpload';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [isSaved, setIsSaved] = useState(false);
    const [views, setViews] = useState(0);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requirementsRef = useRef(null);
    const jobDescriptionRef = useRef(null);
    const headerRef = useRef(null);

    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [applyAfterUpload, setApplyAfterUpload] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const shareMenuRef = useRef(null);


    useEffect(() => {
        if (singleJob) {
            setViews(Math.floor(Math.random() * 100) + 50);
        }
    }, [singleJob]);

  
    useEffect(() => {
        function handleClickOutside(event) {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isProfileComplete = (u) => {
        if (!u) return false;
        const hasPhone = Boolean(u.phoneNumber);
        const hasResume = Boolean(u.profile?.resume);
        return hasPhone && hasResume;
    };

    const applyJobHandler = async () => {
        if (!user) {
            localStorage.setItem('pendingJobApplication', JSON.stringify({
                jobId: jobId,
                jobTitle: singleJob?.title,
                returnUrl: window.location.pathname
            }));
            
            toast.info('Please login to apply for this job');
            navigate('/login');
            return;
        }

        if (!isProfileComplete(user)) {
            localStorage.setItem('pendingJobApplication', JSON.stringify({
                jobId,
                jobTitle: singleJob?.title,
                returnUrl: window.location.pathname,
                requireConfirm: true,
                autoReturn: true
            }));
            toast.info('Please complete your profile before applying.');
            navigate('/profile?edit=1');
            return;
        }

        setShowConfirmDialog(true);
    };

    const handleSaveJob = () => {
        setIsSaved(!isSaved);
        toast.success(!isSaved ? 'Job saved!' : 'Job removed from saved');
    };

    const shareJob = (platform = null) => {
        const jobTitle = singleJob?.title || 'Job Opportunity';
        const companyName = singleJob?.company?.name || '';
        const jobUrl = window.location.href;
        const text = `Check out this ${singleJob?.jobType || ''} position at ${companyName}`;

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(jobUrl);
                setIsCopied(true);
                toast.success('Link copied to clipboard!');
                setTimeout(() => setIsCopied(false), 2000);
                setShowShareMenu(false);
                break;
            case 'email':
                window.open(`mailto:?subject=${encodeURIComponent(jobTitle)}&body=${encodeURIComponent(`${text}\n\n${jobUrl}`)}`);
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/company/109610014/admin/dashboard/=${encodeURIComponent(jobUrl)}`);
                break;
            case 'instagram':
                window.open(`https://www.instagram.com/jobkitty_official?igsh=MW5lNmtid20wZm1qMw==
=${encodeURIComponent(`${text} ${jobUrl}`)}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(text)}`);
                break;
            default:
                if (navigator.share) {
                    navigator.share({
                        title: jobTitle,
                        text: text,
                        url: jobUrl,
                    }).catch(console.error);
                } else {
                    setShowShareMenu(!showShareMenu);
                }
        }
    };

    const ShareMenu = () => (
        <div 
            ref={shareMenuRef}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl bg-white border border-gray-200 z-50 backdrop-blur-sm"
        >
            <div className="py-2" role="menu" aria-orientation="vertical">
                <button
                    onClick={() => shareJob('copy')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    role="menuitem"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-4 h-4 mr-3 text-green-500" />
                            <span className="font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 mr-3 text-gray-500" />
                            <span>Copy link</span>
                        </>
                    )}
                </button>
                <button
                    onClick={() => shareJob('email')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    role="menuitem"
                >
                    <Mail className="w-4 h-4 mr-3 text-gray-500" />
                    <span>Email</span>
                </button>
                <button
                    onClick={() => shareJob('linkedin')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    role="menuitem"
                >
                    <Linkedin className="w-4 h-4 mr-3 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                </button>
                <button
                    onClick={() => shareJob('instagram')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    role="menuitem"
                >
                    <Instagram className="w-4 h-4 mr-3 text-[#E1306C]" />
                    <span>Instagram</span>
                </button>
                <button
                    onClick={() => shareJob('facebook')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-b-xl transition-colors duration-200"
                    role="menuitem"
                >
                    <Facebook className="w-4 h-4 mr-3 text-[#1877F2]" />
                    <span>Facebook</span>
                </button>
            </div>
        </div>
    );

    const handleResumeUploaded = async () => {
        setShowResumeDialog(false);
        if (applyAfterUpload && !isApplied) {
            setApplyAfterUpload(false);
            setTimeout(() => {
                setShowConfirmDialog(true);
            }, 500);
        }
    };

    const confirmApply = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success('Great! Your application has been sent successfully!');
                localStorage.removeItem('pendingJobApplication');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setShowConfirmDialog(false);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                } else {
                    toast.error('Job not found');
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
                if (error.response?.status === 404) {
                    toast.error('Job not found');
                } else if (error.response?.status === 401) {
                    toast.error('Please login to view job details');
                } else {
                    toast.error('Failed to load job details');
                }
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    useEffect(() => {
        const hasSection = Boolean(searchParams.get('section'));
        if (!hasSection) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [jobId, searchParams]);

    useEffect(() => {
        if (user && singleJob) {
            const pendingApplication = localStorage.getItem('pendingJobApplication');
            if (pendingApplication) {
                const applicationData = JSON.parse(pendingApplication);
                if (applicationData.jobId === jobId) {
                    if (isProfileComplete(user) && !isApplied) {
                        setShowConfirmDialog(true);
                    }
                }
            }
        }
    }, [user, singleJob, jobId, isApplied]);

    useEffect(() => {
        if (singleJob && searchParams.get('section')) {
            const section = searchParams.get('section');
            let targetRef = null;
            
            if (section === 'requirements' && requirementsRef.current) {
                targetRef = requirementsRef.current;
            } else if (section === 'job-description' && jobDescriptionRef.current) {
                targetRef = jobDescriptionRef.current;
            } else if (section === 'header' && headerRef.current) {
                targetRef = headerRef.current;
            }
            
            if (targetRef) {
                setTimeout(() => {
                    targetRef.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 500);
            }
        }
    }, [singleJob, searchParams]);

    if (!singleJob) {
        return (
            <>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                    <LoadingSpinner size={60} />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Navigation */}
                    <div className="mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-all duration-200 group"
                        >
                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Back to Jobs</span>
                        </button>
                    </div>

                    {/* Main Job Card */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Header Section with Gradient */}
                        <div ref={headerRef} className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white p-8 lg:p-10">
                            <div className="absolute top-4 right-4 flex items-center gap-2 text-blue-100">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">{views} views</span>
                            </div>
                            
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <Briefcase className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h1 className="text-4xl font-bold mb-3 leading-tight">{singleJob?.title}</h1>
                                            <div className="flex items-center gap-3 text-blue-100 mb-4">
                                                <Building className="w-5 h-5" />
                                                <span className="font-semibold text-lg">{singleJob?.company?.name || 'Company Name'}</span>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className="w-4 h-4 fill-current text-yellow-300" />
                                                    ))}
                                                    <span className="text-sm ml-1">4.8</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Job Meta Badges */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm px-4 py-2">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {formatLocationForDisplay(singleJob?.location)}
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm px-4 py-2">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {singleJob?.jobType}
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm px-4 py-2">
                                            <Users className="w-4 h-4 mr-2" />
                                            {singleJob?.openings || singleJob?.position} Positions
                                        </Badge>
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm px-4 py-2">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            {singleJob?.salary?.min && singleJob?.salary?.max 
                                                ? `₹${singleJob.salary.min}-${singleJob.salary.max} `
                                                : `${singleJob?.salary} `
                                            }
                                        </Badge>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                                        <Button
                                            onClick={isApplied ? null : applyJobHandler}
                                            disabled={isApplied}
                                            className={`px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-2xl ${
                                                isApplied 
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 cursor-not-allowed text-white' 
                                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl transform hover:scale-105'
                                            }`}
                                        >
                                            {isApplied ? (
                                                <>
                                                    <CheckCircle className="w-6 h-6 mr-3" />
                                                    Applied Successfully
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-6 h-6 mr-3" />
                                                    Apply Now
                                                </>
                                            )}
                                        </Button>
                                        
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline"
                                                onClick={handleSaveJob}
                                                className={`flex-1 px-4 py-4 border-2 rounded-2xl transition-all duration-200 ${
                                                    isSaved 
                                                        ? 'border-blue-200 text-blue-600 hover:bg-transparent' 
                                                        : 'border-gray-300 hover:bg-transparent'
                                                }`}
                                            >
                                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                                <span className="ml-2">{isSaved ? 'Saved' : 'Save'}</span>
                                            </Button>
                                        </div>
                                    </div>
                                    
                                  
                                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                        <div className="text-sm text-blue-100 space-y-2">
                                            <div className="flex justify-between">
                                                <span>Posted</span>
                                                <span className="font-medium">
                                                    {new Date(singleJob?.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Applications</span>
                                                <span className="font-medium">{singleJob?.applications?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                     
                        <div className="p-8 lg:p-10">
                            <div className="grid lg:grid-cols-3 gap-8">
                             
                                <div className="lg:col-span-2 space-y-8">
                              
                                    <div ref={jobDescriptionRef} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-xl">
                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                </div>
                                                Job Description
                                            </h2>
                                        </div>
                                        <div className="prose prose-lg max-w-none">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                                {singleJob?.description}
                                            </p>
                                        </div>
                                    </div>

                                 
                                    {singleJob?.requirements && singleJob.requirements.length > 0 && (
                                        <div ref={requirementsRef} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-xl">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                                Requirements & Skills
                                            </h2>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {singleJob.requirements.map((req, index) => (
                                                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                                        <span className="text-gray-700 font-medium">{req}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                  
                                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 rounded-xl">
                                                <Share2 className="w-6 h-6 text-purple-600" />
                                            </div>
                                            Share This Job
                                        </h2>
                                        <p className="text-gray-600 mb-6">
                                            Share this job with your network and help others find great opportunities!
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                onClick={() => shareJob('linkedin')}
                                                className="bg-[#0A66C2] hover:bg-[#0a5cad] text-white rounded-xl py-3 transition-all duration-200"
                                            >
                                                <Linkedin className="w-5 h-5 mr-2" />
                                                LinkedIn
                                            </Button>
                                            <Button
                                                onClick={() => shareJob('instagram')}
                                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 transition-all duration-200"
                                            >
                                                <Instagram className="w-5 h-5 mr-2" />
                                                Instagram
                                            </Button>
                                            <Button
                                                onClick={() => shareJob('facebook')}
                                                className="bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl py-3 transition-all duration-200"
                                            >
                                                <Facebook className="w-5 h-5 mr-2" />
                                                Facebook
                                            </Button>
                                            <Button
                                                onClick={() => shareJob('copy')}
                                                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl py-3 transition-all duration-200"
                                            >
                                                <Copy className="w-5 h-5 mr-2" />
                                                Copy Link
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="space-y-6">
                                   
                                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Job Details</h3>
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                                                <span className="text-gray-600 font-medium">Experience</span>
                                                <span className="font-bold text-gray-900">
                                                    {singleJob?.experience?.min && singleJob?.experience?.max 
                                                        ? `${singleJob.experience.min}-${singleJob.experience.max} years`
                                                        : `${singleJob?.experienceLevel} years`
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                                <span className="text-gray-600 font-medium">Salary Range</span>
                                                <span className="font-bold text-gray-900">
                                                    {singleJob?.salary?.min && singleJob?.salary?.max 
                                                        ? `₹${singleJob.salary.min}-${singleJob.salary.max} `
                                                        : `₹${singleJob?.salary} `
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                                                <span className="text-gray-600 font-medium">Job Type</span>
                                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold">
                                                    {singleJob?.jobType}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                                                <span className="text-gray-600 font-medium">Location</span>
                                                <span className="font-bold text-gray-900">{formatLocationForDisplay(singleJob?.location)}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                                                <span className="text-gray-600 font-medium">Openings</span>
                                                <span className="font-bold text-gray-900">{singleJob?.openings || singleJob?.position}</span>
                                            </div>
                                        </div>
                                    </div>

                              
                                    {singleJob?.company && (
                                        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Company</h3>

                                            <div className="flex items-start gap-4 mb-4">
                                                <Avatar className="w-16 h-16 border-2 border-gray-100 shadow-sm">
                                                    <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                                                        {singleJob?.company?.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className='font-bold text-lg text-gray-900 truncate'>{singleJob?.company?.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{formatLocationForDisplay(singleJob?.location) || 'India'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {singleJob.company.description && (
                                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
                                                    {singleJob.company.description}
                                                </p>
                                            )}
                                            
                                            
                                        </div>
                                    )}

                                   
                                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 rounded-xl">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Posted on</p>
                                                <p className="font-bold text-gray-900 text-lg">
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

   
            <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
                <DialogContent className="max-w-xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Upload your resume to apply</DialogTitle>
                        <DialogDescription className="text-lg">
                            Please upload a PDF or Word document (max 5MB). Once uploaded, we will submit your application automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <ResumeUpload onSuccess={handleResumeUploaded} />
                    </div>
                </DialogContent>
            </Dialog>


            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="max-w-4xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Confirm Your Application</DialogTitle>
                        <DialogDescription className="text-lg">
                            Review your resume before submitting your application for <span className="font-semibold text-blue-600">{singleJob?.title}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {user?.profile?.resume ? (
                            <div className="h-[500px] border-2 border-gray-200 rounded-2xl overflow-hidden shadow-inner">
                                <iframe
                                    src={user.profile.resume}
                                    title="Resume Preview"
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-red-50 rounded-2xl">
                                <p className="text-lg text-red-600 font-semibold">No resume found. Please upload your resume to apply.</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-6 flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowConfirmDialog(false)}
                            className="px-8 py-3 rounded-xl text-lg border-2"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={confirmApply} 
                            disabled={isApplied || !user?.profile?.resume}
                            className="px-8 py-3 rounded-xl text-lg bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Submit Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default JobDescription