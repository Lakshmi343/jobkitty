// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Badge } from '../ui/badge';
// import { toast } from 'sonner';
// import { 
//   FileText,  
//   Download,  
//   Eye,  
//   Search,  
//   Filter, 
//   Users, 
//   Calendar, 
//   Briefcase, 
//   Mail, 
//   X, 
//   GraduationCap, 
//   MapPin, 
//   Clock,
//   SlidersHorizontal,
//   ChevronDown,
//   ChevronUp
// } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Checkbox } from '../ui/checkbox';
// import { Label } from '../ui/label';
// import { ADMIN_API_END_POINT } from '../../utils/constant';

// const AdminCVManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('Jobseeker');
//   const [showPreview, setShowPreview] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Advanced filter states
//   const [filters, setFilters] = useState({
//     search: '',
//     skills: [],
//     experienceMin: '',
//     experienceMax: '',
//     educationLevels: [],
//     locations: [],
//     jobTypes: [],
//     dateAdded: '',
//     hasCV: true,
//     hasProfile: true
//   });
  
//   // Available options for filters
//   const [availableOptions, setAvailableOptions] = useState({
//     skills: [],
//     locations: [],
//     educationLevels: ['High School', 'Diploma', "Bachelor's", "Master's", 'PhD', 'Other'],
//     jobTypes: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
//     dateRanges: [
//       { label: 'Last 7 days', value: '7' },
//       { label: 'Last 30 days', value: '30' },
//       { label: 'Last 90 days', value: '90' },
//       { label: 'This year', value: '365' }
//     ]
//   });
  
//   const [stats, setStats] = useState({
//     totalCVs: 0,
//     jobseekerCVs: 0,
//     totalJobseekers: 0,
//     recentUploads: 0
//   });

//   // Extract unique skills and locations from users
//   const extractUniqueValues = (users) => {
//     const skills = new Set();
//     const locations = new Set();

//     users.forEach(user => {
//       // Extract skills
//       if (user.profile?.skills) {
//         user.profile.skills.forEach(skill => {
//           if (skill && typeof skill === 'string') {
//             skills.add(skill.trim().toLowerCase());
//           }
//         });
//       }
      
//       // Extract locations
//       if (user.profile?.location) {
//         locations.add(user.profile.location.trim());
//       }
//       if (user.profile?.city) {
//         locations.add(user.profile.city.trim());
//       }
//       if (user.profile?.country) {
//         locations.add(user.profile.country.trim());
//       }
//     });

//     setAvailableSkills(Array.from(skills).sort());
//     setAvailableLocations(Array.from(locations).filter(Boolean).sort());
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     filterUsers();
//   }, [searchTerm, filterRole, users, selectedSkills, experienceRange, educationFilter, locationFilter, jobTypeFilter]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${ADMIN_API_END_POINT}/users?role=Jobseeker`);
//       if (response.data.success) {
//         const jobseekers = response.data.users.filter(user => user.role === 'Jobseeker');
//         setUsers(jobseekers);
//         extractUniqueValues(jobseekers);
//         calculateStats(jobseekers);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error('Could not load user information. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (userData) => {
//     const cvCount = userData.filter(user => user.profile?.resume).length;
//     const recentUploads = userData.filter(user => {
//       if (!user.profile?.resume) return false;
//       const uploadDate = new Date(user.updatedAt);
//       const weekAgo = new Date();
//       weekAgo.setDate(weekAgo.getDate() - 7);
//       return uploadDate > weekAgo;
//     }).length;

//     setStats({
//       totalCVs: cvCount,
//       jobseekerCVs: cvCount,
//       totalJobseekers: userData.length,
//       recentUploads
//     });
//   };

//   const filterUsers = () => {
//     let filtered = [...users];

//     // Apply all filters
//     filtered = filtered.filter(user => {
//       // Search across multiple fields
//       if (filters.search) {
//         const searchTerm = filters.search.toLowerCase();
//         const matchesSearch = 
//           user.fullname?.toLowerCase().includes(searchTerm) ||
//           user.email?.toLowerCase().includes(searchTerm) ||
//           user.profile?.headline?.toLowerCase().includes(searchTerm) ||
//           user.profile?.summary?.toLowerCase().includes(searchTerm) ||
//           user.profile?.skills?.some(skill => 
//             skill.toLowerCase().includes(searchTerm)
//           ) ||
//           user.profile?.education?.some(edu => 
//             `${edu.degree} ${edu.fieldOfStudy} ${edu.schoolName}`.toLowerCase().includes(searchTerm)
//           ) ||
//           user.profile?.experience?.some(exp => 
//             `${exp.title} ${exp.company} ${exp.description}`.toLowerCase().includes(searchTerm)
//           );
        
//         if (!matchesSearch) return false;
//       }

//       // Skills filter (multiple selection)
//       if (filters.skills.length > 0) {
//         const userSkills = user.profile?.skills?.map(s => s.toLowerCase()) || [];
//         const hasAllSkills = filters.skills.every(skill => 
//           userSkills.includes(skill.toLowerCase())
//         );
//         if (!hasAllSkills) return false;
//       }

//       // Experience range filter
//       if (filters.experienceMin || filters.experienceMax) {
//         const userExp = parseFloat(user.profile?.experienceYears) || 0;
//         if (filters.experienceMin && userExp < parseFloat(filters.experienceMin)) return false;
//         if (filters.experienceMax && userExp > parseFloat(filters.experienceMax)) return false;
//       }

//       // Education level filter
//       if (filters.educationLevels.length > 0) {
//         const hasMatchingEducation = user.profile?.education?.some(edu => 
//           filters.educationLevels.some(level => 
//             edu.degree?.toLowerCase().includes(level.toLowerCase())
//           )
//         );
//         if (!hasMatchingEducation) return false;
//       }

//       // Location filter
//       if (filters.locations.length > 0) {
//         const userLocations = [
//           user.profile?.location,
//           user.profile?.city,
//           user.profile?.country
//         ].filter(Boolean).map(loc => loc.toLowerCase());
        
//         const hasMatchingLocation = filters.locations.some(loc => 
//           userLocations.some(userLoc => 
//             userLoc.includes(loc.toLowerCase())
//           )
//         );
//         if (!hasMatchingLocation) return false;
//       }

//       // Job type filter
//       if (filters.jobTypes.length > 0 && user.profile?.jobType) {
//         if (!filters.jobTypes.includes(user.profile.jobType)) return false;
//       }

//       // Date added filter
//       if (filters.dateAdded) {
//         const days = parseInt(filters.dateAdded, 10);
//         const cutoffDate = new Date();
//         cutoffDate.setDate(cutoffDate.getDate() - days);
        
//         const userDate = new Date(user.createdAt);
//         if (userDate < cutoffDate) return false;
//       }

//       // Has CV filter
//       if (filters.hasCV && !user.profile?.resume) return false;
      
//       // Has profile filter
//       if (filters.hasProfile && !user.profile) return false;

//       return true;
//     });

//     setFilteredUsers(filtered);
//   };

//   const downloadResume = async (userId, userName) => {
//     try {
//       const response = await axios.get(`${ADMIN_API_END_POINT}/users/${userId}/resume`, {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${userName}_resume.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//       toast.success('Resume downloaded successfully');
//     } catch (error) {
//       console.error('Error downloading resume:', error);
//       toast.error('Failed to download resume');
//     }
//   };

//   const viewResume = (resumeUrl) => {
//     if (resumeUrl) {
//       setPreviewUrl(resumeUrl);
//       setShowPreview(true);
//     } else {
//       toast.error('Resume not available');
//     }
//   };

//   const closePreview = () => {
//     setShowPreview(false);
//     setPreviewUrl('');
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // Toggle filter section
//   const toggleFilter = (filterName) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: !prev[filterName]
//     }));
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterName]: value
//     }));
//   };

//   // Toggle array values in filters (for multi-select)
//   const toggleArrayFilter = (filterName, value) => {
//     setFilters(prev => {
//       const currentValues = [...(prev[filterName] || [])];
//       const valueIndex = currentValues.indexOf(value);
      
//       if (valueIndex === -1) {
//         // Add value if not present
//         return { ...prev, [filterName]: [...currentValues, value] };
//       } else {
//         // Remove value if present
//         return { 
//           ...prev, 
//           [filterName]: currentValues.filter((_, i) => i !== valueIndex) 
//         };
//       }
//     });
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     setFilters({
//       search: '',
//       skills: [],
//       experienceMin: '',
//       experienceMax: '',
//       educationLevels: [],
//       locations: [],
//       jobTypes: [],
//       dateAdded: '',
//       hasCV: true,
//       hasProfile: true
//     });
//   };

//   // Check if any filter is active
//   const isFilterActive = () => {
//     return (
//       filters.search ||
//       filters.skills.length > 0 ||
//       filters.experienceMin ||
//       filters.experienceMax ||
//       filters.educationLevels.length > 0 ||
//       filters.locations.length > 0 ||
//       filters.jobTypes.length > 0 ||
//       filters.dateAdded ||
//       !filters.hasCV ||
//       !filters.hasProfile
//     );
//   };

//   return (
//     <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CV Management</h1>
//           <p className="text-gray-600 mt-1 text-sm sm:text-base">
//             {filteredUsers.length} {filteredUsers.length === 1 ? 'candidate' : 'candidates'} found
//           </p>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2"
//           >
//             <SlidersHorizontal className="h-4 w-4" />
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//             {isFilterActive() && (
//               <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
//                 {Object.values(filters).filter(v => 
//                   Array.isArray(v) ? v.length > 0 : Boolean(v) && v !== true
//                 ).length}
//               </span>
//             )}
//           </Button>
          
//           {isFilterActive() && (
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               onClick={clearAllFilters}
//               className="text-sm text-muted-foreground hover:text-foreground"
//             >
//               Clear all
//             </Button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
//             <FileText className="h-4 w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalCVs}</div>
//             <p className="text-xs text-gray-500">Uploaded resumes</p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Jobseeker CVs</CardTitle>
//             <Users className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.jobseekerCVs}</div>
//             <p className="text-xs text-gray-500">Job seeker resumes</p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Jobseekers</CardTitle>
//             <Briefcase className="h-4 w-4 text-purple-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalJobseekers}</div>
//             <p className="text-xs text-gray-500">Registered candidates</p>
//           </CardContent>
//         </Card>

//         <Card className="hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
//             <Calendar className="h-4 w-4 text-orange-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.recentUploads}</div>
//             <p className="text-xs text-gray-500">This week</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Search & Filter</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   placeholder="Search by name or email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 h-10 sm:h-auto text-sm sm:text-base"
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-gray-500" />
//               <select
//                 value="with-cv"
//                 disabled
//                 className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-sm sm:text-base h-10 sm:h-auto"
//               >
//                 <option value="with-cv">Candidates with CV</option>
//               </select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>User Profiles & CVs</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {filteredUsers.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 No users found matching your criteria
//               </div>
//             ) : (
//               filteredUsers.map((user) => (
//                 <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4">
//                   <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 flex-shrink-0">
//                       {user.profile?.profilePhoto ? (
//                         <img 
//                           src={user.profile.profilePhoto} 
//                           alt="Profile" 
//                           className="w-full h-full object-cover" 
//                         />
//                       ) : (
//                         <span className="text-gray-600 font-semibold text-sm sm:text-base">
//                           {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{user.fullname || 'No Name'}</h3>
//                       <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
//                         <Mail className="h-3 w-3 flex-shrink-0" />
//                         <span className="truncate">{user.email}</span>
//                       </div>
//                       <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
//                         <Badge variant="default" className="text-xs">
//                           Job Seeker
//                         </Badge>
//                         <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
//                           CV Available
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 sm:flex-shrink-0">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => viewResume(user.profile.resume)}
//                       className="flex items-center justify-center space-x-1 text-xs sm:text-sm"
//                     >
//                       <Eye className="h-3 w-3" />
//                       <span>Preview</span>
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => downloadResume(user._id, user.fullname)}
//                       className="flex items-center justify-center space-x-1 text-xs sm:text-sm"
//                     >
//                       <Download className="h-3 w-3" />
//                       <span>Download</span>
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>

    
//       {showPreview && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full h-full sm:w-11/12 sm:h-5/6 max-w-4xl flex flex-col">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b gap-2">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900">CV Preview</h3>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => window.open(previewUrl, '_blank')}
//                   className="flex items-center space-x-1 text-xs sm:text-sm"
//                 >
//                   <Download className="h-3 w-3" />
//                   <span className="hidden sm:inline">Open in New Tab</span>
//                   <span className="sm:hidden">Open</span>
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={closePreview}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </Button>
//               </div>
//             </div>
//             <div className="flex-1 p-2 sm:p-4">
//               <iframe
//                 src={previewUrl}
//                 className="w-full h-full border rounded"
//                 title="CV Preview"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCVManagement;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {  FileText,  Download,  Eye,  Search,  Filter, Users, Calendar, Briefcase, Mail} from 'lucide-react';
import { ADMIN_API_END_POINT } from '../../utils/constant';

const AdminCVManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Jobseeker');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [stats, setStats] = useState({
    totalCVs: 0,
    jobseekerCVs: 0,
    employerProfiles: 0,
    recentUploads: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/users?role=Jobseeker`);
      if (response.data.success) {
        const jobseekers = response.data.users.filter(user => user.role === 'Jobseeker');
        setUsers(jobseekers);
        calculateStats(jobseekers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Could not load user information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const cvCount = userData.filter(user => user.profile?.resume).length;
    const recentUploads = userData.filter(user => {
      if (!user.profile?.resume) return false;
      const uploadDate = new Date(user.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length;

    setStats({
      totalCVs: cvCount,
      jobseekerCVs: cvCount,
      totalJobseekers: userData.length,
      recentUploads
    });
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    filtered = filtered.filter(user => user.profile?.resume);

    setFilteredUsers(filtered);
  };

  const downloadResume = async (userId, userName) => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/users/${userId}/resume`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${userName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  const viewResume = (resumeUrl) => {
    if (resumeUrl) {
      setPreviewUrl(resumeUrl);
      setShowPreview(true);
    } else {
      toast.error('Resume not available');
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewUrl('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CV Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user resumes and profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCVs}</div>
            <p className="text-xs text-gray-500">Uploaded resumes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobseeker CVs</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobseekerCVs}</div>
            <p className="text-xs text-gray-500">Job seeker resumes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobseekers</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobseekers}</div>
            <p className="text-xs text-gray-500">Registered candidates</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-auto text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value="with-cv"
                disabled
                className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-sm sm:text-base h-10 sm:h-auto"
              >
                <option value="with-cv">Candidates with CV</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Profiles & CVs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found matching your criteria
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 flex-shrink-0">
                      {user.profile?.profilePhoto ? (
                        <img 
                          src={user.profile.profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-gray-600 font-semibold text-sm sm:text-base">
                          {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{user.fullname || 'No Name'}</h3>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                        <Badge variant="default" className="text-xs">
                          Job Seeker
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          CV Available
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 sm:flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewResume(user.profile.resume)}
                      className="flex items-center justify-center space-x-1 text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResume(user._id, user.fullname)}
                      className="flex items-center justify-center space-x-1 text-xs sm:text-sm"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

    
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full h-full sm:w-11/12 sm:h-5/6 max-w-4xl flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">CV Preview</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="flex items-center space-x-1 text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">Open in New Tab</span>
                  <span className="sm:hidden">Open</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="flex-1 p-2 sm:p-4">
              <iframe
                src={previewUrl}
                className="w-full h-full border rounded"
                title="CV Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCVManagement;










