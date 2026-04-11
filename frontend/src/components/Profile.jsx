import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Building, Globe, MapPin, Briefcase, FileDown, Award, GraduationCap, Phone, AlertCircle, } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useSelector } from "react-redux";
import UpdateProfileDialog from "./UpdateProfileDialog";
import AppliedJobTable from "./AppliedJobTable";
import IframePdfViewer from "./IframePdfViewer";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import ResumeUpload from "./jobseeker/ResumeUpload";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../utils/constant";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [initialStepOverride, setInitialStepOverride] = useState(undefined);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const { user: authUser } = useSelector((store) => store.auth);
  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = id ? profileUser : authUser;
  const isViewingSelf = !id || id === authUser?._id;
  const isAdminViewing = (authUser?.role === 'admin' || authUser?.role === 'super_admin') && !isViewingSelf;

  const initialStepFromQuery = (() => {
    const s = searchParams.get("step");
    if (!s) return undefined;
    return s.toLowerCase();
  })();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${ADMIN_API_END_POINT}/jobseekers/${id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.data.success) {
          setProfileUser(res.data.jobseeker);
        }
      } catch (error) {
        console.error("Error fetching jobseeker profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserProfile();
  }, [id]);

  useGetAppliedJobs();
  const isProfileComplete = useMemo(() => {
    const hasPhone = Boolean(user?.phoneNumber);
    const hasResume = Boolean(user?.profile?.resume);
    return hasPhone && hasResume;
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    const editRequested = searchParams.get("edit") === "1";
    if (editRequested) setOpen(true);

    const pending = localStorage.getItem("pendingJobApplication");
    if (pending) {
      const data = JSON.parse(pending);
      if (editRequested && isProfileComplete && data.returnUrl && data.autoReturn) {
        navigate(data.returnUrl, { replace: true });
        localStorage.removeItem("pendingJobApplication");
      }
    }
  }, [searchParams, isProfileComplete, navigate]);

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
        const res = await axios.get(
          `http://localhost:5000/api/employer/company/${user?._id}`,
          { withCredentials: true }
        );
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

  if (loadingProfile && id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Back button for admins */}
      {isAdminViewing && (
        <div className="bg-white border-b border-gray-200 py-2">
          <div className="max-w-6xl mx-auto px-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ChevronDown className="w-4 h-4 rotate-90" /> Back to List
            </Button>
          </div>
        </div>
      )}

      {user?.role === "Jobseeker" && (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">

            {(() => {
              const pending =
                typeof window !== "undefined"
                  ? localStorage.getItem("pendingJobApplication")
                  : null;
              if (pending && !isProfileComplete) {
                const data = JSON.parse(pending);
                return (
                  <div className="mb-4 p-3 sm:p-4 border border-amber-300 bg-amber-50 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-amber-800 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Finish your profile to continue applying to "{data.jobTitle}"
                      </span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" onClick={() => setOpen(true)} size="sm">
                        Update Profile
                      </Button>
                      {isProfileComplete && data.returnUrl && (
                        <Button size="sm" onClick={() => navigate(data.returnUrl)}>
                          Continue Applying
                        </Button>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Jobseeker Profile Card */}
            <Card className="shadow-md border border-gray-200 mb-4 sm:mb-6">
              <CardHeader className="bg-white p-4 sm:p-6">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-200 bg-white mx-auto sm:mx-0">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="Profile Photo"
                        className="object-cover"
                      />
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
                          <Mail size={14} />
                          <a
                            href={user?.email ? `mailto:${user.email}` : undefined}
                            className="text-xs sm:text-sm truncate hover:underline"
                          >
                            {user?.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          {user?.phoneNumber ? (
                            <a
                              href={`tel:${user.phoneNumber}`}
                              className="text-xs sm:text-sm hover:underline"
                            >
                              {user.phoneNumber}
                            </a>
                          ) : (
                            <span className="text-xs sm:text-sm">No phone</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isViewingSelf && (
                    <Button
                      onClick={() => setOpen(true)}
                      variant="outline"
                      className="gap-2 px-3 py-2 sm:px-4 text-sm sm:text-base w-full md:w-auto"
                    >
                      <Pen size={14} /> Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Skills Section */}
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800">
                      <Award size={18} /> Skills & Expertise
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        if (isViewingSelf) {
                          setInitialStepOverride("skills");
                          setOpen(true);
                        }
                      }}
                    >
                      {isViewingSelf && <><Pen size={14} className="mr-1" /> Edit</>}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    <div className="flex flex-wrap gap-2">
                      {user?.profile?.skills?.length > 0 ? (
                        user.profile.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="px-3 py-1 text-sm">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <div className="text-center w-full py-6">
                          <Award size={40} className="mx-auto text-gray-400 mb-3" />
                          <p className="text-gray-500 mb-3">No skills added yet</p>
                          <Button variant="outline" onClick={() => setOpen(true)} size="sm">
                            Add Skills
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Education Section */}
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800">
                      <GraduationCap size={18} /> Education
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        if (isViewingSelf) {
                          setInitialStepOverride("education");
                          setOpen(true);
                        }
                      }}
                    >
                      {isViewingSelf && <><Pen size={14} className="mr-1" /> Edit</>}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    {user?.profile?.education ? (
                      <div className="space-y-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                          {user.profile.education.degree}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                          <Building size={14} /> {user.profile.education.institution}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          Graduated: {user.profile.education.yearOfCompletion}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <GraduationCap size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 mb-3">No education details added</p>
                        <Button variant="outline" onClick={() => setOpen(true)} size="sm">
                          Add Education
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Experience Section */}
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800">
                      <Briefcase size={18} /> Experience
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        if (isViewingSelf) {
                          setInitialStepOverride("experience");
                          setOpen(true);
                        }
                      }}
                    >
                      {isViewingSelf && <><Pen size={14} className="mr-1" /> Edit</>}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    {user?.profile?.experience?.years || user?.profile?.experience?.field ? (
                      <div className="space-y-2">
                        {user?.profile?.experience?.years && (
                          <p className="text-gray-700">
                            <span className="font-medium">Years:</span>{" "}
                            {user.profile.experience.years}
                          </p>
                        )}
                        {user?.profile?.experience?.field && (
                          <p className="text-gray-700">
                            <span className="font-medium">Field:</span>{" "}
                            {user.profile.experience.field}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Briefcase size={40} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 mb-3">No experience added</p>
                        <Button variant="outline" onClick={() => setOpen(true)} size="sm">
                          Add Experience
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column — Resume */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800">
                      <FileDown size={18} /> Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    <ResumeUpload />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Applied Jobs */}
            <Card className="shadow-md border border-gray-200 mt-4 sm:mt-6">
              <CardHeader className="bg-white border-b border-gray-200 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-800">
                  <Briefcase size={18} /> Applied Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6 bg-white">
                <div className="overflow-x-auto px-4 sm:px-0 py-4 sm:py-0">
                  <AppliedJobTable />
                </div>
              </CardContent>
            </Card>


            <IframePdfViewer
              pdfUrl={user?.profile?.resume}
              isOpen={pdfViewerOpen}
              onClose={() => setPdfViewerOpen(false)}
              fileName={user?.profile?.resumeOriginalName}
            />


            <UpdateProfileDialog
              open={open}
              setOpen={setOpen}
              initialStep={initialStepOverride || initialStepFromQuery}
            />
          </div>
        </div>
      )}


      {user?.role === "Employer" && (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto p-3 sm:p-6">
            <Card className="shadow-lg rounded-2xl">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto sm:mx-0">
                    <AvatarImage src={companyData?.logo} alt="Company Logo" />
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-lg sm:text-xl">
                      {companyData?.name}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {companyData?.description}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="gap-2 w-full sm:w-auto text-sm"
                  onClick={() => (window.location.href = "/company-setup")}
                >
                  <Pen size={14} /> Edit Company
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Briefcase size={14} />{" "}
                    <span>{companyData?.type || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Award size={14} />{" "}
                    <span>{companyData?.experience || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Globe size={14} />
                    <a
                      href={companyData?.website}
                      target="_blank"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {companyData?.website || "N/A"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <MapPin size={14} />{" "}
                    <span>{companyData?.location || "N/A"}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Mail size={14} /> <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Contact size={14} />{" "}
                    <span>{user?.phoneNumber || "No phone added"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {["admin", "super_admin", "moderator"].includes(user?.role) && (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <Card className="shadow-lg rounded-2xl border-none">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-2xl p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl">
                    <AvatarImage src={user?.profile?.profilePhoto} alt="Admin" />
                    <AvatarFallback className="bg-white/10 text-white text-2xl">
                      {getInitials(user?.fullname || user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-3xl font-bold mb-1">
                      {user?.fullname || user?.name || "Administrator"}
                    </CardTitle>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1">
                        {user?.role?.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className="bg-green-400 text-green-900 border-none px-3 py-1">
                        System Access Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Account Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Mail className="w-5 h-5 text-indigo-500" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Phone className="w-5 h-5 text-indigo-500" />
                          <span>{user?.phoneNumber || "No phone linked"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-indigo-500" />
                          <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Authorized Permissions</h3>
                      <div className="flex flex-wrap gap-2">
                        {user?.permissions?.length > 0 ? (
                          user.permissions.map((perm, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                              {perm.replace('_', ' ')}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">Standard Admin Access</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        onClick={() => navigate('/admin/dashboard')}
                      >
                        Go to Admin Panel
                      </Button>
                    </div>
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
