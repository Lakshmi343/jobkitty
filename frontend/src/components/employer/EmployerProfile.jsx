
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2, Pen, Mail, Contact, Building, Globe, MapPin, Briefcase, Users, Calendar, Save, X, ChevronDown, ChevronUp, Phone, Link, User} from 'lucide-react';
import Navbar from '../shared/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { COMPANY_API_END_POINT } from '../../utils/constant';

const InfoItem = ({ icon, label, value, className }) => {
  return (
    <div className={cn("flex items-start gap-4 p-4", className)}>
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-gray-900 font-medium break-words">{value || 'Not provided'}</p>
      </div>
    </div>
  );
};

const AccordionSection = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-600">
            {icon}
          </div>
          <span className="text-lg font-semibold text-gray-900">{title}</span>
        </div>
        {open ? 
          <ChevronUp className="h-5 w-5 text-gray-500" /> : 
          <ChevronDown className="h-5 w-5 text-gray-500" />
        }
      </button>
      {open && <div className="border-t border-gray-200">{children}</div>}
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
     
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your company profile...</p>
        </div>
      </div>
    </div>
  );

  if (!company) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
  <Navbar />
  <div className="flex-1 flex items-center justify-center px-4">
    <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 max-w-md w-full">
      <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <Building className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Complete Your Company Setup
      </h2>
      <p className="text-gray-600 mb-6">
        You need to complete your company profile setup before you can post jobs or manage candidates. 
        Please finish this step to continue.
      </p>
      <Button
        onClick={() => navigate('/employer/company/setup')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
      >
        Go to Company Setup
      </Button>
    </div>
  </div>
</div>

  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group flex-shrink-0">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg ring-2 ring-blue-100">
                {input.file ? (
                  <AvatarImage src={URL.createObjectURL(input.file)} className="object-cover" />
                ) : company.logo ? (
                  <AvatarImage src={company.logo} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-4xl">
                    {company.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              {editMode && (
                <label htmlFor="logo-upload" className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-md hover:bg-blue-700 transition-all">
                  <Pen className="h-4 w-4" />
                  <input id="logo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600 mt-2 text-lg">{company.description || 'No description available'}</p>
              
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                {company.companyType && (
                  <Tag icon={<Building size={16} />} text={company.companyType} />
                )}
                {company.location && (
                  <Tag icon={<MapPin size={16} />} text={company.location} />
                )}
                {company.experience && (
                  <Tag icon={<Briefcase size={16} />} text={`${company.experience} yrs experience`} />
                )}
                {company.numberOfEmployees && (
                  <Tag icon={<Users size={16} />} text={`${company.numberOfEmployees} employees`} />
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              {!editMode ? (
                <Button 
                  onClick={() => setEditMode(true)} 
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
                >
                  <Pen className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setEditMode(false)} 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    form="profile-form" 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        {!editMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccordionSection title="Company Information" icon={<Building size={20} />}>
              <InfoItem 
                icon={<Briefcase size={20} />} 
                label="Experience" 
                value={company.experience ? `${company.experience} years` : undefined} 
                className="border-b border-gray-100"
              />
              <InfoItem 
                icon={<Globe size={20} />} 
                label="Website" 
                value={company.website} 
                className="border-b border-gray-100"
              />
              <InfoItem 
                icon={<MapPin size={20} />} 
                label="Location" 
                value={company.location} 
                className="border-b border-gray-100"
              />
              <InfoItem 
                icon={<Calendar size={20} />} 
                label="Founded Year" 
                value={company.foundedYear} 
              />
            </AccordionSection>
            
            <AccordionSection title="Contact & Team" icon={<Users size={20} />}>
              <InfoItem 
                icon={<Users size={20} />} 
                label="Team Size" 
                value={company.numberOfEmployees} 
                className="border-b border-gray-100"
              />
              <InfoItem 
                icon={<Mail size={20} />} 
                label="Contact Email" 
                value={company.contactEmail || user?.email} 
                className="border-b border-gray-100"
              />
              <InfoItem 
                icon={<Phone size={20} />} 
                label="Contact Phone" 
                value={company.contactPhone || user?.phoneNumber} 
              />
            </AccordionSection>
          </div>
        ) : (
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">Edit Company Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Company Name" name="name" value={input.name} onChange={handleChange} required />
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 mb-2">Company Description</Label>
                  <textarea 
                    name="description" 
                    value={input.description} 
                    onChange={handleChange} 
                    rows="4" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="Describe your company's mission, values, and what makes it unique..."
                  />
                </div>
                
                <InputField 
                  label="Website" 
                  name="website" 
                  value={input.website} 
                  onChange={handleChange} 
                  placeholder="https://company.com" 
                  icon={<Link size={16} />}
                />
                
                <InputField 
                  label="Location" 
                  name="location" 
                  value={input.location} 
                  onChange={handleChange} 
                  placeholder="City, Country" 
                  icon={<MapPin size={16} />}
                />
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Company Type</Label>
                  <select 
                    name="companyType" 
                    value={input.companyType} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Company Type</option>
                    {['Startup', 'MNC', 'SME', 'Government', 'Non-Profit', 'IT Services', 
                      'Finance', 'Healthcare', 'Education', 'E-commerce', 'Manufacturing', 'Other'].map(t => 
                      <option key={t} value={t}>{t}</option>
                    )}
                  </select>
                </div>
                
                <InputField 
                  label="Years of Experience" 
                  name="experience" 
                  type="number" 
                  value={input.experience} 
                  onChange={handleChange} 
                  min="0" 
                  icon={<Briefcase size={16} />}
                />
                
                <InputField 
                  label="Contact Email" 
                  name="contactEmail" 
                  type="email" 
                  value={input.contactEmail} 
                  onChange={handleChange} 
                  icon={<Mail size={16} />}
                />
                
                <InputField 
                  label="Contact Phone" 
                  name="contactPhone" 
                  value={input.contactPhone} 
                  onChange={handleChange} 
                  icon={<Phone size={16} />}
                />
                
                <InputField 
                  label="Founded Year" 
                  name="foundedYear" 
                  type="number" 
                  value={input.foundedYear} 
                  onChange={handleChange} 
                  min="1800" 
                  max={new Date().getFullYear()} 
                  icon={<Calendar size={16} />}
                />
                
                <InputField 
                  label="Number of Employees" 
                  name="numberOfEmployees" 
                  type="number" 
                  value={input.numberOfEmployees} 
                  onChange={handleChange} 
                  min="1" 
                  icon={<User size={16} />}
                />
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 mb-2">Company Logo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-20 w-20 border border-gray-300">
                      {input.file ? 
                        <AvatarImage src={URL.createObjectURL(input.file)} className="object-cover" /> : 
                        company.logo ? 
                        <AvatarImage src={company.logo} className="object-cover" /> : 
                        <AvatarFallback className="bg-blue-100 text-blue-700">{input.name?.[0]?.toUpperCase() || 'C'}</AvatarFallback>
                      }
                    </Avatar>
                    <div>
                      <label htmlFor="logo-upload" className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors inline-block">
                        Change Logo
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 300×300 pixels, JPG or PNG</p>
                    </div>
                    <input id="logo-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, icon, ...props }) => (
  <div>
    <Label className="text-sm font-medium text-gray-700 mb-2 block">{label}</Label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <Input 
        {...props} 
        className={cn(
          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
          icon ? "pl-10" : ""
        )} 
      />
    </div>
  </div>
);

const Tag = ({ icon, text }) => {
  return (
    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 inline-flex items-center gap-1.5">
      {icon} {text}
    </span>
  );
};

export default EmployerProfile;