import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Loader2, Pen, Mail, Contact, Building, Globe, MapPin, 
  Briefcase, Users, Calendar, User, Save, X
} from 'lucide-react';
import Navbar from '../shared/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { COMPANY_API_END_POINT } from '@/utils/constant';

const EmployerProfile = () => {
  const [company, setCompany] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({});
  const [fetching, setFetching] = useState(true);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${COMPANY_API_END_POINT}/user`, { withCredentials: true });
        if (res.data.success) {
          setCompany(res.data.company);
          setInput({
            name: res.data.company.name || '',
            description: res.data.company.description || '',
            website: res.data.company.website || '',
            location: res.data.company.location || '',
            companyType: res.data.company.companyType || '',
            experience: res.data.company.experience || '',
            contactEmail: res.data.company.contactEmail || user?.email || '',
            contactPhone: res.data.company.contactPhone || user?.phoneNumber || '',
            foundedYear: res.data.company.foundedYear || '',
            numberOfEmployees: res.data.company.numberOfEmployees || '',
            file: null
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load company data');
      } finally {
        setFetching(false);
      }
    };
    fetchCompany();
  }, [user?.email, user?.phoneNumber]);

  const handleChange = e => setInput({ ...input, [e.target.name]: e.target.value });
  const handleFileChange = e => setInput({ ...input, file: e.target.files[0] });

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(input).forEach(key => {
      if (input[key] !== null && key !== 'file') formData.append(key, input[key]);
    });
    if (input.file) formData.append('file', input.file);

    try {
      setLoading(true);
      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${company._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Profile updated successfully');
        setCompany(res.data.company);
        setEditMode(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading your company profile...</p>
      </div>
    </div>
  );

  if (!company) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Company Profile Found</h2>
        <p className="text-gray-600 mb-6">It looks like you haven't created a company profile yet.</p>
        <Button onClick={() => navigate('/create-company')}>
          Create Company Profile
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  {company.logo ? (
                    <AvatarImage src={company.logo} className="object-cover" />
                  ) : (
                    <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
                      {company.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                {editMode && (
                  <label htmlFor="logo-upload" className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-md hover:bg-blue-700 transition">
                    <Pen className="h-4 w-4" />
                    <input 
                      id="logo-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-gray-600 mt-2 max-w-2xl">{company.description || 'No description available'}</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {company.companyType && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {company.companyType}
                    </span>
                  )}
                  {company.location && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {company.location}
                    </span>
                  )}
                  {company.experience && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                      <Briefcase className="h-3 w-3 mr-1" /> {company.experience} yrs experience
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                {!editMode ? (
                  <Button 
                    onClick={() => setEditMode(true)} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Pen className="h-4 w-4" /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      onClick={() => setEditMode(false)} 
                      variant="outline" 
                      className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      form="profile-form"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )} 
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Unified Profile Card */}
        {!editMode ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Company Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Type</p>
                    <p className="font-medium">{company.companyType || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{company.experience ? `${company.experience} yrs` : 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    {company.website ? (
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    ) : (
                      <p className="font-medium">Not provided</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{company.location || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Founded Year</p>
                    <p className="font-medium">{company.foundedYear || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employees</p>
                    <p className="font-medium">{company.numberOfEmployees || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Email</p>
                    <p className="font-medium">{company.contactEmail || user?.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Contact className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Phone</p>
                    <p className="font-medium">{company.contactPhone || user?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profile Name</p>
                    <p className="font-medium">{user?.name || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profile Email</p>
                    <p className="font-medium">{user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form id="profile-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Edit Company Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-gray-700">Basic Information</h3>
                
                <InputField 
                  label="Company Name" 
                  name="name" 
                  value={input.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter company name"
                />
                
                <div>
                  <Label htmlFor="description" className="text-gray-700 mb-2 block">Description</Label>
                  <textarea 
                    id="description"
                    name="description" 
                    value={input.description} 
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your company"
                  ></textarea>
                </div>
                
                <InputField 
                  label="Website" 
                  name="website" 
                  value={input.website} 
                  onChange={handleChange} 
                  placeholder="https://example.com"
                />
                
                <InputField 
                  label="Location" 
                  name="location" 
                  value={input.location} 
                  onChange={handleChange} 
                  placeholder="City, Country"
                />
                
                <div>
                  <Label htmlFor="companyType" className="text-gray-700 mb-2 block">Company Type</Label>
                  <select 
                    id="companyType"
                    name="companyType" 
                    value={input.companyType} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    {['Startup','MNC','SME','Government','Non-Profit','HR','Manufacturing','IT Services','Education','Healthcare','Finance','E-commerce','Consulting','Real Estate','Media & Entertainment','Telecommunications','Energy','Logistics','Agriculture','Automobile','Hospitality','Pharmaceutical','Retail','Construction','Legal','Cybersecurity','AI & Machine Learning','Gaming','Research & Development'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-gray-700">Additional Details</h3>
                
                <InputField 
                  label="Experience (Years)" 
                  name="experience" 
                  value={input.experience} 
                  onChange={handleChange} 
                  type="number" 
                  min="0"
                  placeholder="0"
                />
                
                <InputField 
                  label="Contact Email" 
                  name="contactEmail" 
                  value={input.contactEmail} 
                  onChange={handleChange} 
                  type="email" 
                  placeholder="contact@company.com"
                />
                
                <InputField 
                  label="Contact Phone" 
                  name="contactPhone" 
                  value={input.contactPhone} 
                  onChange={handleChange} 
                  placeholder="+1234567890"
                />
                
                <InputField 
                  label="Founded Year" 
                  name="foundedYear" 
                  value={input.foundedYear} 
                  onChange={handleChange} 
                  type="number" 
                  min="1900" 
                  max={new Date().getFullYear()}
                  placeholder="2020"
                />
                
                <InputField 
                  label="Number of Employees" 
                  name="numberOfEmployees" 
                  value={input.numberOfEmployees} 
                  onChange={handleChange} 
                  type="number" 
                  min="0"
                  placeholder="50"
                />
                
                <div>
                  <Label htmlFor="logo" className="text-gray-700 mb-2 block">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border">
                        {input.file ? (
                          <AvatarImage src={URL.createObjectURL(input.file)} />
                        ) : company.logo ? (
                          <AvatarImage src={company.logo} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {input.name?.[0]?.toUpperCase() || 'C'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div>
                      <input 
                        id="logo"
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                      <label htmlFor="logo" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm cursor-pointer transition">
                        Change Logo
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <Button 
                type="button" 
                onClick={() => setEditMode(false)} 
                variant="outline" 
                className="mr-4 border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <Label htmlFor={props.name} className="text-gray-700 mb-2 block">{label}</Label>
    <Input 
      id={props.name}
      {...props} 
      className="w-full focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default EmployerProfile;