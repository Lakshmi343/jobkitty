
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
export const approveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findByIdAndUpdate(
            id,
            { 
                status: 'accepted',
                statusUpdatedAt: new Date(),
                adminActionAt: new Date()
            },
            { new: true }
        )
        .populate('applicant', 'name email')
        .populate('job', 'title company');

        if (!application) {
            return res.status(404).json({
                message: 'Application not found',
                success: false
            });
        }

        // Send email notification
        await sendApplicationAcceptanceEmail(application.applicant.email, {
            jobTitle: application.job.title,
            companyName: application.job.company,
            userName: application.applicant.name
        });

        res.status(200).json({
            message: 'Application approved successfully',
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({
            message: 'Failed to approve application',
            success: false,
            error: error.message
        });
    }
};

export const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const application = await Application.findByIdAndUpdate(
            id,
            { 
                status: 'rejected',
                statusUpdatedAt: new Date(),
                adminActionAt: new Date(),
                rejectionReason: reason
            },
            { new: true }
        )
        .populate('applicant', 'name email')
        .populate('job', 'title company');

        if (!application) {
            return res.status(404).json({
                message: 'Application not found',
                success: false
            });
        }

        // Send email notification
        await sendApplicationRejectionEmail(application.applicant.email, {
            jobTitle: application.job.title,
            companyName: application.job.company,
            userName: application.applicant.name,
            reason: reason || 'Not specified'
        });

        res.status(200).json({
            message: 'Application rejected successfully',
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({
            message: 'Failed to reject application',
            success: false,
            error: error.message
        });
    }
};

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

/**
 * Bulk approve multiple applications
 */
export const bulkApproveApplications = async (req, res) => {
    try {
        const { applicationIds, notes } = req.body;
        
        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Application IDs array is required"
            });
        }
        
        const applications = await Application.find({
            _id: { $in: applicationIds },
            status: 'pending'
        })
        .populate('applicant', 'email fullname')
        .populate('job', 'title company');
        
        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending applications found with the provided IDs"
            });
        }
        
        const updatedApplications = [];
        const emailPromises = [];
        
        for (const application of applications) {
            application.status = 'accepted';
            application.statusUpdatedAt = new Date();
            application.adminActionAt = new Date();
            application.statusUpdatedBy = req.user._id;
            
            if (notes) {
                application.adminNotes = notes;
            }
            
            await application.save();
            updatedApplications.push(application);
            
            // Send email notification
            if (application.applicant.email) {
                emailPromises.push(
                    sendApplicationAcceptanceEmail(
                        application.applicant.email,
                        application.applicant.fullname,
                        application.job.title,
                        application.job.company?.name || 'the employer'
                    ).catch(emailError => {
                        console.error(`Failed to send acceptance email to ${application.applicant.email}:`, emailError);
                    })
                );
            }
        }
        
        // Send all emails in parallel
        await Promise.allSettled(emailPromises);
        
        return res.status(200).json({
            success: true,
            message: `${updatedApplications.length} applications approved successfully`,
            data: {
                approved: updatedApplications.length,
                applications: updatedApplications.map(app => ({
                    id: app._id,
                    status: app.status,
                    jobTitle: app.job.title,
                    applicantName: app.applicant.fullname
                }))
            }
        });
        
    } catch (error) {
        console.error("Bulk approve applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve applications",
            error: error.message
        });
    }
};

/**
 * Bulk reject multiple applications
 */
export const bulkRejectApplications = async (req, res) => {
    try {
        const { applicationIds, rejectionReason, notes } = req.body;
        
        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Application IDs array is required"
            });
        }
        
        if (!rejectionReason) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required for bulk rejection"
            });
        }
        
        const applications = await Application.find({
            _id: { $in: applicationIds },
            status: 'pending'
        })
        .populate('applicant', 'email fullname')
        .populate('job', 'title company');
        
        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending applications found with the provided IDs"
            });
        }
        
        const updatedApplications = [];
        const emailPromises = [];
        
        for (const application of applications) {
            application.status = 'rejected';
            application.statusUpdatedAt = new Date();
            application.adminActionAt = new Date();
            application.statusUpdatedBy = req.user._id;
            application.rejectionReason = rejectionReason;
            
            if (notes) {
                application.adminNotes = notes;
            }
            
            await application.save();
            updatedApplications.push(application);
            
            // Send email notification
            if (application.applicant.email) {
                emailPromises.push(
                    sendApplicationRejectionEmail(
                        application.applicant.email,
                        application.applicant.fullname,
                        application.job.title,
                        application.job.company?.name || 'the employer',
                        rejectionReason
                    ).catch(emailError => {
                        console.error(`Failed to send rejection email to ${application.applicant.email}:`, emailError);
                    })
                );
            }
        }
        
        // Send all emails in parallel
        await Promise.allSettled(emailPromises);
        
        return res.status(200).json({
            success: true,
            message: `${updatedApplications.length} applications rejected successfully`,
            data: {
                rejected: updatedApplications.length,
                applications: updatedApplications.map(app => ({
                    id: app._id,
                    status: app.status,
                    jobTitle: app.job.title,
                    applicantName: app.applicant.fullname,
                    rejectionReason: app.rejectionReason
                }))
            }
        });
        
    } catch (error) {
        console.error("Bulk reject applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject applications",
            error: error.message
        });
    }
};

/**
 * Get approval statistics
 */
export const getApprovalStats = async (req, res) => {
    try {
        const { timeframe = '30d' } = req.query;
        
        // Calculate date range based on timeframe
        const now = new Date();
        let startDate = new Date();
        
        switch (timeframe) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        
        const stats = await Application.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const totalStats = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Format stats
        const formatStats = (statsArray) => {
            const result = { pending: 0, accepted: 0, rejected: 0 };
            statsArray.forEach(stat => {
                result[stat._id] = stat.count;
            });
            return result;
        };
        
        const recentStats = formatStats(stats);
        const totalStatsFormatted = formatStats(totalStats);
        
        return res.status(200).json({
            success: true,
            data: {
                recent: {
                    ...recentStats,
                    total: recentStats.pending + recentStats.accepted + recentStats.rejected,
                    timeframe
                },
                total: {
                    ...totalStatsFormatted,
                    total: totalStatsFormatted.pending + totalStatsFormatted.accepted + totalStatsFormatted.rejected
                }
            }
        });
        
    } catch (error) {
        console.error("Get approval stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch approval statistics",
            error: error.message
        });
    }
};

/**
 * Get pending applications for admin review
 */
export const getPendingApplications = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        
        const applications = await Application.find({ status: 'pending' })
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate({
                path: 'job',
                select: 'title company location salary type',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            })
            .populate({
                path: 'applicant',
                select: 'fullname email profile',
                populate: {
                    path: 'profile',
                    select: 'resume skills experience education'
                }
            })
            .select('-__v');
            
        const total = await Application.countDocuments({ status: 'pending' });
        
        return res.status(200).json({
            success: true,
            count: applications.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: applications
        });
        
    } catch (error) {
        console.error("Get pending applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending applications",
            error: error.message
        });
    }
};

