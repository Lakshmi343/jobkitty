// import React, { useState } from 'react';
// import axios from 'axios';
// import { USER_API_END_POINT } from '../../utils/constant';
// import { Button } from '../ui/button';
// import { Label } from '../ui/label';
// import { toast } from 'sonner';
// import { FileText, Upload, Loader2 } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setUser } from '@/redux/authSlice';
// import { authUtils } from '../../utils/authUtils';
// import PdfViewer from '../PdfViewer';

// const ResumeUpload = ({ onSuccess }) => {
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [showPreview, setShowPreview] = useState(false);
//     const { user } = useSelector(store => store.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         if (selectedFile) {
        
//             const fileType = selectedFile.type;
//             if (fileType !== 'application/pdf' && 
//                 fileType !== 'application/msword' && 
//                 fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//                 toast.error('Please upload a PDF or Word document');
//                 return;
//             }
            
           
//             if (selectedFile.size > 5 * 1024 * 1024) {
//                 toast.error('File size should be less than 5MB');
//                 return;
//             }
            
//             setFile(selectedFile);
//         }
//     };
    
//     const refreshUser = async () => {
//         const profileRes = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
//         if (profileRes.data?.success) {
//             dispatch(setUser(profileRes.data.user));
//             authUtils.setUser(profileRes.data.user);
//         }
//     };
    
//     const handleUpload = async () => {
//         if (!file) {
//             toast.error('Please select a file to upload');
//             return;
//         }
        
//         // Ensure authenticated
//         if (!user) {
//             toast.info('Please login to upload your resume');
//             navigate('/login');
//             return;
//         }

//         setLoading(true);
        
//         const formData = new FormData();
//         formData.append('resume', file);
        
//         try {
//             const response = await axios.post(`${USER_API_END_POINT}/upload-resume`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//                 withCredentials: true
//             });
            
//             if (response.data.success) {
//                 toast.success('Resume uploaded successfully');
//                 setFile(null);
//                 await refreshUser();
//                 if (typeof onSuccess === 'function') {
//                     onSuccess();
//                 }
//             }
//         } catch (error) {
//             console.error('Resume upload error:', error);
//             if (error.response?.status === 401) {
//                 toast.error('Your session expired. Please login again.');
//                 navigate('/login');
//             } else {
//                 toast.error(error.response?.data?.message || 'Failed to upload resume');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md border">
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold">Resume / CV</h2>
//                 {user?.profile?.resume && (
//                     <div className="flex items-center gap-3">
//                         <a 
//                             href={user.profile.resume} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             download
//                             className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
//                         >
//                             <FileText className="h-4 w-4" />
//                             View Current Resume
//                         </a>
//                         {user.profile.resume.toLowerCase().endsWith('.pdf') && (
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPreview(v => !v)}
//                                 className="text-sm text-blue-600 hover:text-blue-800"
//                             >
//                                 {showPreview ? 'Hide Preview' : 'Preview'}
//                             </button>
//                         )}
//                     </div>
//                 )}
//             </div>
            
//             <div className="space-y-4">
//                 <div className="relative">
//                     <input
//                         type="file"
//                         id="resume-upload"
//                         onChange={handleFileChange}
//                         className="hidden"
//                         accept=".pdf,.doc,.docx"
//                     />
//                     <Label 
//                         htmlFor="resume-upload"
//                         className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
//                     >
//                         <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                         <span className="text-sm text-gray-600">
//                             {file ? `${file.name} ${(file.size/1024/1024).toFixed(2)}MB` : 'Click to upload your resume/CV'}
//                         </span>
//                         <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</span>
//                         <span className="text-xs text-gray-500">Tip: Prefer PDF for best preview and compatibility</span>
//                     </Label>
//                 </div>
                
//                 <Button 
//                     onClick={handleUpload} 
//                     disabled={!file || loading}
//                     className="w-full"
//                 >
//                     {loading ? (
//                         <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Uploading...
//                         </>
//                     ) : (
//                         <>
//                             <Upload className="mr-2 h-4 w-4" />
//                             Upload Resume
//                         </>
//                     )}
//                 </Button>
//             </div>

//             {/* Inline PDF preview */}
//             {showPreview && user?.profile?.resume && user.profile.resume.toLowerCase().endsWith('.pdf') && (
//                 <div className="mt-4 border rounded-md overflow-hidden">
//                     <PdfViewer file={user.profile.resume} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ResumeUpload;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { USER_API_END_POINT } from '../../utils/constant';
// import { Button } from '../ui/button';
// import { Label } from '../ui/label';
// import { toast } from 'sonner';
// import { FileText, Upload, Loader2, X, Eye, Download } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setUser } from '@/redux/authSlice';
// import { authUtils } from '../../utils/authUtils';

// const ResumeUpload = ({ onSuccess }) => {
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [showPreview, setShowPreview] = useState(false);
//     const { user } = useSelector(store => store.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
    
//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         if (selectedFile) {
//             const fileType = selectedFile.type;
//             if (fileType !== 'application/pdf' && 
//                 fileType !== 'application/msword' && 
//                 fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//                 toast.error('Please upload a PDF or Word document');
//                 return;
//             }
            
//             if (selectedFile.size > 5 * 1024 * 1024) {
//                 toast.error('File size should be less than 5MB');
//                 return;
//             }
            
//             setFile(selectedFile);
//         }
//     };
    
//     const clearFile = () => {
//         setFile(null);
//         // Reset the file input
//         const fileInput = document.getElementById('resume-upload');
//         if (fileInput) fileInput.value = '';

import React, { useState } from 'react';
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

const  ResumeUpload = ({ onSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type;
            if (fileType !== 'application/pdf' && 
                fileType !== 'application/msword' && 
                fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                toast.error('Please upload a PDF or Word document');
                return;
            }
            
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            
            setFile(selectedFile);
        }
    };
    
    const clearFile = () => {
        setFile(null);
        const fileInput = document.getElementById('resume-section-upload');
        if (fileInput) fileInput.value = '';
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
            toast.error('Please select a file to upload');
            return;
        }
        
        if (!user) {
            toast.info('Please login to upload your resume');
            navigate('/login');
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
                clearFile();
                await refreshUser();
                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            if (error.response?.status === 401) {
                toast.error('Your session expired. Please login again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to upload resume');
            }
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

                    {/* PDF Preview */}
                    {/* Use a modal dialog for a larger, contained preview */}
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

            {/* Upload Section */}
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