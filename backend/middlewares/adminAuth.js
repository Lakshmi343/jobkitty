import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model.js';

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    console.log('Request URL:', req.originalUrl);
    
    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ message: 'Access denied. No authorization header.', success: false });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token length:', token.length);
    console.log('Token starts with:', token.substring(0, 20));
    
    if (!token || token === 'null' || token === 'undefined') {
      console.log('Invalid token value:', token);
      return res.status(401).json({ message: 'Access denied. No valid token provided.', success: false });
    }

    // Check if token looks like a JWT (has 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('Invalid token format - parts:', tokenParts.length);
      return res.status(401).json({ message: 'Invalid token format.', success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decoded successfully for admin ID:', decoded.id);
    
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      console.log('Admin not found for ID:', decoded.id);
      return res.status(401).json({ message: 'Invalid token - admin not found.', success: false });
    }

    console.log('Admin authenticated:', admin.email, 'Role:', admin.role);
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    console.error('Token that caused error:', req.header('Authorization'));
    res.status(401).json({ message: 'Invalid token.', success: false });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Access denied.', success: false });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Insufficient permissions.', success: false });
    }

    next();
  };
}; 