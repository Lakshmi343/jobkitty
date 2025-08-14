
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
        
        if (!title || !description || !requirements || !salary || !location || 
            !jobType || !experienceLevel || !position || !category) {
            return res.status(400).json({ 
                message: "All fields are required", 
                success: false 
            });
        }
        
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ 
                message: "Category not found", 
                success: false 
            });
        }
        
        // Create job with employer's company
        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim()),
            salary: salary, 
            experience: experience, 
            location,
            jobType,
            experienceLevel: Number(experienceLevel),
            position: Number(position),
            openings: Number(openings),
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
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
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
