import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Save, X, Building, Users, Briefcase, Tags } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';

const AdminAddSection = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  
  // Company form state
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    type: '',
    size: ''
  });

  // User form state
  const [userForm, setUserForm] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    role: 'Jobseeker',
    password: 'defaultpass123'
  });

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    experience: '',
    position: 1,
    companyId: ''
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const resetForms = () => {
    setCompanyForm({
      name: '',
      description: '',
      website: '',
      location: '',
      type: '',
      size: ''
    });
    setUserForm({
      fullname: '',
      email: '',
      phoneNumber: '',
      role: 'Jobseeker',
      password: 'defaultpass123'
    });
    setJobForm({
      title: '',
      description: '',
      requirements: '',
      salary: '',
      location: '',
      jobType: 'Full-time',
      experience: '',
      position: 1,
      companyId: ''
    });
    setCategoryForm({
      name: '',
      description: ''
    });
  };

  const handleAddCompany = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${ADMIN_API_END_POINT}/companies/add`, companyForm);
      if (response.data.success) {
        toast.success('Company added successfully!');
        setCompanyForm({
          name: '',
          description: '',
          website: '',
          location: '',
          type: '',
          size: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add company');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${ADMIN_API_END_POINT}/users/add`, userForm);
      if (response.data.success) {
        toast.success('User added successfully!');
        setUserForm({
          fullname: '',
          email: '',
          phoneNumber: '',
          role: 'Jobseeker',
          password: 'defaultpass123'
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async () => {
    setLoading(true);
    try {
      const jobData = {
        ...jobForm,
        requirements: jobForm.requirements.split(',').map(req => req.trim()),
        position: parseInt(jobForm.position)
      };
      
      const response = await axios.post(`${ADMIN_API_END_POINT}/jobs/add`, jobData);
      if (response.data.success) {
        toast.success('Job added successfully!');
        setJobForm({
          title: '',
          description: '',
          requirements: '',
          salary: '',
          location: '',
          jobType: 'Full-time',
          experience: '',
          position: 1,
          companyId: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add job');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${ADMIN_API_END_POINT}/categories/add`, categoryForm);
      if (response.data.success) {
        toast.success('Category added successfully!');
        setCategoryForm({
          name: '',
          description: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Add Company', icon: Building },
    { id: 'user', label: 'Add User', icon: Users },
    { id: 'job', label: 'Add Job', icon: Briefcase },
    { id: 'category', label: 'Add Category', icon: Tags }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Add Section</h1>
          <p className="text-gray-600 mt-2">Add new companies, users, jobs, and categories to the system</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Add Company Form */}
        {activeTab === 'company' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={20} />
                Add New Company
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                    placeholder="https://company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="companyLocation">Location</Label>
                  <Input
                    id="companyLocation"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="companyType">Company Type</Label>
                  <Select onValueChange={(value) => setCompanyForm({...companyForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="SME">SME</SelectItem>
                      <SelectItem value="MNC">MNC</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="companyDescription">Description</Label>
                <Textarea
                  id="companyDescription"
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                  placeholder="Company description..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCompany} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Adding...' : 'Add Company'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  <X size={16} className="mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add User Form */}
        {activeTab === 'user' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Add New User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    value={userForm.fullname}
                    onChange={(e) => setUserForm({...userForm, fullname: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="userPhone">Phone Number</Label>
                  <Input
                    id="userPhone"
                    value={userForm.phoneNumber}
                    onChange={(e) => setUserForm({...userForm, phoneNumber: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">Role</Label>
                  <Select onValueChange={(value) => setUserForm({...userForm, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jobseeker">Job Seeker</SelectItem>
                      <SelectItem value="Employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddUser} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Adding...' : 'Add User'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  <X size={16} className="mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Job Form */}
        {activeTab === 'job' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase size={20} />
                Add New Job
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <Label htmlFor="jobSalary">Salary</Label>
                  <Input
                    id="jobSalary"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                    placeholder="e.g., 5-8 LPA"
                  />
                </div>
                <div>
                  <Label htmlFor="jobLocation">Location</Label>
                  <Input
                    id="jobLocation"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    placeholder="Job location"
                  />
                </div>
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select onValueChange={(value) => setJobForm({...jobForm, jobType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jobExperience">Experience Required</Label>
                  <Input
                    id="jobExperience"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({...jobForm, experience: e.target.value})}
                    placeholder="e.g., 2-5 years"
                  />
                </div>
                <div>
                  <Label htmlFor="jobPositions">Number of Positions</Label>
                  <Input
                    id="jobPositions"
                    type="number"
                    value={jobForm.position}
                    onChange={(e) => setJobForm({...jobForm, position: e.target.value})}
                    placeholder="1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  placeholder="Job description..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="jobRequirements">Requirements (comma separated)</Label>
                <Textarea
                  id="jobRequirements"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                  placeholder="React, Node.js, MongoDB, etc."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddJob} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Adding...' : 'Add Job'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  <X size={16} className="mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Category Form */}
        {activeTab === 'category' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags size={20} />
                Add New Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea
                  id="categoryDescription"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Category description..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCategory} disabled={loading}>
                  <Save size={16} className="mr-2" />
                  {loading ? 'Adding...' : 'Add Category'}
                </Button>
                <Button variant="outline" onClick={resetForms}>
                  <X size={16} className="mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminAddSection;
