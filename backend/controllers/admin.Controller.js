
import { Admin } from '../models/admin.model.js';
import { User } from '../models/user.model.js';
import { Company } from '../models/company.model.js';
import { Job } from '../models/job.model.js';
import Category from '../models/Category.js';
import { Application } from '../models/application.model.js';
import { Report } from '../models/report.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';

// Helper function to log admin activity
const logActivity = async (adminId, action, target, targetId, details) => {
  try {
    await Admin.findByIdAndUpdate(adminId, {
      $push: {
        activityLog: {
          action,
          target,
          targetId,
          details,
          timestamp: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', success: false });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated', success: false });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ 
      message: 'Login successful', 
      success: true, 
      token, 
      role: admin.role,
      permissions: admin.permissions,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};




export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required', success: false });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword, role });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', success: true, admin: newAdmin });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingJobs = await Job.countDocuments({ status: 'pending' });
    const approvedJobs = await Job.countDocuments({ status: 'approved' });
    const rejectedJobs = await Job.countDocuments({ status: 'rejected' });
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5);
    const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
        pendingJobs,
        approvedJobs,
        rejectedJobs
      },
      recentJobs,
      recentApplications
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


// User Management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    res.status(200).json({ message: 'User deleted successfully', success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Job Management
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company').sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { admin } = req;
    
    const job = await Job.findByIdAndUpdate(jobId, { status: 'approved' }, { new: true });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    // Log activity
    await logActivity(admin._id, 'job_approved', 'job', jobId, `Job "${job.title}" approved`);

    res.status(200).json({ message: 'Job approved successfully', success: true, job });
  } catch (error) {
    console.error('Approve job error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { reason, violationType } = req.body;
    const { admin } = req;
    
    const job = await Job.findByIdAndUpdate(jobId, { 
      status: 'rejected',
      rejectionReason: reason,
      violationType: violationType || 'other'
    }, { new: true });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    // Log activity
    await logActivity(admin._id, 'job_rejected', 'job', jobId, `Job "${job.title}" rejected: ${reason}`);

    res.status(200).json({ message: 'Job rejected successfully', success: true, job });
  } catch (error) {
    console.error('Reject job error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findByIdAndDelete(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    res.status(200).json({ message: 'Job deleted successfully', success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Admin: Get single job by ID
export const getJobByIdAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId)
      .populate('company')
      .populate('category');
    if (!job) return res.status(404).json({ message: 'Job not found', success: false });
    return res.status(200).json({ success: true, job });
  } catch (error) {
    console.error('Admin get job by id error:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Admin: Update job details
export const updateJobDetailsAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      openings,
      category
    } = req.body;

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) {
      updateData.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split(',').map((r) => r.trim());
    }
    if (salary !== undefined) updateData.salary = Number(salary);
    if (experienceLevel !== undefined) updateData.experienceLevel = Number(experienceLevel);
    if (location !== undefined) updateData.location = location;
    if (jobType !== undefined) updateData.jobType = jobType;
    if (position !== undefined) updateData.position = Number(position);
    if (openings !== undefined) updateData.openings = Number(openings);
    if (category !== undefined) updateData.category = category;

    const updated = await Job.findByIdAndUpdate(jobId, updateData, { new: true });
    return res.status(200).json({ message: 'Job updated successfully', success: true, job: updated });
  } catch (error) {
    console.error('Admin update job error:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Company Management
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const updateCompanyStatus = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.body;

    const company = await Company.findByIdAndUpdate(companyId, { status }, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found', success: false });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    console.error('Update company status error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getCompanyByIdAdmin = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found', success: false });
    }
    return res.status(200).json({ success: true, company });
  } catch (error) {
    console.error('Admin get company by id error:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const updateCompanyDetailsAdmin = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { name, description, website, location, companyType, experience } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Company name is required.', success: false });
    }

    const existingCompany = await Company.findById(companyId);
    if (!existingCompany) {
      return res.status(404).json({ message: 'Company not found.', success: false });
    }

    if (name !== existingCompany.name) {
      const nameExists = await Company.findOne({ name, _id: { $ne: companyId } });
      if (nameExists) {
        return res.status(400).json({ message: 'Company with this name already exists.', success: false });
      }
    }

    const file = req.file;
    const updateData = {
      name,
      description,
      website,
      location,
      companyType,
      experience: experience ? Number(experience) : existingCompany.experience
    };

    if (file) {
      try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudResponse.secure_url;
      } catch (uploadError) {
        console.error('Logo upload error (admin):', uploadError);
        return res.status(500).json({ message: 'Failed to upload logo.', success: false });
      }
    }

    const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });
    return res.status(200).json({ message: 'Company information updated successfully.', company, success: true });
  } catch (error) {
    console.error('Admin update company error:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found', success: false });
    }
    return res.status(200).json({ message: 'Company deleted successfully', success: true });
  } catch (error) {
    console.error('Delete company error:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

// Category Management
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required', success: false });
    }

    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists', success: false });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: 'Category created successfully', success: true, category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(categoryId, { name, description }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found', success: false });
    }

    res.status(200).json({ message: 'Category updated successfully', success: true, category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found', success: false });
    }

    res.status(200).json({ message: 'Category deleted successfully', success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Analytics
export const getAnalytics = async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    const lastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());

    // Monthly job statistics
    const monthlyStats = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User role statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Job status statistics
    const jobStatusStats = await Job.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Report statistics
    const reportStats = await Report.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Report type statistics
    const reportTypeStats = await Report.aggregate([
      {
        $group: {
          _id: "$reportType",
          count: { $sum: 1 }
        }
      }
    ]);

    // Company statistics
    const companyStats = await Company.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Application statistics
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Quality check statistics
    const qualityStats = await Job.aggregate([
      {
        $match: {
          "qualityCheck.score": { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$qualityCheck.score" },
          totalChecked: { $sum: 1 }
        }
      }
    ]);

    // Recent activity (last 7 days)
    const lastWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentJobs = await Job.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentUsers = await User.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentApplications = await Application.countDocuments({ createdAt: { $gte: lastWeek } });
    const recentReports = await Report.countDocuments({ createdAt: { $gte: lastWeek } });

    // Top categories
    const topCategories = await Job.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          categoryName: { $first: '$categoryInfo.name' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Location statistics
    const locationStats = await Job.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        monthlyStats,
        userStats,
        jobStatusStats,
        reportStats,
        reportTypeStats,
        companyStats,
        applicationStats,
        qualityStats: qualityStats[0] || { avgScore: 0, totalChecked: 0 },
        recentActivity: {
          jobs: recentJobs,
          users: recentUsers,
          applications: recentApplications,
          reports: recentReports
        },
        topCategories,
        locationStats
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Report Handling
export const getAllReports = async (req, res) => {
  try {
    const { status, priority, reportType } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (reportType) filter.reportType = reportType;

    const reports = await Report.find(filter)
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email')
      .populate('resolution.resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findById(reportId)
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email')
      .populate('resolution.resolvedBy', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found', success: false });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const assignReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { admin } = req;

    const report = await Report.findByIdAndUpdate(reportId, {
      assignedTo: admin._id,
      status: 'investigating'
    }, { new: true });

    if (!report) {
      return res.status(404).json({ message: 'Report not found', success: false });
    }

    await logActivity(admin._id, 'report_assigned', 'report', reportId, `Report assigned to ${admin.name}`);

    res.status(200).json({ message: 'Report assigned successfully', success: true, report });
  } catch (error) {
    console.error('Assign report error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, details, status } = req.body;
    const { admin } = req;

    const report = await Report.findByIdAndUpdate(reportId, {
      status: status || 'resolved',
      resolution: {
        action,
        details,
        resolvedBy: admin._id,
        resolvedAt: new Date()
      }
    }, { new: true });

    if (!report) {
      return res.status(404).json({ message: 'Report not found', success: false });
    }

    await logActivity(admin._id, 'report_resolved', 'report', reportId, `Report resolved: ${action}`);

    res.status(200).json({ message: 'Report resolved successfully', success: true, report });
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Enhanced User Monitoring
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Get user's job applications
    const applications = await Application.find({ user: userId }).populate('job');
    
    // Get jobs posted by user (if employer)
    const postedJobs = await Job.find({ created_by: userId });
    
    // Get reports against this user
    const reportsAgainst = await Report.find({ 
      'reportedItem.type': 'user', 
      'reportedItem.itemId': userId 
    });

    res.status(200).json({
      success: true,
      user,
      activity: {
        applications,
        postedJobs,
        reportsAgainst
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const warnUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { warning, reason } = req.body;
    const { admin } = req;

    const user = await User.findByIdAndUpdate(userId, {
      $push: {
        warnings: {
          message: warning,
          reason,
          issuedBy: admin._id,
          issuedAt: new Date()
        }
      }
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    await logActivity(admin._id, 'user_warned', 'user', userId, `User warned: ${reason}`);

    res.status(200).json({ message: 'User warned successfully', success: true, user });
  } catch (error) {
    console.error('Warn user error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body;
    const { admin } = req;

    const suspensionEnd = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;

    const user = await User.findByIdAndUpdate(userId, {
      status: 'suspended',
      suspension: {
        reason,
        suspendedBy: admin._id,
        suspendedAt: new Date(),
        suspensionEnd
      }
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    await logActivity(admin._id, 'user_suspended', 'user', userId, `User suspended: ${reason}`);

    res.status(200).json({ message: 'User suspended successfully', success: true, user });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Content Quality Check
export const checkJobQuality = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { qualityScore, issues, recommendations } = req.body;
    const { admin } = req;

    const job = await Job.findByIdAndUpdate(jobId, {
      qualityCheck: {
        score: qualityScore,
        issues,
        recommendations,
        checkedBy: admin._id,
        checkedAt: new Date()
      }
    }, { new: true });

    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    await logActivity(admin._id, 'job_quality_check', 'job', jobId, `Quality check completed: ${qualityScore}/10`);

    res.status(200).json({ message: 'Quality check completed', success: true, job });
  } catch (error) {
    console.error('Job quality check error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Admin Activity Log
export const getAdminActivity = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const admin = await Admin.findById(adminId).select('activityLog');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found', success: false });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const activityLog = admin.activityLog
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      activityLog,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(admin.activityLog.length / limit),
        totalActivities: admin.activityLog.length
      }
    });
  } catch (error) {
    console.error('Get admin activity error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Compliance Enforcement
export const enforceCompliance = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const { action, reason, complianceType } = req.body;
    const { admin } = req;

    let target;
    let updateData = {};

    switch (targetType) {
      case 'job':
        target = await Job.findById(targetId);
        if (action === 'remove') {
          updateData = { status: 'removed', complianceAction: { action, reason, type: complianceType } };
        }
        break;
      case 'company':
        target = await Company.findById(targetId);
        if (action === 'suspend') {
          updateData = { status: 'suspended', complianceAction: { action, reason, type: complianceType } };
        }
        break;
      case 'user':
        target = await User.findById(targetId);
        if (action === 'suspend') {
          updateData = { status: 'suspended', complianceAction: { action, reason, type: complianceType } };
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid target type', success: false });
    }

    if (!target) {
      return res.status(404).json({ message: 'Target not found', success: false });
    }

    const updatedTarget = await target.constructor.findByIdAndUpdate(targetId, updateData, { new: true });

    await logActivity(admin._id, 'compliance_enforcement', targetType, targetId, `${action}: ${reason}`);

    res.status(200).json({ 
      message: 'Compliance action applied successfully', 
      success: true, 
      target: updatedTarget 
    });
  } catch (error) {
    console.error('Compliance enforcement error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Admin Applications Management
export const getAllApplications = async (req, res) => {
  try {
    const { status, jobId, userId, page = 1, limit = 20 } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (jobId) filter.job = jobId;
    if (userId) filter.applicant = userId;

    const skip = (page - 1) * limit;

    const applications = await Application.find(filter)
      .populate('applicant', 'fullname email phoneNumber profile')
      .populate({
        path: 'job',
        select: 'title salary location jobType company',
        populate: {
          path: 'company',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Application.findById(applicationId)
      .populate('applicant', 'fullname email phoneNumber profile')
      .populate({
        path: 'job',
        select: 'title description salary location jobType company requirements',
        populate: {
          path: 'company',
          select: 'name description'
        }
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found', success: false });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reason } = req.body;
    const { admin } = req;

    const application = await Application.findByIdAndUpdate(applicationId, {
      status: status.toLowerCase(),
      statusReason: reason,
      statusUpdatedBy: admin._id,
      statusUpdatedAt: new Date()
    }, { new: true }).populate('applicant job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found', success: false });
    }

    // Log activity
    await logActivity(admin._id, 'application_status_updated', 'application', applicationId, `Status changed to ${status}`);

    res.status(200).json({ message: 'Application status updated successfully', success: true, application });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { admin } = req;

    const application = await Application.findByIdAndDelete(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found', success: false });
    }

    // Log activity
    await logActivity(admin._id, 'application_deleted', 'application', applicationId, 'Application deleted');

    res.status(200).json({ message: 'Application deleted successfully', success: true });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());

    // Total applications
    const totalApplications = await Application.countDocuments();

    // Status distribution
    const statusStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly applications
    const monthlyApplications = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top jobs by applications
    const topJobs = await Application.aggregate([
      {
        $group: {
          _id: '$job',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'jobInfo'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        statusStats,
        monthlyApplications,
        topJobs
      }
    });
  } catch (error) {
    console.error('Application stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};