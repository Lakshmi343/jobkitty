
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendRegistrationReminderEmail, sendPasswordResetEmail } from "../utils/emailService.js";
import crypto from "crypto";

export const register = async (req, res) => {
	try {
		const { fullname, email, phoneNumber, password, role } = req.body;

		if (!fullname || !email || !phoneNumber || !password || !role) {
			return res.status(400).json({
				message: "All fields are required.",
				success: false
			});
		}
		if (!req.file) {
			return res.status(400).json({
				message: "Profile photo is required.",
				success: false
			});
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				message: "User already exists with this email.",
				success: false
			});
		}
		const fileUri = getDataUri(req.file);
		const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
			folder: "profile-photos"
		});
		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({
			fullname,
			email,
			phoneNumber,
			password: hashedPassword,
			role,
			profile: {
				profilePhoto: cloudResponse.secure_url
			}
		});
		const user = await User.findOne({ email });
		if (user) {
			setTimeout(async () => {
				try {
					await sendRegistrationReminderEmail(
						user.email,
						user.fullname
					);
					console.log('Reminder email sent to', user.email);
				} catch (err) {
					console.error('Failed to send reminder email:', err);
				}		}, 4 * 60 * 1000); 
		}
		return res.status(201).json({
			message: "Account created successfully.",
			success: true
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", success: false });
	}
};



export const login = async (req, res) => {
  try {
    const { email, password, acceptCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
        success: false
      });
    }

    // Check if user account is blocked
    if (user.status === 'blocked') {
      // Check if accept code is provided and valid
      if (acceptCode) {
        const validAcceptCode = process.env.ADMIN_ACCEPT_CODE || 'ADMIN2024';
        if (acceptCode === validAcceptCode) {
          // Temporarily allow login with accept code - unblock the user
          user.status = 'active';
          await user.save();
          console.log(`User ${user.email} unblocked via accept code`);
        } else {
          return res.status(403).json({
            message: "Invalid accept code. Please contact admin for the correct code.",
            success: false,
            blocked: true
          });
        }
      } else {
        return res.status(403).json({
          message: "Your account has been blocked by the admin. Whether you are an employer or a jobseeker, you cannot log in or use the website until the block is removed.",
          success: false,
          blocked: true
        });
      }
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "4h"
    });

    if (user.role === 'Employer' && user.profile.company) {
      user = await User.findById(user._id).populate('profile.company');
    }

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).cookie("token", token, {
      maxAge: 86400000,
      httpOnly: true,
      sameSite: "strict"
    }).json({
      message: `Welcome back ${user.fullname}`,
      user,
      token,
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


export const logout = async (req, res) => {
	try {
		return res.status(200).cookie("token", "", { maxAge: 0 }).json({
			message: "Logged out successfully.",
			success: true
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", success: false });
	}
};



export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, place, education, experience } = req.body;
        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        let skillsArray = skills ? skills.split(",") : user.profile.skills;
        let resumeUrl = user.profile.resume;
        let resumeName = user.profile.resumeOriginalName;

        // ✅ Resume Upload
        if (req.file) {
            console.log('📄 File received:', req.file.originalname, req.file.mimetype, req.file.size);
            const fileUri = getDataUri(req.file);
            const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname?.toLowerCase().endsWith('.pdf');

            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: process.env.CLOUDINARY_CV_FOLDER || "resumes",
                resource_type: isPdf ? "raw" : "auto",
                public_id: `resume_${userId}_${Date.now()}`,
                format: isPdf ? 'pdf' : undefined
            });

            console.log('☁️ Cloudinary response:', cloudResponse.secure_url);
            resumeUrl = cloudResponse.secure_url;
            resumeName = req.file.originalname;
        }

        // ✅ Update fields
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skillsArray || user.profile.skills;
        if (resumeUrl) {
            user.profile.resume = resumeUrl;
            user.profile.resumeOriginalName = resumeName;
        }
        user.profile.place = place || user.profile.place;

        // ✅ Education (Required)
        if (education) {
			user.profile.education=JSON.parse(education);
		}

        // ✅ Experience (Optional)
        if (experience) {
            user.profile.experience = JSON.parse(experience);
        }

        const updatedUser = await user.save();
        console.log('✅ User saved with resume:', updatedUser.profile.resume);

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getUserProfile = async (req, res) => {
	try {
		const userId = req.id;
		let user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found.",
				success: false
			});
		}

		
		if (user.role === 'Employer' && user.profile.company) {
			user = await User.findById(userId).populate('profile.company');
		}

		user = {
			_id: user._id,
			fullname: user.fullname,
			email: user.email,
			phoneNumber: user.phoneNumber,
			role: user.role,
			profile: user.profile
		};

		return res.status(200).json({
			user,
			success: true
		});
	} catch (error) {
		console.error("Get user profile error:", error);
		return res.status(500).json({
			message: "Internal server error",
			success: false
		});
	}
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ message: "Email is required.", success: false });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found.", success: false });
		}
		// Generate token
		const token = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		await user.save();
		// Construct reset link (adjust frontend URL as needed)
		const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;
		await sendPasswordResetEmail(user.email, resetLink);
		return res.status(200).json({ message: "Password reset link sent to your email.", success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", success: false });
	}
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body;
		if (!token || !password) {
			return res.status(400).json({ message: "Token and new password are required.", success: false });
		}
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		});
		if (!user) {
			return res.status(400).json({ message: "Invalid or expired token.", success: false });
		}
		user.password = await bcrypt.hash(password, 10);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();
		return res.status(200).json({ message: "Password reset successful.", success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", success: false });
	}
};


// Add this function to the existing user.controller.js file

export const uploadResume = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "Resume file is required.",
				success: false
			});
		}

		const userId = req.id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found.",
				success: false
			});
		}

		// Upload to Cloudinary
		console.log('📄 Resume upload - File received:', req.file.originalname, req.file.mimetype, req.file.size);
		const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname?.toLowerCase().endsWith('.pdf');
		const fileUri = getDataUri(req.file);
		const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
			resource_type: isPdf ? 'raw' : 'auto',
			folder: process.env.CLOUDINARY_CV_FOLDER || 'resumes',
			public_id: `resume_${userId}_${Date.now()}`,
			format: isPdf ? 'pdf' : undefined
		});
		
		console.log('☁️ Resume uploaded to Cloudinary:', cloudResponse.secure_url);

		// Update user profile with resume URL
		user.profile.resume = cloudResponse.secure_url;
		user.profile.resumeOriginalName = req.file.originalname;
		await user.save();

		return res.status(200).json({
			message: "Resume uploaded successfully.",
			resumeUrl: cloudResponse.secure_url,
			success: true
		});
	} catch (error) {
		console.error("Resume upload error:", error);
		return res.status(500).json({
			message: "Failed to upload resume.",
			success: false
		});
	}
};



// Get all Jobseekers
export const getAllJobseekers = async (req, res) => {
  try {
    const jobseekers = await User.find({ role: "Jobseeker" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobseekers.length,
      jobseekers
    });
  } catch (error) {
    console.error("Error fetching jobseekers:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Get all Employers
export const getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: "Employer" })
      .select("-password")
      .populate("profile.company") // populate company details if linked
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: employers.length,
      employers
    });
  } catch (error) {
    console.error("Error fetching employers:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
