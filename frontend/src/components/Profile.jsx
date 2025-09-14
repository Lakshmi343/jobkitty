
import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Building, Globe, MapPin, Briefcase, FileDown, Award, Eye, GraduationCap, User, Phone } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useSelector } from "react-redux";
import UpdateProfileDialog from "./UpdateProfileDialog";
import AppliedJobTable from "./AppliedJobTable";
import IframePdfViewer from "./IframePdfViewer";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";

import axios from "axios";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  
  
  useGetAppliedJobs();

 
  useEffect(() => {
    if (user?.role === "Jobseeker") {
    

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
          <div className="max-w-6xl mx-auto p-3 sm:p-6">
    
            <Card className="shadow-md border border-gray-200 mb-4 sm:mb-6">
              <CardHeader className="bg-white p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-300 mx-auto sm:mx-0">
                      <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Photo" />
                    </Avatar>
                    <div className="text-center sm:text-left w-full sm:w-auto">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{user?.fullname}</CardTitle>
                      <CardDescription className="text-gray-600 text-sm sm:text-base">
                        {user?.profile?.bio || "Professional Job Seeker"}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm truncate">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">{user?.phoneNumber || "No phone"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setOpen(true)} 
                    variant="outline"
                    className="gap-2 px-3 py-2 sm:px-4 text-sm w-full sm:w-auto"
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
                    {user?.profile?.resume ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                          <div className="text-center">
                            <FileDown size={24} className="sm:w-7 sm:h-7 mx-auto text-gray-600 mb-2" />
                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 truncate">
                              {user.profile.resumeOriginalName || "resume.pdf"}
                            </p>
                            <p className="text-xs text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Button
                            onClick={() => setPdfViewerOpen(true)}
                            className="w-full gap-2 text-sm"
                            size="sm"
                          >
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                            Preview Resume
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = user.profile.resume;
                              link.download = user.profile.resumeOriginalName || 'resume.pdf';
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="w-full gap-2 text-sm"
                            size="sm"
                          >
                            <FileDown size={14} className="sm:w-4 sm:h-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileDown size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 mb-3">No resume uploaded</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setOpen(true)}
                          className="gap-2"
                          size="sm"
                        >
                          <FileDown size={16} />
                          Upload Resume
                        </Button>
                      </div>
                    )}
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
              <CardContent className="p-4 sm:p-6 bg-white">
                <AppliedJobTable />
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
            <UpdateProfileDialog open={open} setOpen={setOpen} />
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
