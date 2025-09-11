import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT, ADMIN_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, FileDown, UserCheck, UserX, Trash2, MoreHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

const JobseekerTable = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [selectedJobseeker, setSelectedJobseeker] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, action: '', title: '', description: '', userId: null });
  const [resumeDialog, setResumeDialog] = useState({ open: false, url: '' });

  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/jobseekers`, { withCredentials: true });
        setJobseekers(res.data.jobseekers || []);
      } catch (error) {
        console.error("Failed to fetch jobseekers:", error);
      }
    };
    fetchJobseekers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  
  const viewCV = (user) => {
    if (user.profile?.resume) window.open(user.profile.resume, "_blank");
  };

  
  const previewCV = (user) => {
    if (user.profile?.resume) {
      setResumeDialog({ open: true, url: user.profile.resume });
    }
  };

  
  const downloadCV = (user) => {
    if (user.profile?.resume) {
      const link = document.createElement("a");
      link.href = user.profile.resume;
      link.download = user.profile.resumeOriginalName || "resume.pdf";
      link.click();
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.patch(
        `${ADMIN_API_END_POINT}/users/${id}/status`,
        { status },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setJobseekers(jobseekers.map(jobseeker => 
          jobseeker._id === id ? { ...jobseeker, status } : jobseeker
        ));
        
        const statusAction = status === 'active' ? 'activated' : 'blocked';
        toast.success(`Jobseeker ${statusAction} successfully`);
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '', userId: null });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update jobseeker status");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(
        `${ADMIN_API_END_POINT}/users/${id}`, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setJobseekers(jobseekers.filter(jobseeker => jobseeker._id !== id));
        if (selectedJobseeker && selectedJobseeker._id === id) {
          setSelectedJobseeker(null);
        }
        toast.success("Jobseeker deleted successfully");
      }
      
      setActionDialog({ open: false, action: '', title: '', description: '', userId: null });
    } catch (error) {
      console.error("Failed to delete jobseeker:", error);
      toast.error("Failed to delete jobseeker");
    }
  };

  const confirmAction = (action, jobseeker) => {
    let title = '';
    let description = '';
    
    switch(action) {
      case 'activate':
        title = 'Activate Jobseeker Account';
        description = `Are you sure you want to activate ${jobseeker.fullname}'s account?`;
        break;
      case 'block':
        title = 'Block Jobseeker Account';
        description = `Are you sure you want to block ${jobseeker.fullname}'s account?`;
        break;
      case 'delete':
        title = 'Delete Jobseeker Account';
        description = `Are you sure you want to delete ${jobseeker.fullname}'s account? This cannot be undone.`;
        break;
      default:
        return;
    }
    
    setActionDialog({
      open: true,
      action,
      title,
      description,
      userId: jobseeker._id
    });
  };

  const executeAction = () => {
    const { action, userId } = actionDialog;
    switch(action) {
      case 'activate':
        handleStatusUpdate(userId, 'active');
        break;
      case 'block':
        handleStatusUpdate(userId, 'blocked');
        break;
      case 'delete':
        handleDeleteUser(userId);
        break;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-4 font-semibold text-gray-700">Name</th>
            <th className="text-left p-4 font-semibold text-gray-700">Email</th>
            <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
            <th className="text-left p-4 font-semibold text-gray-700">Resume</th>
            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
            <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobseekers.length > 0 ? jobseekers.map(user => (
            <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-900">{user.fullname}</td>
              <td className="p-4 text-gray-700">{user.email}</td>
              <td className="p-4 text-gray-700">{user.phoneNumber || 'N/A'}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  {user.profile?.resume ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => previewCV(user)}>
                        <FileText className="mr-1 h-4 w-4" /> Preview
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => viewCV(user)}>
                        <FileText className="mr-1 h-4 w-4" /> View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadCV(user)}>
                        <FileDown className="mr-1 h-4 w-4" /> Download
                      </Button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">No resume</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <Badge className={getStatusColor(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex gap-1 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedJobseeker(user)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  
                  {user.status === 'active' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => confirmAction('block', user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => confirmAction('activate', user)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => confirmAction('delete', user)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <UserCheck className="h-8 w-8 text-gray-300" />
                  <span>No jobseekers found</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      
      <Dialog open={!!selectedJobseeker} onOpenChange={() => setSelectedJobseeker(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Jobseeker Details</DialogTitle>
          </DialogHeader>
          {selectedJobseeker && (
            <div className="space-y-3 text-sm">
              <p><strong>Name:</strong> {selectedJobseeker.fullname}</p>
              <p><strong>Email:</strong> {selectedJobseeker.email}</p>
              <p><strong>Phone:</strong> {selectedJobseeker.phoneNumber}</p>
              <p><strong>Place:</strong> {selectedJobseeker.profile?.place || 'N/A'}</p>
              <p><strong>Skills:</strong> {selectedJobseeker.profile?.skills?.map((s,i) => <Badge key={i} className="mr-1">{s}</Badge>)}</p>
              <p><strong>Education:</strong> {selectedJobseeker.profile?.education ? `${selectedJobseeker.profile.education.degree}, ${selectedJobseeker.profile.education.institution}, ${selectedJobseeker.profile.education.yearOfCompletion}` : 'N/A'}</p>
              <p><strong>Experience:</strong> {selectedJobseeker.profile?.experience ? `${selectedJobseeker.profile.experience.years} yrs, ${selectedJobseeker.profile.experience.field}` : 'N/A'}</p>
              <p><strong>Bio:</strong> {selectedJobseeker.profile?.bio || 'N/A'}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedJobseeker(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Preview Dialog (iframe) */}
      <Dialog open={resumeDialog.open} onOpenChange={() => setResumeDialog({ open: false, url: '' })}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          {resumeDialog.url ? (
            <iframe 
              src={resumeDialog.url} 
              className="w-full h-[75vh] border rounded" 
              title="Resume Preview"
            />
          ) : (
            <p>No resume available</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResumeDialog({ open: false, url: '' })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

 
      <Dialog open={actionDialog.open} onOpenChange={() => setActionDialog({ open: false, action: '', title: '', description: '', userId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialog.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4">
            {actionDialog.description}
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialog({ open: false, action: '', title: '', description: '', userId: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={executeAction}
              className={actionDialog.action === 'delete' || actionDialog.action === 'block' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {actionDialog.action === 'activate' ? 'Activate' : 
               actionDialog.action === 'block' ? 'Block' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobseekerTable;

