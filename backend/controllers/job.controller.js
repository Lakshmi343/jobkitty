
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
            category         
        } = req.body;
        const userId = req.id;
        const user = req.user; // From employerAuth middleware
        
        if (!user.profile.company) {
            return res.status(400).json({ 
                message: "Company information not found. Please set up your company profile first.", 
                success: false 
            });
        }
        
        const companyId = user.profile.company;
        
        // Only check for essential fields
        if (!title || !description || !category) {
            return res.status(400).json({ 
                message: "Job title, description, and category are required", 
                success: false 
            });
        }
        
        // Set default values for missing fields
        const defaultRequirements = ["No specific requirements"];
        const defaultSalary = { min: 0, max: 0 };
        const defaultExperience = { min: 0, max: 5 };
        const defaultLocation = "Remote";
        const defaultJobType = "Full-time";
        const defaultExperienceLevel = "Entry Level";
        const defaultPosition = 1;
        const defaultOpenings = 1;
        
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ 
                message: "Category not found", 
                success: false 
            });
        }
        
        // Create job with employer's company, using default values for missing fields
        const job = await Job.create({
            title,
            description,
            requirements: requirements ? (Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim())) : defaultRequirements,
            salary: {
                min: salary && salary.min !== undefined ? Number(salary.min) : 0,
                max: salary && salary.max !== undefined ? Number(salary.max) : 0
            },
            experience: {
                min: experience && experience.min !== undefined ? Number(experience.min) : 0,
                max: experience && experience.max !== undefined ? Number(experience.max) : 5
            },
            location: location || defaultLocation,
            jobType: jobType || defaultJobType,
            experienceLevel: experienceLevel || defaultExperienceLevel,
            position: position ? Number(position) : defaultPosition,
            openings: openings ? Number(openings) : defaultOpenings,
            company: companyId,
            category,   
            created_by: userId
        });
        
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



export const getAllJobs = async (req, res) => {
    try {
        const { 
            keyword = "", 
            location = "", 
            jobType = "", 
            categoryId = "",
            salaryMin = 0,
            salaryMax = 0,
            experienceMin = 0,
            experienceMax = 0
        } = req.query;

        // Build dynamic query
        let query = {};
        let conditions = [];

        // Keyword search (case-insensitive)
        if (keyword) {
            conditions.push({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { location: { $regex: keyword, $options: "i" } }
                ]
            });
        }

        // Location filter (case-insensitive)
        if (location) {
            conditions.push({ location: { $regex: location, $options: "i" } });
        }

        // Job type filter (case-insensitive)
        if (jobType) {
            conditions.push({ jobType: { $regex: `^${jobType}$`, $options: "i" } });
        }

        // Category filter
        if (categoryId) {
            conditions.push({ category: categoryId });
        }

        // Salary range filter
        if (salaryMin > 0 || salaryMax > 0) {
            let salaryCondition = {};
            if (salaryMin > 0) salaryCondition['salary.min'] = { $gte: parseInt(salaryMin) };
            if (salaryMax > 0) salaryCondition['salary.max'] = { $lte: parseInt(salaryMax) };
            conditions.push(salaryCondition);
        }

        // Experience range filter
        if (experienceMin >= 0 || experienceMax > 0) {
            let expCondition = {};
            if (experienceMin >= 0) expCondition['experience.min'] = { $gte: parseInt(experienceMin) };
            if (experienceMax > 0) expCondition['experience.max'] = { $lte: parseInt(experienceMax) };
            conditions.push(expCondition);
        }

        // Combine all conditions
        if (conditions.length > 0) {
            query = { $and: conditions };
        }

        const jobs = await Job.find(query)
            .populate({
                path: "company"
            })
            .populate({
                path: "category"
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
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
            category         
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
        if (!title || !description || !requirements || !salary || !location || 
            !jobType || !experienceLevel || !position || !category) {
            return res.status(400).json({ 
                message: "All fields are required", 
                success: false 
            });
        }
        
        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ 
                message: "Category not found", 
                success: false 
            });
        }
        
        // Update the job with employer's company
        const updatedJob = await Job.findByIdAndUpdate(jobId, {
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim()),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experienceLevel),
            position: Number(position),
            company: company._id,    // Use employer's company
            category
        }, { new: true });

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
