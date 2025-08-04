import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';

const EmployerCompanySetup = () => {
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.profile?.company) {
            setInput({

                name: user.profile.company.name || "",
                description: user.profile.company.description || "",
                website: user.profile.company.website || "",
                location: user.profile.company.location || "",
                file: null,
            });
        }
    }, [user]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }

        console.log('Submitting job:', formData);

        try {
            let res;
            if (user?.profile?.company) {

                res = await axios.put(`${COMPANY_API_END_POINT}/update/${user.profile.company._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
            } else {
                // Create new company (use POST)
                res = await axios.post(`${COMPANY_API_END_POINT}/setup`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
            }

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                navigate('/employer/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-2xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-bold mb-6'>
                    {user?.profile?.company ? 'Update Your Company Profile' : 'Setup Your Company'}
                </h1>
                <form onSubmit={submitHandler} className='space-y-6'>
                    <div>
                        <Label>Company Name</Label>
                        <Input type="text" name="name" value={input.name} onChange={changeEventHandler} />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea name="description" value={input.description} onChange={changeEventHandler} />
                    </div>
                    <div>
                        <Label>Website</Label>
                        <Input type="text" name="website" value={input.website} onChange={changeEventHandler} />
                    </div>
                    <div>
                        <Label>Location</Label>
                        <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
                    </div>
                    <div>
                        <Label>Company Logo</Label>
                        <Input type="file" accept="image/*" onChange={changeFileHandler} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : (user?.profile?.company ? 'Update' : 'Save')}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EmployerCompanySetup; 