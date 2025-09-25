

// import React, { useState, useEffect } from 'react'
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
// import { Label } from './ui/label'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { USER_API_END_POINT } from './utils/constant'
// import { setUser } from '@/redux/authSlice'
// import { toast } from 'sonner'
// import LoadingSpinner from './shared/LoadingSpinner'

// // ✅ Tag Input
// import { WithContext as ReactTags } from "react-tag-input";
// import { skillSuggestions } from "../utils/skills";
// import "@/styles/reactTags.css";


// const UpdateProfileDialog = ({ open, setOpen }) => {
//     const [loading, setLoading] = useState(false);
//     const { user } = useSelector(store => store.auth);
//     const dispatch = useDispatch();

//     const [input, setInput] = useState({
//         fullname: "",
//         email: "",
//         phoneNumber: "",
//         bio: "",
//         file: null
//     });

//     const [tags, setTags] = useState([]); // skills state

//     useEffect(() => {
//         if (user) {
//             setInput({
//                 fullname: user.fullname || "",
//                 email: user.email || "",
//                 phoneNumber: user.phoneNumber || "",
//                 bio: user.profile?.bio || "",
//                 file: null
//             });

//             if (user.profile?.skills?.length) {
//                 setTags(user.profile.skills.map(skill => ({ id: skill, text: skill })));
//             } else {
//                 setTags([]);
//             }
//         }
//     }, [user, open]);

//     // react-tag-input handlers
//     const handleDelete = (i) => {
//         setTags(tags.filter((_, index) => index !== i));
//     };

//     const handleAddition = (tag) => {
//         setTags([...tags, tag]);
//     };

//     const handleDrag = (tag, currPos, newPos) => {
//         const newTags = [...tags];
//         newTags.splice(currPos, 1);
//         newTags.splice(newPos, 0, tag);
//         setTags(newTags);
//     };

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }

//     const fileChangeHandler = (e) => {
//         const file = e.target.files?.[0];
//         setInput({ ...input, file });
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();

//         if (!input.fullname || !input.email || !input.phoneNumber) {
//             toast.error("Name, email, and phone number are required");
//             return;
//         }

//         const skillsArray = tags.map(tag => tag.text);
//         const skillsString = skillsArray.join(", ");

//         const formData = new FormData();
//         formData.append("fullname", input.fullname);
//         formData.append("email", input.email);
//         formData.append("phoneNumber", input.phoneNumber);
//         formData.append("bio", input.bio);
//        formData.append("skills", skillsString);

//         if (input.file) {
//             formData.append("file", input.file);
//         }

//         try {
//             setLoading(true);
//             const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//                 withCredentials: true
//             });

//             if (res.data.success) {
//                 dispatch(setUser(res.data.user));
//                 toast.success(res.data.message);
//                 setOpen(false);
//             }
//         } catch (error) {
//             console.error("Profile update error:", error);
//             toast.error(error.response?.data?.message || "Failed to update profile");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                     <DialogTitle>Update Profile</DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={submitHandler}>
//                     <div className='grid gap-4 py-4'>
//                         {/* Full Name */}
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="fullname" className="text-right">Name *</Label>
//                             <Input
//                                 id="fullname"
//                                 name="fullname"
//                                 type="text"
//                                 value={input.fullname}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                                 required
//                             />
//                         </div>

//                         {/* Email */}
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="email" className="text-right">Email *</Label>
//                             <Input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 value={input.email}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                                 required
//                             />
//                         </div>

//                         {/* Phone */}
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="phoneNumber" className="text-right">Phone *</Label>
//                             <Input
//                                 id="phoneNumber"
//                                 name="phoneNumber"
//                                 type="text"
//                                 value={input.phoneNumber}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                                 required
//                             />
//                         </div>

//                         {/* Bio */}
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="bio" className="text-right">Bio</Label>
//                             <Input
//                                 id="bio"
//                                 name="bio"
//                                 value={input.bio}
//                                 onChange={changeEventHandler}
//                                 className="col-span-3"
//                                 placeholder="Tell us about yourself..."
//                             />
//                         </div>

//                         {/* ✅ Skills with react-tag-input */}
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label className="text-right">Skills</Label>
//                             <div className="col-span-3 border rounded-md p-2">
//                                 <ReactTags
//                                     tags={tags}
//                                     suggestions={skillSuggestions}
//                                     handleDelete={handleDelete}
//                                     handleAddition={handleAddition}
//                                     handleDrag={handleDrag}
//                                     delimiters={[188, 13]} // comma & enter
//                                     placeholder="Add a skill"
//                                 />
//                             </div>
//                         </div>

//                         {/* Resume Upload */}
//                         <div className='grid grid-cols-4 items-center gap-4'>
//                             <Label htmlFor="file" className="text-right">Resume</Label>
//                             <Input
//                                 id="file"
//                                 name="file"
//                                 type="file"
//                                 accept=".pdf,.doc,.docx"
//                                 onChange={fileChangeHandler}
//                                 className="col-span-3"
//                             />
//                         </div>
//                     </div>

//                     {/* Footer Buttons */}
//                     <DialogFooter>
//                         <Button 
//                             type="button" 
//                             variant="outline" 
//                             onClick={() => setOpen(false)}
//                             disabled={loading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={loading}>
//                             {loading ? (
//                                 <div className="flex items-center justify-center">
//                                     <LoadingSpinner size={20} color="#ffffff" />
//                                     <span className="ml-2">Updating...</span>
//                                 </div>
//                             ) : (
//                                 'Update Profile'
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }

// export default UpdateProfileDialog

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import LoadingSpinner from "./shared/LoadingSpinner";

// Skills Input
import { WithContext as ReactTags } from "react-tag-input";
import { skillSuggestions } from "../utils/skills";
import "@/styles/reactTags.css";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    place: "",
    degree: "",
    institution: "",
    yearOfCompletion: "",
    grade: "",
    years: "",
    field: "",
    file: null,
  });

  const [tags, setTags] = useState([]); // skills state

  // Prefill form from user data
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        place: user.profile?.place || "",
        degree: user.profile?.education?.degree || "",
        institution: user.profile?.education?.institution || "",
        yearOfCompletion: user.profile?.education?.yearOfCompletion || "",
        grade: user.profile?.education?.grade || "",
        years: user.profile?.experience?.years || "",
        field: user.profile?.experience?.field || "",
        file: null,
      });

      if (user.profile?.skills?.length) {
        setTags(user.profile.skills.map((skill) => ({ id: skill, text: skill })));
      } else {
        setTags([]);
      }
    }
  }, [user]);

  // Wizard state
  const steps = ["Profile", "Education", "Skills", "Experience & Resume"];
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Per-step validation
  const validateStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Profile
        if (!input.fullname || !input.email || !input.phoneNumber) {
          toast.error("Name, email, and phone number are required");
          return false;
        }
        return true;
      case 1: // Education
        if (!input.degree || !input.institution || !input.yearOfCompletion) {
          toast.error("Education details are required");
          return false;
        }
        return true;
      case 2: // Skills
        // Skills optional, but you can enforce minimum if desired
        return true;
      case 3: // Experience & Resume
        // Optional fields
        return true;
      default:
        return true;
    }
  };

  // react-tag-input handlers
  const handleDelete = (i) => {
    setTags(tags.filter((_, index) => index !== i));
  };
  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = [...tags];
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  // Input Change
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // File Upload
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  // Submit
  const submitHandler = async (e) => {
    e.preventDefault();

    // If not on last step, move to next after validation
    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        nextStep();
      }
      return;
    }

    // On last step, validate all required sections
    if (!validateStep(0) || !validateStep(1)) return;

    const skillsArray = tags.map((tag) => tag.text);
    const skillsString = skillsArray.join(", ");

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", skillsString);
    formData.append("place", input.place);

    // Education
    formData.append(
      "education",
      JSON.stringify({
        degree: input.degree,
        institution: input.institution,
        yearOfCompletion: input.yearOfCompletion,
        grade: input.grade,
      })
    );

    // Experience (optional)
    if (input.years || input.field) {
      formData.append(
        "experience",
        JSON.stringify({
          years: input.years,
          field: input.field,
        })
      );
    }

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      console.log("📤 Submitting form data:", {
        fullname: input.fullname,
        email: input.email,
        phoneNumber: input.phoneNumber,
        bio: input.bio,
        skills: skillsString,
        place: input.place,
        hasFile: !!input.file,
        fileName: input.file?.name
      });
      
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("✅ Profile update response:", res.data);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false); // close dialog
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {steps.map((label, idx) => (
              <div key={label} className="flex-1 flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium 
                  ${idx <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded ${idx < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-gray-700 font-medium">{steps[currentStep]}</div>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullname">Full Name *</Label>
                <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} required />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone *</Label>
                <Input id="phoneNumber" name="phoneNumber" type="text" value={input.phoneNumber} onChange={changeEventHandler} required />
              </div>
              <div>
                <Label htmlFor="place">Place</Label>
                <Input id="place" name="place" type="text" value={input.place} onChange={changeEventHandler} placeholder="Your location" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" name="bio" type="text" value={input.bio} onChange={changeEventHandler} placeholder="Tell us about yourself..." />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3">
              <div>
                <Label>Education *</Label>
                <div className="grid gap-2">
                  <Input name="degree" placeholder="Degree (e.g. B.Tech)" value={input.degree} onChange={changeEventHandler} required />
                  <Input name="institution" placeholder="Institution" value={input.institution} onChange={changeEventHandler} required />
                  <Input name="yearOfCompletion" type="number" placeholder="Year of Completion" value={input.yearOfCompletion} onChange={changeEventHandler} required />
                  <Input name="grade" placeholder="Grade (optional)" value={input.grade} onChange={changeEventHandler} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <Label>Skills</Label>
              <div className="border rounded-md p-2">
                <ReactTags
                  tags={tags}
                  suggestions={skillSuggestions}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  delimiters={[188, 13]}
                  placeholder="Add a skill"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Experience</Label>
                <div className="grid gap-2">
                  <Input name="years" type="number" placeholder="Years of experience" value={input.years} onChange={changeEventHandler} />
                  <Input name="field" placeholder="Field (optional)" value={input.field} onChange={changeEventHandler} />
                </div>
              </div>
              <div>
                <Label htmlFor="file">Resume (PDF, DOC, DOCX)</Label>
                <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" onChange={fileChangeHandler} />
                {input.file && (
                  <p className="text-sm text-green-600 mt-1">✅ Selected: {input.file.name} ({(input.file.size / 1024 / 1024).toFixed(2)} MB)</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0 || loading}>
              Back
            </Button>
            <div className="flex gap-2">
              {currentStep < steps.length - 1 ? (
                <Button type="submit" disabled={loading}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size={20} color="#ffffff" />
                      <span className="ml-2">Updating...</span>
                    </div>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
