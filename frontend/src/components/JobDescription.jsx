// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { 
//   Briefcase, 
//   MapPin, 
//   DollarSign, 
//   Clock, 
//   Building, 
//   CheckCircle, 
//   ArrowLeft, 
//   ExternalLink, 
//   Globe,
//   FileText
// } from 'lucide-react';

// // Components
// import Navbar from './shared/Navbar';
// import LoadingSpinner from './shared/LoadingSpinner';
// import { Button } from './ui/button';
// import { Avatar, AvatarImage } from './ui/avatar';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogDescription, 
//   DialogFooter 
// } from './ui/dialog';
// import ResumeUpload from './jobseeker/ResumeUpload';

// // Utils
// import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
// import { setSingleJob } from '@/redux/jobSlice';
// import { formatLocationForDisplay } from '../utils/locationUtils';
// import { addJobPostingSchema } from '../utils/schemaUtils';

// const JobDescription = () => {
//   // State
//   const { singleJob } = useSelector(store => store.job);
//   const { user } = useSelector(store => store.auth);
//   const [isApplied, setIsApplied] = useState(false);
//   const [showResumeDialog, setShowResumeDialog] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Refs
//   const requirementsRef = useRef(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { id: jobId } = useParams();
//   const [searchParams] = useSearchParams();

//   // Check if user has already applied
//   useEffect(() => {
//     if (singleJob?.applications && user?._id) {
//       const hasApplied = singleJob.applications.some(
//         app => app.applicant === user._id
//       );
//       setIsApplied(hasApplied);
//     }
//   }, [singleJob, user]);

//   // Fetch job details
//   useEffect(() => {
//     const fetchJob = async () => {
//       try {
//         setIsLoading(true);
//         const { data } = await axios.get(`${JOB_API_END_POINT}/${jobId}`);
//         dispatch(setSingleJob(data.job));
//       } catch (error) {
//         console.error('Error fetching job:', error);
//         toast.error('Failed to load job details');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchJob();
//   }, [jobId, dispatch]);

//   // Add structured data and handle scroll to section
//   useEffect(() => {
//     if (singleJob?._id === jobId) {
//       // Add structured data for Google Jobs
//       addJobPostingSchema(singleJob, window.location.origin);
      
//       // Scroll to requirements section if specified in URL
//       const section = searchParams.get('section');
//       if (section === 'requirements' && requirementsRef.current) {
//         setTimeout(() => {
//           requirementsRef.current.scrollIntoView({ behavior: 'smooth' });
//         }, 300);
//       }
//     }
//   }, [singleJob, jobId, searchParams]);

//   // Handle job application
//   const handleApply = async () => {
//     if (!user) {
//       // Redirect to login if not authenticated
//       navigate('/login', { 
//         state: { 
//           from: `/jobs/${jobId}`,
//           message: 'Please login to apply for this job'
//         } 
//       });
//       return;
//     }

//     // Check if user has uploaded a resume
//     if (!user.profile?.resume) {
//       setShowResumeDialog(true);
//       return;
//     }

//     setShowConfirmDialog(true);
//   };

//   // Confirm application
//   const confirmApplication = async () => {
//     try {
//       await axios.post(
//         `${APPLICATION_API_END_POINT}/apply/${jobId}`,
//         {},
//         { withCredentials: true }
//       );
      
//       toast.success('Application submitted successfully!');
//       setIsApplied(true);
//       setShowConfirmDialog(false);
//     } catch (error) {
//       console.error('Error applying for job:', error);
//       toast.error(error.response?.data?.message || 'Failed to submit application');
//     }
//   };

//   // Share job
//   const shareJob = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: singleJob.title,
//         text: `Check out this ${singleJob.jobType} position at ${singleJob.company?.name}`,
//         url: window.location.href,
//       }).catch(console.error);
//     } else {
//       // Fallback for browsers that don't support Web Share API
//       const shareUrl = `https://www.google.com/search?q=${encodeURIComponent(
//         `${singleJob.title} at ${singleJob.company?.name} ${window.location.href}`
//       )}`;
//       window.open(shareUrl, '_blank');
//     }
//   };

//     const handleResumeUploaded = async () => {
//         setShowResumeDialog(false);
//         if (applyAfterUpload && !isApplied) {
//             setApplyAfterUpload(false);
        
//             setTimeout(() => {
                
//                 setShowConfirmDialog(true);
//             }, 500);
//         }
//     };

//     const confirmApply = async () => {
//         try {
//             const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
//             if (res.data.success) {
//                 setIsApplied(true);
//                 const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
//                 dispatch(setSingleJob(updatedSingleJob));
//                 toast.success('Great! Your application has been sent successfully!');
//                 localStorage.removeItem('pendingJobApplication');
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
//         } finally {
//             setShowConfirmDialog(false);
//         }
//     };

//     useEffect(()=>{
//         const fetchSingleJob = async () => {
//             try {
//                 const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
//                 if(res.data.success){
//                     dispatch(setSingleJob(res.data.job));
//                     setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
//                 } else {
//                     toast.error('Job not found');
//                 }
//             } catch (error) {
//                 console.error('Error fetching job details:', error);
//                 if (error.response?.status === 404) {
//                     toast.error('Job not found');
//                 } else if (error.response?.status === 401) {
//                     toast.error('Please login to view job details');
//                 } else {
//                     toast.error('Failed to load job details');
//                 }
//             }
//         }
//         fetchSingleJob(); 
//     },[jobId,dispatch, user?._id]);

//     useEffect(() => {
//         const hasSection = Boolean(searchParams.get('section'));
//         if (!hasSection) {
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
     

//     }, [jobId, searchParams]);

   
//     useEffect(() => {
//         if (user && singleJob) {
//             const pendingApplication = localStorage.getItem('pendingJobApplication');
//             if (pendingApplication) {
//                 const applicationData = JSON.parse(pendingApplication);
                
            
//                 if (applicationData.jobId === jobId) {
                  
//                     if (isProfileComplete(user) && !isApplied) {
//                         setShowConfirmDialog(true);
//                     }
//                 }
//             }
//         }
//     }, [user, singleJob, jobId, isApplied]);

    
//     useEffect(() => {
//         if (singleJob && searchParams.get('section')) {
//             const section = searchParams.get('section');
//             let targetRef = null;
            
//             if (section === 'requirements' && requirementsRef.current) {
//                 targetRef = requirementsRef.current;
//             } else if (section === 'job-description' && jobDescriptionRef.current) {
//                 targetRef = jobDescriptionRef.current;
//             } else if (section === 'header' && headerRef.current) {
//                 targetRef = headerRef.current;
//             }
            
//             if (targetRef) {
//                 setTimeout(() => {
//                     targetRef.scrollIntoView({ 
//                         behavior: 'smooth', 
//                         block: 'start' 
//                     });
//                 }, 500); 
//             }
//         }
//     }, [singleJob, searchParams]);

//     useEffect(() => {
//         if (singleJob?._id === jobId) {
//           // Add structured data for Google Jobs
//           const baseUrl = window.location.origin;
//           addJobPostingStructuredData(singleJob, baseUrl);
          
//           // Add canonical URL for better SEO
//           const canonicalUrl = `${baseUrl}/jobs/${jobId}`;
//           let link = document.querySelector("link[rel='canonical']");
//           if (!link) {
//             link = document.createElement('link');
//             link.rel = 'canonical';
//             document.head.appendChild(link);
//           }
//           link.href = canonicalUrl;
//         } else {
//           dispatch(fetchSingleJob(jobId));
//         }
//       }, [jobId, dispatch, singleJob]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size={60} />
//       </div>
//     );
//   }

//   if (!singleJob) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
//           <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
//           <Button onClick={() => navigate('/jobs')} variant="outline">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Jobs
//           </Button>
//         </div>
//       </div>
//     );
//   }
//   }, [jobId, dispatch, singleJob]);

// if (!singleJob) {
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
//             <LoadingSpinner size={60} />
//         </div>
//     );
// }
//                             className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
//                         >
//                             <ArrowLeft className="w-5 h-5" />
//                             Back to Jobs
//                         </button>
//                     </div>

                    
//                     <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    
//                         <div ref={headerRef} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
//                             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//                                 <div className="flex-1">
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <div className="bg-white/20 p-2 rounded-lg">
//                                             <Briefcase className="w-6 h-6" />
//                                         </div>
//                                         <div>
//                                             <h1 className="text-3xl font-bold mb-2">{singleJob?.title}</h1>
//                                             <div className="flex items-center gap-2 text-blue-100">
//                                                 <Building className="w-4 h-4" />
//                                                 <span className="font-medium">{singleJob?.company?.name || 'Company Name'}</span>
//                                             </div>
//                                         </div>
//                                     </div>
                                    
                                   
//                                     <div className="flex flex-wrap items-center gap-3">
//                                         <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
//                                             <MapPin className="w-3 h-3 mr-1" />
//                                             {formatLocationForDisplay(singleJob?.location)}
//                                         </Badge>
//                                         <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
//                                             <Clock className="w-3 h-3 mr-1" />
//                                             {singleJob?.jobType}
//                                         </Badge>
//                                         <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
//                                             <Users className="w-3 h-3 mr-1" />
//                                             {singleJob?.openings || singleJob?.position} Positions
//                                         </Badge>
//                                         <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
//                                             <DollarSign className="w-3 h-3 mr-1" />
//                                             {singleJob?.salary?.min && singleJob?.salary?.max 
//                                                 ? `${singleJob.salary.min}-${singleJob.salary.max} `
//                                                 : `${singleJob?.salary} LPA`
//                                             }
//                                         </Badge>
//                                     </div>
//                                 </div>
                                
                             
//                                 <div className="flex flex-col gap-3">
//                                     <Button
//                                         onClick={isApplied ? null : applyJobHandler}
//                                         disabled={isApplied}
//                                         className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${
//                                             isApplied 
//                                                 ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed' 
//                                                 : 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105'
//                                         }`}
//                                     >
//                                         {isApplied ? (
//                                             <>
//                                                 <CheckCircle className="w-5 h-5 mr-2" />
//                                                 Applied Successfully
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <TrendingUp className="w-5 h-5 mr-2" />
//                                                 Apply Now
//                                             </>
//                                         )}
//                                     </Button>
                                    
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Content Section */}
//                         <div className="p-8">
//                             <div className="grid lg:grid-cols-3 gap-8">
//                                 {/* Main Content */}
//                                 <div className="lg:col-span-2 space-y-8">
//                                     {/* Job Description */}
//                                     <div ref={jobDescriptionRef} className="bg-gray-50 rounded-xl p-6">
//                                         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                                             <FileText className="w-5 h-5 text-blue-600" />
//                                             Job Description
//                                         </h2>
//                                         <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                                             {singleJob?.description}
//                                         </p>
//                                     </div>

//                                     {/* Requirements */}
//                                     {singleJob?.requirements && singleJob.requirements.length > 0 && (
//                                         <div ref={requirementsRef} className="bg-gray-50 rounded-xl p-6">
//                                             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                                                 <CheckCircle className="w-5 h-5 text-green-600" />
//                                                 Requirements
//                                             </h2>
//                                             <ul className="space-y-3">
//                                                 {singleJob.requirements.map((req, index) => (
//                                                     <li key={index} className="flex items-start gap-3">
//                                                         <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                                                         <span className="text-gray-700">{req}</span>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Sidebar */}
//                                 <div className="space-y-6">
//                                     {/* Job Details Card */}
//                                     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">Experience</span>
//                                                 <span className="font-medium text-gray-900">
//                                                     {singleJob?.experience?.min && singleJob?.experience?.max 
//                                                         ? `${singleJob.experience.min}-${singleJob.experience.max} years`
//                                                         : `${singleJob?.experienceLevel} years`
//                                                     }
//                                                 </span>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">Salary Range</span>
//                                                 <span className="font-medium text-gray-900">
//                                                     {singleJob?.salary?.min && singleJob?.salary?.max 
//                                                         ? `${singleJob.salary.min}-${singleJob.salary.max} `
//                                                         : `${singleJob?.salary}`
//                                                     }
//                                                 </span>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">Job Type</span>
//                                                 <Badge variant="outline" className="font-medium">
//                                                     {singleJob?.jobType}
//                                                 </Badge>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">Location</span>
//                                                 <span className="font-medium text-gray-900">{formatLocationForDisplay(singleJob?.location)}</span>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-gray-600">Openings</span>
//                                                 <span className="font-medium text-gray-900">{singleJob?.openings || singleJob?.position}</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Company Info */}
//                                     {singleJob?.company && (
//                                         <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//                                             <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>

//                                             <div className="flex-1 min-w-0">
//                                              <div className="flex-shrink-0">
//                     <Avatar className="w-12 h-12 border-2 border-gray-100">
//                         <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
//                     </Avatar>
//                 </div>
//                     <h3 className='font-semibold text-lg text-gray-900 truncate'>{singleJob?.company?.name}</h3>
//                     <div className="flex gap-4 flex-wrap">
//             <div className="flex items-center gap-2">
//               <MapPin className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm text-muted-foreground">
//                 {formatLocationForDisplay(singleJob.location) || 'Location not specified'}
//                 {singleJob.remoteWork && ' (Remote)'}
//               </span>
//             </div>
//             {singleJob.postedBy?.website && (
//               <div className="flex items-center gap-2">
//                 <Globe className="h-4 w-4 text-muted-foreground" />
//                 <a 
//                   href={singleJob.postedBy.website.startsWith('http') ? singleJob.postedBy.website : `https://${singleJob.postedBy.website}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   {singleJob.postedBy.website.replace(/^https?:\/\//, '')}
//                 </a>
//               </div>
//             )}
//                                             {singleJob.company.description && (
//                                                 <p className="text-gray-600 text-sm leading-relaxed">
//                                                     {singleJob.company.description}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Posted Date */}
//                                     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//                                         <div className="flex items-center gap-3">
//                                             <Calendar className="w-5 h-5 text-gray-500" />
//                                             <div>
//                                                 <p className="text-sm text-gray-600">Posted on</p>
//                                                 <p className="font-medium text-gray-900">
//                                                     {new Date(singleJob?.createdAt).toLocaleDateString('en-US', {
//                                                         year: 'numeric',
//                                                         month: 'long',
//                                                         day: 'numeric'
//                                                     })}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Resume required dialog */}
//             <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
//                 <DialogContent className="max-w-xl">
//                     <DialogHeader>
//                         <DialogTitle>Upload your resume to apply</DialogTitle>
//                         <DialogDescription>
//                             Please upload a PDF or Word document (max 5MB). Once uploaded, we will submit your application automatically.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="mt-2">
//                         <ResumeUpload onSuccess={handleResumeUploaded} />
//                     </div>
//                 </DialogContent>
//             </Dialog>

//             {/* Confirmation dialog with resume preview */}
//             <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//                 <DialogContent className="max-w-2xl">
//                     <DialogHeader>
//                         <DialogTitle>Confirm your application</DialogTitle>
//                         <DialogDescription>
//                             Review your resume before submitting your application to this job.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                         {user?.profile?.resume ? (
//                             <div className="h-[480px] border rounded overflow-hidden">
//                                 <iframe
//                                     src={user.profile.resume}
//                                     title="Resume Preview"
//                                     className="w-full h-full"
//                                 />
//                             </div>
//                         ) : (
//                             <p className="text-sm text-red-600">No resume found. Please upload your resume.</p>
//                         )}
//                     </div>
//                     <DialogFooter className="mt-4 flex gap-2">
//                         <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
//                         <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <Button onClick={applyJobHandler} disabled={!user || isApplied} className="w-full sm:w-auto">
//                 {isApplied ? 'Applied' : 'Apply Now'}
//               </Button>
//               <Button 
//                 variant="outline" 
//                 className="w-full sm:w-auto"
//                 onClick={() => {
//                   // Add job to Google for Jobs index
//                   if (navigator.share) {
//                     navigator.share({
//                       title: singleJob.title,
//                       text: `Check out this ${singleJob.jobType} position at ${singleJob.postedBy?.companyName}`,
//                       url: window.location.href,
//                     });
//                   } else {
//                     // Fallback for browsers that don't support Web Share API
//                       const shareUrl = `https://www.google.com/search?q=${encodeURIComponent(`${singleJob.title} at ${singleJob.postedBy?.companyName} ${window.location.href}`)}`;
//                       window.open(shareUrl, '_blank');
//                   }
//                 }}
//               >
//                 <ExternalLink className="h-4 w-4 mr-2" />
//                 Share Job
//               </Button>
//             </div>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     )
// }
// export default JobDescription



import React, { useEffect, useState, useRef } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Briefcase, MapPin, DollarSign, Clock, Users, Calendar,Building,CheckCircle,ArrowLeft,ExternalLink,Star, TrendingUp, FileText} from 'lucide-react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar'
import LoadingSpinner from './shared/LoadingSpinner';
import { formatLocationForDisplay } from '../utils/locationUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import ResumeUpload from './jobseeker/ResumeUpload';

const JobDescription = () => {

    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
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
        return;

      
    }

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

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
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
    },[jobId,dispatch, user?._id]);

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
           
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4 py-8">
                
                    <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Jobs
                        </button>
                    </div>

                    
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    
                        <div ref={headerRef} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
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
                                    
                                   
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {formatLocationForDisplay(singleJob?.location)}
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
                                                ? `${singleJob.salary.min}-${singleJob.salary.max} `
                                                : `${singleJob?.salary}`
                                            }
                                        </Badge>
                                    </div>
                                </div>
                                
                             
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
                                    
                                </div>
                            </div>
                        </div>

                
                        <div className="p-8">
                            <div className="grid lg:grid-cols-3 gap-8">
                      
                                <div className="lg:col-span-2 space-y-8">
                               
                                    <div ref={jobDescriptionRef} className="bg-gray-50 rounded-xl p-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Job Description
                                        </h2>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {singleJob?.description}
                                        </p>
                                    </div>

                               
                                    {singleJob?.requirements && singleJob.requirements.length > 0 && (
                                        <div ref={requirementsRef} className="bg-gray-50 rounded-xl p-6">
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

                                <div className="space-y-6">
                                  
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
                                                <span className="font-medium text-gray-900">{formatLocationForDisplay(singleJob?.location)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Openings</span>
                                                <span className="font-medium text-gray-900">{singleJob?.openings || singleJob?.position}</span>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    {singleJob?.company && (
                                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>

                                            

                                             <div className="flex-1 min-w-0">
                                             <div className="flex-shrink-0">
                    <Avatar className="w-12 h-12 border-2 border-gray-100">
                        <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                    </Avatar>
                </div>
                    <h3 className='font-semibold text-lg text-gray-900 truncate'>{singleJob?.company?.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{formatLocationForDisplay(singleJob?.location) || 'India'}</span>
                    </div>
                </div>
                                            {singleJob.company.description && (
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {singleJob.company.description}
                                                </p>
                                            )}
                                        </div>
                                    )}

                             
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

           
            <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Upload your resume to apply</DialogTitle>
                        <DialogDescription>
                            Please upload a PDF or Word document (max 5MB). Once uploaded, we will submit your application automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2">
                        <ResumeUpload onSuccess={handleResumeUploaded} />
                    </div>
                </DialogContent>
            </Dialog>

         
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Confirm your application</DialogTitle>
                        <DialogDescription>
                            Review your resume before submitting your application to this job.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {user?.profile?.resume ? (
                            <div className="h-[480px] border rounded overflow-hidden">
                                <iframe
                                    src={user.profile.resume}
                                    title="Resume Preview"
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-red-600">No resume found. Please upload your resume.</p>
                        )}
                    </div>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                        <Button onClick={confirmApply} disabled={isApplied || !user?.profile?.resume}>Submit Application</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default JobDescription