import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.token;
        
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        
        // Check if it's an access token (for new token system)
        if (decode.type && decode.type !== 'access') {
            return res.status(401).json({
                message: "Invalid token type",
                success: false
            });
        }
        
        // Check if user account is blocked
        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }
        
        if (user.status === 'blocked') {
            return res.status(403).json({
                message: "Your account has been blocked by the admin. Whether you are an employer or a jobseeker, you cannot log in or use the website until the block is removed.",
                success: false,
                blocked: true
            });
        }
        
        req.id = decode.userId;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
}
export default isAuthenticated;