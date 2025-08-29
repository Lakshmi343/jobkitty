import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobseekerTable from '../../components/admin/JobseekerTable';
import { showErrorToast } from '../../utils/toast';
import { ADMIN_API_END_POINT } from '../../utils/constant';

const JobseekersPage = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobseekers();
  }, []);

  const fetchJobseekers = async () => {
    try {
      setLoading(true);
      // Using the correct API endpoint from constants
      const response = await axios.get(`${ADMIN_API_END_POINT}/users/jobseekers`);
      setJobseekers(response.data);

      console.log('Jobseekers data:', response.data); // Debug log
    } catch (error) {
      console.error('Error fetching jobseekers:', error);
      showErrorToast('Failed to load jobseekers');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, { status });
      fetchJobseekers(); // Refresh data
    } catch (error) {
      console.error('Error updating user status:', error);
      showErrorToast('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchJobseekers(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      showErrorToast('Failed to delete user');
    }
  };

  const viewCV = (cvUrl) => {
    window.open(cvUrl, '_blank');
  };

  const downloadCV = (cvUrl, userName) => {
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = `${userName}-CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Jobseekers</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <JobseekerTable 
          jobseekers={jobseekers} 
          updateUserStatus={updateUserStatus} 
          deleteUser={deleteUser} 
          viewCV={viewCV} 
          downloadCV={downloadCV} 
        />
      )}
    </div>
  );
};

export default JobseekersPage;