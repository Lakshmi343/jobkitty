
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { authUtils } from "../utils/authUtils";
import PdfViewer from "./PdfViewer";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import LoadingSpinner from "./shared/LoadingSpinner";


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

  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);

  const [tags, setTags] = useState([]); 
  const [resumePreviewUrl, setResumePreviewUrl] = useState("");

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

      setPhotoPreview(user?.profile?.profilePhoto || "");
    }
  }, [user, open]); 

  useEffect(() => {
   
    return () => {
      if (resumePreviewUrl) URL.revokeObjectURL(resumePreviewUrl);
    };
  }, [resumePreviewUrl]);

  useEffect(() => {
    if (input.file) {
      const isPdf = input.file.type === 'application/pdf' || input.file.name?.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        const url = URL.createObjectURL(input.file);
        setResumePreviewUrl(url);
      } else {
        setResumePreviewUrl("");
      }
    } else {
      setResumePreviewUrl("");
    }
  }, [input.file]);

  const steps = ["Profile", "Education", "Skills", "Experience & Resume"];
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const validateStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: 
        if (!input.fullname?.trim()) {
          toast.error("Full name is required");
          return false;
        }
        if (!input.email?.trim()) {
          toast.error("Email is required");
          return false;
        }
        if (!input.phoneNumber?.trim()) {
          toast.error("Phone number is required");
          return false;
        }
        return true;
      case 1: 
        if (!input.degree?.trim() || !input.institution?.trim() || !input.yearOfCompletion) {
          toast.error("Degree, institution, and year of completion are required");
          return false;
        }
        return true;
      case 2: 
        return true;
      case 3: 
        return true;
      default:
        return true;
    }
  };

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

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Please upload a PDF, DOC, or DOCX file");
        return;
      }
    }
    setInput({ ...input, file });
  };

  const uploadResumeNow = async () => {
    if (!input.file) {
      toast.error("Please select a resume file first.");
      return;
    }
    try {
      setResumeUploading(true);
      const fd = new FormData();
      fd.append("resume", input.file);
      const res = await axios.post(`${USER_API_END_POINT}/upload-resume`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        toast.success("Resume uploaded successfully");
        const prof = await axios.get(`${USER_API_END_POINT}/profile`);
        if (prof.data?.success && prof.data.user) {
          dispatch(setUser(prof.data.user));
          authUtils.setUser(prof.data.user);
        }
        setInput(prev => ({ ...prev, file: null }));
      } else {
        toast.error(res.data?.message || "Failed to upload resume");
      }
    } catch (err) {
      console.error("Resume upload error", err);
      toast.error(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setResumeUploading(false);
    }
  };

  const onProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    try {
      setPhotoUploading(true);
      setPhotoPreview(URL.createObjectURL(file));
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post(`${USER_API_END_POINT}/profile/photo`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success && res.data.user) {
        dispatch(setUser(res.data.user));
        authUtils.setUser(res.data.user);
        toast.success("Profile photo updated");
      } else {
        toast.error(res.data?.message || "Failed to update photo");
      }
    } catch (err) {
      console.error("Profile photo upload error", err);
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setPhotoUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (currentStep < steps.length - 1) {
      nextStep();
      return;
    }

    if (!validateStep(0) || !validateStep(1)) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setLoading(true);
      const skillsArray = tags.map((tag) => tag.text);
      const skillsString = skillsArray.join(", ");

      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append("skills", skillsString);
      formData.append("place", input.place);

      formData.append(
        "education",
        JSON.stringify({
          degree: input.degree,
          institution: input.institution,
          yearOfCompletion: input.yearOfCompletion,
          grade: input.grade,
        })
      );

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

      console.log("Submitting profile update...");
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile update response:", res.data);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        authUtils.setUser(res.data.user);
        toast.success("Profile updated successfully");
        setOpen(false);
        setCurrentStep(0); // Reset to first step
      }
    } catch (error) {
      console.error("Profile update error:", error);
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

        <div className="mb-6">
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
          <div className="flex justify-between mt-2">
            {steps.map((label, idx) => (
              <span key={label} className={`text-xs ${idx === currentStep ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={submitHandler} onKeyDown={(e) => {
          if (e.key === 'Enter' && currentStep === 2) {
            e.preventDefault();
          }
        }}>
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="profilePhoto">Profile Photo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-500">No photo</span>
                    )}
                  </div>
                  <div>
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={onProfilePhotoChange}
                      disabled={photoUploading}
                    />
                    {photoUploading && (
                      <p className="text-xs text-gray-500 mt-1">Uploading photo...</p>
                    )}
                  </div>
                </div>
              </div>
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
                <textarea 
                  id="bio" 
                  name="bio" 
                  value={input.bio} 
                  onChange={changeEventHandler} 
                  placeholder="Tell us about yourself..." 
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Education *</Label>
                <div className="grid gap-3 mt-2">
                  <Input name="degree" placeholder="Degree (e.g. B.Tech)" value={input.degree} onChange={changeEventHandler} required />
                  <Input name="institution" placeholder="Institution" value={input.institution} onChange={changeEventHandler} required />
                  <Input name="yearOfCompletion" type="number" placeholder="Year of Completion" value={input.yearOfCompletion} onChange={changeEventHandler} required />
                  <Input name="grade" placeholder="Grade (optional)" value={input.grade} onChange={changeEventHandler} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>Skills (Add skills by typing and pressing Enter)</Label>
              <div className="border rounded-md p-2" onKeyDown={(e)=>{ if (e.key==='Enter') e.preventDefault(); }}>
                <ReactTags
                  tags={tags}
                  suggestions={skillSuggestions}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  delimiters={[188, 13]}
                  placeholder="Add a skill and press Enter"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Resume (PDF, DOC, DOCX - max 5MB)</Label>
                <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" onChange={fileChangeHandler} className="mt-2" />
                {input.file && (
                  <p className="text-sm text-green-600 mt-1">
                    ✅ Selected: {input.file.name} ({(input.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button type="button" variant="outline" onClick={uploadResumeNow} disabled={resumeUploading || !input.file}>
                    {resumeUploading ? "Uploading..." : "Upload Resume Now"}
                  </Button>
                  <span className="text-sm text-gray-500 self-center">Or it will be saved with your profile</span>
                </div>
                {(resumePreviewUrl || (user?.profile?.resume && user.profile.resume.toLowerCase().endsWith('.pdf'))) && (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <iframe
                      title="Resume Preview"
                      src={resumePreviewUrl || user.profile.resume}
                      className="w-full h-80"
                    />
                  </div>
                )}
                {/* Fallback for non-PDF resumes */}
                {!resumePreviewUrl && user?.profile?.resume && !user.profile.resume.toLowerCase().endsWith('.pdf') && (
                  <p className="mt-2 text-sm text-gray-600">
                    Preview not available for this file type.{' '}
                    <a className="text-blue-600 underline" href={user.profile.resume} target="_blank" rel="noreferrer">Open resume</a>
                  </p>
                )}
              </div>
              <div>
                <Label>Experience (Optional)</Label>
                <div className="grid gap-3 mt-2">
                  <Input name="years" type="number" placeholder="Years of experience" value={input.years} onChange={changeEventHandler} />
                  <Input name="field" placeholder="Field" value={input.field} onChange={changeEventHandler} />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Back
            </Button>
            
            <div className="flex gap-2">
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
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