import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Briefcase, MapPin, DollarSign, Clock, Building, CheckCircle, ArrowLeft, ExternalLink, Globe,FileText
} from 'lucide-react';


import Navbar from './shared/Navbar';
import LoadingSpinner from './shared/LoadingSpinner';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from './ui/dialog';
import ResumeUpload from './jobseeker/ResumeUpload';


import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { formatLocationForDisplay } from '../utils/locationUtils';
import { addJobPostingSchema } from '../utils/schemaUtils';

const JobDescription = () => {

  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  const requirementsRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: jobId } = useParams();
  const [searchParams] = useSearchParams();


  useEffect(() => {
    if (singleJob?.applications && user?._id) {
      const hasApplied = singleJob.applications.some(
        app => app.applicant === user._id
      );
      setIsApplied(hasApplied);
    }
  }, [singleJob, user]);

  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${JOB_API_END_POINT}/${jobId}`);
        dispatch(setSingleJob(data.job));
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId, dispatch]);

  
  useEffect(() => {
    if (singleJob?._id === jobId) {
 
      addJobPostingSchema(singleJob, window.location.origin);
      
      
      const section = searchParams.get('section');
      if (section === 'requirements' && requirementsRef.current) {
        setTimeout(() => {
          requirementsRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, [singleJob, jobId, searchParams]);

 
  const handleApply = async () => {
    if (!user) {
      
      navigate('/login', { 
        state: { 
          from: `/jobs/${jobId}`,
          message: 'Please login to apply for this job'
        } 
      });
      return;
    }

  
    if (!user.profile?.resume) {
      setShowResumeDialog(true);
      return;
    }

    setShowConfirmDialog(true);
  };

 
  const confirmApplication = async () => {
    try {
      await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );
      
      toast.success('Application submitted successfully!');
      setIsApplied(true);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    }
  };

  // Share job
  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: singleJob.title,
        text: `Check out this ${singleJob.jobType} position at ${singleJob.company?.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
 
      const shareUrl = `https://www.google.com/search?q=${encodeURIComponent(
        `${singleJob.title} at ${singleJob.company?.name} ${window.location.href}`
      )}`;
      window.open(shareUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/jobs')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-2 space-y-6">
    
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{singleJob.title}</h1>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{singleJob.company?.name || 'Company not specified'}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleApply} 
                    disabled={isApplied}
                    className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                  >
                    {isApplied ? 'Applied' : 'Apply Now'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={shareJob}
                    className="whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {formatLocationForDisplay(singleJob.location) || 'Not specified'}
                        {singleJob.remoteWork && ' (Remote)'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium">
                        {singleJob.salaryMin || singleJob.salaryMax 
                          ? `₹${singleJob.salaryMin?.toLocaleString() || '0'} - ₹${singleJob.salaryMax?.toLocaleString() || '0'}` 
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Job Type</p>
                      <p className="font-medium capitalize">{singleJob.jobType || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="font-medium">
                        {singleJob.createdAt 
                          ? new Date(singleJob.createdAt).toLocaleDateString() 
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: singleJob.description }} 
              />
            </div>

         
            {singleJob.requirements?.length > 0 && (
              <div ref={requirementsRef} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {singleJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          
          <div className="space-y-6">
         
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">About Company</h3>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16 border-2 border-gray-100 flex-shrink-0">
                  <AvatarImage src={singleJob.company?.logo} alt={singleJob.company?.name} />
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">{singleJob.company?.name}</h4>
                  {singleJob.company?.website && (
                    <a
                      href={singleJob.company.website.startsWith('http') 
                        ? singleJob.company.website 
                        : `https://${singleJob.company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {singleJob.company.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
              {singleJob.company?.description && (
                <p className="mt-4 text-sm text-gray-600">
                  {singleJob.company.description}
                </p>
              )}
            </div>

         
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Share This Job</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={shareJob}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share via Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

  
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogDescription>
              You are about to apply for {singleJob.title} at {singleJob.company?.name}.
              Please confirm to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApplication}>
              Confirm Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogDescription>
              Please upload your resume to apply for this position.
            </DialogDescription>
          </DialogHeader>
          <ResumeUpload onSuccess={() => setShowResumeDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDescription;
