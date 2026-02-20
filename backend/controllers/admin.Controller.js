
import { Admin } from '../models/admin.model.js';
import { User } from '../models/user.model.js';
import { Company } from '../models/company.model.js';
import { Job } from '../models/job.model.js';
import Category from '../models/Category.js';
import { Application } from '../models/application.model.js';
import { Report } from '../models/report.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import axios from 'axios';
import { sendAdminPasswordResetEmail } from '../utils/emailService.js';
import dotenv from 'dotenv';
dotenv.config();
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
export const getAllJobseekers = async (req, res) => {
  try {
    const jobseekers = await User.find({ role: 'jobseeker' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(jobseekers);
  } catch (error) {
    console.error('Error fetching jobseekers:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getJobseekerStats = async (req, res) => {
  try {
    const totalJobseekers = await User.countDocuments({ role: 'jobseeker' });
    const activeJobseekers = await User.countDocuments({ 
      role: 'jobseeker',
      status: { $ne: 'blocked' }
    });
    const blockedJobseekers = await User.countDocuments({ 
      role: 'jobseeker',
      status: 'blocked' 
    });
    const jobseekersWithResume = await User.countDocuments({ 
      role: 'jobseeker',
      resume: { $exists: true, $ne: null }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalJobseekers,
        activeJobseekers,
        blockedJobseekers,
        jobseekersWithResume
      }
    });
  } catch (error) {
    console.error('Error fetching jobseeker stats:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(employers);
  } catch (error) {
    console.error('Error fetching employers:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};



export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Contact super admin.",
        success: false
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      },
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};



export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
        success: false
      });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin with this email already exists",
        success: false
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
        success: false
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let permissions = [];
    switch (role) {
      case 'super_admin':
        permissions = ['all'];
        break;
      case 'admin':
        permissions = ['manage_users', 'manage_jobs', 'manage_companies', 'view_analytics'];
        break;
      case 'moderator':
        permissions = ['moderate_content', 'view_reports'];
        break;
      default:
        permissions = ['view_dashboard'];
    }


    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
      permissions,
      isActive: true
    });

    await newAdmin.save();


    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      success: true,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        permissions: newAdmin.permissions
      },
      token
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
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


export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobseekers = await User.countDocuments({ role: 'jobseeker' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingJobs = await Job.countDocuments({ status: 'pending' });
    const approvedJobs = await Job.countDocuments({ status: 'approved' });
    const rejectedJobs = await Job.countDocuments({ status: 'rejected' });
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

    const recentJobs = await Job.find().populate('company').sort({ createdAt: -1 }).limit(5);
    const recentApplications = await Application.find().populate('job').populate('applicant').sort({ createdAt: -1 }).limit(5);


    const currentDate = new Date();
    const monthlyJobStats = await Job.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);


    const monthlyApplicationStats = await Application.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);


    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const jobStat = monthlyJobStats.find(s => s._id.year === year && s._id.month === month);
      const appStat = monthlyApplicationStats.find(s => s._id.year === year && s._id.month === month);

      monthlyData.push({
        month: monthNames[month - 1],
        jobs: jobStat ? jobStat.count : 0,
        applications: appStat ? appStat.count : 0,
        fullMonth: `${monthNames[month - 1]} ${year}`,
        year: year,
        monthNum: month
      });
    }


    const monthlyJobData = monthlyData.map(item => ({
      month: item.fullMonth,
      shortMonth: item.month,
      value: item.jobs,
      year: item.year,
      monthNum: item.monthNum
    }));


    const applicationsGraphData = [
      { name: 'Pending', value: pendingApplications, color: '#2196F3' },
      { name: 'Accepted', value: acceptedApplications, color: '#4CAF50' },
      { name: 'Rejected', value: rejectedApplications, color: '#F44336' }
    ];

    const jobseekerStats = {
      totalJobseekers,
      activeJobseekers: await User.countDocuments({ role: 'jobseeker', status: { $ne: 'blocked' } }),
      blockedJobseekers: await User.countDocuments({ role: 'jobseeker', status: 'blocked' }),
      jobseekersWithResume: await User.countDocuments({ role: 'jobseeker', resume: { $exists: true, $ne: null } })
    };

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobseekers,
        totalEmployers,
        totalCompanies,
        totalJobs,
        totalApplications,
        pendingJobs,
        approvedJobs,
        rejectedJobs,
        pendingApplications,
        acceptedApplications,
        rejectedApplications
      },
      recentJobs,
      recentApplications,
      graphData: {
        monthlyJobs: monthlyJobData,
        monthlyData: monthlyData,
        applications: applicationsGraphData
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;


    const userFilter = {};
    if (role && ['Jobseeker', 'Employer'].includes(role)) {
      userFilter.role = role;
    }
    const regularUsers = await User.find(userFilter).select('-password').sort({ createdAt: -1 });


    const adminFilter = {};
    if (role && ['admin', 'super_admin', 'moderator', 'support'].includes(role)) {
      adminFilter.role = role;
    }
    const adminUsers = await Admin.find(adminFilter).select('-password').sort({ createdAt: -1 });


    let allUsers = [];


    if (!role || ['Jobseeker', 'Employer'].includes(role)) {
      allUsers = [...allUsers, ...regularUsers];
    }


    if (!role || ['admin', 'super_admin', 'moderator', 'support'].includes(role)) {

      const transformedAdmins = adminUsers.map(admin => ({
        _id: admin._id,
        fullname: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status || 'active',
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }));
      allUsers = [...allUsers, ...transformedAdmins];
    }

    allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const { admin } = req;

    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }


    const statusAction = status === 'active' ? 'activated' : 'blocked';
    await logActivity(admin._id, 'user_status_updated', 'user', userId, `User ${user.fullname} ${statusAction}`);

    res.status(200).json({
      success: true,
      user,
      message: `User ${statusAction} successfully`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { admin } = req;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }


    if (user.role === 'employer') {

      const company = await Company.findOne({ userId: userId });
      if (company) {

        await Job.deleteMany({ company: company._id });
        await Application.deleteMany({ job: { $in: await Job.find({ company: company._id }).select('_id') } });


        await Company.findByIdAndDelete(company._id);
      }


      await Job.deleteMany({ created_by: userId });
    }


    await Application.deleteMany({ applicant: userId });

    await User.findByIdAndDelete(userId);


    await logActivity(admin._id, 'user_deleted', 'user', userId, `${user.role} ${user.fullname} deleted with cascade`);

    res.status(200).json({
      message: 'User and associated data deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getUserResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('profile.resume profile.resumeOriginalName fullname');

    if (!user || !user.profile?.resume) {
      return res.status(404).json({ message: 'Resume not found', success: false });
    }

    const resumeUrl = user.profile.resume;
    const filename = user.profile.resumeOriginalName || `${user.fullname || 'resume'}`;

    const response = await axios.get(resumeUrl, { responseType: 'stream' });

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

    response.data.pipe(res);
  } catch (error) {
    console.error('Get user resume error:', error);
    return res.status(500).json({ message: 'Failed to fetch resume', success: false });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      jobType = '',
      categoryId = '',
      companyId = '',
      companyType = '',
      search = '',
      dateFrom = '',
      dateTo = '',
      postedWithin = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (jobType) {
      filter.jobType = { $regex: new RegExp(`^${jobType}$`, 'i') };
    }

    if (categoryId) {
      filter.category = categoryId;
    }

    if (companyId) {
      filter.company = companyId;
    }

    if (search) {
      // Search for companies matching the search term
      const matchingCompanies = await Company.find({
        name: { $regex: new RegExp(search, 'i') }
      }).select('_id');

      const companyIds = matchingCompanies.map((c) => c._id);

      // Build search filter for jobs
      const searchConditions = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { 'location.legacy': { $regex: new RegExp(search, 'i') } },
        { 'location.district': { $regex: new RegExp(search, 'i') } },
        { 'location.state': { $regex: new RegExp(search, 'i') } }
      ];


      if (companyIds.length > 0) {
        searchConditions.push({ company: { $in: companyIds } });
      }

      filter.$or = searchConditions;
    }

    if (dateFrom || dateTo || postedWithin) {
      const createdAtCondition = {};
      if (dateFrom) createdAtCondition.$gte = new Date(dateFrom);
      if (dateTo) createdAtCondition.$lte = new Date(dateTo);

      if (postedWithin) {
        const now = new Date();
        if (postedWithin === 'today') {
          createdAtCondition.$gte = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (postedWithin === 'week') {
          createdAtCondition.$gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (postedWithin === 'month') {
          createdAtCondition.$gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
      }

      if (Object.keys(createdAtCondition).length) {
        filter.createdAt = createdAtCondition;
      }
    }

    if (companyType) {
      const matchingCompanies = await Company.find({
        companyType: { $regex: new RegExp(`^${companyType}$`, 'i') }
      }).select('_id');

      if (!matchingCompanies.length) {
        return res.status(200).json({
          success: true,
          jobs: [],
          pagination: {
            total: 0,
            currentPage: pageNum,
            limit: limitNum,
            totalPages: 0,
            hasNext: false,
            hasPrev: pageNum > 1
          },
          stats: {
            total: 0,
            status: { pending: 0, approved: 0, rejected: 0 }
          }
        });
      }

      const companyIds = matchingCompanies.map((c) => c._id);
      filter.company = filter.company
        ? { $in: companyIds.filter((id) => id.equals(filter.company)) }
        : { $in: companyIds };

      if (filter.company.$in && !filter.company.$in.length) {
        return res.status(200).json({
          success: true,
          jobs: [],
          pagination: {
            total: 0,
            currentPage: pageNum,
            limit: limitNum,
            totalPages: 0,
            hasNext: false,
            hasPrev: pageNum > 1
          },
          stats: {
            total: 0,
            status: { pending: 0, approved: 0, rejected: 0 }
          }
        });
      }
    }

    const allowedSortFields = ['createdAt', 'title', 'salary.min', 'salary.max'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [jobs, totalJobs, statusCounts] = await Promise.all([
      Job.find(filter)
        .populate('company')
        .populate('category')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(filter),
      Job.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statusSummary = statusCounts.reduce((acc, curr) => {
      if (curr?._id) {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    const totalPages = Math.ceil(totalJobs / limitNum) || 0;

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total: totalJobs,
        currentPage: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      stats: {
        total: totalJobs,
        status: {

          pending: statusSummary.pending || 0,
          approved: statusSummary.approved || 0,
          rejected: statusSummary.rejected || 0

        }
      }
    });
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
    if (location !== undefined) {
      const normalizeLocation = (loc, fallback) => {
        const defaultState = 'Tamil Nadu';
        const defaultDistrict = 'Chennai';
        const keralaDistricts = [
          'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
        ];
        const build = (state, district, legacyVal) => ({
          state: state || defaultState,
          district: district || defaultDistrict,
          legacy: legacyVal || `${district || defaultDistrict}, ${state || defaultState}`
        });
        if (!loc) {
          if (typeof fallback === 'string' && fallback.trim()) return build(undefined, undefined, fallback.trim());
          if (fallback && typeof fallback === 'object') return build(fallback.state, fallback.district, fallback.legacy);
          return build();
        }
        if (typeof loc === 'object') return build(loc.state, loc.district, loc.legacy);
        if (typeof loc === 'string') {
          const trimmed = loc.trim();
          if (!trimmed) return build();
          if (trimmed.includes(',')) {
            const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
            const district = parts[0] || defaultDistrict;
            const state = parts[1] || (keralaDistricts.includes(district) ? 'Kerala' : defaultState);
            return build(state, district, trimmed);
          }
          const district = trimmed;
          const state = keralaDistricts.includes(district) ? 'Kerala' : defaultState;
          return build(state, district, `${district}, ${state}`);
        }
        return build();
      };
      updateData.location = normalizeLocation(location, existingJob.location);
    }
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


export const getAllCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      search = '',
      dateFrom = '',
      dateTo = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (status && status !== 'all') {
      if (status === 'active') {
        filter.status = { $in: ['active', 'approved'] };
      } else {
        filter.status = status;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { website: { $regex: new RegExp(search, 'i') } },
        { location: { $regex: new RegExp(search, 'i') } }
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const allowedSortFields = ['createdAt', 'name', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [companies, totalCompanies, statusCounts] = await Promise.all([
      Company.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Company.countDocuments(filter),
      Company.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statusSummary = statusCounts.reduce((acc, curr) => {
      if (curr?._id) {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    const totalPages = Math.ceil(totalCompanies / limitNum) || 0;

    res.status(200).json({
      success: true,
      companies,
      pagination: {
        total: totalCompanies,
        currentPage: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      stats: {
        total: totalCompanies,
        active: (statusSummary.active || 0) + (statusSummary.approved || 0),
        pending: statusSummary.pending || 0,
        suspended: statusSummary.suspended || statusSummary.inactive || 0,
        byStatus: statusSummary
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


export const createCompanyAdmin = async (req, res) => {
  try {
    const adminId = req.id;
    const { name, description, website, location, state, districts, companyType, numberOfEmployees, contactEmail, contactPhone, foundedYear } = req.body;


    if (!name) {
      return res.status(400).json({ message: 'Name is required', success: false });
    }

    const existing = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(409).json({ message: 'Company with this name already exists', success: false });
    }


    let logoUrl = '';
    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        logoUrl = cloudResponse.secure_url;
      } catch (err) {
        console.error('Admin create company - logo upload error:', err);
        return res.status(500).json({ message: 'Failed to upload logo', success: false });
      }
    }


    const normalizedLocation = (() => {
      if (!location) return undefined;
      if (typeof location === 'string') return location;
      try {

        if (typeof location === 'object') {
          const state = location.state || '';
          const district = location.district || '';
          const legacy = location.legacy || '';
          return legacy || [district, state].filter(Boolean).join(', ');
        }
        const parsed = JSON.parse(location);
        const state = parsed.state || '';
        const district = parsed.district || '';
        const legacy = parsed.legacy || '';
        return legacy || [district, state].filter(Boolean).join(', ');
      } catch {
        return String(location);
      }
    })();


    const parsedState = state && typeof state === 'string' ? state : (typeof state === 'object' ? state.state : undefined);
    let parsedDistricts;
    if (Array.isArray(districts)) {
      parsedDistricts = districts.filter(Boolean);
    } else if (typeof districts === 'string') {
      try {
        const d = JSON.parse(districts);
        parsedDistricts = Array.isArray(d) ? d.filter(Boolean) : undefined;
      } catch {

        parsedDistricts = districts.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Only set a valid enum companyType
    let sanitizedCompanyType = undefined;
    if (companyType) {
      const allowedTypes = Company.schema.path('companyType')?.enumValues || [];
      if (allowedTypes.includes(companyType)) {
        sanitizedCompanyType = companyType;
      }
      // else ignore invalid value
    }

    const company = await Company.create({
      name,
      description: description || '',
      website: website || '',
      location: normalizedLocation, // optional legacy string
      state: parsedState,
      districts: parsedDistricts,
      companyType: sanitizedCompanyType,
      numberOfEmployees: numberOfEmployees ? Number(numberOfEmployees) : undefined,
      contactEmail,
      contactPhone,
      foundedYear: foundedYear ? Number(foundedYear) : undefined,
      logo: logoUrl,
      userId: adminId,
      createdByAdmin: true,
      status: 'active'
    });

    return res.status(201).json({ success: true, message: 'Company created successfully', company });
  } catch (error) {
    console.error('Admin create company error:', error);
    return res.status(500).json({ message: 'Server error', success: false });
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
      experience: experience ? Number(experience) : existingCompany.experience
    };


    if (companyType !== undefined) {
      const trimmedType = String(companyType).trim();
      if (trimmedType) {
        const allowedCompanyTypes = Company.schema.path('companyType')?.enumValues || [];
        if (!allowedCompanyTypes.includes(trimmedType)) {
          return res.status(400).json({
            message: `Invalid companyType. Allowed values are: ${allowedCompanyTypes.join(', ')}`,
            success: false
          });
        }
        updateData.companyType = trimmedType;
      }

    }

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


export const postJobAdmin = async (req, res) => {
  try {

    let jobDetails;
    if (req.body.jobData) {

      jobDetails = JSON.parse(req.body.jobData);
    } else {
      // Regular JSON
      jobDetails = req.body;
    }

    const {
      company: companyData,
      companyId,
      title,
      description,
      requirements,
      salary,
      experience,
      experienceLevel,
      location,
      locationMulti,
      jobType,
      position,
      openings,
      category
    } = jobDetails;

    const adminId = req.id;
    const { admin } = req;


    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Job title, description and category are required",
        success: false
      });
    }

    if (!companyId && !companyData) {
      return res.status(400).json({
        message: "Either companyId or company details are required",
        success: false
      });
    }


    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
        success: false
      });
    }

    let logoUrl = '';
    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        logoUrl = cloudResponse.secure_url;
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError);
        return res.status(500).json({
          message: "Failed to upload company logo",
          success: false
        });
      }
    }


    let company;
    if (companyId) {
      company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found', success: false });
      }

      if (logoUrl) {
        company.logo = logoUrl;
        await company.save();
      }
    } else {

      if (!companyData.name || !companyData.description || !companyData.location) {
        return res.status(400).json({
          message: "Company name, description, and location are required",
          success: false
        });
      }
      const existingCompany = await Company.findOne({
        name: { $regex: new RegExp(`^${companyData.name}$`, 'i') }
      });
      if (existingCompany) {
        company = existingCompany;
        if (logoUrl) {
          company.logo = logoUrl;
          await company.save();
        }
      } else {
        company = await Company.create({
          name: companyData.name,
          description: companyData.description,
          website: companyData.website || '',
          location: companyData.location,
          logo: logoUrl,
          userId: adminId,
          createdByAdmin: true
        });
      }
    }


    const defaultRequirements = requirements && requirements.length > 0 ? requirements : ["No specific requirements"];
    const defaultSalary = salary || { min: 0, max: 0 };
    const defaultExperience = experience || { min: 0, max: 5 };
    const defaultExperienceLevel = experienceLevel || "Entry Level";

    const defaultLocation = location ? {
      state: location.state || "Tamil Nadu",
      district: location.district || "Chennai",
      legacy: location.legacy || `${location.district || "Chennai"}, ${location.state || "Tamil Nadu"}`
    } : {
      state: "Tamil Nadu",
      district: "Chennai",
      legacy: "Chennai, Tamil Nadu"
    };
    const defaultJobType = jobType || "Full-time";
    const defaultPosition = position ? Number(position) : 1;
    const defaultOpenings = openings ? Number(openings) : 1;

    // Initialize normalizedLocationMulti
    let normalizedLocationMulti = null;

    if (locationMulti && typeof locationMulti === 'object') {
      const lmState = locationMulti.state || company?.state;
      const lmDistricts = Array.isArray(locationMulti.districts) ? locationMulti.districts.filter(Boolean) : company?.districts;
      if (lmState && Array.isArray(lmDistricts) && lmDistricts.length) {
        normalizedLocationMulti = { state: lmState, districts: lmDistricts };
      }
    } else if (company && company.state && Array.isArray(company.districts) && company.districts.length) {
      normalizedLocationMulti = { state: company.state, districts: company.districts };
    }


    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(defaultRequirements) ? defaultRequirements : defaultRequirements.split(",").map(req => req.trim()),
      salary: {
        min: defaultSalary.min ? Number(defaultSalary.min) : 0,
        max: defaultSalary.max ? Number(defaultSalary.max) : 0
      },
      experience: {
        min: defaultExperience.min !== undefined ? Number(defaultExperience.min) : 0,
        max: defaultExperience.max !== undefined ? Number(defaultExperience.max) : 5
      },
      experienceLevel: defaultExperienceLevel,
      location: defaultLocation,
      locationMulti: normalizedLocationMulti,
      jobType: defaultJobType,
      position: defaultPosition,
      openings: defaultOpenings,
      company: company._id,
      category,
      created_by: adminId,
      createdByAdmin: true,
      status: 'approved'
    });


    await logActivity(adminId, 'job_created_admin', 'job', job._id, `Admin job "${job.title}" created for company "${company.name}"`);

    return res.status(201).json({
      message: "Job created successfully by admin",
      job,
      company,
      success: true
    });

  } catch (error) {
    console.error("Admin job creation error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false
    });
  }
};


// Bulk approve all pending jobs
export const bulkApproveJobs = async (req, res) => {
  try {
    // Update all jobs with pending status to approved
    const result = await Job.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    );

    // Optionally log an admin activity (no specific jobId here)
    const adminId = req.id;
    if (adminId) {
      await logActivity(adminId, 'jobs_bulk_approved', 'job', null, `Approved ${result.modifiedCount} pending jobs`);
    }

    return res.status(200).json({
      success: true,
      message: `Approved ${result.modifiedCount} pending jobs`,
      matched: result.matchedCount ?? result.nMatched,
      modified: result.modifiedCount ?? result.nModified
    });
  } catch (error) {
    console.error('Bulk approve jobs error:', error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};


export const getJobForEdit = async (req, res) => {
  try {
    const { jobId } = req.params;
    const adminId = req.id;

    const job = await Job.findById(jobId)
      .populate('company', 'name description website location logo')
      .populate('category', 'categoryName');

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }



    return res.status(200).json({
      message: "Job retrieved successfully",
      job,
      success: true
    });

  } catch (error) {
    console.error("Get job for edit error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false
    });
  }
};


export const updateJobAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;
    const adminId = req.id;


    let jobDetails;
    if (req.body.jobData) {

      jobDetails = JSON.parse(req.body.jobData);
    } else {

      jobDetails = req.body;
    }

    const {
      company: companyData,
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      openings,
      category
    } = jobDetails;


    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }


    if (!title || !description || !category || !companyData) {
      return res.status(400).json({
        message: "Job title, description, category, and company details are required",
        success: false
      });
    }


    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
        success: false
      });
    }


    let logoUrl = '';
    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        logoUrl = cloudResponse.secure_url;
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError);
        return res.status(500).json({
          message: "Failed to upload company logo",
          success: false
        });
      }
    }


    const company = await Company.findById(job.company);
    if (company) {
      company.name = companyData.name;
      company.description = companyData.description || '';
      company.website = companyData.website || '';
      company.location = companyData.location || '';


      if (logoUrl) {
        company.logo = logoUrl;
      }

      const allowedCompanyTypes = Company.schema.path('companyType')?.enumValues || [];
      if (company.companyType === '' || (company.companyType && !allowedCompanyTypes.includes(company.companyType))) {
        company.companyType = undefined;
      }

      await company.save();
    }
    job.title = title;
    job.description = description;
    job.requirements = Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim());
    job.salary = {
      min: salary.min ? Number(salary.min) : 0,
      max: salary.max ? Number(salary.max) : 0
    };

    const normalizeLocation = (loc, fallback) => {
      const defaultState = 'Tamil Nadu';
      const defaultDistrict = 'Chennai';
      const keralaDistricts = [
        'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
      ];

      const build = (state, district, legacyVal) => ({
        state: state || defaultState,
        district: district || defaultDistrict,
        legacy: legacyVal || `${district || defaultDistrict}, ${state || defaultState}`
      });

      if (!loc) {
        if (typeof fallback === 'string' && fallback.trim()) return build(undefined, undefined, fallback.trim());
        if (fallback && typeof fallback === 'object') return build(fallback.state, fallback.district, fallback.legacy);
        return build();
      }

      if (typeof loc === 'object') {
        return build(loc.state, loc.district, loc.legacy);
      }

      if (typeof loc === 'string') {
        const trimmed = loc.trim();
        if (!trimmed) return build();

        if (trimmed.includes(',')) {
          const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
          const district = parts[0] || defaultDistrict;
          const state = parts[1] || (keralaDistricts.includes(district) ? 'Kerala' : defaultState);
          return build(state, district, trimmed);
        }

        const district = trimmed;
        const state = keralaDistricts.includes(district) ? 'Kerala' : defaultState;
        return build(state, district, `${district}, ${state}`);
      }

      return build();
    };

    job.location = normalizeLocation(location, companyData.location);
    job.jobType = jobType || "Full-time";
    job.position = position ? Number(position) : 1;
    job.openings = openings ? Number(openings) : 1;
    job.category = category;

    await job.save();


    await logActivity(adminId, 'job_updated_admin', 'job', job._id, `Admin job "${job.title}" updated`);

    return res.status(200).json({
      message: "Job updated successfully",
      job,
      company,
      success: true
    });

  } catch (error) {
    console.error("Admin job update error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false
    });
  }
};


export const getAnalytics = async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    const lastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());


    const monthlyStats = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);


    const yearlyUserGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);


    const topCompanies = await Job.aggregate([
      {
        $group: {
          _id: '$company',
          jobsPosted: { $sum: 1 }
        }
      },
      { $sort: { jobsPosted: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' },
      {
        $project: {
          _id: 0,
          companyName: '$company.name',
          jobsPosted: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        monthlyStats,
        yearlyUserGrowth,
        topCompanies
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


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


export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }


    const applications = await Application.find({ user: userId }).populate('job');


    const postedJobs = await Job.find({ created_by: userId });


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


export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found', success: false });
    }

    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.error('Get admin by ID error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, role, permissions } = req.body;
    const { admin: currentAdmin } = req;

    // Check if current admin has permission to update other admins
    if (!currentAdmin.permissions?.includes('admin_management') && currentAdmin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Insufficient permissions', success: false });
    }

    // Validate email uniqueness
    const existingAdmin = await Admin.findOne({
      email,
      _id: { $ne: adminId }
    });

    if (existingAdmin) {
      return res.status(409).json({ message: 'Email already exists', success: false });
    }

    const updateData = {
      name,
      email,
      role,
      permissions: permissions || []
    };

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found', success: false });
    }

    // Log activity
    await logActivity(currentAdmin._id, 'admin_updated', 'admin', adminId, `Admin ${updatedAdmin.name} updated`);

    res.status(200).json({
      message: 'Admin updated successfully',
      success: true,
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { admin: currentAdmin } = req;

    // Check if current admin has permission to delete other admins
    const perms = currentAdmin?.permissions || [];
    const canManage = currentAdmin.role === 'super_admin' || perms.includes('all') || perms.includes('manage_users');
    if (!canManage) {
      return res.status(403).json({ message: 'Insufficient permissions', success: false });
    }

    // Prevent self-deletion
    if (adminId === currentAdmin._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account', success: false });
    }

    const adminToDelete = await Admin.findById(adminId);
    if (!adminToDelete) {
      return res.status(404).json({ message: 'Admin not found', success: false });
    }

    // Prevent deletion of super admin by non-super admin
    if (adminToDelete.role === 'super_admin' && currentAdmin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin', success: false });
    }

    // Do not allow deleting the last remaining super_admin
    if (adminToDelete.role === 'super_admin') {
      const superAdminCount = await Admin.countDocuments({ role: 'super_admin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last remaining super admin', success: false });
      }
    }

    await Admin.findByIdAndDelete(adminId);

    // Log activity
    await logActivity(currentAdmin._id, 'admin_deleted', 'admin', adminId, `Admin ${adminToDelete.name} deleted`);

    res.status(200).json({
      message: 'Admin deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const toggleAdminStatus = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { isActive } = req.body;
    const { admin: currentAdmin } = req;

    const perms = currentAdmin?.permissions || [];
    const canManage = currentAdmin.role === 'super_admin' || perms.includes('all') || perms.includes('manage_users');
    if (!canManage) {
      return res.status(403).json({ message: 'Insufficient permissions', success: false });
    }

    if (adminId === currentAdmin._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own status', success: false });
    }

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found', success: false });
    }

    // Log activity
    const action = isActive ? 'activated' : 'deactivated';
    await logActivity(currentAdmin._id, 'admin_status_changed', 'admin', adminId, `Admin ${admin.name} ${action}`);

    res.status(200).json({
      message: `Admin ${action} successfully`,
      success: true,
      admin
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const {
      status,
      jobId,
      userId,
      page = 1,
      limit = 20,
      search,
      searchFields,
      jobTitle,
      applicantEmail,
      companyName,
      category
    } = req.query;

    // Input validation
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100 items per page
    const skip = (pageNum - 1) * limitNum;
    
    console.log(`Processing page ${pageNum} with ${limitNum} items per page, skip ${skip}`);

    // Build the base query with lean for better performance
    let query = Application.find().lean();
    let countQuery = Application.countDocuments();
    
    // Base filters
    let filter = {};
    if (status) {
      filter.status = status;
      console.log(`Filtering by status: ${status}`);
    }
    if (jobId) {
      filter.job = jobId;
      console.log(`Filtering by jobId: ${jobId}`);
    }
    if (userId) {
      filter.applicant = userId;
      console.log(`Filtering by userId: ${userId}`);
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchFieldsArray = searchFields ? searchFields.split(',') : [
        'applicant.fullname',
        'applicant.email',
        'job.title',
        'job.company.name'
      ];

      const orConditions = searchFieldsArray.map(field => {
        const [model, fieldName] = field.split('.');
        if (model === 'applicant') {
          return { [`${model}.${fieldName}`]: searchRegex };
        } else if (model === 'job') {
          return { [`${model}.${fieldName}`]: searchRegex };
        }
        return null;
      }).filter(Boolean);

      if (orConditions.length > 0) {
        filter.$or = orConditions;
      }
    }

    // Apply filters to both queries
    query = query.find(filter);
    countQuery = countQuery.merge(query).skip(0).limit(null); // Reset pagination for count

    // Build population options
    const populateOptions = [
      {
        path: 'applicant',
        select: 'fullname email phoneNumber profile',
        match: applicantEmail ? { email: new RegExp(applicantEmail, 'i') } : {}
      },
      {
        path: 'job',
        select: 'title salary location jobType company category',
        match: {},
        populate: {
          path: 'company',
          select: 'name logo',
          match: companyName ? { name: new RegExp(companyName, 'i') } : {}
        }
      }
    ];

    // Apply job-specific filters
    const jobMatch = {};
    if (jobTitle) jobMatch.title = new RegExp(jobTitle, 'i');
    if (category) jobMatch.category = category;
    if (companyName) jobMatch['company.name'] = new RegExp(companyName, 'i');
    
    if (Object.keys(jobMatch).length > 0) {
      populateOptions[1].match = jobMatch;
    }

    console.log('Final filter object:', JSON.stringify(filter, null, 2));
    
    console.log('Population options:', JSON.stringify(populateOptions, null, 2));
    
    try {
      // Execute queries in parallel
      const [total, applications] = await Promise.all([
        countQuery,
        query
          .populate(populateOptions)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean()
          .exec()
      ]);
      
      console.log(`Found ${total} total applications, returning ${applications.length} applications`);
      
      // Filter out applications where either applicant or job is null after population
      const filteredApplications = applications.filter(app => {
        const isValid = app.applicant && app.job;
        if (!isValid) {
          console.log('Filtering out invalid application:', app._id);
        }
        return isValid;
      });
      
      console.log(`After filtering, returning ${filteredApplications.length} valid applications`);
      
      const responseData = {
        success: true,
        applications: filteredApplications,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalApplications: total,
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1
        }
      };
      
      console.log(`Sending response with ${filteredApplications.length} applications`);
      return res.status(200).json(responseData);
      
    } catch (dbError) {
      console.error('Database query error:', dbError);
      throw dbError; // This will be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch applications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    let { status, reason } = req.body;
    const { admin } = req;

    // Convert status to lowercase and validate
    status = status.toLowerCase();
    const allowedStatuses = ['pending', 'accepted', 'rejected'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: pending, accepted, rejected', 
        success: false 
      });
    }

    const application = await Application.findByIdAndUpdate(applicationId, {
      status: status,
      statusReason: reason,
      statusUpdatedBy: admin._id,
      statusUpdatedAt: new Date()
    }, { new: true }).populate('applicant job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found', success: false });
    }

    // Log activity with consistent status format
    await logActivity(
      admin._id, 
      'application_status_updated', 
      'application', 
      applicationId, 
      `Status changed to ${status}`
    );

    res.status(200).json({ 
      message: 'Application status updated successfully', 
      success: true, 
      application: {
        ...application.toObject(),
        status: status // Ensure consistent status format in response
      } 
    });
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


    const totalApplications = await Application.countDocuments();


    const statusStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);


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


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        message: "No admin found with this email address",
        success: false
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = resetTokenExpiry;
    await admin.save();


    let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';


    if (!process.env.FRONTEND_URL) {
      if (process.env.VERCEL_URL) {
        frontendUrl = `https://${process.env.VERCEL_URL}`;
      } else if (process.env.NETLIFY) {
        frontendUrl = `https://${process.env.URL || 'jobkitty.in'}`;
      } else if (process.env.NODE_ENV === 'production') {
        frontendUrl = 'https://jobkitty.in';
      }
    }

    const resetLink = `${frontendUrl}/admin/reset-password?token=${resetToken}`;
    console.log(`Generated admin reset link: ${resetLink}`); // For debugging

    
    const emailResult = await sendAdminPasswordResetEmail(admin.email, resetLink);
    if (!emailResult.success) {
      console.error('Failed to send admin password reset email:', emailResult.error);
      return res.status(500).json({
        message: "Failed to send reset email.",
        success: false
      });
    }

    res.status(200).json({
      message: "Password reset instructions have been sent to your email",
      success: true,
      resetToken: resetToken
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Failed to send password reset instructions', 
      success: false 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
        success: false
      });
    }


    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
        success: false
      });
    }


    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
        success: false
      });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.status(200).json({
      message: "Password has been reset successfully",
      success: true
    });

  } catch (error) {
    console.error('Reset password error:', error);
    let errorMessage;
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation error occurred';
    } else if (error.name === 'MongoError') {
      errorMessage = 'Database error occurred';
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid data format';
    }

    res.status(500).json({
      message: errorMessage,
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};