import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'jobkitty.in@gmail.com',
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});


export const sendApplicationAcceptanceEmail = async (studentEmail, studentName, jobTitle, companyName, currentResumeUrl, currentResumeName) => {
    try {
        const mailOptions = {
            from: 'jobkitty.in@gmail.com',
            to: studentEmail,
            subject: `🎉 Application Accepted - ${jobTitle} at ${companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="color: #28a745; margin: 0;">🎉 Application Accepted!</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
                        <p>Dear <strong>${studentName}</strong>,</p>
                        
                        <p>We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been accepted!</p>
                        
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #856404; margin: 0 0 10px 0;">📋 Next Steps Required:</h3>
                            <p style="margin: 0; color: #856404;">
                                Please update your resume with the latest information and ensure it reflects your current skills and experience. 
                                This will help us proceed with the next phase of the hiring process.
                            </p>
                        </div>
                        
                        ${currentResumeUrl ? `
                        <div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="color: #0066cc; margin: 0 0 10px 0;">📄 Current Resume:</h4>
                            <p style="margin: 0; color: #0066cc;">
                                Your current resume: <a href="${currentResumeUrl}" target="_blank" style="color: #0066cc; text-decoration: underline;">${currentResumeName || 'View Resume'}</a>
                            </p>
                        </div>
                        ` : ''}
                        
                        <div style="margin: 24px 0; text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" style="background: #28a745; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-block;">Update Your Profile</a>
                        </div>
                        <p>Please log in to your account and update your resume in your profile section.</p>
                        
                        <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="color: #0c5460; margin: 0 0 10px 0;">Important Notes:</h4>
                            <ul style="color: #0c5460; margin: 0; padding-left: 20px;">
                                <li>Ensure your resume is up-to-date with current contact information</li>
                                <li>Include all relevant skills and certifications</li>
                                <li>Update your work experience and achievements</li>
                                <li>Make sure the file format is PDF or DOC</li>
                            </ul>
                        </div>
                        
                        <p>We will review your updated resume and contact you soon with further instructions.</p>
                        
                        <p>Best regards,<br>
                        <strong>${companyName} HR Team</strong></p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};


export const sendApplicationRejectionEmail = async (studentEmail, studentName, jobTitle, companyName) => {
    try {
        const mailOptions = {
            from: 'jobkitty.in@gmail.com',
            to: studentEmail,
            subject: `Application Status Update - ${jobTitle} at ${companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="color: #6c757d; margin: 0;">Application Status Update</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
                        <p>Dear <strong>${studentName}</strong>,</p>
                        
                        <p>Thank you for your interest in the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                        
                        <p>After careful consideration, we regret to inform you that we have decided to move forward with other candidates for this position.</p>
                        
                        <p>We appreciate the time and effort you put into your application and encourage you to apply for future opportunities that match your skills and experience.</p>
                        
                        <p>Best regards,<br>
                        <strong>${companyName} HR Team</strong></p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

// Email template for application pending
export const sendApplicationPendingEmail = async (studentEmail, studentName, jobTitle, companyName) => {
    try {
        const mailOptions = {
            from: 'jobkitty.in@gmail.com',
            to: studentEmail,
            subject: `Application Status: Pending - ${jobTitle} at ${companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="color: #ffc107; margin: 0;">⏳ Application Pending</h2>
                    </div>
                    <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
                        <p>Dear <strong>${studentName}</strong>,</p>
                        <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> is currently marked as <strong>Pending</strong>.</p>
                        <p>Our team is reviewing your application. We will notify you as soon as there is an update regarding your application status.</p>
                        <p>Thank you for your patience and interest in joining <strong>${companyName}</strong>.</p>
                        <p>Best regards,<br><strong>${companyName} HR Team</strong></p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('Pending email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending pending email:', error);
        return { success: false, error: error.message };
    }
};

export const sendRegistrationReminderEmail = async (studentEmail, studentName) => {
    try {
        const mailOptions = {
            from: 'jobkitty.in@gmail.com',
            to: studentEmail,
            subject: 'Keep Your Profile Updated for Better Opportunities!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="background: linear-gradient(90deg, #6A38C2 0%, #F83002 100%); padding: 18px 0; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="color: #fff; margin: 0; font-size: 1.7rem;">👋 Hi ${studentName},</h2>
                    </div>
                    <div style="background: #fff; padding: 24px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 1.1rem; color: #333;">Thank you for being a part of <b>JobKitty</b>! To help you stand out to recruiters and get the best job matches, please keep your profile up to date.</p>
                        <div style="margin: 24px 0; text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" style="background: #F83002; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-block;">Update Your Profile Now</a>
                        </div>
                        <div style="background: #f3f4f6; border-left: 4px solid #6A38C2; padding: 16px; border-radius: 6px; margin-bottom: 18px;">
                            <h4 style="margin: 0 0 8px 0; color: #6A38C2;">Why update?</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #333;">
                                <li>Increase your chances of being noticed by top employers</li>
                                <li>Showcase your latest skills and certifications</li>
                                <li>Get more relevant job recommendations</li>
                                <li>Keep your contact info current for recruiters</li>
                            </ul>
                        </div>
                        <div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 14px; border-radius: 6px; margin-bottom: 18px;">
                            <strong>Pro Tip:</strong> Upload a recent resume and add new skills to your profile for better visibility!
                        </div>
                        <p style="color: #555;">If you have any questions or need help, just reply to this email or contact our support team.</p>
                        <p style="margin-top: 24px; color: #6A38C2; font-weight: bold;">Wishing you success,<br/>The JobKitty Team</p>
                    </div>
                    <div style="text-align: center; margin-top: 18px; color: #aaa; font-size: 12px;">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('Registration reminder email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending registration reminder email:', error);
        return { success: false, error: error.message };
    }
};

export const sendContactFormEmail = async (contactData) => {
    try {
        const mailOptions = {
			from: contactData.email,
			to: 'jobkitty.in@gmail.com',
			replyTo: contactData.email,
            subject: `Contact Form: ${contactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h2 style="color: #007bff; margin: 0;">📧 New Contact Form Submission</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef;">
                        <div style="margin-bottom: 20px;">
                            <h3 style="color: #333; margin: 0 0 10px 0;">Contact Information:</h3>
                            <p style="margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${contactData.email}" style="color: #007bff;">${contactData.email}</a></p>
                            <p style="margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="color: #333; margin: 0 0 10px 0;">Message:</h4>
                            <p style="margin: 0; white-space: pre-wrap; color: #555;">${contactData.message}</p>
                        </div>
                        
                        <div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="color: #0066cc; margin: 0 0 10px 0;">Quick Actions:</h4>
                            <p style="margin: 5px 0;">
                                <a href="mailto:${contactData.email}?subject=Re: ${contactData.subject}" style="color: #0066cc; text-decoration: underline;">Reply to ${contactData.name}</a>
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                        <p>This message was sent from the JobKitty contact form.</p>
                        <p>Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Contact form email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending contact form email:', error);
        return { success: false, error: error.message };
    }
};

export const sendPasswordResetEmail = async (userEmail, resetLink) => {
    try {
        const mailOptions = {
            from: 'jobkitty.in@gmail.com',
            to: userEmail,
            subject: 'Password Reset Request - JobKitty',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="background: linear-gradient(90deg, #6A38C2 0%, #F83002 100%); padding: 18px 0; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="color: #fff; margin: 0; font-size: 1.7rem;">🔐 Password Reset Request</h2>
                    </div>
                    <div style="background: #fff; padding: 24px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 1.1rem; color: #333;">You requested a password reset for your <b>JobKitty</b> account. Click the button below to set a new password.</p>
                        
                        <div style="margin: 24px 0; text-align: center;">
                            <a href="${resetLink}" style="background: #F83002; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-block;">Reset Your Password</a>
                        </div>
                        
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.</p>
                        </div>
                        
                        <p style="color: #555;">If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
                        
                        <p style="margin-top: 24px; color: #6A38C2; font-weight: bold;">Stay secure,<br/>The JobKitty Team</p>
                    </div>
                    <div style="text-align: center; margin-top: 18px; color: #aaa; font-size: 12px;">
                        <p>This is an automated security message. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: error.message };
    }
};

// Welcome email for new users
export const sendWelcomeEmail = async (userEmail, userName, userRole) => {
    try {
        const mailOptions = {
            from: 'jobkitty.in@gmail.com',
            to: userEmail,
            subject: 'Welcome to JobKitty - Your Career Journey Starts Here! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="background: linear-gradient(90deg, #6A38C2 0%, #F83002 100%); padding: 18px 0; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="color: #fff; margin: 0; font-size: 1.7rem;">🎉 Welcome to JobKitty!</h2>
                    </div>
                    <div style="background: #fff; padding: 24px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 1.1rem; color: #333;">Hi <strong>${userName}</strong>,</p>
                        <p style="font-size: 1.1rem; color: #333;">Welcome to <b>JobKitty</b>! We're excited to have you join our community as a <strong>${userRole}</strong>.</p>
                        
                        <div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="color: #0066cc; margin: 0 0 10px 0;">🚀 Next Steps:</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #0066cc;">
                                ${userRole === 'Jobseeker' ? `
                                <li>Complete your profile and upload your resume</li>
                                <li>Browse available job opportunities</li>
                                <li>Apply to jobs that match your skills</li>
                                <li>Track your application status</li>
                                ` : `
                                <li>Set up your company profile</li>
                                <li>Post your first job opening</li>
                                <li>Review applications from candidates</li>
                                <li>Manage your job postings</li>
                                `}
                            </ul>
                        </div>
                        
                        <div style="margin: 24px 0; text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" style="background: #F83002; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-block;">Complete Your Profile</a>
                        </div>
                        
                        <p style="color: #555;">If you have any questions or need assistance, feel free to contact our support team.</p>
                        
                        <p style="margin-top: 24px; color: #6A38C2; font-weight: bold;">Happy job hunting!<br/>The JobKitty Team</p>
                    </div>
                    <div style="text-align: center; margin-top: 18px; color: #aaa; font-size: 12px;">
                        <p>This is an automated welcome message.</p>
                    </div>
                </div>
            `
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

// Job alert email for matching jobs
export const sendJobAlertEmail = async (userEmail, userName, jobs) => {
    try {
        const jobListHtml = jobs.map(job => `
            <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 16px; margin: 12px 0; background: #fff;">
                <h4 style="margin: 0 0 8px 0; color: #333;">${job.title}</h4>
                <p style="margin: 4px 0; color: #666;"><strong>Company:</strong> ${job.company}</p>
                <p style="margin: 4px 0; color: #666;"><strong>Location:</strong> ${job.location}</p>
                <p style="margin: 4px 0; color: #666;"><strong>Salary:</strong> ${job.salary || 'Not specified'}</p>
                <div style="margin-top: 12px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/job/${job._id}" style="background: #6A38C2; color: #fff; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 0.9rem;">View Details</a>
                </div>
            </div>
        `).join('');

        const mailOptions = {
            from: 'jobkitty.in@gmail.com',
            to: userEmail,
            subject: `🔔 New Job Opportunities for You - ${jobs.length} Jobs Found!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="background: linear-gradient(90deg, #6A38C2 0%, #F83002 100%); padding: 18px 0; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="color: #fff; margin: 0; font-size: 1.7rem;">🔔 New Job Opportunities</h2>
                    </div>
                    <div style="background: #fff; padding: 24px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 1.1rem; color: #333;">Hi <strong>${userName}</strong>,</p>
                        <p style="color: #333;">We found <strong>${jobs.length}</strong> new job${jobs.length > 1 ? 's' : ''} that match your profile and preferences!</p>
                        
                        <div style="margin: 20px 0;">
                            ${jobListHtml}
                        </div>
                        
                        <div style="margin: 24px 0; text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobs" style="background: #F83002; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-block;">View All Jobs</a>
                        </div>
                        
                        <p style="color: #555;">Don't miss out on these opportunities! Apply now to increase your chances of landing your dream job.</p>
                        
                        <p style="margin-top: 24px; color: #6A38C2; font-weight: bold;">Good luck!<br/>The JobKitty Team</p>
                    </div>
                    <div style="text-align: center; margin-top: 18px; color: #aaa; font-size: 12px;">
                        <p>You're receiving this because you subscribed to job alerts.</p>
                    </div>
                </div>
            `
        };
        const result = await transporter.sendMail(mailOptions);
        console.log('Job alert email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending job alert email:', error);
        return { success: false, error: error.message };
    }
};

