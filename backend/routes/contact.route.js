import express from 'express';
import { sendContactFormEmail } from '../utils/emailService.js';

const router = express.Router();

// POST /api/v1/contact/submit
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Send email
        const emailResult = await sendContactFormEmail({
            name,
            email,
            subject,
            message
        });

        if (emailResult.success) {
            res.status(200).json({
                success: true,
                message: 'Message sent successfully! We will get back to you soon.',
                messageId: emailResult.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.',
                error: emailResult.error
            });
        }

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: error.message
        });
    }
});

export default router; 