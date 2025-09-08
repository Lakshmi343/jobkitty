
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
      <Navbar />

    
      {user?.role === "Jobseeker" && (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto p-6">
    
            <Card className="shadow-md border border-gray-200 mb-6">
              <CardHeader className="bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20 border-2 border-gray-300">
                      <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Photo" />
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{user?.fullname}</CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {user?.profile?.bio || "Professional Job Seeker"}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} />
                          <span className="text-sm">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          <span className="text-sm">{user?.phoneNumber || "No phone"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setOpen(true)} 
                    variant="outline"
                    className="gap-2 px-4 py-2"
                  >
                    <Pen size={16} /> Edit Profile
                  </Button>
                </div>
              </CardHeader>
            </Card>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
              <div className="lg:col-span-2 space-y-6">
            
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <Award size={20} />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
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
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <GraduationCap size={20} />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    {user?.profile?.education ? (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {user.profile.education.degree}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Building size={16} />
                          {user.profile.education.institution}
                        </p>
                        <p className="text-gray-500 text-sm">
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

             
              <div className="space-y-6">
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <FileDown size={20} />
                      Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    {user?.profile?.resume ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="text-center">
                            <FileDown size={28} className="mx-auto text-gray-600 mb-2" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {user.profile.resumeOriginalName || "resume.pdf"}
                            </p>
                            <p className="text-xs text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Button
                            onClick={() => setPdfViewerOpen(true)}
                            className="w-full gap-2"
                          >
                            <Eye size={16} />
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
                            className="w-full gap-2"
                          >
                            <FileDown size={16} />
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
            <Card className="shadow-md border border-gray-200 mt-6">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <Briefcase size={20} />
                  Applied Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
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
        <div className="max-w-4xl mx-auto p-6">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={companyData?.logo} alt="Company Logo" />
                </Avatar>
                <div>
                  <CardTitle>{companyData?.name}</CardTitle>
                  <CardDescription>{companyData?.description}</CardDescription>
                </div>
              </div>
              <Button size="sm" className="gap-2" onClick={() => (window.location.href = "/company-setup")}>
                <Pen size={16} /> Edit Company
              </Button>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} /> <span>{companyData?.type || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} /> <span>{companyData?.experience || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} />{" "}
                  <a href={companyData?.website} target="_blank" className="text-blue-600 hover:underline">
                    {companyData?.website || "N/A"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> <span>{companyData?.location || "N/A"}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} /> <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Contact size={16} /> <span>{user?.phoneNumber || "No phone added"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
