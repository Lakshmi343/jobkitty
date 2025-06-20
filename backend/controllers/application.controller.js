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
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
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
// admin dekhega kitna user ne apply kiya hai
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
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by application id and populate necessary fields
        const application = await Application.findOne({_id:applicationId})
            .populate({
                path: 'applicant',
                select: 'fullname email profile.resume profile.resumeOriginalName'
            })
            .populate({
                path: 'job',
                select: 'title',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            });

        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // Fallback: If resume data is not available through populate, fetch user directly
        let resumeUrl = application.applicant.profile?.resume;
        let resumeName = application.applicant.profile?.resumeOriginalName;
        
        if (!resumeUrl || !resumeName) {
            try {
                const user = await User.findById(application.applicant._id).select('profile.resume profile.resumeOriginalName');
                if (user) {
                    resumeUrl = user.profile?.resume;
                    resumeName = user.profile?.resumeOriginalName;
                }
            } catch (userError) {
                console.error('Error fetching user data:', userError);
            }
        }

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        // Send email notification based on status
        try {
            if (status.toLowerCase() === 'accepted') {
                // Debug log to verify resume data
                console.log('Resume Data:', {
                    resumeUrl: resumeUrl,
                    resumeName: resumeName,
                    studentName: application.applicant.fullname,
                    studentEmail: application.applicant.email
                });
                
                const emailResult = await sendApplicationAcceptanceEmail(
                    application.applicant.email,
                    application.applicant.fullname,
                    application.job.title,
                    application.job.company.name,
                    resumeUrl,
                    resumeName
                );
                
                if (!emailResult.success) {
                    console.error('Failed to send acceptance email:', emailResult.error);
                }
            } else if (status.toLowerCase() === 'rejected') {
                const emailResult = await sendApplicationRejectionEmail(
                    application.applicant.email,
                    application.applicant.fullname,
                    application.job.title,
                    application.job.company.name
                );
                
                if (!emailResult.success) {
                    console.error('Failed to send rejection email:', emailResult.error);
                }
            } else if (status.toLowerCase() === 'pending') {
                const emailResult = await sendApplicationPendingEmail(
                    application.applicant.email,
                    application.applicant.fullname,
                    application.job.title,
                    application.job.company.name
                );
                if (!emailResult.success) {
                    console.error('Failed to send pending email:', emailResult.error);
                }
            }
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            // Don't fail the entire request if email fails
        }

        return res.status(200).json({
            message:"Status updated successfully.",
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