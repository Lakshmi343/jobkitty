import { User } from "../models/user.model.js";

const employerAuth = async (req, res, next) => {
    try {
        const userId = req.id;
        
        if (!userId) {
            return res.status(401).json({
                message: "Authentication required",
                success: false
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (user.role !== 'Employer') {
            return res.status(403).json({
                message: "Access denied. Only employers can perform this action.",
                success: false
            });
        }

        // Add user info to request for use in controllers
        req.user = user;
        next();
    } catch (error) {
        console.error("Employer auth error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default employerAuth; 