import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export default async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || 
                     req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token - User not found");
        }

        if (user.role !== 'admin') {
            throw new ApiError(403, "Access denied. Admin privileges required.");
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(error.statusCode || 401).json({
            success: false,
            message: error?.message || "Invalid or expired token",
        });
    }
};
