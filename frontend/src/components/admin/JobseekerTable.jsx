

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, FileDown, UserCheck, UserX, Trash2, MoreHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';

const JobseekerTable = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [selectedJobseeker, setSelectedJobseeker] = useState(null);

  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/jobseekers", { withCredentials: true });
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
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewCV = (user) => {
    if (user.profile?.resume) window.open(user.profile.resume, "_blank");
  };

  const downloadCV = (user) => {
    if (user.profile?.resume) {
      const link = document.createElement("a");
      link.href = user.profile.resume;
      link.download = user.profile.resumeOriginalName || "resume.pdf";
      link.click();
    }
  };

  const updateUserStatus = async (id, status) => console.log(`Update ${id} to ${status}`);
  const deleteUser = async (id) => console.log(`Delete ${id}`);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Resume</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobseekers.length > 0 ? jobseekers.map(user => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{user.fullname}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phoneNumber}</td>
              <td className="p-3 flex gap-2">
                {user.profile?.resume && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => viewCV(user)}>
                      <FileText className="mr-2 h-4 w-4" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadCV(user)}>
                      <FileDown className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </>
                )}
              </td>
              <td className="p-3">
                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
              </td>
              <td className="p-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedJobseeker(user)}>More Details</Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">No jobseekers found</td>
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
              {selectedJobseeker.profile?.resume && (
                <p>
                  <strong>Resume:</strong>
                  <Button variant="outline" size="sm" onClick={() => viewCV(selectedJobseeker)} className="ml-2"><FileText className="mr-1 h-4 w-4" /> View</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadCV(selectedJobseeker)} className="ml-2"><FileDown className="mr-1 h-4 w-4" /> Download</Button>
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedJobseeker(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobseekerTable;
