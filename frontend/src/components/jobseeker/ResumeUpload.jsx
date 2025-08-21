import React, { useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { FileText, Upload, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check file type
            const fileType = selectedFile.type;
            if (fileType !== 'application/pdf' && 
                fileType !== 'application/msword' && 
                fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                toast.error('Please upload a PDF or Word document');
                return;
            }
            
            // Check file size (5MB max)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            
            setFile(selectedFile);
        }
    };
    
    const refreshUser = async () => {
        const profileRes = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
        if (profileRes.data?.success) {
            dispatch(setUser(profileRes.data.user));
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }
        
        setLoading(true);
        
        const formData = new FormData();
        formData.append('resume', file);
        
        try {
            const response = await axios.post(`${USER_API_END_POINT}/upload-resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                toast.success('Resume uploaded successfully');
                setFile(null);
                await refreshUser();
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload resume');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Resume / CV</h2>
                {user?.profile?.resume && (
                    <a 
                        href={user.profile.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    >
                        <FileText className="h-4 w-4" />
                        View Current Resume
                    </a>
                )}
            </div>
            
            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="file"
                        id="resume-upload"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                    />
                    <Label 
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                    >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                            {file ? file.name : 'Click to upload your resume/CV'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</span>
                    </Label>
                </div>
                
                <Button 
                    onClick={handleUpload} 
                    disabled={!file || loading}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Resume
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ResumeUpload;