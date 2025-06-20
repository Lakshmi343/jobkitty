import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Building, Globe, MapPin, Briefcase } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);

    // Fetch company data for employers
    useEffect(() => {
        const fetchCompanyData = async () => {
            if (user?.role === 'Employer') {
                try {
                    setLoading(true);
                    const response = await axios.get(`${COMPANY_API_END_POINT}/user`, {
                        withCredentials: true
                    });
                    if (response.data.success) {
                        setCompanyData(response.data.company);
                    }
                } catch (error) {
                    console.error('Error fetching company data:', error);
                    toast.error('Failed to load company data');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCompanyData();
    }, [user]);

    // For jobseekers - show personal profile
    if (user?.role === 'Jobseeker') {
        return (
            <div>
                <Navbar />
                <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                            </Avatar>
                            <div>
                                <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                                <p>{user?.profile?.bio}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                    </div>
                    <div className='my-5'>
                        <div className='flex items-center gap-3 my-2'>
                            <Mail />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-2'>
                            <Contact />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                    <div className='my-5'>
                        <h1>Skills</h1>
                        <div className='flex items-center gap-1'>
                            {
                                user?.profile?.skills?.length > 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                            }
                        </div>
                    </div>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-md font-bold">Resume</Label>
                        {
                            user?.profile?.resume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                    <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                    <AppliedJobTable />
                </div>
                <UpdateProfileDialog open={open} setOpen={setOpen}/>
            </div>
        )
    }

    // For employers - show company profile
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={companyData?.logo || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="company logo" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{companyData?.name || 'Company Name'}</h1>
                            <p className='text-gray-600'>{companyData?.description || 'No description available'}</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => window.location.href = '/company-setup'} 
                        className="text-right" 
                        variant="outline"
                    >
                        <Pen className="mr-2 h-4 w-4" />
                        Edit Company
                    </Button>
                </div>
                
                <div className='my-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center gap-3'>
                        <Building className="h-5 w-5 text-gray-500" />
                        <span className='font-medium'>Company Type:</span>
                        <span>{companyData?.companyType || 'Not specified'}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Briefcase className="h-5 w-5 text-gray-500" />
                        <span className='font-medium'>Experience:</span>
                        <span>{companyData?.experience ? `${companyData.experience} years` : 'Not specified'}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Globe className="h-5 w-5 text-gray-500" />
                        <span className='font-medium'>Website:</span>
                        {companyData?.website ? (
                            <a href={companyData.website} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>
                                {companyData.website}
                            </a>
                        ) : (
                            <span>Not specified</span>
                        )}
                    </div>
                    <div className='flex items-center gap-3'>
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <span className='font-medium'>Location:</span>
                        <span>{companyData?.location || 'Not specified'}</span>
                    </div>
                </div>

                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile