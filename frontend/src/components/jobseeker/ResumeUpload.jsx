
import React, { useState,useRef } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';
import { FileText, Upload, Loader2, X, Eye, Download } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/redux/authSlice';
import { authUtils } from '../../utils/authUtils';
import PdfViewer from '../PdfViewer';

const ResumeUpload = ({ onSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const validateFile = (file) => {
        if (!file) return { valid: false, error: 'No file selected' };
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];        
        if (!validTypes.includes(file.type)) {
            return { valid: false, error: 'Please upload a PDF or Word document (PDF, DOC, DOCX)' };
        }      
        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            return { valid: false, error: 'File size should be less than 5MB' };
        }   
        return { valid: true };
    };  
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError(null);
        
        const { valid, error } = validateFile(selectedFile);
        if (!valid) {
            setError(error);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }
            return;
        }
        
        setFile(selectedFile);
    };
    
    const clearFile = () => {
        setFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
        }
    };
    
    const refreshUser = async () => {
        const profileRes = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
        if (profileRes.data?.success) {
            dispatch(setUser(profileRes.data.user));
            authUtils.setUser(profileRes.data.user);
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }
        
   
        const { valid, error: validationError } = validateFile(file);
        if (!valid) {
            setError(validationError);
            return;
        }
        

        if (!user) {
            toast.info('Please login to upload your resume');
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('resume', file);
        
        try {
            const response = await axios.post(`${USER_API_END_POINT}/upload-resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            
            if (response.data.success) {
                toast.success('Resume uploaded successfully');
                setFile(null);
                setUploadProgress(0);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; 
                }
                
              
                await refreshUser();
                
             
                if (typeof onSuccess === 'function') {
                    onSuccess(response.data);
                }
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            let errorMessage = 'Failed to upload resume';
            
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Your session has expired. Please login again.';
                    navigate('/login', { state: { from: window.location.pathname } });
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const getFileNameFromUrl = (url) => {
        if (!url) return 'Resume';
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        return decodeURIComponent(fileName.split('?')[0]) || 'Resume';
    };
    
    const isPdfFile = (fileOrUrl) => {
        if (typeof fileOrUrl === 'string') {
            return fileOrUrl.toLowerCase().endsWith('.pdf');
        }
        return fileOrUrl?.type === 'application/pdf';
    };

    const formatFileName = (fileName) => {
        if (!fileName) return 'Resume';
        const cleanName = fileName.replace(/(resume_|_|\d{10,})/g, ' ').trim();
        return cleanName || 'Resume';
    };

    return (
        <div className="space-y-4">
            {/* Current Resume Info */}
            {user?.profile?.resume ? (
                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-900">
                                        {formatFileName(user.profile.resumeOriginalName || getFileNameFromUrl(user.profile.resume))}
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Uploaded resume
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a 
                                    href={user.profile.resume} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    download
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1 transition-colors"
                                >
                                    <Download className="h-3 w-3" />
                                    Download
                                </a>
                                {isPdfFile(user.profile.resume) && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(v => !v)}
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 flex items-center gap-1 transition-colors"
                                    >
                                        <Eye className="h-3 w-3" />
                                        {showPreview ? 'Hide' : 'Preview'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>


                    <Dialog open={showPreview && isPdfFile(user?.profile?.resume)} onOpenChange={setShowPreview}>
                        <DialogContent className="max-w-4xl w-[92vw]">
                            <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg">Resume Preview</DialogTitle>
                            </DialogHeader>
                            <div className="relative w-full h-[65vh] overflow-hidden rounded-md border">
                                {user?.profile?.resume && (
                                    <iframe
                                        src={`${user.profile.resume}#view=FitH`}
                                        title="Resume Preview"
                                        className="absolute inset-0 w-full h-full block"
                                        frameBorder="0"
                                    />
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-yellow-800 font-medium">No resume uploaded</p>
                    <p className="text-yellow-700 text-sm">Upload your resume to complete your profile</p>
                </div>
            )}

           
            <div className="space-y-3">
                <div>
                    <input
                        type="file"
                        id="resume-section-upload"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                    />
                    <Label 
                        htmlFor="resume-section-upload"
                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 bg-gray-50"
                    >
                        <Upload className="w-5 h-5 text-blue-600 mb-2" />
                        <span className="text-sm text-gray-700 text-center font-medium">
                            {file ? file.name : 'Upload new resume'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                            PDF, DOC, DOCX up to 5MB
                        </span>
                    </Label>
                    
                    {file && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                            <button
                                onClick={clearFile}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
                
                <Button 
                    onClick={handleUpload} 
                    disabled={!file || loading}
                    className="w-full"
                    size="sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            {user?.profile?.resume ? 'Update Resume' : 'Upload Resume'}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default  ResumeUpload;