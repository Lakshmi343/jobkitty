import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email template for application acceptance
export const sendApplicationAcceptanceEmail = async (studentEmail, studentName, jobTitle, companyName, currentResumeUrl, currentResumeName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: 'Application Accepted - Please Update Your Resume',
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

// Email template for application rejection
export const sendApplicationRejectionEmail = async (studentEmail, studentName, jobTitle, companyName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: 'Application Status Update',
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
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: 'Application Status: Pending',
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
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: 'Keep Your Profile Updated for Better Opportunities!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="background: linear-gradient(90deg, #6A38C2 0%, #F83002 100%); padding: 18px 0; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="color: #fff; margin: 0; font-size: 1.7rem;">👋 Hi ${studentName},</h2>
                    </div>
                    <div style="background: #fff; padding: 24px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 1.1rem; color: #333;">Thank you for being a part of <b>JobPortal</b>! To help you stand out to recruiters and get the best job matches, please keep your profile up to date.</p>
                        <div style="margin: 24px 0; text-align: center;">
                            <a href="https://your-jobportal-domain.com/profile" style="background: #F83002; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1rem; display: inline-block;">Update Your Profile Now</a>
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
                        <p style="margin-top: 24px; color: #6A38C2; font-weight: bold;">Wishing you success,<br/>The JobPortal Team</p>
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
            from: process.env.EMAIL_USER,
            to: 'righthuman.rhr@gmail.com',
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
                        <p>This message was sent from the Right Human Resources contact form.</p>
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
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>You requested a password reset. Click the link below to set a new password. This link will expire in 1 hour.</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
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

