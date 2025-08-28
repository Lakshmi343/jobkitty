
// import React, { useEffect, useState } from "react";
// import Navbar from "./shared/Navbar";
// import { Avatar, AvatarImage } from "./ui/avatar";
// import { Button } from "./ui/button";
// import { Contact, Mail, Pen, Building, Globe, MapPin, Briefcase, FileDown, Award } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
// import { useSelector } from "react-redux";
// import UpdateProfileDialog from "./UpdateProfileDialog";
// import AppliedJobTable from "./AppliedJobTable";

// import axios from "axios";

// const Profile = () => {
//   const [open, setOpen] = useState(false);
//   const [companyData, setCompanyData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { user } = useSelector((store) => store.auth);

//   r
//   useEffect(() => {
//     const fetchCompanyProfile = async () => {
//       if (user?.role !== "Employer") return;
//       try {
//         setLoading(true);
//         const res = await axios.get(`http://localhost:5000/api/employer/company/${user?._id}`, {
//           withCredentials: true,
//         });
//         if (res.data.success) {
//           setCompanyData(res.data.company);
//         }
//       } catch (error) {
//         console.error("Error fetching company profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCompanyProfile();
//   }, [user]);

//   return (
//     <div>
//       <Navbar />

//       {/* Jobseeker Section */}
//       {user?.role === "Jobseeker" && (
//         <div className="max-w-4xl mx-auto p-6">
//           <Card className="shadow-lg rounded-2xl">
//             <CardHeader className="flex flex-row justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <Avatar className="w-20 h-20">
//                   <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Photo" />
//                 </Avatar>
//                 <div>
//                   <CardTitle>{user?.fullname}</CardTitle>
//                   <CardDescription>{user?.profile?.bio}</CardDescription>
//                 </div>
//               </div>
//               <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
//                 <Pen size={16} /> Edit
//               </Button>
//             </CardHeader>

//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <Mail size={16} /> <span>{user?.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Contact size={16} /> <span>{user?.phoneNumber || "No phone added"}</span>
//                 </div>

//                 {/* Skills */}
//                 <div>
//                   <h2 className="text-lg font-semibold">Skills</h2>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {user?.profile?.skills?.length > 0 ? (
//                       user.profile.skills.map((skill, idx) => (
//                         <Badge key={idx} className="bg-gray-200 text-gray-700">
//                           {skill}
//                         </Badge>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500">No skills added</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                     {user?.profile?.education&& 
//                     <div>
                        
//                        </div> 
//                        }
//                 </div>

//                 {/* Resume */}
//                 <div>
//                   <h2 className="text-lg font-semibold">Resume</h2>
//                   {user?.profile?.resume ? (
//                     <a href={user.profile.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
//                       <FileDown size={16} /> Download Resume
//                     </a>
//                   ) : (
//                     <p className="text-sm text-gray-500">No resume uploaded</p>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Applied Jobs */}
//           <div className="mt-6">
//             <h2 className="text-xl font-bold">Applied Jobs</h2>
//             <AppliedJobTable />
//           </div>

//           {/* Update Dialog */}
//           <UpdateProfileDialog open={open} setOpen={setOpen} />
//         </div>
//       )}

//       {/* Employer Section */}
//       {user?.role === "Employer" && (
//         <div className="max-w-4xl mx-auto p-6">
//           <Card className="shadow-lg rounded-2xl">
//             <CardHeader className="flex flex-row justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <Avatar className="w-20 h-20">
//                   <AvatarImage src={companyData?.logo} alt="Company Logo" />
//                 </Avatar>
//                 <div>
//                   <CardTitle>{companyData?.name}</CardTitle>
//                   <CardDescription>{companyData?.description}</CardDescription>
//                 </div>
//               </div>
//               <Button size="sm" className="gap-2" onClick={() => (window.location.href = "/company-setup")}>
//                 <Pen size={16} /> Edit Company
//               </Button>
//             </CardHeader>

//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <Briefcase size={16} /> <span>{companyData?.type || "N/A"}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Award size={16} /> <span>{companyData?.experience || "N/A"}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Globe size={16} />{" "}
//                   <a href={companyData?.website} target="_blank" className="text-blue-600 hover:underline">
//                     {companyData?.website || "N/A"}
//                   </a>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <MapPin size={16} /> <span>{companyData?.location || "N/A"}</span>
//                 </div>
//               </div>
//               <div className="mt-4 flex flex-col gap-2">
//                 <div className="flex items-center gap-2">
//                   <Mail size={16} /> <span>{user?.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Contact size={16} /> <span>{user?.phoneNumber || "No phone added"}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Building, Globe, MapPin, Briefcase, FileDown, Award } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useSelector } from "react-redux";
import UpdateProfileDialog from "./UpdateProfileDialog";
import AppliedJobTable from "./AppliedJobTable";

import axios from "axios";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

 
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
        <div className="max-w-4xl mx-auto p-6">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Photo" />
                </Avatar>
                <div>
                  <CardTitle>{user?.fullname}</CardTitle>
                  <CardDescription>{user?.profile?.bio}</CardDescription>
                </div>
              </div>
              <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
                <Pen size={16} /> Edit
              </Button>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} /> <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Contact size={16} /> <span>{user?.phoneNumber || "No phone added"}</span>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-lg font-semibold">Skills</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.profile?.skills?.length > 0 ? (
                      user.profile.skills.map((skill, idx) => (
                        <Badge key={idx} className="bg-gray-200 text-gray-700">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills added</p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div>
                  {user?.profile?.education && (
                    <div>
                      <h2 className="text-lg font-semibold">Education</h2>
                      <p>
                        {user.profile.education.degree} - {user.profile.education.institution} (
                        {user.profile.education.yearOfCompletion})
                      </p>
                    </div>
                  )}
                </div>

                {/* Resume */}
                <div>
                  <h2 className="text-lg font-semibold">Resume</h2>
                  {user?.profile?.resume ? (
                    <a
                      href={user.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                      onClick={() => console.log("🔽 Opening Resume:", user.profile.resume)}
                    >
                      <FileDown size={16} /> Download Resume
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">No resume uploaded</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applied Jobs */}
          <div className="mt-6">
            <h2 className="text-xl font-bold">Applied Jobs</h2>
            <AppliedJobTable />
          </div>

          {/* Update Dialog */}
          <UpdateProfileDialog open={open} setOpen={setOpen} />
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
