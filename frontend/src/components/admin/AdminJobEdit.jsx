import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { formatLocationForDisplay } from '../../utils/locationUtils';
import { ADMIN_API_END_POINT, CATEGORY_API_END_POINT } from '../../utils/constant';

const AdminJobEdit = () => {
  const { jobId, id } = useParams();
  const routeJobId = jobId || id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [formData, setFormData] = useState({
    // Company details
    company: {
      name: '',
      description: '',
      website: '',
      location: '',
      logo: ''
    },
    // Job details
    title: '',
    description: '',
    requirements: [],
    salary: { min: '', max: '' },
    location: '',
    jobType: 'Full-time',
    position: 1,
    openings: 1,
    category: ''
  });

  useEffect(() => {
    if (!routeJobId) {
      toast.error('Invalid job id in URL');
      navigate('/admin/jobs');
      return;
    }
    fetchJobData();
    fetchCategories();
  }, [routeJobId]);

  const fetchJobData = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.get(`${ADMIN_API_END_POINT}/jobs/${routeJobId}/edit`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const job = response.data.job;
        setFormData({
          company: {
            name: job.company.name || '',
            description: job.company.description || '',
            website: job.company.website || '',
            location: typeof job.company.location === 'object' ? formatLocationForDisplay(job.company.location) : (job.company.location || ''),
            logo: job.company.logo || ''
          },
          title: job.title || '',
          description: job.description || '',
          requirements: Array.isArray(job.requirements) ? job.requirements : [],
          salary: {
            min: job.salary?.min || '',
            max: job.salary?.max || ''
          },
          location: typeof job.location === 'object' ? formatLocationForDisplay(job.location) : (job.location || ''),
          jobType: job.jobType || 'Full-time',
          position: job.position || 1,
          openings: job.openings || 1,
          category: job.category?._id || ''
        });
        
        if (job.company.logo) {
          setLogoPreview(job.company.logo);
        }
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      navigate('/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${CATEGORY_API_END_POINT}/get`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field, value, isCompany = false) => {
    if (isCompany) {
      setFormData(prev => ({
        ...prev,
        company: { ...prev.company, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleRequirementsChange = (value) => {
    const requirements = value.split('\n').filter(req => req.trim() !== '');
    setFormData(prev => ({ ...prev, requirements }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setFormData(prev => ({
      ...prev,
      company: { ...prev.company, logo: '' }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Job title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Job description is required');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a job category');
      return;
    }
    
    if (!formData.company.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      // Add job data
      submitData.append('jobData', JSON.stringify(formData));
      
      // Add logo file if selected
      if (logoFile) {
        submitData.append('file', logoFile);
      }

      const response = await axios.put(
        `${ADMIN_API_END_POINT}/jobs/${routeJobId}/edit`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Job updated successfully!');
        navigate('/admin/jobs');
      } else {
        toast.error(response.data.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-600 mt-1">Update job and company details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.company.name}
                    onChange={(e) => handleInputChange('name', e.target.value, true)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={formData.company.website}
                    onChange={(e) => handleInputChange('website', e.target.value, true)}
                    placeholder="https://company.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={formData.company.description}
                  onChange={(e) => handleInputChange('description', e.target.value, true)}
                  placeholder="Brief description of the company"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="companyLocation">Company Location</Label>
                <Input
                  id="companyLocation"
                  value={formData.company.location}
                  onChange={(e) => handleInputChange('location', e.target.value, true)}
                  placeholder="City, Country"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <Label>Company Logo</Label>
                <div className="mt-2">
                  {logoPreview ? (
                    <div className="flex items-center gap-4">
                      <img 
                        src={logoPreview} 
                        alt="Company logo" 
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('logoInput').click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change Logo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeLogo}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logoInput').click()}
                      className="w-full h-32 border-dashed"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload company logo</p>
                        <p className="text-xs text-gray-400">Max 5MB, image files only</p>
                      </div>
                    </Button>
                  )}
                  <input
                    id="logoInput"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name || cat.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="jobDescription">Job Description *</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed job description..."
                  className="min-h-[240px] resize-y"
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleRequirementsChange(e.target.value)}
                  placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Proficiency in React and Node.js"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="jobLocation">Job Location</Label>
                  <Input
                    id="jobLocation"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country or Remote"
                  />
                </div>
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select 
                    value={formData.jobType} 
                    onValueChange={(value) => handleInputChange('jobType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="openings">Number of Openings</Label>
                  <Input
                    id="openings"
                    type="number"
                    min="1"
                    value={formData.openings}
                    onChange={(e) => handleInputChange('openings', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minSalary">Minimum Salary</Label>
                  <Input
                    id="minSalary"
                    type="number"
                    value={formData.salary.min}
                    onChange={(e) => handleInputChange('salary', { ...formData.salary, min: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="maxSalary">Maximum Salary</Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    value={formData.salary.max}
                    onChange={(e) => handleInputChange('salary', { ...formData.salary, max: e.target.value })}
                    placeholder="80000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/jobs')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminJobEdit;
