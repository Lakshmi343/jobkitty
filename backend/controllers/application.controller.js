
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendApplicationAcceptanceEmail, sendApplicationRejectionEmail, sendApplicationPendingEmail } from "../utils/emailService.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });
        job.applications.push(newApplication._id);
        await job.save({ validateBeforeSave: false });
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};






export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        
        return res.status(200).json({
            application: applications,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


// Add this to the existing updateStatus function in application.controller.js

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        
        if (!id) {
            return res.status(400).json({
                message: "Application id is required",
                success: false
            });
        }
        
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        }
        
        const application = await Application.findById(id);
        
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }
        
        // Update application status
        application.status = status;
        
        // Add rejection reason if provided
        if (status === 'rejected' && rejectionReason) {
            application.rejectionReason = rejectionReason;
        }
        
        await application.save();
        
        // Get applicant and job details for email notification
        const applicant = await User.findById(application.applicant);
        const job = await Job.findById(application.job).populate('company');
        
        if (applicant && job) {
            // Send appropriate email based on status
            if (status === 'accepted') {
                await sendApplicationAcceptanceEmail(
                    applicant.email,
                    applicant.fullname,
                    job.title,
                    job.company?.name || 'the employer'
                );
            } else if (status === 'rejected') {
                await sendApplicationRejectionEmail(
                    applicant.email,
                    applicant.fullname,
                    job.title,
                    job.company?.name || 'the employer',
                    rejectionReason || 'No specific reason provided'
                );
            } else if (status === 'pending') {
                await sendApplicationPendingEmail(
                    applicant.email,
                    applicant.fullname,
                    job.title,
                    job.company?.name || 'the employer'
                );
            }
        }
        
        return res.status(200).json({
            message: `Application status updated to ${status}`,
            success: true
        });
    } catch (error) {
        console.error("Update application status error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

