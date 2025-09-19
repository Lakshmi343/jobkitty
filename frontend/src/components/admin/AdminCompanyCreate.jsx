import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import LocationSelector from '../ui/LocationSelector';
import MultiLocationSelector from '../ui/MultiLocationSelector';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '../../utils/constant';
import { Upload, ArrowLeft, Building } from 'lucide-react';
import { toast } from 'sonner';

const AdminCompanyCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    multiLocation: { state: '', districts: [] },
    companyType: '',
    numberOfEmployees: '',
    contactEmail: '',
    contactPhone: '',
    foundedYear: ''
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    // Only name is required for admin-created companies
    if (!form.name) {
      toast.error('Company name is required');
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      if (logoFile) fd.append('file', logoFile);
      const payload = { ...form };
      fd.append('name', payload.name);
      if (payload.description) fd.append('description', payload.description);
      if (payload.website) fd.append('website', payload.website);
      if (payload.location) fd.append('location', typeof payload.location === 'string' ? payload.location : JSON.stringify(payload.location));
      if (payload.multiLocation?.state) fd.append('state', payload.multiLocation.state);
      if (payload.multiLocation?.districts?.length) fd.append('districts', JSON.stringify(payload.multiLocation.districts));
      if (payload.companyType) fd.append('companyType', payload.companyType);
      if (payload.numberOfEmployees) fd.append('numberOfEmployees', String(payload.numberOfEmployees));
      if (payload.contactEmail) fd.append('contactEmail', payload.contactEmail);
      if (payload.contactPhone) fd.append('contactPhone', payload.contactPhone);
      if (payload.foundedYear) fd.append('foundedYear', String(payload.foundedYear));

      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${ADMIN_API_END_POINT}/companies`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success('Company created');
        const id = res.data.company?._id;
        if (id) navigate(`/admin/companies/${id}`);
        else navigate('/admin/companies');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-7 h-7 text-blue-600" /> Create Company
            </h1>
            <p className="text-gray-600">Add a company so you can post jobs under it</p>
          </div>
          <div>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/companies')}>Go to Companies</Button>
          </div>
        </div>

        <form onSubmit={submit}>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic details to identify the company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Name *</Label>
                  <Input name="name" value={form.name} onChange={onChange} placeholder="e.g., Acme Corp" />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input name="website" value={form.website} onChange={onChange} placeholder="https://acme.com" />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea name="description" value={form.description} onChange={onChange} placeholder="What does this company do?" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <LocationSelector
                    label="Legacy Location (optional)"
                    value={form.location}
                    onChange={(value) => setForm({ ...form, location: value })}
                    required={false}
                    placeholder="Select location"
                  />
                </div>
                <div>
                  <Label>Logo</Label>
                  <div className="flex items-center gap-3">
                    <Input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('logo')?.click()} className="flex items-center gap-2">
                      <Upload className="w-4 h-4" /> Upload Logo
                    </Button>
                    {logoPreview && (
                      <img src={logoPreview} alt="logo" className="h-10 w-10 rounded object-cover border" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <MultiLocationSelector
                  label="State & Districts (optional)"
                  value={form.multiLocation}
                  onChange={(val) => setForm({ ...form, multiLocation: val })}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label>Company Type</Label>
                  <Input name="companyType" value={form.companyType} onChange={onChange} placeholder="e.g., IT Services" />
                </div>
                <div>
                  <Label>Employees</Label>
                  <Input name="numberOfEmployees" value={form.numberOfEmployees} onChange={onChange} type="number" min="1" />
                </div>
                <div>
                  <Label>Founded Year</Label>
                  <Input name="foundedYear" value={form.foundedYear} onChange={onChange} type="number" min="1800" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Contact Email</Label>
                  <Input name="contactEmail" value={form.contactEmail} onChange={onChange} type="email" />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input name="contactPhone" value={form.contactPhone} onChange={onChange} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Company'}</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default AdminCompanyCreate;
