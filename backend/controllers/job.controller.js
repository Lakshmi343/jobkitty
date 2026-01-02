
import { Job } from "../models/job.model.js";
import Category from "../models/Category.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";

export const postJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            experience,
            location, 
            jobType, 
            experienceLevel,  
            position, 
            openings,
            category, 
            categories 
        } = req.body;
        const userId = req.id;
        const user = req.user; 
        
        if (!user.profile.company) {
            return res.status(400).json({ 
                message: "Company information not found. Please set up your company profile first.", 
                success: false 
            });
        }
        
        const companyId = user.profile.company;
        
       
        let categoryIds = [];
        if (categories && Array.isArray(categories) && categories.length > 0) {
            categoryIds = categories;
        } else if (category) {
            categoryIds = [category]; 
        }
      
        if (!title || !description || categoryIds.length === 0) {
            return res.status(400).json({ 
                message: "Job title, description, and at least one category are required", 
                success: false 
            });
        }   
        const defaultRequirements = ["No specific requirements"];
        const defaultSalary = { min: 0, max: 0 };
        const defaultLocation = {
            state: "",
            district: "",
            legacy: "Remote"
        };
        const defaultJobType = "Full-time";
        const defaultExperienceLevel = "Entry Level";
        const defaultPosition = 1;
        const defaultOpenings = 1;
        const existingCategories = await Category.find({ _id: { $in: categoryIds } });
        if (existingCategories.length !== categoryIds.length) {
            return res.status(404).json({ 
                message: "One or more categories not found", 
                success: false 
            });
        }
        let finalLocation;
        if (location) {
            const parseFromLegacy = (legacy) => {
                if (!legacy || typeof legacy !== 'string') return { state: '', district: '', legacy: '' };
                const parts = legacy.split(',').map(s => s.trim()).filter(Boolean);
                if (parts.length >= 3) {
                    
                    const state = parts[parts.length - 1];
                    const district = parts[parts.length - 2];
                    return { district, state, legacy };
                }
                if (parts.length === 2) {
                 
                    return { district: parts[0], state: parts[1], legacy };
                }

                return { district: legacy, state: '', legacy };
            };

         
            if (typeof location === 'string') {
                const parsed = parseFromLegacy(location.trim());
                finalLocation = {
                    state: parsed.state || undefined,
                    district: parsed.district || undefined,
                    legacy: parsed.legacy || location.trim()
                };
            } else if (typeof location === 'object') {
                
                const fromLegacy = (!location.state || !location.district) && location.legacy
                    ? parseFromLegacy(location.legacy)
                    : null;

                const stateVal = location.state || fromLegacy?.state || undefined;
                const districtVal = location.district || fromLegacy?.district || undefined;
                const legacyVal = location.legacy || (districtVal && stateVal ? `${districtVal}, ${stateVal}` : (location.legacy ?? undefined));

                // If we have at least something, build object without forcing specific defaults
                if (stateVal || districtVal || legacyVal) {
                    finalLocation = {
                        state: stateVal,
                        district: districtVal,
                        legacy: legacyVal
                    };
                }
            }
        }

        // Create job with employer's company, using default values only if no location info
        const jobData = {
            title,
            description,
            requirements: requirements ? (Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim())) : defaultRequirements,
            salary: {
                min: salary && salary.min !== undefined ? Number(salary.min) : 0,
                max: salary && salary.max !== undefined ? Number(salary.max) : 0
            },
            location: finalLocation ? {
                state: finalLocation.state,
                district: finalLocation.district,
                legacy: finalLocation.legacy || ((finalLocation.district && finalLocation.state) ? `${finalLocation.district}, ${finalLocation.state}` : (finalLocation.district || finalLocation.state || ''))
            } : defaultLocation,
            jobType: jobType || defaultJobType,
            experienceLevel: experienceLevel || defaultExperienceLevel,
            position: position ? Number(position) : defaultPosition,
            openings: openings ? Number(openings) : defaultOpenings,
            company: companyId,
            category: categoryIds,   
            created_by: userId
        };

        // Only set experience if provided, otherwise let Mongoose use schema defaults
        if (experience && (experience.min !== undefined || experience.max !== undefined)) {
            jobData.experience = {
                min: experience.min !== undefined ? Number(experience.min) : 0,
                max: experience.max !== undefined ? Number(experience.max) : 5
            };
        }

        const job = await Job.create(jobData);
        
        return res.status(201).json({
            message: "Job created successfully",
            job,
            success: true
        });

    } catch (error) {
        console.error("Job creation error:", error);
        return res.status(500).json({ 
            message: error.message || "Server error", 
            success: false 
        });
    }
}


// Search jobs by role and location
export const searchJobs = async (req, res) => {
    try {
        const { role = '', location = '', page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
        const skip = (pageNum - 1) * limitNum;

        // Build search query
        const query = { status: 'approved' };
        
        // Add role search (case-insensitive regex search in title and description)
        if (role) {
            query.$or = [
                { title: { $regex: role, $options: 'i' } },
                { description: { $regex: role, $options: 'i' } }
            ];
        }

        // Add location search (case-insensitive search in location fields)
        if (location) {
            const locationQuery = {
                $or: [
                    { 'location.legacy': { $regex: location, $options: 'i' } },
                    { 'location.district': { $regex: location, $options: 'i' } },
                    { 'location.state': { $regex: location, $options: 'i' } }
                ]
            };
            
            if (query.$or) {
                query.$and = (query.$and || []).concat([
                    { $or: query.$or },
                    { $or: locationQuery.$or }
                ]);
                delete query.$or;
            } else {
                Object.assign(query, locationQuery);
            }
        }

        // Execute search with pagination
        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate('company', 'name logo companyType')
                .populate('category', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Job.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limitNum);

        return res.status(200).json({
            success: true,
            jobs,
            pagination: {
                total,
                currentPage: pageNum,
                limit: limitNum,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    } catch (error) {
        console.error('Search jobs error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error searching for jobs',
            error: error.message
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            keyword = '',
            location = '',
            jobType = '',
            salaryRange = '',
            experienceRange = '',
            categoryId = '',
            companyType = '',
            datePosted = ''
        } = req.query;

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const skip = (pageNum - 1) * limitNum;

        // Build filter - only show approved jobs for public
        const filter = {
            status: 'approved'
        };

        // Build $and array for combining multiple OR conditions
        const andConditions = [];

        // Search by keyword (title, description, location)
        if (keyword) {
            andConditions.push({
                $or: [
                    { title: { $regex: new RegExp(keyword, 'i') } },
                    { description: { $regex: new RegExp(keyword, 'i') } },
                    { 'location.legacy': { $regex: new RegExp(keyword, 'i') } },
                    { 'location.district': { $regex: new RegExp(keyword, 'i') } },
                    { 'location.state': { $regex: new RegExp(keyword, 'i') } }
                ]
            });
        }

        // Filter by location
        if (location) {
            const locationRegex = new RegExp(location, 'i');
            andConditions.push({
                $or: [
                    { 'location.legacy': locationRegex },
                    { 'location.district': locationRegex },
                    { 'location.state': locationRegex }
                ]
            });
        }

        // Filter by job type
        if (jobType) {
            filter.jobType = { $regex: new RegExp(`^${jobType}$`, 'i') };
        }

        // Filter by category
        if (categoryId) {
            filter.category = categoryId;
        }

        // Filter by salary range (format: "min-max" or "min+")
        if (salaryRange) {
            if (salaryRange.includes('-')) {
                const [min, max] = salaryRange.split('-').map(Number);
                andConditions.push({
                    $or: [
                        { 'salary.min': { $lte: max }, 'salary.max': { $gte: min } }
                    ]
                });
            } else if (salaryRange.includes('+')) {
                const min = parseInt(salaryRange.replace('+', ''));
                andConditions.push({
                    'salary.max': { $gte: min }
                });
            }
        }

        // Filter by experience range (format: "min-max")
        if (experienceRange) {
            if (experienceRange.includes('-')) {
                const [min, max] = experienceRange.split('-').map(Number);
                andConditions.push({
                    $or: [
                        { 'experience.min': { $lte: max }, 'experience.max': { $gte: min } }
                    ]
                });
            }
        }

        // Combine all AND conditions
        if (andConditions.length > 0) {
            filter.$and = andConditions;
        }

        // Filter by company type
        if (companyType) {
            const matchingCompanies = await Company.find({
                companyType: { $regex: new RegExp(`^${companyType}$`, 'i') }
            }).select('_id');

            if (!matchingCompanies.length) {
                return res.status(200).json({
                    success: true,
                    jobs: [],
                    pagination: {
                        total: 0,
                        currentPage: pageNum,
                        limit: limitNum,
                        totalPages: 0,
                        hasNext: false,
                        hasPrev: pageNum > 1
                    }
                });
            }

            const companyIds = matchingCompanies.map((c) => c._id);
            filter.company = { $in: companyIds };
        }

        // Filter by date posted
        if (datePosted) {
            const now = new Date();
            const createdAtCondition = {};
            
            if (datePosted === 'today') {
                createdAtCondition.$gte = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            } else if (datePosted === 'week') {
                createdAtCondition.$gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (datePosted === 'month') {
                createdAtCondition.$gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }

            if (Object.keys(createdAtCondition).length) {
                filter.createdAt = createdAtCondition;
            }
        }

        // Execute query with pagination
        const [jobs, totalJobs] = await Promise.all([
            Job.find(filter)
                .populate({
                    path: "company"
                })
                .populate({
                    path: "category"
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Job.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalJobs / limitNum) || 0;

        return res.status(200).json({
            success: true,
            jobs,
            pagination: {
                total: totalJobs,
                currentPage: pageNum,
                limit: limitNum,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    } catch (error) {
        console.error("Get all jobs error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: "company"
            })
            .populate({
                path: "category"
            })
            .populate({
                path: "applications"
            });
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Get job by ID error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const getEmployerJobs = async (req, res) => {
    try {
        const employerId = req.id;
        const user = req.user; // From employerAuth middleware
        
        console.log('Getting jobs for employer:', employerId);
        console.log('User:', user.email, 'Role:', user.role);
        
        if (!employerId) {
            return res.status(401).json({
                message: "Authentication required",
                success: false
            });
        }
        
        // Get jobs with company population
        const jobs = await Job.find({ created_by: employerId }).populate({
            path: 'company',
            options: { sort: { createdAt: -1 } }
        }).sort({ createdAt: -1 });
        
        console.log('Found jobs:', jobs.length);
        
        // Get application counts for each job
        const jobsWithApplicationCount = await Promise.all(
            jobs.map(async (job) => {
                const applicationCount = await Application.countDocuments({ job: job._id });
                return {
                    ...job.toObject(),
                    applicationCount
                };
            })
        );
        
        return res.status(200).json({
            jobs: jobsWithApplicationCount,
            success: true
        });
    } catch (error) {
        console.error("Get employer jobs error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}



export const updateJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experienceLevel,  
            position, 
            category,
            categories        
        } = req.body;
        
        const jobId = req.params.id;
        const userId = req.id;
        const user = req.user; // From employerAuth middleware

        // Check if job exists and belongs to the user
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json({ 
                message: "Job not found", 
                success: false 
            });
        }
        
        if (existingJob.created_by.toString() !== userId) {
            return res.status(403).json({ 
                message: "You can only update your own jobs", 
                success: false 
            });
        }
        
        // Get company from user's profile
        const company = user.profile?.company;
        if (!company) {
            return res.status(400).json({ 
                message: "Company information not found in your profile. Please update your profile with company details.", 
                success: false 
            });
        }
        
        // Validate required fields
        // Handle both single category (for backward compatibility) and multiple categories
        let categoryIds = [];
        if (categories && Array.isArray(categories) && categories.length > 0) {
            categoryIds = categories;
        } else if (category) {
            categoryIds = [category]; // Convert single category to array
        }

        if (!title || !description || !requirements || !salary || !location || 
            !jobType || !experienceLevel || !position || categoryIds.length === 0) {
            return res.status(400).json({ 
                message: "All fields are required and at least one category must be selected", 
                success: false 
            });
        }
        
        // Verify all categories exist
        const existingCategories = await Category.find({ _id: { $in: categoryIds } });
        if (existingCategories.length !== categoryIds.length) {
            return res.status(404).json({ 
                message: "One or more categories not found", 
                success: false 
            });
        }
        
        // Parse and normalize incoming fields
        const normalized = {};
        if (title !== undefined) normalized.title = title;
        if (description !== undefined) normalized.description = description;
        if (requirements !== undefined) {
            normalized.requirements = Array.isArray(requirements)
                ? requirements
                : String(requirements).split(',').map(req => req.trim()).filter(Boolean);
        }
        if (salary !== undefined) {
            if (typeof salary === 'object') {
                normalized.salary = {
                    min: salary.min !== undefined ? Number(salary.min) : 0,
                    max: salary.max !== undefined ? Number(salary.max) : 0
                };
            } else {
                // Backward compatibility if sent as single number (set both bounds same)
                const num = Number(salary) || 0;
                normalized.salary = { min: num, max: num };
            }
        }

        if (jobType !== undefined) normalized.jobType = jobType;
        if (experienceLevel !== undefined) normalized.experienceLevel = String(experienceLevel);
        if (position !== undefined) normalized.position = Number(position);
        if (categoryIds.length > 0) normalized.category = categoryIds;

        // Normalize location: accept string or object like in postJob
        if (location !== undefined) {
            const parseFromLegacy = (legacy) => {
                if (!legacy || typeof legacy !== 'string') return { state: '', district: '', legacy: '' };
                const parts = legacy.split(',').map(s => s.trim()).filter(Boolean);
                if (parts.length >= 3) {
                    const state = parts[parts.length - 1];
                    const district = parts[parts.length - 2];
                    return { district, state, legacy };
                }
                if (parts.length === 2) {
                    return { district: parts[0], state: parts[1], legacy };
                }
                return { district: legacy, state: '', legacy };
            };

            if (typeof location === 'string') {
                const parsed = parseFromLegacy(location.trim());
                normalized.location = {
                    state: parsed.state || undefined,
                    district: parsed.district || undefined,
                    legacy: parsed.legacy || location.trim()
                };
            } else if (typeof location === 'object') {
                const fromLegacy = (!location.state || !location.district) && location.legacy
                    ? parseFromLegacy(location.legacy)
                    : null;
                const stateVal = location.state || fromLegacy?.state || undefined;
                const districtVal = location.district || fromLegacy?.district || undefined;
                const legacyVal = location.legacy || (districtVal && stateVal ? `${districtVal}, ${stateVal}` : (location.legacy ?? undefined));
                normalized.location = { state: stateVal, district: districtVal, legacy: legacyVal };
            }
        }

        // Ensure company remains the employer's company
        normalized.company = company;

        // Update the job
        const updatedJob = await Job.findByIdAndUpdate(jobId, normalized, { new: true });

        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
            success: true
        });

    } catch (error) {
        console.error("Job update error:", error);
        return res.status(500).json({ 
            message: error.message || "Server error", 
            success: false 
        });
    }
}

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const user = req.user; // From employerAuth middleware

        // Check if job exists and belongs to the user
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json({ 
                message: "Job not found", 
                success: false 
            });
        }

        if (existingJob.created_by.toString() !== userId) {
            return res.status(403).json({ 
                message: "You can only delete your own jobs", 
                success: false 
            });
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully",
            success: true
        });

    } catch (error) {
        console.error("Job deletion error:", error);
        return res.status(500).json({ 
            message: error.message || "Server error", 
            success: false 
        });
    }
}

export const getJobsByCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const userId = req.id;
        const user = req.user; // From employerAuth middleware

        // Check if company belongs to the employer
        const Company = (await import("../models/company.model.js")).Company;
        const company = await Company.findById(companyId);
        
        if (!company) {
            return res.status(404).json({ 
                message: "Company not found", 
                success: false 
            });
        }

        if (company.userId.toString() !== userId) {
            return res.status(403).json({ 
                message: "You can only view jobs for your own company", 
                success: false 
            });
        }

        const jobs = await Job.find({ company: companyId })
            .populate('category')
            .populate('applications')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.error("Get jobs by company error:", error);
        return res.status(500).json({ 
            message: error.message || "Server error", 
            success: false 
        });
    }
}
