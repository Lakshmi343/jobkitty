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
//   Users, 
//   Calendar, 
//   Building, 
//   CheckCircle, 
//   ExternalLink, 
//   Globe,
//   ArrowLeft,
//   FileText,
//   BookOpen,
//   Award,
//   Mail,
//   Phone,
//   Map,
//   Home,
//   UserCheck,
//   GraduationCap,
//   Layers,
//   BriefcaseBusiness,
//   BadgeDollarSign,
//   Clock3
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
//   const [isApplying, setIsApplying] = useState(false);
//   const [applicationStatus, setApplicationStatus] = useState(null);
  
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
//       navigate('/login', { 
//         state: { 
//           from: `/jobs/${jobId}`,
//           message: 'Please login to apply for this job'
//         } 
//       });
//       return;
//     }

//     // Check if user has completed their profile
//     if (!user.profile?.resume) {
//       setShowResumeDialog(true);
//       return;
//     }

//     // Check if user has already applied
//     if (isApplied) {
//       toast.info('You have already applied to this position');
//       return;
//     }

//     setShowConfirmDialog(true);
//   };

//   // Confirm application
//   const confirmApplication = async () => {
//     if (!jobId) {
//       console.error('No job ID found');
//       toast.error('Invalid job reference. Please try refreshing the page.');
//       return;
//     }

//     setIsApplying(true);
    
//     try {
//       console.log('Sending application for job:', jobId);
//       console.log('API Endpoint:', `${APPLICATION_API_END_POINT}/apply/${jobId}`);
      
//       const response = await axios.post(
//         `${APPLICATION_API_END_POINT}/apply/${jobId}`,
//         {},
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//           timeout: 10000 // 10 second timeout
//         }
//       );
      
//       console.log('Application response:', response.data);
      
//       if (response.data && response.data.success) {
//         toast.success('Application submitted successfully!');
//         setIsApplied(true);
//         setApplicationStatus('applied');
        
//         // Update the job in the Redux store to reflect the new application
//         dispatch(setSingleJob({
//           ...singleJob,
//           applications: [...(singleJob.applications || []), { 
//             _id: Date.now().toString(), // Temporary ID
//             applicant: user._id,
//             status: 'pending',
//             appliedAt: new Date().toISOString()
//           }]
//         }));
//       } else {
//         const errorMsg = response.data?.message || 'Failed to submit application';
//         console.error('Application submission failed:', errorMsg);
//         throw new Error(errorMsg);
//       }
//     } catch (error) {
//       console.error('Error applying for job:', {
//         error,
//         response: error.response?.data,
//         status: error.response?.status,
//         config: {
//           url: error.config?.url,
//           method: error.config?.method,
//           headers: error.config?.headers
//         }
//       });
      
//       let errorMessage = 'Failed to submit application';
      
//       if (error.response) {
//         // Server responded with an error status code
//         if (error.response.status === 401) {
//           errorMessage = 'Please log in to apply for this job';
//         } else if (error.response.status === 400) {
//           errorMessage = error.response.data?.message || 'Invalid request. Please check your details and try again.';
//         } else if (error.response.status === 403) {
//           errorMessage = 'You do not have permission to apply for this job';
//         } else if (error.response.status === 404) {
//           errorMessage = 'Job not found or no longer available';
//         } else if (error.response.status === 409) {
//           errorMessage = 'You have already applied to this position';
//           setIsApplied(true);
//         } else if (error.response.status >= 500) {
//           errorMessage = 'Server error. Please try again later.';
//         }
//       } else if (error.request) {
//         // Request was made but no response received
//         errorMessage = 'No response from server. Please check your connection.';
//       } else if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Request timed out. Please try again.';
//       } else if (error.message === 'Network Error') {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }
      
//       toast.error(errorMessage);
//       setApplicationStatus('error');
//     } finally {
//       setIsApplying(false);
//       setShowConfirmDialog(false);
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

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-6">
//           <Button 
//             variant="ghost" 
//             onClick={() => navigate(-1)}
//             className="text-gray-600 hover:bg-gray-100"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Jobs
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Job Header */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">{singleJob.title}</h1>
//                   <div className="mt-2 flex items-center text-sm text-gray-500">
//                     <Building className="h-4 w-4 mr-1" />
//                     <span>{singleJob.company?.name || 'Company not specified'}</span>
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <Button 
//                     onClick={handleApply} 
//                     disabled={isApplied}
//                     className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
//                   >
//                     {isApplied ? 'Applied' : 'Apply Now'}
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     onClick={shareJob}
//                     className="whitespace-nowrap"
//                   >
//                     <ExternalLink className="w-4 h-4 mr-2" />
//                     Share
//                   </Button>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center">
//                     <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Location</p>
//                       <p className="font-medium">
//                         {formatLocationForDisplay(singleJob.location) || 'Not specified'}
//                         {singleJob.remoteWork && ' (Remote)'}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <DollarSign className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Salary</p>
//                       <p className="font-medium">
//                         {singleJob.salaryMin || singleJob.salaryMax 
//                           ? `₹${singleJob.salaryMin?.toLocaleString() || '0'} - ₹${singleJob.salaryMax?.toLocaleString() || '0'}` 
//                           : 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <Briefcase className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Job Type</p>
//                       <p className="font-medium capitalize">{singleJob.jobType || 'Not specified'}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <Clock className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
//                     <div>
//                       <p className="text-sm text-gray-500">Posted</p>
//                       <p className="font-medium">
//                         {singleJob.createdAt 
//                           ? new Date(singleJob.createdAt).toLocaleDateString() 
//                           : 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Job Description */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <div className="flex items-center mb-4">
//                 <FileText className="h-5 w-5 text-blue-600 mr-2" />
//                 <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
//               </div>
//               <div 
//                 className="prose max-w-none text-gray-700" 
//                 dangerouslySetInnerHTML={{ __html: singleJob.description }} 
//               />
//             </div>

//             {/* Job Details */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <div className="flex items-center mb-4">
//                 <Layers className="h-5 w-5 text-blue-600 mr-2" />
//                 <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <BriefcaseBusiness className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Job Type</h3>
//                       <p className="text-gray-900">{singleJob.jobType || 'Not specified'}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <Clock3 className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Experience</h3>
//                       <p className="text-gray-900">
//                         {singleJob.experienceMin || singleJob.experienceMax 
//                           ? `${singleJob.experienceMin || '0'} - ${singleJob.experienceMax || '0'} years` 
//                           : 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <BadgeDollarSign className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Salary</h3>
//                       <p className="text-gray-900">
//                         {singleJob.salaryMin || singleJob.salaryMax 
//                           ? `₹${singleJob.salaryMin?.toLocaleString() || '0'} - ₹${singleJob.salaryMax?.toLocaleString() || '0'}` 
//                           : 'Not specified'}
//                         {singleJob.salaryType && ` (${singleJob.salaryType})`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Location</h3>
//                       <p className="text-gray-900">
//                         {formatLocationForDisplay(singleJob.location) || 'Not specified'}
//                         {singleJob.remoteWork && ' (Remote)'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Posted</h3>
//                       <p className="text-gray-900">
//                         {singleJob.createdAt 
//                           ? new Date(singleJob.createdAt).toLocaleDateString('en-IN', { 
//                               year: 'numeric', 
//                               month: 'long', 
//                               day: 'numeric' 
//                             }) 
//                           : 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <UserCheck className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <h3 className="text-sm font-medium text-gray-500">Openings</h3>
//                       <p className="text-gray-900">
//                         {singleJob.vacancies || singleJob.vacancies === 0 
//                           ? singleJob.vacancies 
//                           : 'Not specified'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Requirements & Skills */}
//             <div ref={requirementsRef} className="bg-white rounded-xl shadow-sm p-6">
//               <div className="flex items-center mb-4">
//                 <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
//                 <h2 className="text-xl font-semibold text-gray-900">Requirements & Skills</h2>
//               </div>
              
//               {singleJob.requirements?.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="font-medium text-gray-800 mb-3">Key Requirements:</h3>
//                   <ul className="space-y-3">
//                     {singleJob.requirements.map((req, index) => (
//                       <li key={`req-${index}`} className="flex items-start">
//                         <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                         <span className="text-gray-700">{req}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {singleJob.skills?.length > 0 && (
//                 <div>
//                   <h3 className="font-medium text-gray-800 mb-3">Preferred Skills:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {singleJob.skills.map((skill, index) => (
//                       <span 
//                         key={`skill-${index}`}
//                         className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {singleJob.education && (
//                 <div className="mt-6">
//                   <h3 className="font-medium text-gray-800 mb-3">Education:</h3>
//                   <div className="flex items-start">
//                     <GraduationCap className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
//                     <span className="text-gray-700">{singleJob.education}</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Responsibilities */}
//             {singleJob.responsibilities?.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm p-6">
//                 <div className="flex items-center mb-4">
//                   <ListChecks className="h-5 w-5 text-blue-600 mr-2" />
//                   <h2 className="text-xl font-semibold text-gray-900">Key Responsibilities</h2>
//                 </div>
//                 <ul className="space-y-3">
//                   {singleJob.responsibilities.map((responsibility, index) => (
//                     <li key={`resp-${index}`} className="flex items-start">
//                       <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                       <span className="text-gray-700">{responsibility}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Company Card */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-semibold text-lg">About Company</h3>
//                 {singleJob.company?.website && (
//                   <a
//                     href={singleJob.company.website.startsWith('http') 
//                       ? singleJob.company.website 
//                       : `https://${singleJob.company.website}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm text-blue-600 hover:underline flex items-center"
//                   >
//                     <Globe className="h-4 w-4 mr-1" />
//                     Visit Website
//                   </a>
//                 )}
//               </div>
              
//               <div className="flex items-start space-x-4 mb-4">
//                 <Avatar className="h-20 w-20 border-2 border-gray-100 flex-shrink-0">
//                   <AvatarImage src={singleJob.company?.logo} alt={singleJob.company?.name} />
//                 </Avatar>
//                 <div>
//                   <h4 className="font-semibold text-gray-900 text-lg">{singleJob.company?.name}</h4>
//                   {singleJob.company?.tagline && (
//                     <p className="text-sm text-gray-600 mt-1">{singleJob.company.tagline}</p>
//                   )}
//                   <div className="flex items-center text-sm text-gray-500 mt-2">
//                     <Building className="h-4 w-4 mr-1" />
//                     <span>{singleJob.company?.companyType || 'Company'}</span>
//                   </div>
//                 </div>
//               </div>
              
//               {singleJob.company?.description && (
//                 <div className="mt-4">
//                   <h4 className="font-medium text-gray-800 mb-2">About Us</h4>
//                   <p className="text-sm text-gray-600">
//                     {singleJob.company.description}
//                   </p>
//                 </div>
//               )}
              
//               <div className="mt-4 pt-4 border-t border-gray-100">
//                 <h4 className="font-medium text-gray-800 mb-3">Company Details</h4>
//                 <div className="space-y-3">
//                   {singleJob.company?.email && (
//                     <div className="flex items-center text-sm">
//                       <Mail className="h-4 w-4 text-gray-500 mr-2" />
//                       <a href={`mailto:${singleJob.company.email}`} className="text-blue-600 hover:underline">
//                         {singleJob.company.email}
//                       </a>
//                     </div>
//                   )}
                  
//                   {singleJob.company?.phone && (
//                     <div className="flex items-center text-sm">
//                       <Phone className="h-4 w-4 text-gray-500 mr-2" />
//                       <a href={`tel:${singleJob.company.phone}`} className="text-blue-600 hover:underline">
//                         {singleJob.company.phone}
//                       </a>
//                     </div>
//                   )}
                  
//                   {singleJob.company?.address && (
//                     <div className="flex items-start text-sm">
//                       <Map className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
//                       <span className="text-gray-700">
//                         {singleJob.company.address}
//                         {singleJob.company.city && `, ${singleJob.company.city}`}
//                         {singleJob.company.state && `, ${singleJob.company.state}`}
//                         {singleJob.company.country && `, ${singleJob.company.country}`}
//                         {singleJob.company.pincode && ` - ${singleJob.company.pincode}`}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Share Job */}
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h3 className="font-semibold text-lg mb-4">Share This Job</h3>
//               <div className="space-y-3">
//                 <Button 
//                   variant="outline" 
//                   className="w-full justify-start"
//                   onClick={shareJob}
//                 >
//                   <ExternalLink className="h-4 w-4 mr-2" />
//                   Share via Google
//                 </Button>
//                 <Button 
//                   variant="outline" 
//                   className="w-full justify-start"
//                   onClick={() => {
//                     const text = `Check out this ${singleJob.jobType} position at ${singleJob.company?.name}: ${window.location.href}`;
//                     window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
//                   }}
//                 >
//                   <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
//                   </svg>
//                   Share on Twitter
//                 </Button>
//                 <Button 
//                   variant="outline" 
//                   className="w-full justify-start"
//                   onClick={() => {
//                     const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
//                     window.open(url, '_blank');
//                   }}
//                 >
//                   <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                   </svg>
//                   Share on LinkedIn
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Application Confirmation Dialog */}
//       <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold">Confirm Application</DialogTitle>
//             <DialogDescription className="text-gray-600">
//               You are about to apply for <span className="font-medium text-gray-900">{singleJob.title}</span> at <span className="font-medium text-gray-900">{singleJob.company?.name}</span>.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="my-4 p-4 bg-gray-50 rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-2">Your Application Includes:</h4>
//             <ul className="space-y-2 text-sm text-gray-600">
//               <li className="flex items-start">
//                 <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                 <span>Your profile information</span>
//               </li>
//               <li className="flex items-start">
//                 <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                 <span>Your resume: <span className="font-medium">
//                   {user?.profile?.resume?.split('/').pop() || 'No resume uploaded'}
//                 </span></span>
//               </li>
//               {user?.profile?.coverLetter && (
//                 <li className="flex items-start">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                   <span>Your cover letter</span>
//                 </li>
//               )}
//             </ul>
            
//             {!user?.profile?.resume && (
//               <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
//                 <p className="text-sm text-yellow-700">
//                   You haven't uploaded a resume yet. Please upload one before applying.
//                 </p>
//               </div>
//             )}
//           </div>
          
//           <DialogFooter className="sm:flex sm:flex-row-reverse sm:space-x-2 sm:space-x-reverse">
//             <Button 
//               onClick={confirmApplication} 
//               disabled={isApplying || !user?.profile?.resume}
//               className="w-full sm:w-auto"
//             >
//               {isApplying ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Applying...
//                 </>
//               ) : 'Submit Application'}
//             </Button>
//             <Button 
//               variant="outline" 
//               onClick={() => setShowConfirmDialog(false)}
//               className="w-full sm:w-auto mt-2 sm:mt-0"
//               disabled={isApplying}
//             >
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Resume Upload Dialog */}
//       <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Upload Resume</DialogTitle>
//             <DialogDescription>
//               Please upload your resume to apply for this position.
//             </DialogDescription>
//           </DialogHeader>
//           <ResumeUpload onSuccess={() => setShowResumeDialog(false)} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default JobDescription;


// import React, { useEffect, useState, useRef } from 'react'
// import { Badge } from './ui/badge'
// import { Button } from './ui/button'
// import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
// import { setSingleJob } from '@/redux/jobSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'sonner';
// import { Briefcase, MapPin, DollarSign, Clock, Users, Calendar, Building, CheckCircle, ArrowLeft, ExternalLink, Star, TrendingUp, FileText, Share2, Mail, Linkedin, Twitter, Facebook, Copy, Check } from 'lucide-react';
// import Navbar from './shared/Navbar';
// import { Avatar, AvatarImage } from './ui/avatar'
// import LoadingSpinner from './shared/LoadingSpinner';
// import { formatLocationForDisplay } from '../utils/locationUtils';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
// import ResumeUpload from './jobseeker/ResumeUpload';




// const JobDescription = () => {
//     const {singleJob} = useSelector(store => store.job);
//     const {user} = useSelector(store=>store.auth);
//     const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
//     const [isApplied, setIsApplied] = useState(isIntiallyApplied);

//     const params = useParams();
//     const jobId = params.id;
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const requirementsRef = useRef(null);
//     const jobDescriptionRef = useRef(null);
//     const headerRef = useRef(null);

//     const [showResumeDialog, setShowResumeDialog] = useState(false);
//     const [applyAfterUpload, setApplyAfterUpload] = useState(false);
//     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//     const [showShareMenu, setShowShareMenu] = useState(false);
//     const [isCopied, setIsCopied] = useState(false);
//     const shareMenuRef = useRef(null);

//     // Close share menu when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
//                 setShowShareMenu(false);
//             }
//         }
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const isProfileComplete = (u) => {
//         if (!u) return false;
//         // Define your completeness criteria here (adjust as needed)
//         const hasPhone = Boolean(u.phoneNumber);
//         const hasResume = Boolean(u.profile?.resume);
//         return hasPhone && hasResume; // extend with more fields if required
//     };

//     const applyJobHandler = async () => {
//         // Check if user is logged in
//         if (!user) {
//             // Store job info for after login
//             localStorage.setItem('pendingJobApplication', JSON.stringify({
//                 jobId: jobId,
//                 jobTitle: singleJob?.title,
//                 returnUrl: window.location.pathname
//             }));
            
//             toast.info('Please login to apply for this job');
//             navigate('/login');
//             return;
//         }

//         // Check profile completeness first
//         if (!isProfileComplete(user)) {
//             // Save intent and send to profile editor
//             localStorage.setItem('pendingJobApplication', JSON.stringify({
//                 jobId,
//                 jobTitle: singleJob?.title,
//                 returnUrl: window.location.pathname,
//                 requireConfirm: true,
//                 autoReturn: true
//             }));
//             toast.info('Please complete your profile before applying.');
//             navigate('/profile?edit=1');
//             return;
//         }

//         setShowConfirmDialog(true);
//         return;
//     }

//     // Share job function
//     const shareJob = (platform = null) => {
//         const jobTitle = singleJob?.title || 'Job Opportunity';
//         const companyName = singleJob?.company?.name || '';
//         const jobUrl = window.location.href;
//         const text = `Check out this ${singleJob?.jobType || ''} position at ${companyName}`;

//         switch (platform) {
//             case 'copy':
//                 navigator.clipboard.writeText(jobUrl);
//                 setIsCopied(true);
//                 toast.success('Link copied to clipboard!');
//                 setTimeout(() => setIsCopied(false), 2000);
//                 setShowShareMenu(false);
//                 break;
//             case 'email':
//                 window.open(`mailto:?subject=${encodeURIComponent(jobTitle)}&body=${encodeURIComponent(`${text}\n\n${jobUrl}`)}`);
//                 break;
//             case 'linkedin':
//                 window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`);
//                 break;
//             case 'twitter':
//                 window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${jobUrl}`)}`);
//                 break;
//             case 'facebook':
//                 window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(text)}`);
//                 break;
//             default:
//                 if (navigator.share) {
//                     navigator.share({
//                         title: jobTitle,
//                         text: text,
//                         url: jobUrl,
//                     }).catch(console.error);
//                 } else {
//                     setShowShareMenu(!showShareMenu);
//                 }
//         }
//     };

//     // Share menu component
//     const ShareMenu = () => (
//         <div 
//             ref={shareMenuRef}
//             className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
//         >
//             <div className="py-1" role="menu" aria-orientation="vertical">
//                 <button
//                     onClick={() => shareJob('copy')}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     role="menuitem"
//                 >
//                     {isCopied ? (
//                         <>
//                             <Check className="w-4 h-4 mr-3 text-green-500" />
//                             <span>Copied!</span>
//                         </>
//                     ) : (
//                         <>
//                             <Copy className="w-4 h-4 mr-3 text-gray-500" />
//                             <span>Copy link</span>
//                         </>
//                     )}
//                 </button>
//                 <button
//                     onClick={() => shareJob('email')}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     role="menuitem"
//                 >
//                     <Mail className="w-4 h-4 mr-3 text-gray-500" />
//                     <span>Email</span>
//                 </button>
//                 <button
//                     onClick={() => shareJob('linkedin')}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     role="menuitem"
//                 >
//                     <Linkedin className="w-4 h-4 mr-3 text-[#0A66C2]" />
//                     <span>LinkedIn</span>
//                 </button>
//                 <button
//                     onClick={() => shareJob('twitter')}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     role="menuitem"
//                 >
//                     <Twitter className="w-4 h-4 mr-3 text-[#1DA1F2]" />
//                     <span>Twitter</span>
//                 </button>
//                 <button
//                     onClick={() => shareJob('facebook')}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
//                     role="menuitem"
//                 >
//                     <Facebook className="w-4 h-4 mr-3 text-[#1877F2]" />
//                     <span>Facebook</span>
//                 </button>
//             </div>
//         </div>
//     );

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

//     if (!singleJob) {
//         return (
//             <>
               
//                 <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
//                     <LoadingSpinner size={60} />
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
           
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//                 <div className="max-w-6xl mx-auto px-4 py-8">
                
//                     <div className="mb-6">
//                         <button
//                             onClick={() => window.history.back()}
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
//                                     <div className="flex flex-col sm:flex-row gap-3">
//                                         <Button
//                                             onClick={isApplied ? null : applyJobHandler}
//                                             disabled={isApplied}
//                                             className={`px-6 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${
//                                                 isApplied 
//                                                     ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed' 
//                                                     : 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105'
//                                             }`}
//                                         >
//                                             {isApplied ? (
//                                                 <>
//                                                     <CheckCircle className="w-5 h-5 mr-2" />
//                                                     Applied
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <TrendingUp className="w-5 h-5 mr-2" />
//                                                     Apply Now
//                                                 </>
//                                             )}
//                                         </Button>
//                                         <Button 
//                                             variant="outline"
//                                             onClick={shareJob}
//                                             className="px-4 py-3 border-gray-300 hover:bg-gray-50"
//                                             title="Share this job"
//                                         >
//                                             <Share2 className="w-5 h-5 text-gray-600" />
//                                         </Button>
//                                     </div>
                                    
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

//                                             {/* <div className="flex items-center gap-3 mb-4">
//                                                 {singleJob.company.logo ? (
//                                                     <img 
//                                                         src={singleJob.company.logo} 
//                                                         alt={singleJob.company.name}
//                                                         className="w-12 h-12 rounded-lg object-cover"
//                                                     />
//                                                 ) : (
//                                                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                                                         <Building className="w-6 h-6 text-blue-600" />
//                                                     </div>
//                                                 )}
//                                                 <div>
//                                                     <h4 className="font-semibold text-gray-900">{singleJob.company.name}</h4>
//                                                     <p className="text-sm text-gray-600">{singleJob.company.location}</p>
//                                                 </div>
//                                             </div> */}

//                                              <div className="flex-1 min-w-0">
//                                              <div className="flex-shrink-0">
//                     <Avatar className="w-12 h-12 border-2 border-gray-100">
//                         <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
//                     </Avatar>
//                 </div>
//                     <h3 className='font-semibold text-lg text-gray-900 truncate'>{singleJob?.company?.name}</h3>
//                     <div className="flex items-center gap-1 text-sm text-gray-500">
//                         <MapPin className="w-4 h-4" />
//                         <span>{formatLocationForDisplay(singleJob?.location) || 'India'}</span>
//                     </div>
//                 </div>
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
//                         <Button onClick={confirmApply} disabled={isApplied || !user?.profile?.resume}>Submit Application</Button>
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
  Twitter, 
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
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${jobUrl}`)}`);
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
                    onClick={() => shareJob('twitter')}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    role="menuitem"
                >
                    <Twitter className="w-4 h-4 mr-3 text-[#1DA1F2]" />
                    <span>Twitter</span>
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
                                                ? `₹${singleJob.salary.min}-${singleJob.salary.max} LPA`
                                                : `${singleJob?.salary} LPA`
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
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 cursor-not-allowed' 
                                                    : 'bg-white text-blue-600 hover:bg-gray-50 hover:shadow-2xl transform hover:scale-105'
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
                                                        ? 'border-blue-200 text-blue-600' 
                                                        : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                                <span className="ml-2">{isSaved ? 'Saved' : 'Save'}</span>
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Stats */}
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

                        {/* Content Section */}
                        <div className="p-8 lg:p-10">
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Job Description */}
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

                                    {/* Requirements */}
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

                                    {/* Share This Job Section */}
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
                                                onClick={() => shareJob('twitter')}
                                                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl py-3 transition-all duration-200"
                                            >
                                                <Twitter className="w-5 h-5 mr-2" />
                                                Twitter
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

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Job Details Card */}
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
                                                        ? `₹${singleJob.salary.min}-${singleJob.salary.max} LPA`
                                                        : `₹${singleJob?.salary} LPA`
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

                                    {/* Company Info */}
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

                                    {/* Posted Date */}
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

            {/* Resume required dialog */}
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

            {/* Confirmation dialog with resume preview */}
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