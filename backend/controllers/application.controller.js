
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendApplicationAcceptanceEmail, sendApplicationRejectionEmail, sendApplicationPendingEmail } from "../utils/emailService.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.user._id; // Changed from req.id to req.user._id for consistency
        const jobId = req.params.id;
        
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ 
            job: jobId, 
            applicant: userId 
        });
        
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: 'pending',
            statusUpdatedAt: new Date()
        });

        // Update job's applications array
        job.applications.push(newApplication._id);
        await job.save({ validateBeforeSave: false });

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
            applicationId: newApplication._id
        });
    } catch (error) {
        console.error("Apply job error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};






export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user._id; // Changed from req.id to req.user._id
        const { status } = req.query;
        
        // Build query
        const query = { applicant: userId };
        
        // Add status filter if provided
        if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
            query.status = status;
        }
        
        const applications = await Application.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                select: 'title company location type salary description requirements',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            })
            .select('-__v -updatedAt');
        
        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error("Get applied jobs error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { status } = req.query;

        // Check if job exists and user has permission
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found.'
            });
        }

        // Check if user is the employer of this job or admin
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view applicants for this job'
            });
        }

        // Build query
        const query = { job: jobId };
        
        // Add status filter if provided
        if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'applicant',
                select: 'fullname email profile',
                populate: {
                    path: 'profile',
                    select: 'resume skills experience education'
                }
            })
            .select('-__v -updatedAt');

        return res.status(200).json({
            success: true,
            count: applications.length,
            data: {
                job: {
                    _id: job._id,
                    title: job.title,
                    location: job.location
                },
                applications
            }
        });
    } catch (error) {
        console.error("Get applicants error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applicants",
            error: error.message
        });
    }
};




export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason, notes } = req.body;
        const userId = req.user._id;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }
        
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: pending, accepted, rejected"
            });
        }
        
        // Find and update application
        const application = await Application.findById(id)
            .populate('job', 'title company postedBy')
            .populate('applicant', 'email fullname');
            
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }
        
        // Check if user has permission to update this application
        if (application.job.postedBy.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application"
            });
        }
        
        // Update application
        application.status = status;
        application.statusUpdatedAt = new Date();
        application.statusUpdatedBy = userId;
        
        if (status === 'rejected' && rejectionReason) {
            application.rejectionReason = rejectionReason;
        }
        
        if (notes) {
            application.notes = notes;
        }
        
        await application.save();
        
        // Send email notification if applicable
        try {
            if (application.applicant.email) {
                if (status === 'accepted') {
                    await sendApplicationAcceptanceEmail(
                        application.applicant.email,
                        application.applicant.fullname,
                        application.job.title,
                        application.job.company?.name || 'the employer'
                    );
                } else if (status === 'rejected') {
                    await sendApplicationRejectionEmail(
                        application.applicant.email,
                        application.applicant.fullname,
                        application.job.title,
                        application.job.company?.name || 'the employer',
                        rejectionReason
                    );
                }
            }
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Don't fail the request if email fails
        }
        
        return res.status(200).json({
            success: true,
            message: `Application status updated to ${status}`,
            data: {
                application: {
                    _id: application._id,
                    status: application.status,
                    updatedAt: application.updatedAt
                }
            }
        });
        
    } catch (error) {
        console.error("Update application status error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update application status",
            error: error.message
        });
    }
};

/**
 * Get all applications (Admin only)
 */
export const getAllApplications = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            jobId, 
            applicantId,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        // Build query
        const query = {};
        
        if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
            query.status = status;
        }
        
        if (jobId) {
            query.job = jobId;
        }
        
        if (applicantId) {
            query.applicant = applicantId;
        }
        
        // Sorting
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        
        // Execute query with pagination
        const applications = await Application.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate({
                path: 'job',
                select: 'title company location',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .populate({
                path: 'applicant',
                select: 'fullname email'
            })
            .select('-__v');
            
        // Get total count for pagination
        const total = await Application.countDocuments(query);
        
        return res.status(200).json({
            success: true,
            count: applications.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: applications
        });
        
    } catch (error) {
        console.error("Get all applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};

