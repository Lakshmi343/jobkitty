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
import { cn } from '../../lib/utils';

const COMPANY_API_END_POINT = "http://localhost:8000/api/v1/company";

// InfoItem component for consistent profile detail display
const InfoItem = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
    indigo: "bg-indigo-100 text-indigo-600"
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <div className={cn("p-2.5 rounded-lg flex-shrink-0", colorClasses[color])}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <div className="text-gray-900 font-medium break-words">
          {typeof value === 'string' ? value : value}
        </div>
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 -mt-24">
              {/* Avatar Section */}
              <div className="relative group flex-shrink-0">
                <div className="p-1 bg-white rounded-full shadow-2xl">
                  <Avatar className="h-36 w-36 border-4 border-white shadow-lg">
                    {company.logo ? (
                      <AvatarImage src={company.logo} className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                        {company.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                {editMode && (
                  <label htmlFor="logo-upload" className="absolute bottom-3 right-3 bg-blue-600 p-3 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110">
                    <Pen className="h-5 w-5" />
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
              
              {/* Company Info Section */}
              <div className="flex-1 text-center lg:text-left min-w-0">
                <div className="mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    {company.name}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                    {company.description || 'No description available'}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {company.companyType && (
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-semibold shadow-sm border border-blue-200">
                      <Building className="h-4 w-4 inline mr-2" />
                      {company.companyType}
                    </span>
                  )}
                  {company.location && (
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-sm font-semibold shadow-sm border border-purple-200">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      {company.location}
                    </span>
                  )}
                  {company.experience && (
                    <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-semibold shadow-sm border border-green-200">
                      <Briefcase className="h-4 w-4 inline mr-2" />
                      {company.experience} years
                    </span>
                  )}
                  {company.numberOfEmployees && (
                    <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full text-sm font-semibold shadow-sm border border-orange-200">
                      <Users className="h-4 w-4 inline mr-2" />
                      {company.numberOfEmployees} employees
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 flex-shrink-0">
                {!editMode ? (
                  <Button 
                    onClick={() => setEditMode(true)} 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Pen className="h-5 w-5" /> 
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      onClick={() => setEditMode(false)} 
                      variant="outline" 
                      className="flex items-center gap-2 border-2 border-red-300 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <X className="h-5 w-5" /> 
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      form="profile-form"
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Save className="h-5 w-5" />
                      )} 
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Details Card */}
        {!editMode ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Building className="h-6 w-6 text-blue-600" />
                Company Details
              </h2>
              <p className="text-gray-600 mt-1">Complete information about your company</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Company Information
                  </h3>
                  
                  <div className="space-y-5">
                    <InfoItem 
                      icon={<Building className="h-5 w-5" />}
                      label="Company Type"
                      value={company.companyType || 'Not specified'}
                      color="blue"
                    />
                    
                    <InfoItem 
                      icon={<Briefcase className="h-5 w-5" />}
                      label="Experience"
                      value={company.experience ? `${company.experience} years` : 'Not specified'}
                      color="green"
                    />
                    
                    <InfoItem 
                      icon={<Globe className="h-5 w-5" />}
                      label="Website"
                      value={company.website ? (
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                        >
                          {company.website}
                        </a>
                      ) : 'Not provided'}
                      color="purple"
                    />
                    
                    <InfoItem 
                      icon={<MapPin className="h-5 w-5" />}
                      label="Location"
                      value={company.location || 'Not specified'}
                      color="red"
                    />
                    
                    <InfoItem 
                      icon={<Calendar className="h-5 w-5" />}
                      label="Founded Year"
                      value={company.foundedYear || 'Not specified'}
                      color="orange"
                    />
                  </div>
                </div>
                
                {/* Contact & Team Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Contact & Team Details
                  </h3>
                  
                  <div className="space-y-5">
                    <InfoItem 
                      icon={<Users className="h-5 w-5" />}
                      label="Team Size"
                      value={company.numberOfEmployees ? `${company.numberOfEmployees} employees` : 'Not specified'}
                      color="indigo"
                    />
                    
                    <InfoItem 
                      icon={<Mail className="h-5 w-5" />}
                      label="Contact Email"
                      value={company.contactEmail || user?.email || 'Not provided'}
                      color="blue"
                    />
                    
                    <InfoItem 
                      icon={<Contact className="h-5 w-5" />}
                      label="Contact Phone"
                      value={company.contactPhone || user?.phoneNumber || 'Not provided'}
                      color="green"
                    />
                    
                    <InfoItem 
                      icon={<User className="h-5 w-5" />}
                      label="Profile Owner"
                      value={user?.name || 'Not available'}
                      color="purple"
                    />
                    
                    <InfoItem 
                      icon={<Mail className="h-5 w-5" />}
                      label="Owner Email"
                      value={user?.email || 'Not available'}
                      color="red"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form id="profile-form" onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Pen className="h-6 w-6 text-orange-600" />
                Edit Company Profile
              </h2>
              <p className="text-gray-600 mt-1">Update your company information and details</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>
                  
                  <div className="space-y-5">
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
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Additional Details
                  </h3>
                  
                  <div className="space-y-5">
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

