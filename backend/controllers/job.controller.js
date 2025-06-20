import { Job } from "../models/job.model.js";
import Category from "../models/Category.js";
import { Company } from "../models/company.model.js";



export const postJob = async (req, res) => {
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
            company,        
            category         
        } = req.body;
        const userId = req.id;
        if (!title || !description || !requirements || !salary || !location || 
            !jobType || !experienceLevel || !position || !company || !category) {
            return res.status(400).json({ 
                message: "All fields are required", 
                success: false 
            });
        }

      
        const companyExists = await Company.findById(company);
        if (!companyExists) {
            return res.status(404).json({ 
                message: "Company not found", 
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

   
        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim()),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experienceLevel),
            position: Number(position),
            company,    
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


export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
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
            company,        
            category         
        } = req.body;
        
        const jobId = req.params.id;
        const userId = req.id;

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

        // Validate required fields
        if (!title || !description || !requirements || !salary || !location || 
            !jobType || !experienceLevel || !position || !company || !category) {
            return res.status(400).json({ 
                message: "All fields are required", 
                success: false 
            });
        }

        // Check if company exists
        const companyExists = await Company.findById(company);
        if (!companyExists) {
            return res.status(404).json({ 
                message: "Company not found", 
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

        // Update the job
        const updatedJob = await Job.findByIdAndUpdate(jobId, {
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim()),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experienceLevel),
            position: Number(position),
            company,    
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
