

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendRegistrationReminderEmail, sendPasswordResetEmail, sendWelcomeEmail } from "../utils/emailService.js";
import crypto from "crypto";



export const register = async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber } = req.body;

    console.log('Registration attempt:', { 
      fullname: fullname?.substring(0, 10) + '...', 
      email, 
      role,
      phoneNumber 
    });

    // Validate required fields
    const missing = [];
    if (!fullname || !String(fullname).trim()) missing.push('fullname');
    if (!email || !String(email).trim()) missing.push('email');
    if (!password || !String(password).trim()) missing.push('password');
    if (!role || !String(role).trim()) missing.push('role');
    
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required field(s): ${missing.join(', ')}`,
        success: false,
        missing
      });
    }

    // Validate role
    const validRoles = ['Jobseeker', 'Employer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be either 'Jobseeker' or 'Employer'",
        success: false
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user WITHOUT profile photo
    const user = await User.create({
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      password: hashedPassword,
      role: role.trim(),
      profile: {
        // Empty profile - no profile photo required
        profilePhoto: "",
        bio: "",
        place: ""
      }
    });

    console.log('User created successfully:', user._id);

    // Send welcome email (optional)
    if (process.env.ENABLE_NONCRITICAL_EMAILS === 'true') {
      try {
        await sendWelcomeEmail(user.email, user.fullname, user.role);
        console.log('Welcome email sent to', user.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }
    }

    // Send reminder email after 4 minutes (optional)
    if (process.env.ENABLE_NONCRITICAL_EMAILS === 'true') {
      setTimeout(async () => {
        try {
          await sendRegistrationReminderEmail(user.email, user.fullname);
          console.log('Reminder email sent to', user.email);
        } catch (reminderError) {
          console.error('Failed to send reminder email:', reminderError);
        }
      }, 4 * 60 * 1000);
    }

    return res.status(201).json({
      message: "Account created successfully! You can now login.",
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: `Validation error: ${errors.join(', ')}`,
        success: false
      });
    }

    return res.status(500).json({ 
      message: "Internal server error during registration", 
      success: false 
    });
  }
};


// export const register = async (req, res) => {
//   try {
//       const { fullname, email, password, role } = req.body || {};

//       // Debug: log received keys to trace body parsing issues
//       try {
//         console.log('Register Content-Type:', req.headers['content-type']);
//         console.log('Register body keys:', Object.keys(req.body || {}));
//         console.log('Register raw body sample:', {
//           fullname: typeof fullname === 'string' ? fullname : typeof fullname,
//           email: typeof email === 'string' ? email : typeof email,
//           password: password ? '***' : undefined,
//           role
//         });
//       } catch {}

//       const missing = [];
//       if (!fullname || !String(fullname).trim()) missing.push('fullname');
//       if (!email || !String(email).trim()) missing.push('email');
//       if (!password || !String(password).trim()) missing.push('password');
//       if (!role || !String(role).trim()) missing.push('role');
//       if (missing.length) {
//         return res.status(400).json({
//           message: `Missing required field(s): ${missing.join(', ')}`,
//           success: false,
//           missing
//         });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//           return res.status(400).json({
//               message: "User already exists with this email.",
//               success: false
//           });
//       }

//       let profilePhotoUrl = undefined;
      
      
//       if (req.file) {
//           const fileUri = getDataUri(req.file);
//           const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
//               folder: "profile-photos"
//           });
//           profilePhotoUrl = cloudResponse.secure_url;
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const userPayload = {
//           fullname: String(fullname).trim(),
//           email: String(email).trim().toLowerCase(),
//           password: hashedPassword,
//           role: String(role).trim()
//       };

     
//       if (profilePhotoUrl) {
//           userPayload.profile = { profilePhoto: profilePhotoUrl };
//       }

//       const user = await User.create(userPayload);

    
//       try {
//           await sendWelcomeEmail(user.email, user.fullname, user.role);
//           console.log('Welcome email sent to', user.email);
//       } catch (err) {
//           console.error('Failed to send welcome email:', err);
//       }

//       setTimeout(async () => {
//           try {
//               await sendRegistrationReminderEmail(user.email, user.fullname);
//               console.log('Reminder email sent to', user.email);
//           } catch (err) {
//               console.error('Failed to send reminder email:', err);
//           }
//       }, 4 * 60 * 1000);

//       return res.status(201).json({
//           message: "Account created successfully.",
//           success: true
//       });

//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ 
//           message: "Server error", 
//           success: false 
//       });
//   }
// };


export const updateProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
          
            return res.status(200).json({
                message: "No file provided. Profile photo unchanged.",
                success: true
            });
        }

        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: "profile-photos"
        });
        // Ensure profile object exists to avoid setting property on undefined
        if (!user.profile) {
            user.profile = {};
        }
        user.profile.profilePhoto = cloudResponse.secure_url;
        const updatedUser = await user.save();

        return res.status(200).json({
            message: "Profile photo updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error("Update profile photo error:", error);
        return res.status(500).json({ message: "Failed to update profile photo.", success: false });
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

    
    if (user.status === 'blocked') {
     
      if (acceptCode) {
        const validAcceptCode = process.env.ADMIN_ACCEPT_CODE || 'ADMIN2024';
        if (acceptCode === validAcceptCode) {
         
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

 
    const accessTokenData = { userId: user._id, type: 'access' };
    const accessToken = jwt.sign(accessTokenData, process.env.SECRET_KEY, {
      expiresIn: "15m"
    });

 
    const refreshTokenData = { userId: user._id, type: 'refresh' };
    const refreshToken = jwt.sign(refreshTokenData, process.env.REFRESH_SECRET_KEY || process.env.SECRET_KEY, {
      expiresIn: "7d" 
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
    console.log("Login Response:", { accessToken, refreshToken, user });

    return res.status(200).json({
        message: `Welcome back ${user.fullname}`,
        user,
        accessToken,
        refreshToken,
        success: true
      });
      


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


export const logout = async (req, res) => {
	try {
		return res.status(200).json({
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

        
        if (education) {
			user.profile.education=JSON.parse(education);
		}

        
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

		const token = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; 
		await user.save();
		
		let frontendUrl;
		if (process.env.NODE_ENV === 'production') {
		
			frontendUrl = 'https://jobkitty.in';
		} else {
	
			frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
		}
		
		const resetLink = `${frontendUrl}/reset-password/${token}`;
		console.log(`Generated reset link: ${resetLink}`);        const emailResult = await sendPasswordResetEmail(user.email, resetLink);
        if (!emailResult.success) {
            console.error('Failed to send password reset email:', emailResult.error);
            if (process.env.ALLOW_RESET_LINK_FALLBACK === 'true') {
                return res.status(200).json({
                    message: "Email quota exceeded or send failed. Using fallback reset link.",
                    success: true,
                    resetLink
                });
            } else {
                return res.status(500).json({ message: "Failed to send reset email.", success: false });
            }
        }
        
        return res.status(200).json({ message: "Password reset link sent to your email.", success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", success: false });
	}
};

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


export const getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: "Employer" })
      .select("-password")
      .populate("profile.company") 
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


export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const cookieRefreshToken = req.cookies.refreshToken;
    
    const tokenToVerify = refreshToken || cookieRefreshToken;
    
    if (!tokenToVerify) {
      return res.status(401).json({
        message: "Refresh token is required",
        success: false
      });
    }

   
    const decoded = jwt.verify(tokenToVerify, process.env.REFRESH_SECRET_KEY || process.env.SECRET_KEY);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        message: "Invalid token type",
        success: false
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        message: "Account is blocked",
        success: false,
        blocked: true
      });
    }

 
    const accessTokenData = { userId: user._id, type: 'access' };
    const newAccessToken = jwt.sign(accessTokenData, process.env.SECRET_KEY, {
      expiresIn: "15m"
    });


    const refreshTokenData = { userId: user._id, type: 'refresh' };
    const newRefreshToken = jwt.sign(refreshTokenData, process.env.REFRESH_SECRET_KEY || process.env.SECRET_KEY, {
      expiresIn: "7d"
    });

    return res.status(200).json({
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        success: true
      });

  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({
      message: "Invalid or expired refresh token",
      success: false
    });
  }
};
