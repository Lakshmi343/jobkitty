
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Building, Globe, MapPin, Briefcase, FileDown, Award, Eye, GraduationCap, User, Phone } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useSelector } from "react-redux";
import UpdateProfileDialog from "./UpdateProfileDialog";
import AppliedJobTable from "./AppliedJobTable";
import IframePdfViewer from "./IframePdfViewer";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertCircle } from 'lucide-react';
import ResumeUpload from "./jobseeker/ResumeUpload";

import axios from "axios";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [skillsPromptOpen, setSkillsPromptOpen] = useState(false);
  const [initialStepOverride, setInitialStepOverride] = useState(undefined);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStepFromQuery = (() => {
    const s = searchParams.get('step');
    if (!s) return undefined;
    return s.toLowerCase();
  })();
  
  
  useGetAppliedJobs();

  const isProfileComplete = useMemo(() => {
    const hasPhone = Boolean(user?.phoneNumber);
    const hasResume = Boolean(user?.profile?.resume);
    return hasPhone && hasResume;
  }, [user]);

  // Helper to render initials when no profile photo
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

 
  useEffect(() => {
    // Open edit dialog if requested via query param
    const editRequested = searchParams.get('edit') === '1';
    if (editRequested) {
      setOpen(true);
    }

    // If returning from profile update to continue application
    const pending = localStorage.getItem('pendingJobApplication');
    if (pending) {
      const data = JSON.parse(pending);
      // Only auto-return if profile is complete, a returnUrl exists, and we know we came here for application flow
      if (editRequested && isProfileComplete && data.returnUrl && data.autoReturn) {
        // Navigate back to job page; JobDescription will show confirm dialog
        navigate(data.returnUrl, { replace: true });
        // Clear pending marker so future visits to profile don't redirect
        localStorage.removeItem('pendingJobApplication');
      }
    }
  }, [searchParams, isProfileComplete, navigate]);

  useEffect(() => {
    if (user?.role === "Jobseeker") {
      // Open a modal prompting to complete profile if skills are missing
      const needsSkills = !(Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0);
      if (needsSkills) {
        setInitialStepOverride('skills');
        setSkillsPromptOpen(true);
      }

      if (user?.profile?.resume) {
        console.log("✅ Resume URL:", user.profile.resume);
        console.log("✅ Resume File Name:", user.profile.resumeOriginalName);
      } else {
        console.log("⚠️ No Resume Uploaded");
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (user?.role !== "Employer") return;
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/employer/company/${user?._id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCompanyData(res.data.company);
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyProfile();
  }, [user]);

  return (
    <div>
    

    
      {user?.role === "Jobseeker" && (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
    
            {/* Pending application banner */}
            {(() => {
              const pending = typeof window !== 'undefined' ? localStorage.getItem('pendingJobApplication') : null;
              if (pending && !isProfileComplete) {
                const data = JSON.parse(pending);
                return (
                  <div className="mb-4 p-3 sm:p-4 border border-amber-300 bg-amber-50 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-amber-800 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Finish your profile to continue applying to "{data.jobTitle}"</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" onClick={() => setOpen(true)} size="sm">Update Profile</Button>
                      {isProfileComplete && data.returnUrl && (
                        <Button size="sm" onClick={() => navigate(data.returnUrl)}>Continue Applying</Button>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <Card className="shadow-md border border-gray-200 mb-4 sm:mb-6">
              <CardHeader className="bg-white p-4 sm:p-6">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-200 bg-white mx-auto sm:mx-0">
                      <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Photo" className="object-cover" />
                      <AvatarFallback className="text-sm sm:text-base font-semibold">
                        {getInitials(user?.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left w-full md:w-auto">
                      <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                        <span className="break-words">{user?.fullname}</span>
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm sm:text-base max-w-prose">
                        {user?.profile?.bio || "Professional Job Seeker"}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-3 text-gray-600">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                          <a
                            href={user?.email ? `mailto:${user.email}` : undefined}
                            className="text-xs sm:text-sm truncate max-w-[220px] sm:max-w-[280px] md:max-w-none hover:underline"
                          >
                            {user?.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                          {user?.phoneNumber ? (
                            <a href={`tel:${user.phoneNumber}`} className="text-xs sm:text-sm hover:underline">{user.phoneNumber}</a>
                          ) : (
                            <span className="text-xs sm:text-sm">No phone</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setOpen(true)} 
                    variant="outline"
                    className="gap-2 px-3 py-2 sm:px-4 text-sm sm:text-base w-full md:w-auto"
                  >
                    <Pen size={14} className="sm:w-4 sm:h-4" /> Edit Profile
                  </Button>
                </div>
              </CardHeader>
            </Card>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
           
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-gray-800 text-lg sm:text-xl">
                      <Award size={18} className="sm:w-5 sm:h-5" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    <div className="flex flex-wrap gap-2">
                      {user?.profile?.skills?.length > 0 ? (
                        user.profile.skills.map((skill, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline"
                            className="px-3 py-1 text-sm"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <div className="text-center w-full py-6">
                          <Award size={40} className="mx-auto text-gray-400 mb-3" />
                          <p className="text-gray-500 mb-3">No skills added yet</p>
                          <Button 
                            variant="outline" 
                            onClick={() => setOpen(true)}
                            size="sm"
                          >
                            Add Skills
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

 
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-gray-800 text-lg sm:text-xl">
                      <GraduationCap size={18} className="sm:w-5 sm:h-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    {user?.profile?.education ? (
                      <div className="space-y-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                          {user.profile.education.degree}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                          <Building size={14} className="sm:w-4 sm:h-4" />
                          {user.profile.education.institution}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          Graduated: {user.profile.education.yearOfCompletion}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <GraduationCap size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 mb-3">No education details added</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setOpen(true)}
                          size="sm"
                        >
                          Add Education
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-gray-800 text-lg sm:text-xl">
                      <Briefcase size={18} className="sm:w-5 sm:h-5" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    {user?.profile?.experience?.years || user?.profile?.experience?.field ? (
                      <div className="space-y-2">
                        {user?.profile?.experience?.years && (
                          <p className="text-gray-700 text-sm sm:text-base"><span className="font-medium">Years:</span> {user.profile.experience.years}</p>
                        )}
                        {user?.profile?.experience?.field && (
                          <p className="text-gray-700 text-sm sm:text-base"><span className="font-medium">Field:</span> {user.profile.experience.field}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Briefcase size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 mb-3">No experience added</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setOpen(true)}
                          size="sm"
                        >
                          Add Experience
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

             
              <div className="space-y-4 sm:space-y-6">
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-gray-800 text-lg sm:text-xl">
                      <FileDown size={18} className="sm:w-5 sm:h-5" />
                      Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    {/* Use unified resume upload component for viewing/replacing resume */}
                    <ResumeUpload onSuccess={() => { /* no-op */ }} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Applied Jobs Section */}
            <Card className="shadow-md border border-gray-200 mt-4 sm:mt-6">
              <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-gray-800 text-lg sm:text-xl">
                  <Briefcase size={18} className="sm:w-5 sm:h-5" />
                  Applied Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6 bg-white">
                <div className="overflow-x-auto px-4 sm:px-0 py-4 sm:py-0">
                  <AppliedJobTable />
                </div>
              </CardContent>
            </Card>

            {/* PDF Viewer Modal */}
            <IframePdfViewer
              pdfUrl={user?.profile?.resume}
              isOpen={pdfViewerOpen}
              onClose={() => setPdfViewerOpen(false)}
              fileName={user?.profile?.resumeOriginalName}
            />

            {/* Update Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen} initialStep={initialStepOverride || initialStepFromQuery} />

            {/* Skills/Profile completion modal */}
            <Dialog open={skillsPromptOpen} onOpenChange={setSkillsPromptOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complete your profile</DialogTitle>
                  <DialogDescription>
                    Please add your skills to complete your profile. This helps employers find you faster.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setSkillsPromptOpen(false)}>Later</Button>
                  <Button onClick={() => { setSkillsPromptOpen(false); setInitialStepOverride('skills'); setOpen(true); }}>Update Now</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Employer Section */}
      {user?.role === "Employer" && (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto p-3 sm:p-6">
            <Card className="shadow-lg rounded-2xl">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto sm:mx-0">
                    <AvatarImage src={companyData?.logo} alt="Company Logo" />
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-lg sm:text-xl">{companyData?.name}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{companyData?.description}</CardDescription>
                  </div>
                </div>
                <Button size="sm" className="gap-2 w-full sm:w-auto text-sm" onClick={() => (window.location.href = "/company-setup")}>
                  <Pen size={14} className="sm:w-4 sm:h-4" /> Edit Company
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Briefcase size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> 
                    <span className="truncate">{companyData?.type || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Award size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> 
                    <span className="truncate">{companyData?.experience || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Globe size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <a href={companyData?.website} target="_blank" className="text-blue-600 hover:underline truncate">
                      {companyData?.website || "N/A"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> 
                    <span className="truncate">{companyData?.location || "N/A"}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> 
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Contact size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> 
                    <span className="truncate">{user?.phoneNumber || "No phone added"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
